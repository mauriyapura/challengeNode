const { postUser, getUserById, login, deleteUser } = require("../controllers/auth");
const { validations } = require("../helpers/validations");
const { check } = require('express-validator');

const router = require("express").Router();


router.get("/:id", getUserById);

router.post("/register", [
    check("email", "email es requerido").notEmpty(),   
    check("email", "email no es valido").isEmail(), 
    check("password", "password es requerido").notEmpty(),   
    validations
], postUser);

router.post("/login", [
    check("email", "email es requerido").notEmpty(),  
    check("email", "email no es valido").isEmail(), 
    check("password", "password es requerido").notEmpty(),   
    validations
], login);


router.delete("/:id", deleteUser);



module.exports = router;

