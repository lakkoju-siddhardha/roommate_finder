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

    const user = {
        reg_no: "AP25110010998",
        name: "Lakkoju Siddhardha",

        room_type: "4 Bunker Sharing A/C",

        block_name: "GANGA B",

        tower: "Level 5",

        room_number: "553",

        academic_year: "2025-2026",

        allotted_date: "25-Aug-2025",

        hostel_status: "Hosteller"
    };

    res.render("dashboard", { user });

});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});