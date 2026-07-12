const socket = io();

const chatBox = document.getElementById("chatBox");

chatBox.scrollTop = chatBox.scrollHeight;

const receiver = document.getElementById("receiver").value;
const sender = document.getElementById("sender").value;

const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");

// Join your own room
socket.emit("join", sender);

// ---------------- SEND MESSAGE ----------------

async function sendMessage() {

    const message = input.value.trim();

    if (!message) return;

    try {

        await fetch("/chat/send", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                receiver,
                message

            })

        });

        // Show message immediately
        const messageDiv = document.createElement("div");

        messageDiv.className = "message sent";

        messageDiv.innerHTML = `
            <p>${message}</p>
        `;

        chatBox.appendChild(messageDiv);

        chatBox.scrollTop = chatBox.scrollHeight;

        input.value = "";

    } catch (err) {

        console.error(err);

    }

}

// Send button
sendBtn.addEventListener("click", sendMessage);

// Desktop Enter
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (!isMobile) {

    input.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            sendMessage();

        }

    });

}

// ---------------- RECEIVE MESSAGE ----------------

socket.on("receive-message", (data) => {

    const messageDiv = document.createElement("div");

    messageDiv.className = "message received";

    messageDiv.innerHTML = `
        <p>${data.message}</p>
    `;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

});