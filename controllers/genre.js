
const Genre = require('../models/genres');
const Movie = require("../models/movie");

const getGenreById = async(req, res)=>{
    const {id} = req.params;

    try {
        const genre = await Genre.findByPk(id,{
            include: [{
                model: Movie,
                as: "movies",
                attributes: ["id", "titulo", "fechaCreacion", "calificacion", "imagen"],
                through: {
                    attributes: []
                }           
            }]
        });
        res.status(200).json(genre);        
    } catch (error) {
        res.status(500).json(error);        
    }
};

const getAllGenres = async(req, res)=>{

    try {
        const genres = await Genre.findAll({
             include: [{
                 model: Movie,
                 as: "movies",
                 attributes: ["id", "titulo", "fechaCreacion", "calificacion", "imagen"],
                 through: {
                     attributes: []
                 }           
             }]
        });
        res.status(200).json(genres);
        
    } catch (error) {
        res.status(500).json(error);        
    }
};

const postGenre = async(req, res)=>{

    const {nombre, imagen} = req.body;

    try {
        const genre = await Genre.create({nombre, imagen });
        res.status(201).json(genre);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });        
    }
};

const updateGenre = async(req, res) => {
    const {id} = req.params;
    const {body} = req;

    try {        
        const genre = await Genre.findByPk(id);
        if( genre){
            await genre.update(body);
            res.status(200).json( genre );
        }else{
            return res.status(404).json({
                msg: `Genre Id not found`
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

// Agregar un genero a una pelicula
const addGenreToMovie = async(req, res) => {

    const { id } = req.params;
    const { movieId } = req.body;    

    try {
        const genre = await Genre.findByPk(id);
        if(!genre){
            return res.status(404).json("Genre ID not found")
        }
        const movie = await Movie.findByPk(movieId);
        if(!movie){
            return res.status(404).json("Movie ID not found")
        }
        await genre.addMovie(movie);
        res.status(200).json(movie);
        
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getGenreById,
    getAllGenres,
    postGenre,
    updateGenre,
    addGenreToMovie
}