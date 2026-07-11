const loginToSRM = require("../automation/login");

async function login(req, res) {

    try {

        const { regNo, password } = req.body;

        await loginToSRM(regNo, password);

        res.redirect("/dashboard");

    } catch (err) {

        console.error(err);

        res.status(500).send("Login Failed");

    }

}

module.exports = {
    login
};