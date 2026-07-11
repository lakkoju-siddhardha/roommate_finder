const socket = io();
const chatBox = document.getElementById("chatBox");

chatBox.scrollTop = chatBox.scrollHeight;
const receiver =
    document.getElementById("receiver").value;

const sender =
    document.getElementById("sender").value;

// Join your own room
socket.emit("join", sender);

const form = document.querySelector(".chat-input");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const input =
        document.getElementById("message");

    const message = input.value;

    if (!message.trim()) return;

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

const messageDiv = document.createElement("div");

messageDiv.className = "message sent";

messageDiv.innerHTML = `
    <p>${message}</p>
`;

chatBox.appendChild(messageDiv);

chatBox.scrollTop = chatBox.scrollHeight;

input.value = "";

input.focus();

});

socket.on("receive-message", (data) => {

    const chatBox = document.getElementById("chatBox");

    const messageDiv = document.createElement("div");

    messageDiv.className = "message received";

    messageDiv.innerHTML = `
        <p>${data.message}</p>
    `;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

});