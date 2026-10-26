/**
 * Everything you are likely to swap lives here.
 *
 * media: a file in public/media - an image (.jpg/.png) or a video
 * (.mp4/.mov/.webm). For a video, `start` is the second to start from.
 * `focus` is the CSS object-position of the crop (the frame is portrait).
 */
export type Media = { src: string; focus: string; caption: string; start?: number };

export const PHOTO_SCENES: {
  label: string;
  title: string;
  sub: string;
  media: Media;
}[] = [
  {
    label: "[ 01 - WORKSHOPS ]",
    title: "Learn by building.",
    sub: "Hands-on workshops where theory turns into something you can demo.",
    media: { src: "media/wu-lc-1.jpg", focus: "64% 50%", caption: "[ LIBRARY & LEARNING CENTER ]" },
  },
  {
    label: "[ 02 - SPEAKER NIGHTS ]",
    title: "World-class speakers.",
    sub: "Honest discussion about AI, beyond the hype.",
    media: { src: "media/wu-lc-2.jpg", focus: "60% 50%", caption: "[ WU CAMPUS - 1020 WIEN ]" },
  },
];

export const STATS = [
  { from: 1990, to: 2026, suffix: "", label: "[ FOUNDED ]" },
  { from: 0, to: 50, suffix: "+", label: "[ MEMBERS ]" },
  { from: 0, to: 30, suffix: "+", label: "[ EVENTS / YEAR ]" },
];

export const URL = "aisocietyvienna.tech";
