"use client";

import React, { useState } from "react";
import {
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from "lucide-react";

export default function HintPanel({
  hints = [],
  revealedCount = 0,
  onRevealNextHint,
  failedAttempts = 0,
  missionTitle = "",
}) {
  const [collapsedHints, setCollapsedHints] = useState({});
  const totalHints = hints.length;

  const toggleCollapse = (level) => {
    setCollapsedHints((prev) => ({
      ...prev,
      [level]: !prev[level],
    }));
  };

  const handleReveal = () => {
    if (revealedCount < totalHints) {
      onRevealNextHint(revealedCount + 1);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-4 min-w-0 max-w-full">
      {/* Header with counter */}
      <div className="flex items-center justify-between min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-semibold text-cyber-text truncate">Progressive Hints</h3>
            <p className="text-[10px] text-cyber-muted truncate">No penalty. Reveal step-by-step.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-amber-300">
            {revealedCount} / {totalHints} Used
          </span>
        </div>
      </div>

      {/* Alternative Explanation for Repeated Failed Attempts */}
      {failedAttempts >= 2 && revealedCount === 0 && (
        <div className="p-3 rounded-lg bg-amber-950/25 border border-amber-500/30 text-amber-200/90 text-xs space-y-1.5 animate-in fade-in min-w-0">
          <div className="flex items-center gap-1.5 font-semibold text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Having trouble with the command?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-200/80 break-words">
            You have made {failedAttempts} attempts. Remember: in cybersecurity tools, commands are strictly formatted as <code className="bg-black/40 px-1 py-0.5 rounded text-amber-100 font-mono break-all">tool [options] target</code>. Try revealing Hint 1 below for a conceptual push.
          </p>
        </div>
      )}

      {/* Revealed Hints Accordion */}
      {revealedCount > 0 && (
        <div className="space-y-2.5 min-w-0">
          {hints.slice(0, revealedCount).map((hint) => {
            const isHidden = collapsedHints[hint.level];

            return (
              <div
                key={hint.level}
                className="rounded-lg bg-cyber-card border border-cyber-border/80 overflow-hidden text-xs transition-all min-w-0"
              >
                {/* Accordion header */}
                <div
                  onClick={() => toggleCollapse(hint.level)}
                  className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-cyber-surface/60 transition-colors select-none min-w-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-mono text-[10px] flex items-center justify-center font-bold shrink-0">
                      {hint.level}
                    </span>
                    <span className="font-semibold text-cyber-text truncate">{hint.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-cyber-muted shrink-0">
                    {isHidden ? (
                      <Eye className="w-3.5 h-3.5" title="Show" />
                    ) : (
                      <EyeOff className="w-3.5 h-3.5" title="Hide" />
                    )}
                    {isHidden ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Content */}
                {!isHidden && (
                  <div className="p-3 pt-1 border-t border-cyber-border/40 text-cyber-muted text-xs leading-relaxed whitespace-pre-line bg-cyber-bg/40 font-mono break-words">
                    {hint.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reveal Next Hint Button */}
      {revealedCount < totalHints ? (
        <button
          type="button"
          onClick={handleReveal}
          className="w-full py-2 px-3 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border hover:border-amber-500/40 text-xs font-semibold text-amber-300 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {revealedCount === 0
              ? "Reveal Hint 1 (Conceptual Clue)"
              : revealedCount === 1
              ? "Reveal Hint 2 (Directional Clue)"
              : revealedCount === 2
              ? "Reveal Hint 3 (Command Structure)"
              : "Reveal Worked Example"}
          </span>
        </button>
      ) : (
        <div className="p-2 text-center text-[11px] text-cyber-muted/70 bg-cyber-card/40 rounded border border-cyber-border/40">
          All hints unlocked for this mission. Review the worked example above!
        </div>
      )}
    </div>
  );
}
