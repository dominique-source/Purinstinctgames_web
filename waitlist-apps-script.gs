/**
 * PürInstinct Games — Waitlist → Google Sheets
 * ============================================
 * SETUP (5 minutes, one time):
 *
 * 1. Go to https://sheets.google.com and create a new spreadsheet.
 *    Name it e.g. "PurInstinct Waitlist".
 * 2. In the sheet: Extensions → Apps Script.
 * 3. Delete the default code and paste THIS ENTIRE FILE.
 * 4. Click Deploy → New deployment → type: Web app.
 *      - Description: waitlist
 *      - Execute as: Me
 *      - Who has access: Anyone          <-- important
 *    Click Deploy, authorize with your Google account.
 * 5. Copy the Web app URL (it ends in /exec).
 * 6. In index.html, find SHEET_ENDPOINT and replace
 *    PASTE_YOUR_APPS_SCRIPT_URL_HERE with that URL.
 *
 * Every signup then appears instantly as a new row:
 * Date | Email | Cellulaire | Tier | Langue | Page
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Waitlist") || ss.insertSheet("Waitlist");

    // header row on first run
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Date", "Email", "Cellulaire", "Tier", "Langue", "Page"]);
      sheet.getRange(1, 1, 1, 6).setFontWeight("bold").setBackground("#CCFF00");
      sheet.setFrozenRows(1);
    }

    var p = e.parameter;
    sheet.appendRow([
      new Date(),
      p.email || "",
      "'" + (p.phone || ""),   // leading ' keeps phone formatting as text
      p.tier || "",
      p.lang || "",
      p.page || ""
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: visiting the URL in a browser shows a tiny status page
function doGet() {
  return ContentService.createTextOutput("PurInstinct waitlist endpoint OK");
}
