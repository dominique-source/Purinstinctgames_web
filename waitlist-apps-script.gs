/**
 * PürInstinct Games — Inscriptions → Google Sheets
 * =================================================
 * Structure des onglets :
 *   "Toutes les inscriptions" — toutes les lignes (liste principale)
 *   "2026-09-05 Montréal"     — un onglet par date + ville (créé automatiquement)
 *
 * SETUP (si pas encore fait) :
 * 1. Extensions → Apps Script → coller ce fichier complet
 * 2. Deploy → New deployment → Web app
 *    Execute as: Me  /  Who has access: Anyone
 * 3. Copier l'URL /exec → coller dans index.html → SHEET_ENDPOINT
 *
 * Si tu as DÉJÀ déployé et tu modifies le script :
 * Deploy → Manage deployments → Edit (crayon) → New version → Deploy
 */

var MAIN_SHEET = "Toutes les inscriptions";
var MAIN_HEADERS = ["Date","Email","Cellulaire","Ville","Date événement","Session","Langue","Source"];

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var p = e.parameter;

    // ── Onglet principal ──────────────────────────────────────────
    var main = ss.getSheetByName(MAIN_SHEET) || ss.insertSheet(MAIN_SHEET, 0);
    if (main.getLastRow() === 0) {
      main.appendRow(MAIN_HEADERS);
      main.getRange(1, 1, 1, MAIN_HEADERS.length)
          .setFontWeight("bold").setBackground("#CCFF00").setFontColor("#0A0A0A");
      main.setFrozenRows(1);
    }
    main.appendRow([
      new Date(),
      p.email  || "",
      "'" + (p.phone || ""),
      p.ville  || "",
      p.event_date || "",
      p.session || p.tier || "",
      p.lang   || "",
      p.page   || ""
    ]);

    // ── Onglet par date + ville (ex: "2026-09-05 Montréal") ──────
    if (p.event_date && p.ville) {
      var tabName = (p.event_date + " " + p.ville).substring(0, 100);
      var tab = ss.getSheetByName(tabName) || ss.insertSheet(tabName);
      if (tab.getLastRow() === 0) {
        var tabH = ["Heure inscription","Email","Cellulaire","Session","Langue"];
        tab.appendRow(tabH);
        tab.getRange(1, 1, 1, tabH.length)
           .setFontWeight("bold").setBackground("#CCFF00").setFontColor("#0A0A0A");
        tab.setFrozenRows(1);
      }
      tab.appendRow([
        new Date(),
        p.email || "",
        "'" + (p.phone || ""),
        p.session || p.tier || "",
        p.lang || ""
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("PurInstinct endpoint OK");
}
