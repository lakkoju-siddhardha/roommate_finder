const sharp = require("sharp");
const Tesseract = require("tesseract.js");

async function solveCaptcha(imagePath) {

    try {

        console.log("📷 Processing Captcha Image...");

        const processedImage = imagePath.replace(
            ".png",
            "_processed.png"
        );

        await sharp(imagePath)
            .grayscale()
            .normalize()
            .threshold(150)
            .toFile(processedImage);

        console.log("✅ Image Processed");

        console.log("🧠 Starting OCR...");

        const { data } = await Tesseract.recognize(

            processedImage,

            "eng",

            {

                logger: m => {

                    if (m.status) {

                        console.log(`OCR: ${m.status}`);

                    }

                }

            }

        );

        console.log("OCR Confidence:", data.confidence);

        let captcha = data.text
            .replace(/[^A-Za-z0-9]/g, "")
            .trim();

        console.log("OCR Raw:", data.text);
        console.log("OCR Final:", captcha);

        if (!captcha) {

            throw new Error("OCR_FAILED");

        }

        return captcha;

    } catch (err) {

        console.error("========== OCR ERROR ==========");
        console.error(err);
        console.error(err.stack);
        console.error("===============================");

        throw err;

    }

}

module.exports = solveCaptcha;