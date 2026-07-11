const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chatController");

router.get("/chat/:regNo", chatController.openChat);

router.post("/chat/send", chatController.sendMessage);

module.exports = router;