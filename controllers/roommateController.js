const { getRoommates } = require("../models/roommateModel");

async function showRoommates(req, res) {

    const regNo = req.params.regNo;

    const roommates = await getRoommates(regNo);

    res.render("roommates", {
        roommates
    });

}

module.exports = {
    showRoommates
};