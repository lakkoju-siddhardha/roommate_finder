const launchBrowser = require("./browser");
const solveCaptcha = require("./ocr");
const getHostelDetails = require("./hostel");
const { saveHostelDetails } = require("../models/userModel");
async function loginToSRM(regNo, password) {

    const { browser, page } = await launchBrowser();

    await page.goto("https://student.srmap.edu.in/", {
        waitUntil: "domcontentloaded"
    });

    

    await page.getByRole('textbox', {
        name: 'Enter Application Number /'
    }).fill(regNo);

    await page.getByRole('textbox', {
        name: 'Password'
    }).fill(password);

  

    // Capture Captcha
    const captcha = page.locator('#frmSL').getByRole('img');

    await captcha.screenshot({
        path: "public/images/captcha.png"
    });

    const captchaText = await solveCaptcha("public/images/captcha.png");



    await page.getByRole('textbox', {
    name: 'Enter Captcha Text'
}).fill(captchaText);

console.log("Captcha Filled");
   await page.getByRole('button', {
    name: 'Login'
}).click();
await page.waitForSelector("text=Hostel");

console.log("Login Successful");

await page.waitForTimeout(1000);

await page.getByText("Hostel", {
    exact: true
}).click();
await page.waitForTimeout(500);
console.log("Hostel Menu Opened");


try {
  await page.getByRole("link", {
    name: /Room Details/i
}).click();

    console.log("Room Details Opened");

} catch (err) {
    console.log(err);
}
const hostel = await getHostelDetails(page);

    await saveHostelDetails(regNo, hostel);

console.log("Saved to Database");
}

module.exports = loginToSRM;