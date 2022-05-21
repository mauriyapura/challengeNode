const { Sequelize } = require("sequelize");
const config = require("../config/index");

const uri = `mysql://${config.database.username}:${config.database.password}@${config.database.host}:3306/${config.database.name}`;

const db = new Sequelize(uri);

module.exports = db;
