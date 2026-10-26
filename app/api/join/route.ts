import { NextResponse } from "next/server";
import { clean, parseApplication } from "@/lib/membership";
import { notificationEmail, welcomeEmail } from "@/lib/join-emails";
import { site } from "@/lib/site";

/**
 * Membership applications from /join.
 *
 * Validates the form, renders both emails and hands everything to a Google
 * Apps Script web app (integrations/members-sheet.gs). The script appends
 * the person to the member sheet and sends the emails through the Google
 * account that owns it - no mail service, API key or DNS setup needed.
 *
 * Secrets live in environment variables only (the repo is public):
 *   MEMBERS_SHEET_URL, MEMBERS_SHEET_SECRET, WHATSAPP_INVITE_URL
 */

export const runtime = "nodejs";

const json = (body: object, status = 200) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Honeypot: hidden from people, bots fill it in. Pretend it worked.
  if (clean(body.website, 200)) return json({ ok: true });

  const parsed = parseApplication(body);
  if (!parsed.ok) return json({ ok: false, error: parsed.error }, 400);
  const app = parsed.data;
  const submittedAt = new Date().toISOString();

  const { MEMBERS_SHEET_URL, MEMBERS_SHEET_SECRET, WHATSAPP_INVITE_URL } = process.env;
  if (!MEMBERS_SHEET_URL || !MEMBERS_SHEET_SECRET) {
    if (process.env.NODE_ENV !== "production") {
      // Local development without the sheet: show what would happen.
      console.info("[join] not configured - application received:", app);
      return json({ ok: true, dev: true });
    }
    console.error("[join] missing MEMBERS_SHEET_URL / MEMBERS_SHEET_SECRET");
    return json({ ok: false, error: `Sign-up is not available right now. Please write to ${site.email}.` }, 503);
  }

  try {
    const res = await fetch(MEMBERS_SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: MEMBERS_SHEET_SECRET,
        submittedAt,
        ...app,
        welcome: welcomeEmail(app, WHATSAPP_INVITE_URL),
        notification: notificationEmail(app, submittedAt),
      }),
      redirect: "follow", // Apps Script answers through a redirect
    });
    const out = (await res.json().catch(() => null)) as { ok?: boolean; welcomeSent?: boolean; error?: string } | null;
    if (!res.ok || !out?.ok) throw new Error(`Sheet ${res.status}: ${out?.error ?? "no confirmation"}`);
    return json({ ok: true, welcomeSent: out.welcomeSent !== false });
  } catch (err) {
    console.error("[join] failed:", err);
    return json({ ok: false, error: `Something went wrong. Please try again or write to ${site.email}.` }, 502);
  }
}
