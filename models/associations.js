const { DataTypes } = require('sequelize');
const sequelize = require("../database/connection");

const character = require("./character");
const movie = require("./movie");
const genre = require("./genres");


const characterMovie = sequelize.define('characterMovie', {
    movieId: {
      type: DataTypes.INTEGER,
      references: {
        model: movie,
        key: 'id'
      }
    },
    characterId: {
      type: DataTypes.INTEGER,
      references: {
        model: character, 
        key: 'id'
      }
    }
  }, {
      timestamps: false
  });

const genreMovie = sequelize.define('genreMovie', {
  movieId: {
    type: DataTypes.INTEGER,
    references: {
      model: movie,
      key: 'id'
    }
  },
  genreId: {
    type: DataTypes.INTEGER,
    references: {
      model: genre, 
      key: 'id'
    }
  }
}, {
    timestamps: false
});



character.belongsToMany(movie, {through: characterMovie});
movie.belongsToMany(character, {through: characterMovie});


genre.belongsToMany(movie, {through: genreMovie});
movie.belongsToMany(genre, {through: genreMovie});

