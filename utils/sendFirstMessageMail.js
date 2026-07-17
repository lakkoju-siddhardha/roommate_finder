const transporter = require("./mailer");

async function sendFirstMessageMail(to, senderName) {

    await transporter.sendMail({

        from: `"SRMAPrommateFinder" <${process.env.EMAIL_USER}>`,

        to,

        subject: "💬 You received your first message!",

        html: `

        <div style="font-family:Segoe UI;padding:30px">

            <h2 style="color:#00B8FF">

                💬 New Message

            </h2>

            <p>

                <strong>${senderName}</strong>

                has sent you your first message on SRMAPrommateFinder.

            </p>

            <p>

                Login to SRMAPrommateFinder to reply.

            </p>

        </div>

        `

    });

}

module.exports = sendFirstMessageMail;