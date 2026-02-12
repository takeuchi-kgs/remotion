import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Character } from "../components/character/Character";
import { tokens } from "../styles/tokens";

export const CharacterPreview: React.FC = () => {
  const frame = useCurrentFrame();
  // Left speaks for first half, right speaks for second half
  const leftSpeaking = frame < 45;
  const rightSpeaking = frame >= 45;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        flexDirection: "row",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: `0 ${tokens.spacing["2xl"]}px ${tokens.spacing.xl}px`,
      }}
    >
      <Character speaker="left" isSpeaking={leftSpeaking} />
      <div
        style={{
          position: "absolute",
          top: tokens.spacing.xl,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: tokens.typography.fontFamily.sans,
          fontSize: tokens.typography.fontSize.lg,
          color: tokens.colors.text.secondary,
        }}
      >
        {leftSpeaking ? "← 左キャラが話し中" : "右キャラが話し中 →"}
      </div>
      <Character speaker="right" isSpeaking={rightSpeaking} />
    </AbsoluteFill>
  );
};
