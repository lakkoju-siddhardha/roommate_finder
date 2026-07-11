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
            "Content-Type":"application/json"
        },

        body: JSON.stringify({

            receiver,
            message

        })

    });

    input.value="";

});

socket.on("receive-message",(data)=>{

    location.reload();

});