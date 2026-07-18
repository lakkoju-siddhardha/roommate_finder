const {
    getUser,
    userExists
} = require("../models/userModel");

const loginToSRM = require("../automation/login");

const {
    getRoommates
} = require("../models/roommateModel");


const loginQueue = require("../utils/loginQueue");
// ---------------- LOGIN ----------------

async function login(req, res) {

    try {

        const { regNo, password } = req.body;

        // Check if user already exists
        const exists = await userExists(regNo);

        if (exists) {

            console.log("✅ User already exists. Skipping scraping.");

            req.session.regNo = regNo;

            const user = await getUser(regNo);

            const roommates = await getRoommates(regNo);

            return res.render("dashboard", {
                user,
                roommates
            });

        }

        // First time login
        req.session.tempRegNo = regNo;
        req.session.tempPassword = password;

        // Show loading page
       return res.render("loading",{

    title:"Connecting to SRM...",

    description:"Fetching your hostel details.",

    action:"/login/scrape"

});
    } catch (err) {

        console.error(err);

        res.status(500).send("Login Failed");

    }

}

// ---------------- SCRAPE ----------------

async function scrape(req, res) {

    try {

        const regNo = req.session.tempRegNo;
        const password = req.session.tempPassword;

        if (!regNo || !password) {
            return res.redirect("/");
        }

        console.log(`Queue Waiting: ${loginQueue.size}`);
        console.log(`Currently Running: ${loginQueue.pending}`);

        await loginQueue.add(() =>
            loginToSRM(regNo, password)
        );

        req.session.regNo = regNo;

        delete req.session.tempRegNo;
        delete req.session.tempPassword;

        return res.redirect("/dashboard");

    } catch (err) {

        console.error(err);

        delete req.session.tempRegNo;
        delete req.session.tempPassword;

        if (err.message === "INVALID_CREDENTIALS") {

            return res.render("login", {
                error: "Incorrect Registration Number or Password."
            });

        }

        if (err.message === "CAPTCHA_FAILED") {

            return res.render("login", {
                error: "Couldn't verify the captcha. Please try again."
            });

        }

        return res.render("login", {
            error: "Unable to connect to SRM. Please try again."
        });

    }

}

// ---------------- LOGOUT ----------------

async function logout(req, res) {

    delete req.session.tempRegNo;
    delete req.session.tempPassword;

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).send("Logout Failed");
        }

        res.clearCookie("connect.sid");

        res.redirect("/");

    });

}

  async function refreshData(req, res) {

    try {

        const regNo = req.session.regNo;
        const { password } = req.body;

        if (!regNo) {
            return res.redirect("/");
        }

        // Store password temporarily
        req.session.refreshPassword = password;

        // Show loading page
        return res.render("loading", {

            title: "Refreshing SRM Data...",

            description: "Please wait while we fetch the latest hostel details.",

            action: "/refresh/process"

        });

    } catch (err) {

    console.error(err);

    res.status(500).send("Refresh Failed");

}
}
async function refreshProcess(req, res) {

    try {

        const regNo = req.session.regNo;
        const password = req.session.refreshPassword;

        if (!regNo || !password) {
            return res.redirect("/");
        }

        console.log("Refreshing SRM Data...");
        console.log(`Queue Waiting: ${loginQueue.size}`);
        console.log(`Currently Running: ${loginQueue.pending}`);

        await loginQueue.add(() =>
            loginToSRM(regNo, password)
        );

        delete req.session.refreshPassword;

        return res.redirect("/dashboard");

    } catch (err) {

        console.error(err);

        delete req.session.refreshPassword;

        if (err.message === "INVALID_CREDENTIALS") {

            return res.send("Incorrect password.");

        }

        if (err.message === "CAPTCHA_FAILED") {

            return res.send("Captcha verification failed. Please try again.");

        }

        return res.send("Unable to refresh data.");

    }

}
module.exports = {
    login,
    scrape,
    logout,
    refreshData,
    refreshProcess
};
    