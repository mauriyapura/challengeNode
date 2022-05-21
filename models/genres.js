
const {DataTypes} = require("sequelize");
const sequelize = require("../database/connection");

const Genre = sequelize.define('genre', {

    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false        
    },   
    imagen: {
        type: DataTypes.STRING(100)
    }
},{
    timestamps: false
});

module.exports = Genre;

