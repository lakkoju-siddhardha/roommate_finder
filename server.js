const express = require("express");
const path = require("path");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});