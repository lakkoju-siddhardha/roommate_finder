async function getProfileDetails(page) {

    const rows = await page.locator("table.table tbody tr").all();

    const profile = {};

    for (const row of rows) {

        const cells = await row.locator("td").allTextContents();

        if (cells.length < 3) continue;

        const key = cells[0].trim();
        const value = cells[2].trim();

        profile[key] = value;

    }

    // ---------------- DOB & Gender ----------------

    const dobGender = profile["D.O.B. / Gender"] || "";

    const [dob, gender] =
        dobGender.split("/").map(item => item.trim());

    // ---------------- Phone & Email ----------------

 const contact = profile["Student Contact Number / Email"] || "";

let phone = "";
let email = "";

const parts = contact.split("/");

if (parts.length >= 2) {

    phone = parts[0]
        .replace(/\(.*?\)/g, "")   // removes anything inside ()
        .trim();

    email = parts[1].trim();

}
       
    return {

        name: profile["Student Name"],

        regNo: profile["Register No."],

        semester: profile["Semester"],

        branch: profile["Program / Section"],

        phone,

        email,

        dob,

        gender

    };

}

module.exports = getProfileDetails;