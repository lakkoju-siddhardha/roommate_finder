require("dotenv").config();

const transporter = require("./utils/mailer");

async function testMail() {

    try {

        await transporter.sendMail({

            from: `"RoomSync" <${process.env.EMAIL_USER}>`,

            to: process.env.EMAIL_USER,

            subject: "RoomSync Test",

            html: `
                <h2>🎉 Email Working!</h2>
                <p>This is a test email from RoomSync.</p>
            `

        });

        console.log("✅ Email Sent Successfully!");

    } catch (err) {

        console.error(err);

    }

}

testMail();