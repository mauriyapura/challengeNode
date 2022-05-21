
const dotenv = require("dotenv");
const envFound = dotenv.config()

if(!envFound){
    throw new Error("Couldn´t find .env file.");
}

process.env.NODE_ENV = process.env.NODE_ENV || "development";

module.exports = {
    port: process.env.PORT,         
    database: {
        host: process.env.DATABASE_HOST,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    },   
    auth: {
        secret: process.env.AUTH_SECRET,
        ttl: process.env.AUTH_TTL
    }
}
