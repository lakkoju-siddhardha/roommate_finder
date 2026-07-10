const db = require("../database/db");

async function saveHostelDetails(regNo, hostel) {

    const query = `
        INSERT INTO users
        (
            reg_no,
            academic_year,
            allotted_date,
            block_name,
            tower,
            room_number,
            room_type
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE

            academic_year = VALUES(academic_year),
            allotted_date = VALUES(allotted_date),
            block_name = VALUES(block_name),
            tower = VALUES(tower),
            room_number = VALUES(room_number),
            room_type = VALUES(room_type),
            last_synced = CURRENT_TIMESTAMP
    `;

    await db.execute(query, [

        regNo,

        hostel.academicYear,

        hostel.allottedDate,

        hostel.block,

        hostel.tower,

        hostel.roomNumber,

        hostel.roomType

    ]);

    console.log("✅ Saved Successfully");
}

module.exports = {
    saveHostelDetails
};