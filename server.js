const express = require("express");
const path = require("path");

const app = express();

const loginToSRM = require("./automation/login");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {

    const { regNo, password } = req.body;

    console.log("Registration Number:", regNo);
    console.log("Password:", password);

    await loginToSRM(regNo, password);

    res.send("Browser Opened");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});