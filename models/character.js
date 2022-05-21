
const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection");


const Character = sequelize.define('characters', {

    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false        
    },
    edad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    peso: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    historia: {
        type: DataTypes.STRING,
        allowNull: false
    },    
    imagen: {
        type: DataTypes.STRING(100)
    }
},{
    timestamps: false
});

module.exports = Character;
