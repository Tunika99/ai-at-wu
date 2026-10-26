import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// High quality master - Instagram and LinkedIn re-encode on upload anyway.
Config.setCrf(16);
// The headless shell Remotion downloads crashes on this Mac (GPU process),
// so render with the installed Google Chrome in new-headless mode, launched
// through a wrapper that turns the GPU process off.
Config.setBrowserExecutable(`${process.cwd()}/scripts/chrome.sh`);
Config.setChromeMode("chrome-for-testing");
// Software GL - the GPU path crashes in this environment.
Config.setChromiumOpenGlRenderer("swiftshader");
