const { Router } = require('express');
const { getGenreById, getAllGenres, postGenre, updateGenre, addGenreToMovie } = require('../controllers/genre');



const router = Router();


router.get("/:id", getGenreById);

router.get("/", getAllGenres);


router.post("/", postGenre);

router.put("/:id", updateGenre);

router.put("/association/:id", addGenreToMovie);



module.exports = router;