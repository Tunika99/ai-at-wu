// Membership certificates for AI Society Vienna.
//
// Edit certificates.json (names, texts, signers), optionally drop signature
// PNGs into signatures/, then run:
//
//   node certificates/generate.mjs              -> certificates/out/*.pdf
//   node certificates/generate.mjs --preview    -> also a PNG preview per PDF
//
// Each certificate is an A4 portrait page rendered by Google Chrome from
// the HTML below, with the website's fonts embedded. The rubber stamp is
// drawn as SVG with ink filters and baked into a high-res PNG first, so it
// prints crisp.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(DIR, "out");
const PREVIEW = process.argv.includes("--preview");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const data = JSON.parse(fs.readFileSync(path.join(DIR, "certificates.json"), "utf8"));

const b64 = (file) => fs.readFileSync(path.join(DIR, file)).toString("base64");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const FONTS = `
  @font-face { font-family: "Space Grotesk"; font-weight: 300 700; src: url(data:font/woff2;base64,${b64("fonts/space-grotesk-latin.woff2")}) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212; }
  @font-face { font-family: "Space Grotesk"; font-weight: 300 700; src: url(data:font/woff2;base64,${b64("fonts/space-grotesk-latin-ext.woff2")}) format("woff2");
    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+1EF2-1EFF, U+A720-A7FF; }
  @font-face { font-family: "Inter"; font-weight: 100 900; src: url(data:font/woff2;base64,${b64("fonts/inter-latin.woff2")}) format("woff2");
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212; }
  @font-face { font-family: "Inter"; font-weight: 100 900; src: url(data:font/woff2;base64,${b64("fonts/inter-latin-ext.woff2")}) format("woff2");
    unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+1E00-1E9F, U+1EF2-1EFF, U+A720-A7FF; }
  @font-face { font-family: "JetBrains Mono"; font-weight: 100 800; src: url(data:font/woff2;base64,${b64("fonts/jetbrains-mono-latin.woff2")}) format("woff2"); }
`;

/**
 * A rubber stamp: one violet ink, double outer ring, the name running around
 * it, the @ in the middle. Filters roughen the edges, leave tiny gaps in the
 * ink and vary the pressure, like a real stamp pressed by hand.
 */
const STAMP_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 124" width="1400" height="1400">
  <defs>
    <path id="top" d="M 16,62 A 46,46 0 0,1 108,62"/>
    <path id="bottom" d="M 9.5,62 A 52.5,52.5 0 0,0 114.5,62"/>
    <filter id="ink" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <!-- slightly wobbly edges -->
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="4" result="edge"/>
      <feDisplacementMap in="SourceGraphic" in2="edge" scale="1.1" xChannelSelector="R" yChannelSelector="G" result="rough"/>
      <!-- sparse, crisp gaps where the rubber did not take ink -->
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="9" result="grain"/>
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -16 0 0 0 10.6" result="holes"/>
      <feComposite in="rough" in2="holes" operator="in" result="speckled"/>
      <!-- uneven hand pressure: big soft lighter patches -->
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="21" result="press"/>
      <feColorMatrix in="press" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.2 0 0 0 -0.75" result="pressure"/>
      <feComposite in="speckled" in2="pressure" operator="in"/>
    </filter>
  </defs>
  <g filter="url(#ink)" fill="#4c2aa8" stroke="#4c2aa8">
    <circle cx="62" cy="62" r="59" fill="none" stroke-width="2.6"/>
    <circle cx="62" cy="62" r="55.6" fill="none" stroke-width="0.9"/>
    <circle cx="62" cy="62" r="40.5" fill="none" stroke-width="1.6"/>
    <g stroke="none" font-family="Space Grotesk" font-weight="700">
      <text font-size="9.6" letter-spacing="2.6" text-anchor="middle"><textPath href="#top" startOffset="50%">AI SOCIETY VIENNA</textPath></text>
      <text font-size="8.6" letter-spacing="2.2" text-anchor="middle"><textPath href="#bottom" startOffset="50%">STUDENT SOCIETY · WU</textPath></text>
      <text x="13" y="65.2" font-size="8" text-anchor="middle">★</text>
      <text x="111" y="65.2" font-size="8" text-anchor="middle">★</text>
      <text x="62" y="70" font-size="40" text-anchor="middle">@</text>
      <text x="62" y="89" font-size="6.6" letter-spacing="1.6" text-anchor="middle" font-family="JetBrains Mono" font-weight="600">EST. 2026</text>
    </g>
  </g>
</svg>`;
let stampPng = "";

function signatureBlock(key) {
  const s = data.signers[key];
  if (!s) throw new Error(`unknown signer "${key}" - see "signers" in certificates.json`);
  const img = s.signature && fs.existsSync(path.join(DIR, s.signature))
    ? `<img src="data:image/png;base64,${b64(s.signature)}" alt="">`
    : "";
  return `<div class="sig"><div class="ink">${img}</div><div class="line"></div>
    <div class="who">${esc(s.name)}</div><div class="role">${esc(s.title)}</div></div>`;
}

function html(c, number) {
  const t = data.templates[c.template];
  if (!t) throw new Error(`unknown template "${c.template}" for ${c.name}`);
  const pick = (k) => c[k] ?? t[k];
  const firstName = c.name.trim().split(/\s+/)[0];
  const fill = (s) => esc(s).replace(/\{firstName\}/g, esc(firstName)).replace(/\{name\}/g, esc(c.name));
  const signers = pick("signedBy").map(signatureBlock);
  const stamp = `<img class="stamp ${signers.length === 1 ? "single" : ""}" src="data:image/png;base64,${stampPng}" alt="">`;
  return `<!doctype html><html><head><meta charset="utf-8">
<title>${esc(pick("title"))} - ${esc(c.name)}</title>
<style>
${FONTS}
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { position: relative; width: 210mm; height: 297mm; overflow: hidden; background: #fbfaff; color: #120e22; font-family: "Inter", sans-serif; }
.grid { position: absolute; inset: 0;
  background-image: linear-gradient(to right, rgba(91,33,182,0.055) 0.25mm, transparent 0.25mm), linear-gradient(to bottom, rgba(91,33,182,0.055) 0.25mm, transparent 0.25mm);
  background-size: 9mm 9mm; -webkit-mask-image: radial-gradient(ellipse 85% 70% at 50% 42%, black 30%, transparent 95%); }
.glow { position: absolute; inset: 0; background:
  radial-gradient(70mm 60mm at 6% 4%, rgba(139,92,246,0.13), transparent 70%),
  radial-gradient(80mm 60mm at 96% 97%, rgba(217,70,239,0.09), transparent 70%); }
.watermark { position: absolute; left: 50%; top: 128mm; transform: translate(-50%, -50%); font-family: "Space Grotesk"; font-weight: 700; font-size: 300pt; line-height: 1;
  color: transparent; -webkit-text-stroke: 0.35mm rgba(91,33,182,0.07); }
.frame { position: absolute; inset: 9mm; border: 0.3mm solid rgba(91,33,182,0.22); border-radius: 2.5mm; }
.corner { position: absolute; width: 12mm; height: 12mm; border: 0 solid #8b5cf6; }
.tl { top: 6.5mm; left: 6.5mm; border-top-width: 0.7mm; border-left-width: 0.7mm; }
.tr { top: 6.5mm; right: 6.5mm; border-top-width: 0.7mm; border-right-width: 0.7mm; }
.bl { bottom: 6.5mm; left: 6.5mm; border-bottom-width: 0.7mm; border-left-width: 0.7mm; }
.br { bottom: 6.5mm; right: 6.5mm; border-bottom-width: 0.7mm; border-right-width: 0.7mm; }
.hud { position: absolute; font-family: "JetBrains Mono", monospace; font-size: 6.2pt; letter-spacing: 0.2em; color: #8a84a3; }
.content { position: absolute; top: 33mm; left: 0; right: 0; text-align: center; }
.wordmark { display: inline-flex; align-items: flex-end; gap: 0.22em; font-family: "Space Grotesk"; font-weight: 600; font-size: 25pt; line-height: 1; letter-spacing: -0.025em; }
.at { background: linear-gradient(100deg, #5b21b6 10%, #8b5cf6 55%, #c026d3 90%); -webkit-background-clip: text; background-clip: text; color: transparent; padding: 0.2em; margin: -0.2em; }
.col { display: inline-flex; flex-direction: column; align-items: flex-start; }
.society { font-size: 0.36em; font-weight: 500; letter-spacing: 0.34em; color: #6b6485; margin-bottom: 0.16em; }
.label { margin-top: 17mm; font-family: "JetBrains Mono"; font-size: 8.5pt; letter-spacing: 0.32em; color: #7c3aed; text-transform: uppercase; }
.certify { margin-top: 13mm; font-size: 11.5pt; color: #5b5570; }
.name { width: 176mm; margin: 3mm auto 0; white-space: nowrap; font-family: "Space Grotesk"; font-weight: 600; font-size: 38pt; line-height: 1.12; letter-spacing: -0.02em; }
.rule { width: 70mm; height: 0.45mm; margin: 4mm auto 0; background: linear-gradient(90deg, transparent, #8b5cf6 25%, #c026d3 75%, transparent); }
.roleline { margin-top: 5mm; font-size: 12.5pt; color: #2a2440; }
.roleline b { font-weight: 600; }
.text { width: 146mm; margin: 0 auto; font-size: 10.5pt; line-height: 1.65; color: #4b4560; }
.about { margin-top: 15mm; }
.recognition { margin-top: 4mm; color: #2a2440; }
.meta { margin-top: 13mm; font-family: "JetBrains Mono"; font-size: 7pt; letter-spacing: 0.18em; color: #7c7596; text-transform: uppercase; display: flex; flex-direction: column; gap: 2mm; }
.signatures { position: absolute; left: 0; right: 0; bottom: 47mm; display: flex; justify-content: center; align-items: flex-end; gap: 34mm; }
.sig { width: 62mm; text-align: center; position: relative; z-index: 1; }
.ink { height: 16mm; display: flex; align-items: flex-end; justify-content: center; }
.ink img { max-height: 16mm; max-width: 56mm; }
.line { border-top: 0.3mm solid #2a2440; }
.who { margin-top: 2mm; font-family: "Space Grotesk"; font-weight: 600; font-size: 10.5pt; }
.role { margin-top: 0.8mm; font-family: "JetBrains Mono"; font-size: 6.8pt; letter-spacing: 0.26em; color: #7c3aed; text-transform: uppercase; }
/* pressed by hand: a little crooked, overlapping the signature lines */
.stamp { position: absolute; z-index: 2; width: 37mm; height: 37mm; left: 50%; bottom: -6mm; transform: translateX(-50%) rotate(-11deg);
  mix-blend-mode: multiply; opacity: 0.88; }
.stamp.single { left: calc(50% - 47mm); bottom: -4mm; transform: translateX(-50%) rotate(-11deg); }
</style></head><body><div class="page">
  <div class="glow"></div><div class="grid"></div><div class="watermark">@</div><div class="frame"></div>
  <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
  <div class="hud" style="top:12.5mm;left:14mm">[ 48.2131° N - 16.4085° E ]</div>
  <div class="hud" style="top:12.5mm;right:14mm">NO. ${esc(number)}</div>
  <div class="hud" style="bottom:12.5mm;left:14mm">[ WELTHANDELSPLATZ 1 - 1020 WIEN ]</div>
  <div class="hud" style="bottom:12.5mm;right:14mm">AISOCIETYVIENNA.TECH</div>
  <div class="content">
    <div class="wordmark"><span>AI</span><span class="at">@</span><span class="col"><span class="society">SOCIETY</span><span>VIENNA</span></span></div>
    <div class="label">[ ${esc(pick("title"))} ]</div>
    <div class="certify">This is to certify that</div>
    <div class="name">${esc(c.name)}</div>
    <div class="rule"></div>
    <div class="roleline">${fill(pick("roleLine"))} <b>AI Society Vienna</b></div>
    <p class="text about">${fill(c.about ?? data.about)}</p>
    <p class="text recognition">${fill(pick("recognition"))}</p>
    <div class="meta">${c.memberSince ? `<span>Member since ${esc(c.memberSince)}</span>` : ""}<span>Issued in Vienna, ${esc(c.issued ?? today)}</span></div>
  </div>
  <div class="signatures">${signers.join("")}${stamp}</div>
</div></body></html>`;
}

// --- render every certificate with one headless Chrome ----------------------
const PORT = 9600 + Math.floor(Math.random() * 300);
const profile = fs.mkdtempSync("/tmp/asv-cert-chrome-");
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run", `--user-data-dir=${profile}`,
  `--remote-debugging-port=${PORT}`, "about:blank"], { stdio: "ignore" });
try {
  let page;
  for (let i = 0; i < 60 && !page; i++) {
    await sleep(250);
    try { page = (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).find((t) => t.type === "page"); } catch {}
  }
  if (!page) throw new Error("Could not start Google Chrome");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  const pending = new Map(); let id = 0;
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  await new Promise((r) => (ws.onopen = r));
  const send = (method, params = {}) => new Promise((r, j) => {
    const i = ++id; pending.set(i, (m) => (m.error ? j(new Error(m.error.message)) : r(m.result)));
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  await send("Page.enable");
  const frameId = (await send("Page.getFrameTree")).frameTree.frame.id;

  // bake the stamp into a transparent high-res PNG (filters print soft otherwise)
  await send("Emulation.setDeviceMetricsOverride", { width: 1400, height: 1400, deviceScaleFactor: 1, mobile: false });
  await send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  await send("Page.setDocumentContent", { frameId, html: `<!doctype html><html><head><style>${FONTS} html,body{margin:0;background:transparent}</style></head><body>${STAMP_SVG}</body></html>` });
  await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
  await sleep(200);
  stampPng = (await send("Page.captureScreenshot", { format: "png" })).data;
  await send("Emulation.setDefaultBackgroundColorOverride", {});

  // A4 portrait at 96 dpi, so the preview matches the PDF
  await send("Emulation.setDeviceMetricsOverride", { width: 794, height: 1123, deviceScaleFactor: 2, mobile: false });

  fs.mkdirSync(OUT, { recursive: true });
  const year = new Date().getFullYear();
  for (const [i, c] of data.certificates.entries()) {
    const number = c.number ?? `ASV-${year}-${String(i + 1).padStart(3, "0")}`;
    await send("Page.setDocumentContent", { frameId, html: html(c, number) });
    await send("Runtime.evaluate", { expression: "document.fonts.ready.then(() => true)", awaitPromise: true });
    // long names shrink until they fit on one line
    await send("Runtime.evaluate", { expression: `(() => { const n = document.querySelector(".name"); let s = 38;
      while (n.scrollWidth > n.clientWidth && s > 18) n.style.fontSize = --s + "pt"; })()` });
    await sleep(150);
    const base = `certificate-${slug(c.name)}${c.template === "member" ? "" : `-${c.template}`}`;
    const pdf = await send("Page.printToPDF", { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
    fs.writeFileSync(path.join(OUT, `${base}.pdf`), Buffer.from(pdf.data, "base64"));
    if (PREVIEW) {
      const png = await send("Page.captureScreenshot", { format: "png" });
      fs.writeFileSync(path.join(OUT, `${base}.png`), Buffer.from(png.data, "base64"));
    }
    console.log(`wrote out/${base}.pdf  (${c.name}, ${c.template}, ${number})`);
  }
  ws.close();
} finally {
  chrome.kill();
}
