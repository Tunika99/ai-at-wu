# AI Society Vienna - intro video

Vertical 1080x1920 intro video (about 24 s, 30 fps) in the website's style,
built with [Remotion](https://www.remotion.dev) - React, like the site.

## Swap photos or videos

1. Put the file into `public/media/` (`.jpg`, `.png`, `.mp4`, `.mov`, `.webm`).
2. Point the scene to it in `src/content.ts`:
   ```ts
   media: { src: "media/campus.mp4", focus: "50% 50%", caption: "[ WU CAMPUS ]", start: 3 },
   ```
   - `focus` is where the portrait crop centres (`"30% 50%"` = more to the left)
   - `start` (videos only) is the second to start from

Texts of the scenes, the stats and the URL are in `src/content.ts` too.

The two campus photos in `public/media/` are placeholders. Before publishing,
use your own footage or check the photos' licence and credit them.

## Preview and render

```
npm install
npm run studio   # live preview in the browser
npm run render   # writes out/ai-society-vienna-intro.mp4 (about 2 minutes)
```

`npm run render` uses `scripts/render.mjs`: Remotion builds the page, the
script drives Google Chrome frame by frame and encodes with Remotion's ffmpeg.
On the Mac this was built on, `remotion render` itself kept losing its browser
("Target closed"); if it works on your machine, `npm run render:remotion` is
the standard way.

Note: the script captures plain images, so for video clips in
`public/media/` swap `OffthreadVideo` in `src/Media.tsx` for `<Video>` from
`remotion` (OffthreadVideo needs Remotion's own renderer).

The video has no music on purpose: add a licensed sound when you upload it
(Instagram / TikTok sound library), or royalty-free music for LinkedIn.

`remotion.config.ts` points `remotion render` / `remotion still` at the
installed Google Chrome via `scripts/chrome.sh` (no GPU process).

## Files

- `src/scenes.tsx` - the five scenes and their timing
- `src/Wordmark.tsx` - the AI @ SOCIETY VIENNA wordmark and the spinning @
- `src/Network.tsx` - the neural backdrop (never draws through text)
- `src/Background.tsx`, `src/Hud.tsx` - nebula, grid and corner labels
