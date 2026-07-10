const { chromium } = require("playwright");

async function launchBrowser() {

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const page = await browser.newPage();

    return { browser, page };
}

module.exports = launchBrowser;