import React from "react";
import { Audio, staticFile } from "remotion";
import type { SE } from "../../schemas/se";

type AnnotationSEProps = {
  se: SE;
};

export const AnnotationSE: React.FC<AnnotationSEProps> = ({ se }) => {
  return <Audio src={staticFile(se.path)} volume={se.volume} />;
};
