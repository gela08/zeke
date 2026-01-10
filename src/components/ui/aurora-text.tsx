import React, { memo } from "react";
import "./aurora-text.css";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  speed?: number;
}

export const AuroraText = memo(
  ({
    children,
    className = "",
    colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"],
    speed = 1,
  }: AuroraTextProps) => {
    const gradientStyle: React.CSSProperties = {
      backgroundImage: `linear-gradient(
        135deg,
        ${colors.join(", ")},
        ${colors[0]}
      )`,
      animationDuration: `${10 / speed}s`,
    };

    return (
      <span className={`aurora-wrapper ${className}`}>
        {/* Screen-reader only */}
        <span className="aurora-sr">{children}</span>

        {/* Visible animated text */}
        <span
          className="aurora-text"
          style={gradientStyle}
          aria-hidden="true"
        >
          {children}
        </span>
      </span>
    );
  }
);

AuroraText.displayName = "AuroraText";
