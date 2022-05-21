
const { Router } = require('express');
const { postMovie, updateMovie, getAllMovies, getMovieById, addMovieToCharacter } = require('../controllers/movies');


const router = Router();


router.get("/", getAllMovies);

router.get("/:id", getMovieById);

router.post("/", postMovie);

router.put("/:id", updateMovie);

router.put("/association/:id", addMovieToCharacter);



module.exports = router;