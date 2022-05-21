const User = require("../models/user");
const bcrypt = require("bcrypt");

const getUserById = async(req, res) => {

    const {id} = req.params;
    try {
        const user = await User.findByPk(id);        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);        
    }
};

// Register
const postUser = async(req, res) => {

    const {email, password} = req.body;   
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({email, password: passwordHash});      
        res.status(201).json(user);        
    } catch (err) {
        res.status(500).json(err);
    }
};

// Login
const login = async(req, res) => {

    const {email, password} = req.body;
    try {

        const user = await User.findOne({ where: {email: email} });
        if(!user){
            return res.status(400).json("Email or password incorrect");
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json("Email or password incorrect");
        }
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json(err);        
    }
};


module.exports = {
    getUserById,
    postUser,
    login
}