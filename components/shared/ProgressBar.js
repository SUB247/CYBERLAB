"use client";

import React from "react";

export default function ProgressBar({
  value = 0,
  max = 100,
  showLabel = false,
  size = "md",
  className = "",
  label = "",
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const heightClasses = {
    xs: "h-1",
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-cyber-muted mb-1.5 font-medium">
          <span>{label || "Progress"}</span>
          <span className="text-cyber-emerald font-semibold">{percentage}%</span>
        </div>
      )}
      <div
        className={`w-full bg-cyber-border rounded-full overflow-hidden ${
          heightClasses[size] || heightClasses.md
        }`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
