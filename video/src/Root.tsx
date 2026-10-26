import React from "react";
import { AbsoluteFill, Composition, Sequence, useCurrentFrame } from "remotion";
import { FPS, H, W } from "./theme";
import { ramp } from "./motion";
import { Background } from "./Background";
import { Network } from "./Network";
import { Hud, hudBoxes } from "./Hud";
import { SCENES, TOTAL } from "./scenes";
import { Announcement } from "./announce/Announcement";
import { T } from "./announce/timing";

const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const active = SCENES.filter((s) => frame >= s.from && frame < s.from + s.dur);
  const boxes = [...hudBoxes(frame), ...active.flatMap((s) => s.boxes(frame - s.from))];
  const anchors = active.flatMap((s) => s.anchors(frame - s.from));
  return (
    <AbsoluteFill>
      <Background />
      {/* the net wakes up once the @ has landed, as on the website */}
      <Network frame={frame} boxes={boxes} anchors={anchors} opacity={ramp(frame, 44, 84)} />
      {SCENES.map((s) => (
        <Sequence key={s.id} from={s.from} durationInFrames={s.dur}>
          <s.Component />
        </Sequence>
      ))}
      <Hud />
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <>
    {/* the launch teaser with music - the one to post */}
    <Composition id="Announcement" component={Announcement} durationInFrames={T.end} fps={FPS} width={W} height={H} />
    {/* first draft, kept for reference */}
    <Composition id="Intro" component={Main} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
  </>
);
