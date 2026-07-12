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

        await page.goto("https://student.srmap.edu.in/", {
            waitUntil: "domcontentloaded"
        });

        let loggedIn = false;

        // ---------------- CAPTCHA RETRY ----------------

        for (let attempt = 1; attempt <= 3; attempt++) {

            console.log(`🔄 Login Attempt ${attempt}/3`);

            // SRM clears these fields after captcha failure,
            // so fill them every attempt.
            await page.getByRole("textbox", {
                name: "Enter Application Number /"
            }).fill(regNo);

            await page.getByRole("textbox", {
                name: "Password"
            }).fill(password);

            // Capture captcha
            const captcha = page.locator("#frmSL").getByRole("img");

            await captcha.screenshot({
                path: "public/images/captcha.png"
            });

            const captchaText = await solveCaptcha(
                "public/images/captcha.png"
            );

            await page.getByRole("textbox", {
                name: "Enter Captcha Text"
            }).fill("");

            await page.getByRole("textbox", {
                name: "Enter Captcha Text"
            }).fill(captchaText);

            console.log("Captcha:", captchaText);

            await page.getByRole("button", {
                name: "Login"
            }).click();

            await page.waitForTimeout(1500);

            // ---------------- INVALID PASSWORD ----------------

            const invalidUser = await page
                .locator("text=Invalid User ID or Password")
                .isVisible()
                .catch(() => false);

            if (invalidUser) {

                throw new Error("INVALID_CREDENTIALS");

            }

            // ---------------- CAPTCHA FAILED ----------------

            const invalidCaptcha = await page
                .locator("text=Captcha Invalid")
                .isVisible()
                .catch(() => false);

            if (invalidCaptcha) {

                console.log(`❌ Captcha failed (${attempt}/3)`);

                continue;

            }

            // ---------------- LOGIN SUCCESS ----------------

            try {

                await page.waitForSelector("text=Hostel", {

                    timeout: 5000

                });

                loggedIn = true;

                console.log("✅ Login Successful");

                break;

            } catch {

                console.log("Waiting for next retry...");

            }

        }

        if (!loggedIn) {

            throw new Error("CAPTCHA_FAILED");

        }

        // ---------------- FETCH PROFILE ----------------

        await page.waitForTimeout(3000);

        const profile = await getProfileDetails(page);

        await page.getByText("Hostel", {
            exact: true
        }).click();

        await page.waitForTimeout(500);

        await page.getByRole("link", {
            name: /Room Details/i
        }).click();

        const hostel = await getHostelDetails(page);

        // ---------------- SAVE USER ----------------

        const isNewUser = await saveUser(profile, hostel);

        console.log("✅ User Saved");

        // ---------------- EMAIL ROOMMATES ----------------

        if (isNewUser) {

            console.log("🎉 First login detected.");

            const roommates = await getRoommatesByRoom(

                hostel.block,
                hostel.tower,
                hostel.roomNumber,
                profile.regNo

            );

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

                console.log("📧 Roommate notification emails sent.");

            } else {

                console.log("No roommates found.");

            }

        } else {

            console.log("ℹ️ Existing user. Skipping emails.");

        }

        await browser.close();

    } catch (err) {

        await browser.close();

        throw err;

    }

}

module.exports = loginToSRM;