// Fallback renderer for Macs where `remotion render` loses its browser
// ("Target closed"). Remotion only builds the page; this script drives
// Google Chrome itself (no GPU process), captures every frame and resumes
// after a crash, then encodes with the ffmpeg that ships with Remotion.
//
//   node scripts/render.mjs                    -> out/ai-society-vienna-announcement.mp4 (with music)
//   node scripts/render.mjs --comp Intro       -> out/ai-society-vienna-intro.mp4
//   node scripts/render.mjs 0 120              -> only frames 0..119 (quick test, no encode)
import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FFMPEG = path.join(ROOT, "node_modules/@remotion/compositor-darwin-arm64/ffmpeg");
const BUILD = path.join(ROOT, "build");
const FRAMES = path.join(ROOT, "out/frames");
const args = process.argv.slice(2);
const compFlag = args.indexOf("--comp");
const COMP_ID = compFlag >= 0 ? args.splice(compFlag, 2)[1] : "Announcement";
const OUT = path.join(ROOT, `out/ai-society-vienna-${COMP_ID.toLowerCase()}.mp4`);
// music laid under the video when encoding (compositions without one stay silent)
const AUDIO = { Announcement: path.join(ROOT, "public/audio/music.mp3") }[COMP_ID];
const COMP = { id: COMP_ID, width: 1080, height: 1920, fps: 30 };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 1. bundle
execFileSync("npx", ["remotion", "bundle", "src/index.ts", "--out-dir", BUILD, "--log=error"], { cwd: ROOT, stdio: "inherit" });

// 2. serve the bundle
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const p = path.join(BUILD, decodeURIComponent(new URL(req.url, "http://x").pathname));
  const file = fs.existsSync(p) && fs.statSync(p).isFile() ? p : path.join(BUILD, "index.html");
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const URL_ = `http://127.0.0.1:${server.address().port}/index.html`;

// 3. one browser session; returns a frame grabber
let chrome;
let duration = 0;
async function openSession() {
  const port = 9500 + Math.floor(Math.random() * 400);
  const profile = fs.mkdtempSync("/tmp/remotion-chrome-");
  chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", "--mute-audio",
    `--user-data-dir=${profile}`, `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
  let page;
  for (let i = 0; i < 60 && !page; i++) {
    await sleep(250);
    try { page = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page"); } catch {}
  }
  if (!page) throw new Error("Chrome did not start");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  const pending = new Map(); let id = 0; let closed = false;
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } };
  ws.onclose = () => { closed = true; for (const r of pending.values()) r({ error: { message: "closed" } }); };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const send = (method, params = {}) => new Promise((r, j) => {
    if (closed) return j(new Error("browser closed"));
    const i = ++id;
    const t = setTimeout(() => { pending.delete(i); j(new Error(`timeout ${method}`)); }, 60000);
    pending.set(i, (m) => { clearTimeout(t); m.error ? j(new Error(m.error.message)) : r(m.result); });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evalJs = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  };

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: COMP.width, height: COMP.height, deviceScaleFactor: 1, mobile: false });
  // the globals Remotion's renderer sets before the bundle boots (set-props-and-env.js)
  await send("Page.addScriptToEvaluateOnNewDocument", { source: `
    window.remotion_puppeteerTimeout = 60000; window.remotion_isMainTab = true;
    window.remotion_mediaCacheSizeInBytes = null; window.remotion_initialMemoryAvailable = null;
    window.remotion_sampleRate = 48000; window.process = { env: { NODE_ENV: "production" } };
    window.remotion_envVariables = "{}"; window.remotion_inputProps = "{}"; window.remotion_initialFrame = 0;
    window.remotion_attempt = 1; window.remotion_proxyPort = 0; window.remotion_audioEnabled = false;
    window.remotion_videoEnabled = true; window.remotion_logLevel = "error";` });
  await send("Page.navigate", { url: URL_ });
  for (let i = 0; i < 120; i++) {
    await sleep(250);
    if (await evalJs("typeof window.remotion_setBundleMode === 'function'").catch(() => false)) break;
  }
  // ask the bundle for the composition's length (like `remotion compositions`)
  await evalJs(`window.remotion_setBundleMode({ type: "evaluation" }); true`);
  const waitReady = async (what) => {
    for (let i = 0; ; i++) {
      if (await evalJs("window.remotion_renderReady === true")) return;
      if (i > 1200) throw new Error(`${what} never became ready`);
      await sleep(25);
    }
  };
  await waitReady("composition list");
  const meta = (await evalJs("window.getStaticCompositions()")).find((c) => c.id === COMP.id);
  duration = meta.durationInFrames;
  await evalJs(`window.remotion_setBundleMode({ type: "composition", compositionName: "${COMP.id}",
    serializedResolvedPropsWithSchema: "{}", compositionDurationInFrames: ${duration}, compositionFps: ${COMP.fps},
    compositionHeight: ${COMP.height}, compositionWidth: ${COMP.width}, compositionDefaultCodec: "h264",
    compositionDefaultOutName: null, compositionDefaultVideoImageFormat: null, compositionDefaultPixelFormat: null,
    compositionDefaultProResProfile: null, compositionDefaultSampleRate: null }); true`);

  return async (frame) => {
    await evalJs(`window.remotion_setFrame(${frame}, "${COMP.id}", 1); true`);
    await waitReady(`frame ${frame}`);
    await evalJs("document.fonts.ready.then(() => true)");
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 95 });
    fs.writeFileSync(path.join(FRAMES, `${String(frame).padStart(4, "0")}.jpg`), Buffer.from(shot.data, "base64"));
  };
}

// 4. capture, resuming after crashes
const from = Number(args[0] ?? 0);
let to = args[1] === undefined ? Infinity : Number(args[1]);
// fresh frames every run (crash restarts below resume within this run only)
fs.rmSync(FRAMES, { recursive: true, force: true });
fs.mkdirSync(FRAMES, { recursive: true });
let frame = from;
let restarts = 0;
const t0 = Date.now();
while (frame < to) {
  try {
    const grab = await openSession();
    to = Math.min(to, duration);
    while (frame < to) {
      const file = path.join(FRAMES, `${String(frame).padStart(4, "0")}.jpg`);
      if (!fs.existsSync(file)) await grab(frame);
      frame++;
      if (frame % 30 === 0) console.log(`frame ${frame}/${to}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
  } catch (e) {
    if (++restarts > 25) throw e;
    console.log(`browser lost at frame ${frame} (${e.message}) - restarting`);
  } finally {
    chrome?.kill("SIGKILL");
  }
}
server.close();

// 5. encode
if (from === 0 && to === duration) {
  console.log(`captured ${duration} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s, encoding...`);
  const seconds = duration / COMP.fps;
  const audio = AUDIO
    // the track already decays to silence at its end; Remotion's ffmpeg has no afade
    ? ["-i", AUDIO, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "256k", "-t", seconds.toFixed(3)]
    : [];
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-framerate", String(COMP.fps), "-i", path.join(FRAMES, "%04d.jpg"), ...audio,
    "-c:v", "libx264", "-crf", "16", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT],
    // Remotion's ffmpeg finds its libav*.dylib only relative to the working directory
    { stdio: "inherit", cwd: path.dirname(FFMPEG) });
  console.log("wrote", OUT);
}
