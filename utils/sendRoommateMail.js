const transporter = require("./mailer");

async function sendRoommateMail(to, roommate) {

    await transporter.sendMail({

        from: `"SRMAPrommmateFinder" <${process.env.EMAIL_USER}>`,

        to,

        subject: "🎉 A New Roommate Joined!",

        html: `

        <div style="font-family:Segoe UI;padding:30px">

            <h2 style="color:#00B8FF">
                🎉 You have a new roommate!
            </h2>

            <p>

                <strong>${roommate.name}</strong>
                has joined your hostel room.

            </p>

            <table>

                <tr>

                    <td><b>Name</b></td>

                    <td>${roommate.name}</td>

                </tr>

                <tr>

                    <td><b>Registration No.</b></td>

                    <td>${roommate.regNo}</td>

                </tr>

                <tr>

                    <td><b>Branch</b></td>

                    <td>${roommate.branch}</td>

                </tr>

            </table>

            <br>

            <p>

                Login to SRMAPrommmateFinder and start chatting.

            </p>

        </div>

        `

    });

}

module.exports = sendRoommateMail;