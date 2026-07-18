const launchBrowser = require("./browser");
const solveCaptcha = require("./ocr");
const getProfileDetails = require("./profile");
const getHostelDetails = require("./hostel");

const { saveUser } = require("../models/userModel");
const { getRoommatesByRoom } = require("../models/roommateModel");
const sendRoommateMail = require("../utils/sendRoommateMail");

async function loginToSRM(regNo, password) {

    const { browser, page } = await launchBrowser();

    try {

        console.log("🌐 Opening SRM Portal...");

        await page.setViewportSize({
            width: 1366,
            height: 768
        });
await page.goto("https://student.srmap.edu.in/", {
    waitUntil: "domcontentloaded"
});

// Debug logs
console.log("Current URL:", page.url());

console.log("Page Title:", await page.title());

await page.screenshot({
    path: "homepage.png",
    fullPage: true
});

console.log("Homepage screenshot captured.");

let loggedIn = false;

        // ---------------- CAPTCHA RETRY ----------------

        for (let attempt = 1; attempt <= 3; attempt++) {

            console.log(`🔄 Login Attempt ${attempt}/3`);

            await page.getByRole("textbox", {
                name: "Enter Application Number /"
            }).fill(regNo);

            await page.getByRole("textbox", {
                name: "Password"
            }).fill(password);

            const captcha = page.locator("#frmSL").getByRole("img");

            await captcha.screenshot({
                path: "public/images/captcha.png"
            });

            console.log("🧠 Solving Captcha...");

            const captchaText = await solveCaptcha(
                "public/images/captcha.png"
            );

            console.log("✅ OCR Result:", captchaText);

            await page.getByRole("textbox", {
                name: "Enter Captcha Text"
            }).fill(captchaText);

            await page.getByRole("button", {
                name: "Login"
            }).click();

            await page.waitForTimeout(1500);

            // Invalid Credentials

            const invalidUser = await page
                .locator("text=Invalid User ID or Password")
                .isVisible()
                .catch(() => false);

            if (invalidUser) {

                throw new Error("INVALID_CREDENTIALS");

            }

            // Invalid Captcha

            const invalidCaptcha = await page
                .locator("text=Captcha Invalid")
                .isVisible()
                .catch(() => false);

            if (invalidCaptcha) {

                console.log(`❌ Captcha Failed (${attempt}/3)`);

                continue;

            }

            try {

                await page.waitForSelector("text=Hostel", {
                    timeout: 5000
                });

                loggedIn = true;

                console.log("✅ Login Successful");

                break;

            } catch {

                console.log("⚠️ Login not completed. Retrying...");

            }

        }

        if (!loggedIn) {

            throw new Error("CAPTCHA_FAILED");

        }

        // ---------------- PROFILE ----------------

        console.log("📄 Fetching Profile...");

        const profile = await getProfileDetails(page);

        console.log("✅ Profile Loaded");

        // ---------------- HOSTEL ----------------

        console.log("🏠 Opening Hostel Page...");

        await page.getByText("Hostel", {
            exact: true
        }).click();

        await page.waitForTimeout(500);

        await page.getByRole("link", {
            name: /Room Details/i
        }).click();

        const hostel = await getHostelDetails(page);

        console.log("✅ Hostel Details Loaded");

        // ---------------- DATABASE ----------------

        const isNewUser = await saveUser(profile, hostel);

        console.log("✅ User Saved");

        // ---------------- EMAIL ----------------

        if (isNewUser) {

            console.log("🎉 First Login");

            const roommates = await getRoommatesByRoom(

                hostel.block,
                hostel.tower,
                hostel.roomNumber,
                profile.regNo

            );

            console.log(`👥 Roommates Found: ${roommates.length}`);

            if (roommates.length > 0) {

                await Promise.all(

                    roommates

                        .filter(roommate => roommate.email)

                        .map(roommate =>

                            sendRoommateMail(

                                roommate.email,

                                {

                                    name: profile.name,
                                    regNo: profile.regNo,
                                    branch: profile.branch

                                }

                            )

                        )

                );

                console.log("📧 Emails Sent");

            }

        } else {

            console.log("ℹ️ Existing User");

        }

        await browser.close();

    } catch (err) {

        console.error("====================================");
        console.error("❌ LOGIN ERROR");
        console.error(err);
        console.error(err.stack);
        console.error("====================================");

        try {

            await page.screenshot({

                path: "error.png",

                fullPage: true

            });

            console.log("📸 Error Screenshot Saved");

        } catch {}

        try {

            await browser.close();

        } catch {}

        throw err;

    }

}

module.exports = loginToSRM;