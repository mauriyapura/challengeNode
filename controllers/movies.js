
const express = require('express');
const Character = require('../models/character');
const Movie = require("../models/movie");
const Genre = require("../models/genres");
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;


const getMovieById = async(req, res)=>{
    const {id} = req.params;

    try {
        const movie = await Movie.findByPk(id,{
            include: [{
                model: Character,
                as: "characters",
                attributes: ["id", "nombre", "edad", "peso", "historia", "imagen"],
                through: {
                    attributes: []
                }           
            },{
                model: Genre,
                as: "genres",
                attributes: ["id", "nombre", "imagen"],
                through: {
                    attributes: []
                }           
            }]
        });
        if(!movie){
            return res.status(404).json("Movie ID not found")
        }
        res.status(200).json(movie);        
    } catch (error) {
        res.status(500).json(error);        
    }
};

const getAllMovies = async(req, res)=>{

    let {titulo, genre, order} = req.query;   
    let whereCondition = {};
    
    if(titulo){
        whereCondition.titulo = {[Op.like]: '%'+titulo+'%'};
    }   
    if(!order){
        order = "ASC";
    }  
    if(genre){
        const genresMovie = await Movie.findAll({
            where: {
                '$genres.id$': genre
            },
            include: [{
                model: Genre,
                as: "genres",                        
            }],
            order: [
                ["titulo", order]
            ]
        });
        return res.status(200).json(genresMovie);
    }     
    
    try {
       const movies = await Movie.findAll({
            include: [{
                model: Character,
                as: "characters",
                attributes: ["id", "nombre", "edad", "peso", "historia", "imagen"],
                through: {
                    attributes: []
                }           
            },{
                model: Genre,
                as: "genres",
                attributes: ["id", "nombre", "imagen"],
                through: {
                    attributes: []
                }           
            }],
            where: whereCondition,
            order: [
                ["titulo", order]
            ]
       });
       res.status(200).json(movies);       
   } catch (error) {
    res.status(500).json(error);      
   }
};

const postMovie = async(req, res)=>{

    const {titulo, fechaCreacion, calificacion} = req.body;
    let fileUpload;

    try {
        const movie = await Movie.create({titulo, fechaCreacion, calificacion});
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
            fileUpload = false;            
        }else{ fileUpload = true }

        if(fileUpload){
            const {tempFilePath} = req.files.file;
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
            movie.imagen = secure_url;
            await movie.save();
        }
        res.status(201).json(movie);        
    } catch (error) {
        res.status(500).json(error);             
    }
};

const updateMovie = async(req, res) => {
    const {id} = req.params;
    const {body} = req;

    try {        
        const movie = await Movie.findByPk(id);
        if( movie){
            await movie.update(body);
            res.status(200).json( movie );
        }else{
            return res.status(404).json({
                msg: `Movie Id not found`
            });
        } 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });          
    }
};;

// Actualizar imagen de una pelicula
const updateImage = async(req, res) => {

    const {id} = req.params;
    try {
        const movie = await Movie.findByPk(id);
        if(!movie){
            return res.status(400).json({msg: ` Movie ID not found`})
        }

        // borrar imagenes previas
        if(movie.imagen){
            const nameArr = movie.imagen.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        const {tempFilePath} = req.files.file;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        movie.imagen = secure_url;
        await movie.save();
        res.status(200).json(movie);
        
    } catch (err) {
        res.status(500).json(err);        
    }
};

// Agregar una pelicula a un personaje
const addMovieToCharacter = async(req, res) => {

    const { id } = req.params;
    const { characterId } = req.body;    

    try {
        const movie = await Movie.findByPk(id);
        if(!movie){
            return res.status(404).json("Movie ID not found")
        }
        const character = await Character.findByPk(characterId);
        if(!character){
            return res.status(404).json("Character ID not found")
        }
        await character.addMovie(movie);
        res.status(200).json(movie);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });
    }
};

const deleteMovie = async(req, res) => {

    const {id} = req.params;
    const movie = await Movie.findByPk(id);
    if(!movie){
        return res.status(404).json("Movie ID not found")
    };
    try {
        await movie.destroy();
        res.status(200).json(`Deleted movie with ID ${id} and title ${movie.titulo}`);
        
    } catch (err) {
        res.status(500).json(err)
    }
};


module.exports = {
    getMovieById,
    getAllMovies,
    postMovie,
    updateMovie,
    updateImage,
    addMovieToCharacter,
    deleteMovie
}
