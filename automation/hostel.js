async function getHostelDetails(page) {

    await page.waitForSelector("#tblFinalConfirmation");

    const rows = page.locator("#tblFinalConfirmation tr");

    const count = await rows.count();

    let hostel = {

        academicYear: "",
        allottedDate: "",
        block: "",
        tower: "",
        roomNumber: "",
        roomType: ""

    };

    for (let i = 0; i < count; i++) {

        const cols = await rows.nth(i).locator("td").allTextContents();

        if (cols.length < 2) continue;

        const label = cols[0].trim();
        const value = cols[1].trim();

        // Current Room Type
        if (label === "Room Type") {

            hostel.roomType = value;

        }

        // Current Hostel Allocation
        else if (label === "Allotted Room No.") {

            const parts = value.split("/").map(item => item.trim());

            hostel.block = parts[0] || "";
            hostel.tower = parts[1] || "";
            hostel.roomNumber = parts[2] || "";

            // If you want Bed Number later:
            // hostel.bedNumber = parts[3] || "";

        }

        // Previous Year Hostel Status Table
        else if (label.includes("202")) {

            hostel.academicYear = cols[0].trim();
            hostel.allottedDate = cols[1].trim();
        }

    }

    return hostel;

}

module.exports = getHostelDetails;