

const db = require("../database/db");

function convertDate(dateStr) {

    if (!dateStr) return null;

    const months = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"
    };

    const [day, month, year] = dateStr.split("-");

    return `${year}-${months[month]}-${day}`;
}

async function saveUser(profile, hostel) {

    const query = `
    INSERT INTO users (

        reg_no,
        name,
        branch,
        semester,
        dob,
        gender,

        academic_year,
        allotted_date,
        block_name,
        tower,
        room_number,
        room_type

    )

    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE

        name = VALUES(name),
        branch = VALUES(branch),
        semester = VALUES(semester),
        dob = VALUES(dob),
        gender = VALUES(gender),

        academic_year = VALUES(academic_year),
        allotted_date = VALUES(allotted_date),
        block_name = VALUES(block_name),
        tower = VALUES(tower),
        room_number = VALUES(room_number),
        room_type = VALUES(room_type),

        last_synced = CURRENT_TIMESTAMP
    `;

    await db.execute(query, [

        profile.regNo,

        profile.name,

        profile.branch,

        profile.semester,

        convertDate(profile.dob),

        profile.gender,

        hostel.academicYear,

        hostel.allottedDate,

        hostel.block,

        hostel.tower,

        hostel.roomNumber,

        hostel.roomType

    ]);

    console.log("✅ User Saved Successfully");
}

async function getUser(regNo) {

    const [rows] = await db.execute(
        "SELECT * FROM users WHERE reg_no = ?",
        [regNo]
    );

    return rows[0];
}
async function userExists(regNo) {

    const [rows] = await db.execute(
        "SELECT reg_no FROM users WHERE reg_no = ?",
        [regNo]
    );

    return rows.length > 0;
}
async function getUserName(regNo) {

    const [rows] = await db.execute(
        "SELECT name FROM users WHERE reg_no = ?",
        [regNo]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0].name;
}
module.exports = {
    saveUser,
    getUser,
    userExists,
    getUserName
};