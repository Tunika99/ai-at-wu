/**
 * Every cut sits on the music (public/audio/music.mp3, 120 BPM), measured
 * from its waveform: in the build-up the beats land at 0.28 s + 0.5 s * k,
 * there is a short silence from 7.5 s with a hit at 7.76 s, and the drop
 * hits at 8.02 s. Frames at 30 fps.
 */
export const FPS = 30;
export const beat = (k: number) => 8 + 15 * k;
export const DROP = 241;
export const dropBeat = (k: number) => DROP + 15 * k;

export const T = {
  hook: 0, //            SOMETHING / NEW / IS / COMING / TO / WU.
  footage: beat(6), //   98  - the LC at night, AI vision overlay
  brk: beat(14), //      218 - GET READY. in the silence before the drop
  hit: 233, //           7.76 s - the hit inside the silence
  drop: DROP, //         241 - the @ slams in
  words: dropBeat(6), // 331 - what we do, one word per beat
  outro: dropBeat(11), //406 - music falls quiet: end card
  end: 465,
};

/** Last beat at or before frame f (for camera bumps on the drop). */
export function lastDropBeat(f: number) {
  if (f < DROP) return -Infinity;
  return DROP + Math.floor((f - DROP) / 15) * 15;
}
