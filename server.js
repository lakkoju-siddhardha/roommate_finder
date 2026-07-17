require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3000;
const { getUser } = require("./models/userModel");
const { getRoommates } = require("./models/roommateModel");

const authRoutes = require("./routes/authRoutes");
const roommateRoutes = require("./routes/roommateRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Create Socket.IO Server
const io = new Server(server);

// Make io available everywhere
app.set("io", io);

// ---------------- Socket.IO ----------------

io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("join", (regNo) => {

        socket.join(regNo);

        console.log(`${regNo} joined`);

    });

    socket.on("disconnect", () => {

        console.log("User Disconnected");

    });

});

// ---------------- Express ----------------

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || "roomsync-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(express.static(path.join(__dirname, "public")));

// ---------------- Routes ----------------

app.use("/", authRoutes);
app.use("/", roommateRoutes);
app.use("/", chatRoutes);

// ---------------- Pages ----------------

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/dashboard", async (req, res) => {

    if (!req.session.regNo) {
        return res.redirect("/");
    }

    try {

        const user = await getUser(req.session.regNo);

        const roommates = await getRoommates(req.session.regNo);

        res.render("dashboard", {
            user,
            roommates
        });

    } catch (err) {

        console.error(err);

        res.status(500).send("Server Error");

    }

});

// ---------------- Start Server ----------------

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:3000`);
});