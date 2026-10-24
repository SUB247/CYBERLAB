"use client";

import React, { useState } from "react";
import { Terminal, CheckCircle2, ChevronRight, Layers, HelpCircle, Code2 } from "lucide-react";

export default function CommandExplanation({ breakdown = [], executedCommand = "" }) {
  const [selectedTokenIdx, setSelectedTokenIdx] = useState(0);

  if (!breakdown || breakdown.length === 0) return null;

  const currentToken = breakdown[selectedTokenIdx] || breakdown[0];

  return (
    <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-cyber-text">Command Breakdown & Anatomy</h3>
            <p className="text-[10px] text-cyber-muted">Inspect each component of your executed command</p>
          </div>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30 font-mono font-medium">
          Verified Syntax
        </span>
      </div>

      {/* Interactive Token Selector Ribbon */}
      <div className="p-2.5 rounded-lg bg-cyber-bg border border-cyber-border flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-cyber-muted font-mono select-none mr-1">$</span>
        {breakdown.map((item, idx) => {
          const isSelected = selectedTokenIdx === idx;
          return (
            <button
              key={idx}
              onClick={() => setSelectedTokenIdx(idx)}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all ${
                isSelected
                  ? "bg-cyber-emerald text-black shadow-md shadow-emerald-950/30 scale-105"
                  : "bg-cyber-surface text-cyber-text hover:bg-cyber-card border border-cyber-border"
              }`}
            >
              {item.token}
            </button>
          );
        })}
      </div>

      {/* Selected Token Deep-Dive Card */}
      <div className="p-3.5 rounded-lg bg-cyber-surface border border-cyber-border/80 space-y-2.5 text-xs">
        <div className="flex items-center justify-between border-b border-cyber-border/40 pb-2">
          <span className="font-mono text-emerald-400 font-bold text-sm">
            {currentToken.token}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-card text-cyber-muted font-mono border border-cyber-border">
            {currentToken.type}
          </span>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-semibold text-cyber-muted uppercase tracking-wider block">
              What it does:
            </span>
            <p className="text-cyber-text leading-relaxed mt-0.5">{currentToken.description}</p>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-cyber-muted uppercase tracking-wider block">
              Impact & Alteration:
            </span>
            <p className="text-cyber-muted leading-relaxed mt-0.5">{currentToken.impact}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
