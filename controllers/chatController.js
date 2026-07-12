const {
    getMessages,
    saveMessage
} = require("../models/chatModel");

const {
    getUserName
} = require("../models/userModel");

// ---------------- OPEN CHAT ----------------

async function openChat(req, res) {

    const sender = req.session.regNo;

    const receiver = req.params.regNo;

    const receiverName = await getUserName(receiver);

    const messages = await getMessages(sender, receiver);

    res.render("chat", {
        sender,
        receiver,
        receiverName,
        messages
    });

}

// ---------------- SEND MESSAGE ----------------

async function sendMessage(req, res) {

    try {

        const sender = req.session.regNo;

        const { receiver, message } = req.body;

        if (!message || message.trim() === "") {

            return res.status(400).json({
                success: false,
                message: "Message cannot be empty"
            });

        }

        // Save message
        await saveMessage(sender, receiver, message);

        // Notify only the receiver
        const io = req.app.get("io");

        io.to(receiver).emit("receive-message", {
            sender,
            message
        });

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Error sending message"
        });

    }

}

module.exports = {
    openChat,
    sendMessage
};