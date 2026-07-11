const db = require("../database/db");

async function getMessages(user1, user2) {

    const [rows] = await db.execute(

        `SELECT *
         FROM messages
         WHERE
            (sender_reg_no = ? AND receiver_reg_no = ?)
         OR
            (sender_reg_no = ? AND receiver_reg_no = ?)
         ORDER BY sent_at ASC`,

        [user1, user2, user2, user1]

    );

    return rows;
}

async function saveMessage(sender, receiver, message) {

    await db.execute(

        `INSERT INTO messages
        (sender_reg_no, receiver_reg_no, message)
        VALUES (?, ?, ?)`,

        [sender, receiver, message]

    );

}

module.exports = {
    getMessages,
    saveMessage
};