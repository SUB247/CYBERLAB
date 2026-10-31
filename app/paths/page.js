"use client";

import React from "react";
import Link from "next/link";
import {
  Route,
  Target,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { LEARNING_PATHS_DETAILED } from "@/lib/lessons/courses-data";
import { useUserProgress } from "@/lib/progress/progress-store";

export default function LearningPathsPage() {
  const { progressState } = useUserProgress();
  const completedMissions = progressState.completedMissions || [];

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150 w-full min-w-0">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
              <Route className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Career Trajectories
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight break-words">
            Learning Paths & Progression Trees
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed break-words">
            Multi-course career specializations guiding you from network fundamentals to advanced offensive security auditing and infrastructure analysis.
          </p>
        </div>

        {/* Paths List */}
        <div className="space-y-6 min-w-0">
          {LEARNING_PATHS_DETAILED.map((path, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={path.id}
                className={`p-6 lg:p-8 rounded-2xl border space-y-6 transition-all min-w-0 ${
                  isFirst
                    ? "bg-cyber-card border-cyber-emerald/40 shadow-lg shadow-emerald-950/20"
                    : "bg-cyber-surface border-cyber-border"
                }`}
              >
                {/* Path Header */}
                <div className="flex items-start justify-between flex-wrap gap-4 min-w-0">
                  <div className="space-y-1.5 max-w-2xl min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-emerald font-bold uppercase">
                        Track 0{idx + 1}
                      </span>
                      <span className="text-xs text-cyber-muted font-mono">{path.level}</span>
                      <span className="text-xs text-cyber-muted font-mono">• {path.estimatedTotalHours}</span>
                    </div>

                    <h2 className="text-lg lg:text-xl font-bold text-cyber-text break-words">
                      {path.title}
                    </h2>
                    <p className="text-xs text-cyber-muted leading-relaxed break-words">
                      {path.description}
                    </p>
                  </div>

                  {isFirst ? (
                    <Link
                      href="/courses/nmap-essentials"
                      className="px-4 py-2 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <span>Continue Active Path</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-xl bg-cyber-card border border-cyber-border text-xs text-cyber-muted/60 font-mono flex items-center gap-1.5 shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Unlock After Track 01</span>
                    </span>
                  )}
                </div>

                {/* Milestones Flow */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-cyber-text font-mono uppercase tracking-wider block">
                    Curriculum Progression Sequence
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {path.milestones.map((m, mIdx) => {
                      const isMilestoneActive = m.status === "active";
                      const isNmap = m.courseId === "nmap-essentials";

                      return (
                        <div
                          key={mIdx}
                          className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                            isMilestoneActive
                              ? "bg-cyber-bg border-cyber-emerald/50"
                              : "bg-cyber-bg/50 border-cyber-border/70 text-cyber-muted/50"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-mono">
                              <span>Step 0{mIdx + 1}</span>
                              {isMilestoneActive ? (
                                <span className="text-cyber-emerald font-semibold">Active Lab</span>
                              ) : (
                                <span>Prerequisite</span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-cyber-text">{m.title}</h4>
                          </div>

                          <div className="pt-2 border-t border-cyber-border/40 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-cyber-muted">
                              {isNmap ? `${completedMissions.length}/3 Labs Done` : "Locked"}
                            </span>
                            <Link
                              href={`/courses/${m.courseId}`}
                              className="text-xs text-cyber-emerald hover:underline flex items-center gap-1"
                            >
                              <span>Details</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
