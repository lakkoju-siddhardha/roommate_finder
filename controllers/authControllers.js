const loginToSRM = require("../automation/login");

async function login(req, res) {

    try {

        const { regNo, password } = req.body;

        await loginToSRM(regNo, password);

        req.session.regNo = regNo;

        res.redirect("/dashboard");

    } catch (err) {

        console.error(err);

        res.status(500).send("Login Failed");

    }
}


async function logout(req, res) {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).send("Logout Failed");
        }

        res.clearCookie("connect.sid");

        res.redirect("/");

    });

}

module.exports = {
    login,
    logout
};