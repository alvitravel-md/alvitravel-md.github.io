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

    const type = clean_(p.type, 40);
    const name = clean_(p.name, 120);
    const phone = clean_(p.phone, 80);

    if (!phone || (type !== 'callback' && !name)) {
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
        type === 'callback' ? '' : name,
        phone,
        type === 'callback' ? '' : clean_(p.destination, 120),
        type === 'callback' ? '' : clean_(p.date, 60),
        type === 'callback' ? '' : clean_(p.adults, 20),
        type === 'callback' ? '' : clean_(p.children, 20),
        type === 'callback' ? '' : clean_(p.childAges, 250),
        type === 'callback' ? '' : clean_(p.budget, 120),
        type === 'callback' ? 'Solicitare apel' : clean_(p.message, 1500),
        type === 'callback' ? 'callback-homepage' : (clean_(p.source, 200) || 'alvitravel.md'),
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
