const { postUser, getUserById, login } = require("../controllers/auth");

const router = require("express").Router();


router.get("/:id", getUserById);

router.post("/register", postUser);

router.post("/login", login);



module.exports = router;

