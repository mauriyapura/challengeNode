const express = require('express');
const Character = require("../models/character");
const Movie = require('../models/movie');
//const {characterMovie} = require('../models/associations');
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const getCharacterById = async(req, res)=>{
    const {id} = req.params;

    try {
        const character = await Character.findByPk(id,{
            include: [{
                model: Movie,
                as: "movies",
                attributes: ["id", "titulo", "fechaCreacion", "calificacion", "imagen"],
                through: {
                    attributes: []
                }           
            }]
        });
        if(!character){
            return res.status(404).json("Character ID not found")
        }
        res.status(200).json(character);        
    } catch (error) {
        res.status(500).json(error);        
    }
};

const getAllCharacters = async(req, res) => {

    const {nombre, edad, movie } = req.query;
    //console.log(nombre, edad, movie);
    let whereCondition = {};

    if(nombre){
        whereCondition.nombre = {[Op.like]: '%'+nombre+'%'};
    }
    if(edad){        
        whereCondition.edad = {[Op.like]: '%'+edad+'%'};        
    }   

    if(movie){
        const charactersMovie = await Character.findAll({
            where: {
                '$movies.id$': movie
            },
            include: [{
                model: Movie,
                as: "movies",                        
            }],
        });
        return res.status(200).json(charactersMovie);
    }    
    try {
        const characters = await Character.findAll({
            include: [{
                model: Movie,
                as: "movies",
                attributes: ["id", "titulo", "fechaCreacion", "calificacion", "imagen"],
                through: {
                    attributes: []
                }           
            }],
            where: whereCondition
        });
        res.status(200).json(characters);
        
    } catch (error) {
        res.status(500).json(error);
    }
};

const postCharacter = async(req, res)=>{

    const {nombre, edad, peso, historia} = req.body;
    let fileUpload;

    try {
        const character = await Character.create({ nombre, edad, peso, historia });

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
            fileUpload = false;            
        }else{
            fileUpload = true;
        }        
        
        if(fileUpload){
            const {tempFilePath} = req.files.file;
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
            character.imagen = secure_url;
            await character.save();
        }
        res.status(201).json(character);        
    } catch (error) {
        res.status(500).json(error);               
    }
};

const updateCharacter = async(req, res) => {
    const {id} = req.params;
    const {body} = req;

    try {        
        const character = await Character.findByPk(id);
        if( character){
            await character.update(body);
            res.status(200).json( character );
        }else{
            return res.status(404).json({
                msg: `No existe una operación con el id ${id}`
            });
        } 
        
    } catch (error) {        
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });          
    }
};

// Actualizar imagen de personaje
const updateImage = async(req, res) => {

    const {id} = req.params;
    try {
        const character = await Character.findByPk(id);
        if(!character){
            return res.status(400).json({msg: ` Character ID not found`})
        }

        // borrar imagenes previas
        if(character.imagen){
            const nameArr = character.imagen.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        const {tempFilePath} = req.files.file;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        character.imagen = secure_url;
        await character.save();
        res.status(200).json(character);
        
    } catch (err) {
        res.status(500).json(err);        
    }
};


// Agregar un personaje a una pelicula
const addCharacterToMovie = async(req, res) => {

    const { id } = req.params;
    const { movieId } = req.body;    

    try {
        const character = await Character.findByPk(id);
        if(!character){
            return res.status(404).json("Character ID not found")
        }
        const movie = await Movie.findByPk(movieId);
        if(!movie){
            return res.status(404).json("Movie ID not found")
        }
        await movie.addCharacter(character);
        res.status(200).json(character);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });
    }
};

const deleteCharacter = async(req, res) => {

    const {id} = req.params;
    const character = await Character.findByPk(id);
    if(!character){
        return res.status(404).json("Character ID not found")
    };
    try {
        await character.destroy();
        res.status(200).json(`Deleted character with ID ${id} and name ${character.nombre}`);
        
    } catch (err) {
        res.status(500).json(err)
    }
};

module.exports = {
    getCharacterById,
    getAllCharacters,
    postCharacter,
    updateCharacter,
    addCharacterToMovie,
    updateImage,
    deleteCharacter
}
