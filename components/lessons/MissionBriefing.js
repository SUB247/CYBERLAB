"use client";

import React from "react";
import {
  Target,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Terminal,
  Info,
} from "lucide-react";

export default function MissionBriefing({ mission }) {
  if (!mission) return null;

  const {
    title,
    subtitle,
    scenarioHost,
    networkContext,
    briefing,
    conceptExplanation,
    challenge,
  } = mission;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-[11px] font-mono font-semibold uppercase">
              Mission {mission.number}
            </span>
            <span className="text-xs text-cyber-muted font-medium">
              {mission.difficulty} • ~{mission.estimatedMinutes} mins
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 px-2.5 py-1 rounded-md">
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Target: {scenarioHost}</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-cyber-text tracking-tight">{title}</h1>
          <p className="text-xs text-cyber-muted mt-1 leading-relaxed">{subtitle}</p>
        </div>
      </div>

      {/* Why it Matters (Importance) */}
      <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyber-emerald">
          <AlertCircle className="w-4 h-4" />
          <span>Operational Context & Why This Matters</span>
        </div>
        <p className="text-xs text-cyber-muted leading-relaxed">{briefing.importance}</p>
      </div>

      {/* Learning Objectives */}
      <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyber-text">
          <Target className="w-4 h-4 text-cyber-emerald" />
          <span>Learning Objectives</span>
        </div>
        <ul className="space-y-2">
          {briefing.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-cyber-muted">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0 mt-0.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deep Concept Explanation */}
      <div className="p-5 rounded-xl bg-cyber-surface border border-cyber-border space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyber-text">
          <BookOpen className="w-4 h-4 text-cyber-cyan" />
          <span>{conceptExplanation.heading}</span>
        </div>

        <div className="space-y-2 text-xs text-cyber-muted leading-relaxed">
          {conceptExplanation.body.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {conceptExplanation.codeExample && (
          <div className="p-3 rounded-lg bg-cyber-bg border border-cyber-border font-mono text-xs text-cyber-emerald flex items-center justify-between">
            <span>{conceptExplanation.codeExample}</span>
            <span className="text-[10px] text-cyber-muted uppercase">Syntax Pattern</span>
          </div>
        )}

        {conceptExplanation.notes && (
          <div className="space-y-1.5 pt-1">
            {conceptExplanation.notes.map((note, nIdx) => (
              <div
                key={nIdx}
                className="text-[11px] text-cyber-muted/90 flex items-start gap-2 bg-cyber-card/60 p-2 rounded border border-cyber-border/50"
              >
                <Info className="w-3.5 h-3.5 text-cyber-muted shrink-0 mt-0.5" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mission Challenge / Task Box */}
      <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3 shadow-lg shadow-emerald-950/20">
        <div className="flex items-center gap-2 text-xs font-bold text-cyber-emerald uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Your Mission Objective</span>
        </div>

        <p className="text-xs text-emerald-100 font-medium leading-relaxed">
          {challenge.taskDescription}
        </p>

        <div className="p-2.5 rounded bg-cyber-bg/90 border border-cyber-border text-xs font-mono text-cyber-muted flex items-center justify-between">
          <span>Assigned Scope:</span>
          <span className="text-emerald-400 font-bold">{challenge.targetIp}</span>
        </div>
      </div>
    </div>
  );
}
