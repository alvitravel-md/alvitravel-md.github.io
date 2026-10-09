const ALVI_SPREADSHEET_ID = '17AsSGRBLbtbGjDcopN6K97cTghdOdOofRGesAJqcljc';
const ALVI_SHEET_NAME = 'Leads';

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ok:true, service:'AlviTravel Leads'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return json_({ok:false,error:'empty_request'});
    const raw = String(e.postData.contents);
    if (raw.length > 12000) return json_({ok:false,error:'payload_too_large'});
    const p = JSON.parse(raw);

    const name = clean_(p.name,120);
    const phone = clean_(p.phone,80);
    if (!name || !phone) return json_({ok:false,error:'missing_required_fields'});

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const ss = SpreadsheetApp.openById(ALVI_SPREADSHEET_ID);
      const sh = ss.getSheetByName(ALVI_SHEET_NAME);
      if (!sh) throw new Error('Sheet not found: '+ALVI_SHEET_NAME);

      const ages = Array.isArray(p.childAges)
        ? p.childAges.map(v=>clean_(v,8)).filter(Boolean).join(', ')
        : '';

      sh.appendRow([
        new Date(),
        name,
        phone,
        clean_(p.destination,120),
        clean_(p.date,40),
        number_(p.adults),
        number_(p.children),
        ages,
        clean_(p.budget,100),
        clean_(p.message,2500),
        clean_(p.source,500),
        'Nou'
      ]);
    } finally {
      lock.releaseLock();
    }
    return json_({ok:true});
  } catch (err) {
    console.error(err);
    return json_({ok:false,error:'server_error'});
  }
}

function clean_(value,maxLen){
  if(value===null||value===undefined) return '';
  return String(value).replace(/[\u0000-\u001F\u007F]/g,' ').trim().slice(0,maxLen);
}
function number_(value){
  const n=Number(value);
  return Number.isFinite(n)&&n>=0?n:0;
}
function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
