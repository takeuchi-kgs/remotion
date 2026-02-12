import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, typewriter } from "../../utils/animation";

type CodeSlideProps = {
  title?: string;
  code?: string;
  language?: string;
};

export const CodeSlide: React.FC<CodeSlideProps> = ({
  title,
  code = "",
  language,
}) => {
  const frame = useCurrentFrame();

  const lines = code.split("\n");
  const visibleChars = typewriter(frame, 15, code.length, 0.5);

  // Calculate which characters to show across all lines
  let charsRemaining = visibleChars;
  const visibleLines = lines.map((line) => {
    if (charsRemaining <= 0) return "";
    if (charsRemaining >= line.length) {
      charsRemaining -= line.length + 1; // +1 for newline
      return line;
    }
    const partial = line.substring(0, charsRemaining);
    charsRemaining = 0;
    return partial;
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: tokens.colors.background,
        fontFamily: tokens.typography.fontFamily.sans,
        padding: tokens.spacing["2xl"],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {title && (
        <div
          style={{
            opacity: fadeIn(frame, 0),
            transform: `translateY(${slideInFromBottom(frame, 0)}px)`,
            fontSize: tokens.typography.fontSize["2xl"],
            fontWeight: 700,
            color: tokens.colors.text.primary,
            marginBottom: tokens.spacing.xl,
            alignSelf: "flex-start",
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          opacity: fadeIn(frame, 8),
          transform: `translateY(${slideInFromBottom(frame, 8)}px)`,
          backgroundColor: tokens.colors.codeBg,
          borderRadius: 12,
          padding: tokens.spacing.lg,
          width: "90%",
          maxWidth: 1400,
          overflow: "hidden",
        }}
      >
        {/* Language badge */}
        {language && (
          <div
            style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.text.secondary,
              marginBottom: tokens.spacing.sm,
              textTransform: "uppercase",
              letterSpacing: 1,
              fontFamily: tokens.typography.fontFamily.mono,
            }}
          >
            {language}
          </div>
        )}
        {/* Code content */}
        <div
          style={{
            fontFamily: tokens.typography.fontFamily.mono,
            fontSize: tokens.typography.fontSize.sm,
            lineHeight: 1.7,
          }}
        >
          {lines.map((_, lineIdx) => (
            <div
              key={lineIdx}
              style={{
                display: "flex",
                minHeight: tokens.typography.fontSize.sm * 1.7,
              }}
            >
              {/* Line number */}
              <span
                style={{
                  color: tokens.colors.text.secondary,
                  opacity: 0.4,
                  width: 40,
                  textAlign: "right",
                  marginRight: tokens.spacing.sm,
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                {lineIdx + 1}
              </span>
              {/* Line content */}
              <span
                style={{
                  color: tokens.colors.codeText,
                  whiteSpace: "pre",
                }}
              >
                {visibleLines[lineIdx]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
