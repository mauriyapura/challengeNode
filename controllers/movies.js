
const express = require('express');
const Character = require('../models/character');
const Movie = require("../models/movie");
const Genre = require("../models/genres");

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
        res.status(200).json(movie);        
    } catch (error) {
        res.status(500).json(error);        
    }
};

const getAllMovies = async(req, res)=>{
    
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
            }]
       });
       res.status(200).json(movies);       
   } catch (error) {
    res.status(500).json(error);        
       
   }
};

const postMovie = async(req, res)=>{

    const {titulo, fechaCreacion, calificacion, imagen} = req.body;

    try {
        const movie = await Movie.create({titulo, fechaCreacion, calificacion, imagen, });
        res.status(201).json(movie);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });        
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
}


module.exports = {
    getMovieById,
    getAllMovies,
    postMovie,
    updateMovie,
    addMovieToCharacter
}
