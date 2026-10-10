const SHEET_ID = '1G0R030yLvEg2ElDsVk1xyz8v6TGUsc5Ag3wwtqzcXn8';
const SHEET_NAME = 'Cereri';
const SITE_KEY = 'alvitravel-web-2026';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ok:true, service:'AlviTravel lead endpoint'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, maxLen) {
  return String(value || '').trim().slice(0, maxLen || 500);
}

function doPost(e) {
  try {
    const p = (e && e.parameter) ? e.parameter : {};

    if (clean_(p.website, 200)) {
      return ContentService.createTextOutput(JSON.stringify({ok:true}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    if (clean_(p.siteKey, 80) !== SITE_KEY) {
      return ContentService.createTextOutput(JSON.stringify({ok:false, error:'invalid-source'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const name = clean_(p.name, 120);
    const phone = clean_(p.phone, 80);
    if (!name || !phone) {
      return ContentService.createTextOutput(JSON.stringify({ok:false, error:'missing-required'}))
        .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('Sheet not found');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      sheet.appendRow([
        new Date(),
        name,
        phone,
        clean_(p.destination, 120),
        clean_(p.date, 60),
        clean_(p.adults, 20),
        clean_(p.children, 20),
        clean_(p.childAges, 250),
        clean_(p.budget, 120),
        clean_(p.message, 1500),
        clean_(p.source, 200) || 'alvitravel.md',
        'Nou'
      ]);
    } finally {
      lock.releaseLock();
    }

    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
