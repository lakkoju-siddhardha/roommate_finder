const db = require("../database/db");

async function getRoommates(regNo) {

    // Get current user's room
    const [userRows] = await db.execute(
        `SELECT block_name, tower, room_number
         FROM users
         WHERE reg_no = ?`,
        [regNo]
    );

    if (userRows.length === 0) {
        return [];
    }

    const user = userRows[0];


    // Find everyone in the same room except the current user
    const [roommates] = await db.execute(
        `SELECT
            reg_no,
            name,
            branch
        FROM users
        WHERE block_name = ?
          AND tower = ?
          AND room_number = ?
          AND reg_no <> ?`,
        [
            user.block_name,
            user.tower,
            user.room_number,
            regNo
        ]
    );

   
    return roommates;
}

module.exports = {
    getRoommates
};