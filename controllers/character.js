const express = require('express');
const Character = require("../models/character");
const Movie = require('../models/movie');

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
        res.status(200).json(character);        
    } catch (error) {
        res.status(500).json(error);        
    }
};

const getAllCharacters = async(req, res) => {

    try {
        const characters = await Character.findAll({
            include: [{
                model: Movie,
                as: "movies",
                attributes: ["id", "titulo", "fechaCreacion", "calificacion", "imagen"],
                through: {
                    attributes: []
                }           
            }]
        });
        res.status(200).json(characters);
        
    } catch (error) {
        res.status(500).json(error);
    }
};

const postCharacter = async(req, res)=>{

    const {nombre, edad, peso, historia, imagen} = req.body;

    try {
        const character = await Character.create({ nombre, edad, peso, historia, imagen });
        res.status(201).json(character);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });        
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
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });          
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
}

module.exports = {
    getCharacterById,
    getAllCharacters,
    postCharacter,
    updateCharacter,
    addCharacterToMovie
}
