/**
 * AI Society Vienna - member sign-up (Google Apps Script).
 *
 * The website's /api/join route posts every application here. This script
 * 1. appends the person to the "Members" tab
 * 2. sends them the welcome email (WhatsApp + member portal links)
 * 3. sends the board a notification
 * Emails go out through the Google account that owns this script, with
 * "AI Society Vienna" as the sender name. Setup: see integrations/README.md.
 *
 * Script properties (Project Settings -> Script properties):
 *   SECRET     required - the same long random string as MEMBERS_SHEET_SECRET in Vercel
 *   NOTIFY_TO  optional - where notifications go (default: the account that owns the script)
 *   REPLY_TO   optional - where replies to the welcome email go (e.g. info@aisocietyvienna.tech once that inbox works)
 *   FROM       optional - send as this address instead of the Google account, e.g. info@aisocietyvienna.tech.
 *              It must be set up in this Gmail account first (Settings -> Accounts -> "Send mail as").
 */

const SHEET = "Members";
const HEADER = ["Submitted", "Name", "Email", "Phone", "Study program", "Consent", "Status", "Welcome email", "Notes"];
const SENDER_NAME = "AI Society Vienna";

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty("SECRET");
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply({ ok: false, error: "bad json" });
  }
  if (!secret || data.secret !== secret) return reply({ ok: false, error: "unauthorized" });

  const email = String(data.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return reply({ ok: false, error: "bad email" });

  // 1. welcome email first, so the sheet can record whether it went out
  let welcomeSent = false;
  if (data.welcome) {
    try {
      const opts = { name: SENDER_NAME, htmlBody: data.welcome.html };
      const replyTo = props.getProperty("REPLY_TO");
      if (replyTo) opts.replyTo = replyTo;
      send(email, data.welcome.subject, data.welcome.text, opts);
      welcomeSent = true;
    } catch (err) {
      console.error("welcome email failed: " + err);
    }
  }

  // 2. member sheet
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET) || book.insertSheet(SHEET);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
      sheet.getRange(1, 1, 1, HEADER.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    const last = sheet.getLastRow();
    const known = last > 1 ? sheet.getRange(2, 3, last - 1, 1).getValues().map((r) => String(r[0]).toLowerCase()) : [];
    sheet.appendRow([
      new Date(data.submittedAt || Date.now()),
      safe(data.name),
      safe(email),
      safe(data.phone),
      safe(data.program),
      data.consent ? "yes" : "no",
      known.indexOf(email) >= 0 ? "duplicate" : "new",
      welcomeSent ? "sent" : "FAILED - send manually",
      "",
    ]);
  } finally {
    lock.releaseLock();
  }

  // 3. notification to the board
  if (data.notification) {
    try {
      const to = props.getProperty("NOTIFY_TO") || Session.getEffectiveUser().getEmail();
      send(to, data.notification.subject, data.notification.text, {
        name: SENDER_NAME,
        htmlBody: data.notification.html,
        replyTo: email,
      });
    } catch (err) {
      console.error("notification failed: " + err);
    }
  }

  return reply({ ok: true, welcomeSent: welcomeSent });
}

/**
 * Sends through Gmail as the FROM address when it is a verified "Send mail as"
 * alias of this account, otherwise as the account itself.
 */
function send(to, subject, text, opts) {
  const from = PropertiesService.getScriptProperties().getProperty("FROM");
  if (from) {
    if (GmailApp.getAliases().indexOf(from) >= 0) {
      opts.from = from;
      GmailApp.sendEmail(to, subject, text, opts);
      return;
    }
    console.warn("FROM " + from + " is not a Send-mail-as alias of this account - sending as the account");
  }
  MailApp.sendEmail(to, subject, text, opts);
}

/** Text only: stops "+43 ..." turning into a formula and blocks formula injection. */
function safe(value) {
  const s = String(value == null ? "" : value).slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the editor (select "authorize" -> Run) before deploying:
 * Google then asks for permission to edit the sheet and send email.
 */
function authorize() {
  SpreadsheetApp.getActiveSpreadsheet();
  MailApp.getRemainingDailyQuota();
  console.log("Send-mail-as aliases: " + GmailApp.getAliases().join(", "));
}
