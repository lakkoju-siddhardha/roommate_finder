const express = require("express");

const router = express.Router();

const roommateController = require("../controllers/roommateController");

router.get("/roommates/:regNo", roommateController.showRoommates);

module.exports = router;