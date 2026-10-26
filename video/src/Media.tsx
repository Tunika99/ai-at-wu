import React from "react";
import { Img, OffthreadVideo, staticFile } from "remotion";
import { FPS } from "./theme";
import type { Media } from "./content";

/** An image or a (muted) video clip from public/media, filling its frame. */
export const MediaFill: React.FC<{ media: Media; style?: React.CSSProperties }> = ({ media, style }) => {
  const s: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: media.focus, ...style };
  return /\.(mp4|mov|m4v|webm)$/i.test(media.src) ? (
    <OffthreadVideo src={staticFile(media.src)} muted trimBefore={Math.round((media.start ?? 0) * FPS)} style={s} />
  ) : (
    <Img src={staticFile(media.src)} style={s} />
  );
};
