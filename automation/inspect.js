const launchBrowser = require("./browser");

async function inspectPage() {

    const { page } = await launchBrowser();

    await page.goto("https://student.srmap.edu.in/", {
        waitUntil: "domcontentloaded"
    });

    await page.pause();
}

inspectPage();