const { Router } = require('express');
const { getGenreById, getAllGenres, postGenre, updateGenre, addGenreToMovie, deleteGenre, updateImage } = require('../controllers/genre');
const { validarJWT } = require('../helpers/validar-jwt');
const { validations } = require('../helpers/validations');
const { check } = require('express-validator');
const { fileValidation } = require('../helpers/fileValidation');


const router = Router();


router.get("/:id", getGenreById);

router.get("/", getAllGenres);


router.post("/", [
    validarJWT,
    check("nombre", "titulo es requerido").notEmpty(),    
    validations
], postGenre);

router.put("/:id", [
    validarJWT,
    check("nombre", "nombre es requerido").optional().notEmpty(),    
    validations
], updateGenre);

router.put("/association/:id", [
    validarJWT,
    validations
], addGenreToMovie);

router.put("/image/:id", [
    validarJWT,
    fileValidation,
    validations
], updateImage);

router.delete("/:id",[
    validarJWT,
    validations
], deleteGenre);



module.exports = router;