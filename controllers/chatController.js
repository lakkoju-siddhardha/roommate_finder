
const {
    getMessages,
    saveMessage
} = require("../models/chatModel");
async function openChat(req, res) {

    const sender = req.session.regNo;

    const receiver = req.params.regNo;

    const messages = await getMessages(sender, receiver);

    res.render("chat", {
        sender,
        receiver,
        messages
    });

}

async function sendMessage(req, res) {

    try {

        const sender = req.session.regNo;

        const { receiver, message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).send("Message cannot be empty");
        }

        await saveMessage(sender, receiver, message);

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

        res.status(500).send("Error sending message");

    }

}

module.exports = {
    openChat,
    sendMessage
};