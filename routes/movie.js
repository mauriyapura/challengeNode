
const { Router } = require('express');
const { postMovie, updateMovie, getAllMovies, getMovieById, addMovieToCharacter, deleteMovie, updateImage } = require('../controllers/movies');

const { check } = require('express-validator');
const { validarJWT } = require('../helpers/validar-jwt');
const { validations } = require('../helpers/validations');
const { fileValidation } = require('../helpers/fileValidation');


const router = Router();


router.get("/", getAllMovies);

router.get("/:id", getMovieById);

router.post("/", [
    validarJWT,
    check("titulo", "titulo es requerido").notEmpty(),    
    check("fechaCreacion", "fechaCreacion debe ser un INTEGER").isInt(),
    check("calificacion", "calificacion debe ser un INTEGER").isInt(),   
    validations
], postMovie);

router.put("/:id", [
    validarJWT,
    check("titulo", "titulo es requerido").optional().notEmpty(),    
    check("fechaCreacion", "fechaCreacion es requerido").optional().isInt(),    
    check("calificacion", "calificacion es requerido").optional().isInt(),    
    validations
], updateMovie);

router.put("/association/:id", [
    validarJWT,
    validations
], addMovieToCharacter);

router.put("/image/:id", [
    validarJWT,
    fileValidation,
    validations
], updateImage);

router.delete("/:id",[
    validarJWT,
    validations
], deleteMovie);

module.exports = router;