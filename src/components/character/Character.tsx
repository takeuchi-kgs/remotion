import React from "react";
import { Img, staticFile } from "remotion";
import { useLipSync } from "./useLipSync";
import { useBlink } from "./useBlink";
import type { Speaker } from "../../schemas/script";

type CharacterProps = {
  speaker: Speaker;
  isSpeaking: boolean;
  expression?: string;
  avatarId?: string;
};

const STATES: Array<{ eyesOpen: boolean; mouthOpen: boolean }> = [
  { eyesOpen: true, mouthOpen: false }, // eo-mc
  { eyesOpen: true, mouthOpen: true }, // eo-mo
  { eyesOpen: false, mouthOpen: false }, // ec-mc
  { eyesOpen: false, mouthOpen: true }, // ec-mo
];

function getImagePath(
  speaker: Speaker,
  eyesOpen: boolean,
  mouthOpen: boolean,
  expression?: string,
  avatarId?: string,
): string {
  const eyeCode = eyesOpen ? "eo" : "ec";
  const mouthCode = mouthOpen ? "mo" : "mc";
  const prefix =
    expression && expression !== "normal" ? `${expression}-` : "";
  const defaultAvatar = speaker === "left" ? "male-suit" : "female-glasses";
  const dir = `avatars/${avatarId || defaultAvatar}`;
  return `images/characters/${dir}/${prefix}${eyeCode}-${mouthCode}.png`;
}

export const Character: React.FC<CharacterProps> = ({
  speaker,
  isSpeaking,
  expression,
  avatarId,
}) => {
  const { mouthOpen } = useLipSync(isSpeaking);
  const { eyesOpen } = useBlink(`character-${speaker}`);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: speaker === "left" ? "flex-start" : "flex-end",
      }}
    >
      <div style={{ position: "relative", width: 200, height: 300 }}>
        {STATES.map((state) => {
          const active =
            state.eyesOpen === eyesOpen && state.mouthOpen === mouthOpen;
          return (
            <Img
              key={`${state.eyesOpen}-${state.mouthOpen}`}
              src={staticFile(
                getImagePath(
                  speaker,
                  state.eyesOpen,
                  state.mouthOpen,
                  expression,
                  avatarId,
                ),
              )}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 200,
                height: 300,
                objectFit: "contain",
                opacity: active ? 1 : 0,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
