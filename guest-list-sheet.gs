/**
 * Haritha & Alen — guest list for the wedding invite.
 * Paste this whole file into Extensions › Apps Script of a new Google Sheet,
 * then Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
 * Copy the web-app link into sheetUrl near the top of the script in index.html.
 *
 * It keeps three tabs up to date:
 *   RSVPs        one row per guest (a guest who answers again updates their own row)
 *   Performances one row per performance entry
 *   Summary      live totals for the engagement and the wedding
 */

const RSVP_HEADERS = ['Last updated', 'Name', 'Side', 'Engagement (Wed 20 Jan)', 'Wedding (Mon 25 Jan)', 'Guests', 'Phone', 'Note', 'Times answered'];
const PERFORM_HEADERS = ['Received', 'Name', 'Side', 'Celebration', 'Performance', 'Performers', 'Idea', 'Phone'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    setUp_(ss);
    if (data.type === 'perform') {
      const sh = ss.getSheetByName('Performances');
      sh.appendRow([new Date(), clean_(data.name), clean_(data.side), clean_(data.event), clean_(data.kind), clean_(data.count), clean_(data.idea), clean_(data.phone)]);
    } else {
      saveRsvp_(ss.getSheetByName('RSVPs'), data);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: 'Guest list is connected.' });
}

function saveRsvp_(sh, d) {
  const name = clean_(d.name), side = clean_(d.side);
  const guests = d.guests === '6 or more' ? 6 : Number(d.guests) || 0;
  const key = (name + '|' + side).toLowerCase().replace(/\s+/g, ' ');
  const last = sh.getLastRow();
  if (last > 1) {
    const rows = sh.getRange(2, 1, last - 1, RSVP_HEADERS.length).getValues();
    for (let i = 0; i < rows.length; i++) {
      const k = (String(rows[i][1]) + '|' + String(rows[i][2])).toLowerCase().replace(/\s+/g, ' ');
      if (k === key) {
        const times = (Number(rows[i][8]) || 1) + 1;
        sh.getRange(i + 2, 1, 1, RSVP_HEADERS.length).setValues([[new Date(), name, side, clean_(d.eng), clean_(d.wed), guests, clean_(d.phone) || rows[i][6], clean_(d.note) || rows[i][7], times]]);
        return;
      }
    }
  }
  sh.appendRow([new Date(), name, side, clean_(d.eng), clean_(d.wed), guests, clean_(d.phone), clean_(d.note), 1]);
}

function setUp_(ss) {
  let r = ss.getSheetByName('RSVPs');
  if (!r) {
    r = ss.getSheets().length === 1 && ss.getSheets()[0].getLastRow() === 0 ? ss.getSheets()[0].setName('RSVPs') : ss.insertSheet('RSVPs');
    r.appendRow(RSVP_HEADERS); styleHeader_(r, RSVP_HEADERS.length);
  }
  let p = ss.getSheetByName('Performances');
  if (!p) { p = ss.insertSheet('Performances'); p.appendRow(PERFORM_HEADERS); styleHeader_(p, PERFORM_HEADERS.length); }
  let s = ss.getSheetByName('Summary');
  if (!s) {
    s = ss.insertSheet('Summary', 0);
    s.getRange('A1:C1').setValues([['', 'Engagement (Wed 20 Jan)', 'Wedding (Mon 25 Jan)']]);
    s.getRange('A2:A6').setValues([['Coming (replies)'], ['Coming (total people)'], ["Can't make it"], ['Not sure yet'], ['Total replies']]);
    s.getRange('B2:C6').setFormulas([
      ['=COUNTIF(RSVPs!D2:D,"Yes*")', '=COUNTIF(RSVPs!E2:E,"Yes*")'],
      ['=SUMIF(RSVPs!D2:D,"Yes*",RSVPs!F2:F)', '=SUMIF(RSVPs!E2:E,"Yes*",RSVPs!F2:F)'],
      ['=COUNTIF(RSVPs!D2:D,"Sorry*")', '=COUNTIF(RSVPs!E2:E,"Sorry*")'],
      ['=COUNTIF(RSVPs!D2:D,"Not sure*")', '=COUNTIF(RSVPs!E2:E,"Not sure*")'],
      ['=COUNTA(RSVPs!B2:B)', '=COUNTA(RSVPs!B2:B)']
    ]);
    s.getRange('A8:A9').setValues([['Performance entries'], ['']]);
    s.getRange('B8').setFormula('=COUNTA(Performances!B2:B)');
    s.getRange('A1:C1').setFontWeight('bold').setBackground('#FBDCE3');
    s.getRange('A2:A8').setFontWeight('bold');
    s.setColumnWidths(1, 3, 220);
  }
}

function styleHeader_(sh, n) {
  sh.getRange(1, 1, 1, n).setFontWeight('bold').setBackground('#F5D98F');
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, n, 170);
}

function clean_(v) {
  // keep values as plain text so nothing typed by a guest becomes a formula
  const s = v == null ? '' : String(v).trim().slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
