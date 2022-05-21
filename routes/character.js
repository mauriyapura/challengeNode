
const { Router } = require('express');
const { getCharacterById, postCharacter, updateCharacter, addCharacterToMovie, getAllCharacters } = require('../controllers/character');

const router = Router();


router.get("/:id", getCharacterById);

router.get("/", getAllCharacters);

router.post("/", postCharacter);

router.put("/:id", updateCharacter); // REVISAR porque creo que esta mal

router.put("/association/:id", addCharacterToMovie);


module.exports = router;
