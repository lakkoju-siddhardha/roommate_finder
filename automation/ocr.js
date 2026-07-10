const sharp = require("sharp");
const Tesseract = require("tesseract.js");

async function solveCaptcha(imagePath) {

    // Preprocess the image
    const processedImage = imagePath.replace(".png", "_processed.png");

    await sharp(imagePath)
        .grayscale()
        .normalize()
        .threshold(150)
        .toFile(processedImage);

    console.log("Image Processed");

    // OCR
    const { data } = await Tesseract.recognize(
        processedImage,
        "eng",
        {
            logger: m => console.log(m.status)
        }
    );

    let captcha = data.text
        .replace(/[^A-Za-z0-9]/g, "")
        .trim();

    console.log("OCR Result:", captcha);

    return captcha;
}

module.exports = solveCaptcha;