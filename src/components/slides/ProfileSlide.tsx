import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import {
  fadeIn,
  scaleIn,
  slideInFromRight,
  staggerDelay,
} from "../../utils/animation";

type ProfileSlideProps = {
  title?: string;
  profileImage?: {
    source: "generate" | "static";
    prompt?: string;
    path?: string;
  };
  profileName?: string;
  profileRole?: string;
  items?: string[];
};

export const ProfileSlide: React.FC<ProfileSlideProps> = ({
  title,
  profileImage,
  profileName,
  profileRole,
  items = [],
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing["2xl"],
        justifyContent: "center",
      }}
    >
      {title && (
        <div
          style={{
            opacity: fadeIn(frame, 0),
            fontSize: tokens.typography.fontSize["2xl"],
            fontWeight: 700,
            color: tokens.colors.text.primary,
            marginBottom: tokens.spacing.xl,
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.xl,
          marginBottom: tokens.spacing.lg,
        }}
      >
        {/* Profile image */}
        <div
          style={{
            opacity: fadeIn(frame, 5),
            transform: `scale(${scaleIn(frame, 5)})`,
            width: 180,
            height: 180,
            borderRadius: "50%",
            backgroundColor: "#64748B",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: tokens.colors.text.inverse,
            fontSize: tokens.typography.fontSize.sm,
            flexShrink: 0,
          }}
        >
          {profileImage?.prompt || "Profile"}
        </div>
        {/* Name and role */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: tokens.spacing.xs,
          }}
        >
          {profileName && (
            <div
              style={{
                opacity: fadeIn(frame, 10),
                transform: `translateX(${slideInFromRight(frame, 10)}px)`,
                fontSize: tokens.typography.fontSize.xl,
                fontWeight: 700,
                color: tokens.colors.text.primary,
              }}
            >
              {profileName}
            </div>
          )}
          {profileRole && (
            <div
              style={{
                opacity: fadeIn(frame, 14),
                transform: `translateX(${slideInFromRight(frame, 14)}px)`,
                fontSize: tokens.typography.fontSize.lg,
                color: tokens.colors.text.secondary,
                fontWeight: 500,
              }}
            >
              {profileRole}
            </div>
          )}
        </div>
      </div>
      {/* Detail items */}
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
        {items.map((item, i) => {
          const delay = staggerDelay(i, 8) + 20;
          return (
            <div
              key={i}
              style={{
                opacity: fadeIn(frame, delay),
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.sm,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: tokens.colors.primary,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: tokens.typography.fontSize.md,
                  color: tokens.colors.text.primary,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
