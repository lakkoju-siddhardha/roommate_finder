const express = require("express");

const router = express.Router();

const authController = require("../controllers/authControllers");

const { login, logout } = require("../controllers/authControllers");

router.post("/login", authController.login);

router.get("/logout", logout);

module.exports = router;