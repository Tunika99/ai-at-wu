import type { Application } from "@/lib/membership";
import { site } from "@/lib/site";

/** Everything people typed is escaped before it goes into an HTML email. */
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;padding:13px 26px;border-radius:999px;background:#a78bfa;color:#0d0a19;font-weight:600;font-size:15px;text-decoration:none">${esc(label)}</a>`;

const shell = (body: string) => `<!doctype html><html><body style="margin:0;padding:0;background:#f4f2fb">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2fb;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;border:1px solid #e4defa;font-family:Helvetica,Arial,sans-serif;color:#1d1830">
<tr><td style="padding:32px 36px 8px">
  <div style="font-size:11px;letter-spacing:4px;color:#6b6485;padding-left:62px">SOCIETY</div>
  <div style="font-size:26px;font-weight:700;letter-spacing:-0.5px">AI <span style="color:#8b5cf6">@</span> VIENNA</div>
</td></tr>
<tr><td style="padding:16px 36px 32px;font-size:15px;line-height:1.6">${body}</td></tr>
<tr><td style="padding:18px 36px;border-top:1px solid #eeeafb;font-size:12px;line-height:1.5;color:#8a84a3">
  AI Society Vienna · Student society for artificial intelligence at WU Vienna<br>
  <a href="https://aisocietyvienna.tech" style="color:#7c3aed">aisocietyvienna.tech</a> · <a href="mailto:${site.email}" style="color:#7c3aed">${site.email}</a>
</td></tr>
</table></td></tr></table></body></html>`;

/** Sent to the new member right after they apply. */
export function welcomeEmail(a: Application, whatsapp: string | undefined) {
  const first = a.name.split(" ")[0];
  const steps: string[] = [];
  if (whatsapp) {
    steps.push(`<p style="margin:26px 0 6px;font-weight:600">1. Join our WhatsApp community</p>
<p style="margin:0 0 14px;color:#4b4560">Announcements, events and quick questions - this is where it all happens.</p>
${button(whatsapp, "Join the WhatsApp community")}`);
  }
  steps.push(`<p style="margin:26px 0 6px;font-weight:600">${whatsapp ? "2. " : ""}Open the member portal</p>
<p style="margin:0 0 14px;color:#4b4560">Slides, recordings and learning resources. Sign in to Notion with this email address (<b>${esc(a.email)}</b>) to get access.</p>
${button(site.memberPortal.url, "Open the member portal")}`);

  const html = shell(`<p style="margin:0">Hi ${esc(first)},</p>
<p>thanks for joining <b>AI Society Vienna</b> - we're excited to have you on board! Here's how to get started:</p>
${steps.join("\n")}
<p style="margin-top:30px">Questions? Just reply to this email.</p>
<p style="margin-bottom:0">See you soon,<br>The AI Society Vienna team</p>`);

  const text = [
    `Hi ${first},`,
    "",
    "thanks for joining AI Society Vienna - we're excited to have you on board!",
    "",
    ...(whatsapp ? ["Join our WhatsApp community:", whatsapp, ""] : []),
    `Member portal (sign in to Notion with ${a.email}):`,
    site.memberPortal.url,
    "",
    "Questions? Just reply to this email.",
    "",
    "See you soon,",
    "The AI Society Vienna team",
  ].join("\n");

  return { subject: "Welcome to AI Society Vienna", html, text };
}

/** Sent to the society's inbox for every new application. */
export function notificationEmail(a: Application, submittedAt: string) {
  const rows: [string, string][] = [
    ["Name", a.name],
    ["Email", a.email],
    ["Phone", a.phone],
    ["Study program", a.program],
    ["Submitted", new Date(submittedAt).toLocaleString("en-GB", { timeZone: "Europe/Vienna" })],
  ];
  const html = shell(`<p style="margin:0 0 14px"><b>New member application</b></p>
<table cellpadding="0" cellspacing="0" style="font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="padding:4px 18px 4px 0;color:#8a84a3">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="color:#4b4560">Already added to the member sheet. The welcome email with the WhatsApp and portal links went out automatically.</p>`);
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { subject: `New member: ${a.name} (${a.program.split(" - ")[0]})`, html, text };
}
