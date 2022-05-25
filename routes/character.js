
const { Router } = require('express');
const { check } = require('express-validator');
const { getCharacterById, postCharacter, updateCharacter, addCharacterToMovie, getAllCharacters, deleteCharacter, updateImage } = require('../controllers/character');
const { fileValidation } = require('../helpers/fileValidation');
const { validarJWT } = require('../helpers/validar-jwt');
const { validations } = require('../helpers/validations');

const router = Router();


router.get("/:id", getCharacterById);

router.get("/", getAllCharacters);

router.post("/", [
    validarJWT,
    check("nombre", "nombre es requerido").notEmpty(),    
    check("edad", "edad debe ser un INTEGER").isInt(),
    check("peso", "peso es requerido").notEmpty(),
    check("historia", "historia es requerido").notEmpty(),

    validations
], postCharacter);

router.put("/:id", [
    validarJWT,
    check("nombre", "nombre es requerido").optional().notEmpty(),    
    check("edad", "edad es requerido").optional().notEmpty(),    
    check("peso", "peso es requerido").optional().notEmpty(), 
    check("historia", "historia es requerido").optional().notEmpty(),

    validations
], updateCharacter); 

router.put("/association/:id", [
    validarJWT,
    validations
], addCharacterToMovie);

router.put("/image/:id", [
    validarJWT,
    fileValidation,
    validations
], updateImage);


router.delete("/:id",[
    validarJWT,
    validations
], deleteCharacter);

module.exports = router;
