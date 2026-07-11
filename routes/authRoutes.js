const express = require("express");
const router = express.Router();

const {
    login,
    scrape,
    logout,
    refreshData,
    refreshProcess
} = require("../controllers/authControllers");

router.post("/login", login);

router.post("/login/scrape", scrape);

router.post("/refresh", refreshData);

router.post("/refresh/process", refreshProcess);

router.get("/logout", logout);

module.exports = router;