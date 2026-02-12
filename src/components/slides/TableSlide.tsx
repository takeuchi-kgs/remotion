import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { tokens } from "../../styles/tokens";
import { fadeIn, slideInFromBottom, staggerDelay } from "../../utils/animation";

type TableSlideProps = {
  title?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
};

export const TableSlide: React.FC<TableSlideProps> = ({
  title,
  tableHeaders = [],
  tableRows = [],
}) => {
  const frame = useCurrentFrame();

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
      <table
        style={{
          borderCollapse: "collapse",
          width: "90%",
          maxWidth: 1400,
        }}
      >
        {tableHeaders.length > 0 && (
          <thead>
            <tr
              style={{
                opacity: fadeIn(frame, 8),
              }}
            >
              {tableHeaders.map((header, i) => (
                <th
                  key={i}
                  style={{
                    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                    backgroundColor: tokens.colors.primary,
                    color: tokens.colors.text.inverse,
                    fontSize: tokens.typography.fontSize.md,
                    fontWeight: 700,
                    textAlign: "left",
                    borderBottom: `2px solid ${tokens.colors.primary}`,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {tableRows.map((row, rowIdx) => {
            const delay = staggerDelay(rowIdx) + 15;
            return (
              <tr
                key={rowIdx}
                style={{
                  opacity: fadeIn(frame, delay),
                  backgroundColor:
                    rowIdx % 2 === 0 ? tokens.colors.surface : tokens.colors.background,
                }}
              >
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    style={{
                      padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                      fontSize: tokens.typography.fontSize.md,
                      color: tokens.colors.text.primary,
                      borderBottom: `1px solid #E2E8F0`,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </AbsoluteFill>
  );
};
