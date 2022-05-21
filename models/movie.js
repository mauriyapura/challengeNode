const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const Movie = sequelize.define('movies', {

    titulo: {
        type: DataTypes.STRING(50),
        allowNull: false        
    },
    fechaCreacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    calificacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },    
    imagen: {
        type: DataTypes.STRING(100)
    }
    
},{
    timestamps: false
});

module.exports = Movie;