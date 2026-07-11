async function getHostelDetails(page) {

    await page.waitForSelector("#tblFinalConfirmation");

    const rows = page.locator("#tblFinalConfirmation tbody tr");

    const count = await rows.count();

    // Get the latest hostel record (last row)
    const cols = await rows
        .nth(count - 1)
        .locator("td")
        .allTextContents();

    const hostel = {

        academicYear: cols[0].trim(),
        allottedDate: cols[1].trim(),
        block: cols[2].trim(),
        tower: cols[3].trim(),
        roomNumber: cols[4].trim(),
        roomType: cols[5].trim()

    };

    return hostel;
}

module.exports = getHostelDetails;