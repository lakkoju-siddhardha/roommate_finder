async function getHostelDetails(page) {

    await page.waitForSelector("#tblFinalConfirmation");

    const rows = page.locator("#tblFinalConfirmation tbody tr");

    const cols = await rows.nth(5).locator("td").allTextContents();

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