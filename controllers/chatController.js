const {
    getMessages,
    saveMessage,
    isFirstMessage
} = require("../models/chatModel");

const {
    getUserName,
    getUserEmail
} = require("../models/userModel");

const sendFirstMessageMail =
    require("../utils/sendFirstMessageMail");

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

        // Check if this is the first message
        const firstMessage = await isFirstMessage(
            sender,
            receiver
        );

        // Save message
        await saveMessage(
            sender,
            receiver,
            message
        );

        // Send first-message email (background)
        if (firstMessage) {

            const receiverEmail =
                await getUserEmail(receiver);

            const senderName =
                await getUserName(sender);

            if (receiverEmail) {

                sendFirstMessageMail(

                    receiverEmail,

                    senderName

                ).catch(err => {

                    console.error(
                        "Failed to send first message email:",
                        err
                    );

                });

            }

        }

        // Notify receiver in real time
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