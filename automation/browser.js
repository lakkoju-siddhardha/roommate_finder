const { chromium } = require("playwright");

async function launchBrowser() {

    const browser = await chromium.launch({

        headless: true,

        args: [

            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage"

        ]

    });

    const page = await browser.newPage();

    return { browser, page };

}

module.exports = launchBrowser;