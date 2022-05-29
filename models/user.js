const {DataTypes} = require("sequelize");
const sequelize = require("../database/connection");


const User = sequelize.define('users', {

    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true        
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }    
    
},{
    timestamps: false
});

User.prototype.toJSON = function(){

    let values = Object.assign({}, this.get());

    delete values.password;
    return values;
}

module.exports = User;


