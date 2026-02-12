import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import type { SE } from "../../schemas/se";

type AnnotationTriggerSEProps = {
  se: SE;
  triggerFrame: number;
};

export const AnnotationTriggerSE: React.FC<AnnotationTriggerSEProps> = ({
  se,
  triggerFrame,
}) => {
  return (
    <Sequence from={triggerFrame}>
      <Audio src={staticFile(se.path)} volume={se.volume} />
    </Sequence>
  );
};
