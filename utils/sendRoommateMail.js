const transporter = require("./mailer");

async function sendRoommateMail(to, roommate) {

    await transporter.sendMail({

        from: `"SRM AP RoomSync" <${process.env.EMAIL_USER}>`,

        to,

        subject: "🎉 A New Roommate Joined Your Room!",

        html: `

        <div style="
            max-width:600px;
            margin:auto;
            font-family:'Segoe UI',Arial,sans-serif;
            background:#ffffff;
            border:1px solid #e5e7eb;
            border-radius:12px;
            overflow:hidden;
        ">

            <div style="
                background:#00B8FF;
                color:white;
                padding:24px;
                text-align:center;
            ">

                <h2 style="margin:0;">
                    🎉 A New Roommate Joined!
                </h2>

            </div>

            <div style="padding:30px; color:#374151;">

                <p style="font-size:16px;">
                    Great news! <strong>${roommate.name}</strong> has joined your hostel room on <strong>RoomSync</strong>.
                </p>

                <table style="
                    width:100%;
                    border-collapse:collapse;
                    margin:25px 0;
                ">

                    <tr>
                        <td style="padding:10px;border-bottom:1px solid #eee;"><strong>Name</strong></td>
                        <td style="padding:10px;border-bottom:1px solid #eee;">${roommate.name}</td>
                    </tr>

                    <tr>
                        <td style="padding:10px;border-bottom:1px solid #eee;"><strong>Registration No.</strong></td>
                        <td style="padding:10px;border-bottom:1px solid #eee;">${roommate.regNo}</td>
                    </tr>

                    <tr>
                        <td style="padding:10px;border-bottom:1px solid #eee;"><strong>Branch</strong></td>
                        <td style="padding:10px;border-bottom:1px solid #eee;">${roommate.branch}</td>
                    </tr>

                </table>

                <div style="text-align:center;margin:35px 0;">

                    <a
                        href="https://roommate-finder-zgkj.onrender.com"
                        style="
                            display:inline-block;
                            background:#00B8FF;
                            color:white;
                            text-decoration:none;
                            padding:14px 28px;
                            border-radius:8px;
                            font-weight:bold;
                        "
                    >
                        Open RoomSync
                    </a>

                </div>

                <p style="font-size:15px;line-height:1.7;">
                    You can now chat with your roommate, view their profile, and connect before arriving on campus.
                </p>

                <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">

                <p style="
                    color:#6b7280;
                    font-size:13px;
                    text-align:center;
                    margin:0;
                ">
                    Thanks for using <strong>SRM AP Roommatefinder</strong> ❤️
                </p>

            </div>

        </div>

        `

    });

}

module.exports = sendRoommateMail;