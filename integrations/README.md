# Member sign-up: one-time setup (about 10 minutes)

When someone submits the form on `/join`, the website (`app/api/join/route.ts`) checks the input
and hands it to a Google Apps Script (`members-sheet.gs`), which:

1. adds the person to the **member sheet** (Google Sheets - download as Excel anytime: File -> Download -> .xlsx)
2. sends them the **welcome email** with the WhatsApp community and member portal links
3. sends you a **notification** about the new member

The emails go out through the Google account that owns the sheet, with "AI Society Vienna" as the
sender name. No mail service, API key or DNS records needed. Limit: about 100 emails per day.

Tip: use a shared club Google account (e.g. a Gmail created for the society) rather than a personal one.

## 1. Google Sheet + script

1. Create a Google Sheet, e.g. "AI Society Vienna - Members" (signed in with the club account).
2. Extensions -> Apps Script. Delete the sample code, paste `members-sheet.gs` from this folder, save.
3. Project Settings (gear icon) -> Script properties -> Add:
   - `SECRET` = a long random string (e.g. from `openssl rand -hex 24`). You need it again in step 2.
   - optional `NOTIFY_TO` = who gets the "new member" emails (default: the club account)
   - optional `REPLY_TO` = where replies to the welcome email go (default: the club account)
   - optional `FROM` = `info@aisocietyvienna.tech` to send as that address (see "Sending as info@" below)
4. Back in the editor, choose the function **authorize** in the toolbar and click **Run**.
   Google asks for permission to edit the sheet and send email - allow it
   ("Google hasn't verified this app" -> Advanced -> Go to project).
5. Deploy -> New deployment -> gear -> **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   -> Deploy, then copy the **Web app URL** (ends in `/exec`).

The "Members" tab with its header row is created on the first sign-up.
If you change the script later: Deploy -> Manage deployments -> edit -> Version: New version.

## 2. Vercel environment variables

Vercel -> project -> Settings -> Environment Variables (Production):

| Name | Value |
|---|---|
| `MEMBERS_SHEET_URL` | the Web app URL from step 1.5 |
| `MEMBERS_SHEET_SECRET` | the same `SECRET` as in step 1.3 |
| `WHATSAPP_INVITE_URL` | the WhatsApp community invite link |

Then redeploy (or push the code). Secrets go into Vercel only - **never into this repo, it is public.**
The WhatsApp link stays out of the code on purpose: it only reaches people through the welcome email.

## Sending as info@aisocietyvienna.tech

By default the emails come from the Google account. To send them as info@aisocietyvienna.tech:

1. **The inbox must work.** In Zoho Mail create the `info@` mailbox, then add Zoho's records at
   name.com (DNS for aisocietyvienna.tech): MX `mx.zoho.eu` (priority 10), `mx2.zoho.eu` (20),
   `mx3.zoho.eu` (50), TXT `v=spf1 include:zoho.eu ~all`, plus the DKIM record Zoho shows.
2. **Add it to the club Gmail:** Gmail -> Settings -> Accounts and Import -> "Send mail as" ->
   Add another email address -> info@aisocietyvienna.tech (leave "Treat as an alias" ticked) ->
   SMTP server `smtp.zoho.eu`, port 465 (SSL), username info@aisocietyvienna.tech + its Zoho password
   (or a Zoho app password). Confirm with the code Gmail sends to info@.
3. Set the script properties `FROM` and `REPLY_TO` to `info@aisocietyvienna.tech`, run **authorize** once more
   (it now also asks for Gmail permission and logs the aliases it sees), then deploy a new version.

If `FROM` is set but the alias is missing, the script falls back to sending as the Google account.

## Member portal access

The welcome email links to `site.memberPortal.url` (lib/site.ts) and tells people to sign in to Notion
with the email they signed up with. Notion's API cannot invite people, so either share the portal page
with "anyone with the link" (simplest - the link only goes out by email), or invite new emails from the
sheet by hand.

## Without setup (local development)

If the variables are missing, `npm run dev` still accepts the form and only logs the application to
the terminal. In production the form then shows an error that points people to the contact address.
