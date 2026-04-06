// const express = require("express");
// const router = express.Router();

// const authController = require("../controllers/auth.controller");

// router.post("/register", authController.register);
// router.post("/login", authController.login);

// module.exports = router;
const express = require("express");
const router = express.Router();

const { register } = require("../controllers/auth.controller");

router.post("/register", register);

module.exports = router;