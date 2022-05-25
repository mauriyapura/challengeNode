
const Genre = require('../models/genres');
const Movie = require("../models/movie");
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

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
        if(!genre){
            return res.status(404).json("Genre ID not found")
        }
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

    const {nombre} = req.body;
    let fileUpload;

    try {
        const genre = await Genre.create({nombre});

        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
            fileUpload = false;            
        }else{fileUpload = true};

        if(fileUpload){
            const {tempFilePath} = req.files.file;
            const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
            genre.imagen = secure_url;
            await genre.save();
        }  
        res.status(201).json(genre);
        
    } catch (error) {
        res.status(500).json(error); 
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

// Actualizar imagen de un genero
const updateImage = async(req, res) => {

    const {id} = req.params;
    try {
        const genre = await Genre.findByPk(id);
        if(!genre){
            return res.status(400).json({msg: ` Genre ID not found`})
        }

        // borrar imagenes previas
        if(genre.imagen){
            const nameArr = genre.imagen.split('/');
            const name = nameArr[nameArr.length - 1];
            const [public_id] = name.split('.');
            await cloudinary.uploader.destroy(public_id);
        }

        const {tempFilePath} = req.files.file;
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
        genre.imagen = secure_url;
        await genre.save();
        res.status(200).json(genre);
        
    } catch (err) {
        res.status(500).json(err);        
    }
};

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
};

const deleteGenre = async(req, res) => {

    const {id} = req.params;
    const genre = await Genre.findByPk(id);
    if(!genre){
        return res.status(404).json("Genre ID not found")
    };
    try {
        await genre.destroy();
        res.status(200).json(`Deleted genre with ID ${id} and name ${genre.nombre}`);
        
    } catch (err) {
        res.status(500).json(err)
    }
};


module.exports = {
    getGenreById,
    getAllGenres,
    postGenre,
    updateGenre,
    updateImage,
    addGenreToMovie,
    deleteGenre
}