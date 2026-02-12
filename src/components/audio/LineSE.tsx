import React from "react";
import { Audio, staticFile } from "remotion";
import type { SE } from "../../schemas/se";

type LineSEProps = {
  se: SE;
};

export const LineSE: React.FC<LineSEProps> = ({ se }) => {
  return <Audio src={staticFile(se.path)} volume={se.volume} />;
};
