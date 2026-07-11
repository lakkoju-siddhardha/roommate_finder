const loginToSRM = require("../automation/login");
const { getUser } = require("../models/userModel");

async function login(req, res) {
    try {

        const { regNo, password } = req.body;

        // Login to SRM, scrape data, save to MySQL
        await loginToSRM(regNo, password);

        // Fetch the saved user from MySQL
        const user = await getUser(regNo);

        // Render dashboard with real data
        res.render("dashboard", { user });

    } catch (err) {

        console.error(err);

        res.status(500).send("Login Failed");

    }
}

module.exports = {
    login
};