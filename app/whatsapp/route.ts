import { NextResponse } from "next/server";

/**
 * /whatsapp forwards to the WhatsApp community invite (WHATSAPP_INVITE_URL).
 * Welcome emails link here instead of to chat.whatsapp.com directly: mail
 * filters drop mails from new domains that carry WhatsApp invite links.
 */
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const target = process.env.WHATSAPP_INVITE_URL || new URL("/join", req.url).toString();
  const res = NextResponse.redirect(target, 302);
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "no-store");
  return res;
}
