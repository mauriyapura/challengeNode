
const express = require('express');
const cors = require("cors");
const config = require("../config/index");

require("./associations");

class Server{

    constructor(){

        this.app = express();
        this.port = config.port || "5000";

        this.paths = {
            characters: "/api/characters",
            movies: "/api/movies",
            genres: "/api/genres"
        }

        this.middlewares();
        this.routes();                        
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use(this.paths.characters, require("../routes/character"));
        this.app.use(this.paths.movies, require("../routes/movie"));
        this.app.use(this.paths.genres, require("../routes/genre"));
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port `, this.port)
        })
    }

}

module.exports = Server;
