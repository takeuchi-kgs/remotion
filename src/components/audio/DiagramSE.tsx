import React from "react";
import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import type { SE } from "../../schemas/se";

type DiagramSEProps = {
  se: SE;
};

const DIAGRAM_SE_DELAY_SEC = 0.3;

export const DiagramSE: React.FC<DiagramSEProps> = ({ se }) => {
  const { fps } = useVideoConfig();
  const delayFrames = Math.round(DIAGRAM_SE_DELAY_SEC * fps);

  return (
    <Sequence from={delayFrames}>
      <Audio src={staticFile(se.path)} volume={se.volume} />
    </Sequence>
  );
};
