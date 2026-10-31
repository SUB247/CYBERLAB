"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  Terminal,
  Lightbulb,
  Award,
  Zap,
  Clock,
  ArrowRight,
  Shield,
  Activity,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import {
  useUserProgress,
  computeProgressStats,
  ACHIEVEMENTS,
} from "@/lib/progress/progress-store";
import ProgressBar from "@/components/shared/ProgressBar";
import { MISSIONS } from "@/lib/lessons/lesson-data";

export default function ProgressPage() {
  const { progressState, isMounted } = useUserProgress();

  const stats = computeProgressStats(progressState);
  const completedMissions = progressState.completedMissions || [];
  const attempts = progressState.attempts || {};

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150 w-full min-w-0">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Learning Analytics
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight break-words">
            My Learning Progress & Analytics
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed break-words">
            Detailed breakdown of verified mission completions, terminal execution metrics, acquired competencies, and recent audit activity.
          </p>
        </div>

        {/* Master Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
          <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border space-y-2">
            <span className="text-xs font-mono uppercase text-cyber-muted">Curriculum Mastery</span>
            <div className="text-3xl font-extrabold font-mono text-cyber-emerald">
              {stats.percentage}%
            </div>
            <ProgressBar value={stats.percentage} size="sm" />
            <p className="text-[11px] text-cyber-muted pt-1">
              {stats.completedCount} of {stats.totalMissions} missions passed
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border space-y-2">
            <span className="text-xs font-mono uppercase text-cyber-muted">Command Runs</span>
            <div className="text-3xl font-extrabold font-mono text-cyber-cyan">
              {progressState.commandsRun || 0}
            </div>
            <p className="text-[11px] text-cyber-muted pt-1">
              {stats.totalAttempts} total evaluated attempts
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border space-y-2">
            <span className="text-xs font-mono uppercase text-cyber-muted">Hints Consulted</span>
            <div className="text-3xl font-extrabold font-mono text-cyber-amber">
              {stats.totalHintsUsed}
            </div>
            <p className="text-[11px] text-cyber-muted pt-1">
              Progressive conceptual clues used
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-cyber-surface border border-cyber-border space-y-2">
            <span className="text-xs font-mono uppercase text-cyber-muted">Badges Unlocked</span>
            <div className="text-3xl font-extrabold font-mono text-purple-400">
              {stats.unlockedAchievementsCount}
            </div>
            <p className="text-[11px] text-cyber-muted pt-1">
              Out of {ACHIEVEMENTS.length} available achievements
            </p>
          </div>
        </div>

        {/* Missions Breakdown Table */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4 min-w-0">
          <h2 className="text-base font-bold text-cyber-text">Mission Completion Breakdown</h2>

          <div className="space-y-3 min-w-0">
            {["mission-01", "mission-02", "mission-03"].map((mId) => {
              const m = MISSIONS[mId];
              const isCompleted = completedMissions.includes(mId);
              const mAttempts = attempts[mId] || { successful: 0, failed: 0 };
              const hintsUsed = progressState.hintsRevealed?.[mId] || 0;

              return (
                <div
                  key={mId}
                  className="p-4 rounded-xl bg-cyber-surface border border-cyber-border flex items-center justify-between flex-wrap gap-4 min-w-0"
                >
                  <div className="space-y-1 min-w-0 max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyber-emerald bg-cyber-bg px-2 py-0.5 rounded border border-cyber-border shrink-0">
                        MISSION {m.number}
                      </span>
                      <span className="text-xs font-bold text-cyber-text truncate">{m.title}</span>
                    </div>
                    <p className="text-xs text-cyber-muted break-words">{m.subtitle}</p>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Scope: {m.scenarioHost}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 text-xs font-mono flex-wrap">
                    <div className="text-right">
                      <span className="text-[10px] text-cyber-muted block">Attempts</span>
                      <span className="text-cyber-text">
                        {mAttempts.successful} succ / {mAttempts.failed} err
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-cyber-muted block">Hints Used</span>
                      <span className="text-amber-400">{hintsUsed} / 4</span>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <span className="text-[10px] text-cyber-muted block">Status</span>
                      {isCompleted ? (
                        <span className="text-cyber-emerald font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Passed
                        </span>
                      ) : (
                        <span className="text-cyber-muted">Incomplete</span>
                      )}
                    </div>

                    <Link
                      href={`/missions/${mId}`}
                      className="px-3 py-1.5 rounded-lg bg-cyber-bg hover:bg-cyber-card border border-cyber-border text-xs text-cyber-text transition-colors flex items-center gap-1"
                    >
                      <span>{isCompleted ? "Review" : "Launch"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skills & Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
          {/* Skills Acquired */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-cyber-text">Verified Skills</h2>
            </div>

            <div className="space-y-2 min-w-0">
              {stats.skills.length > 0 ? (
                stats.skills.map((skill, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded-lg bg-cyber-surface border border-cyber-border flex items-center justify-between text-xs font-mono min-w-0"
                  >
                    <span className="text-cyber-text truncate mr-2">{skill}</span>
                    <span className="text-cyber-emerald flex items-center gap-1 font-semibold shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-cyber-muted">
                  Complete your first interactive mission checkpoint to verify skills here.
                </div>
              )}
            </div>
          </div>

          {/* Activity Audit Trail */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4 min-w-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-cyber-text">Activity Audit Log</h2>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto min-w-0">
              {progressState?.activityFeed?.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-cyber-surface border border-cyber-border flex items-center justify-between text-xs font-mono min-w-0"
                >
                  <div className="space-y-0.5 truncate pr-2 min-w-0">
                    <span className="text-cyber-text font-semibold block truncate">
                      {item.title}
                    </span>
                    {item.detail && (
                      <span className="text-[11px] text-cyber-muted truncate block">
                        {item.detail}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-cyber-muted/60 shrink-0">
                    {isMounted ? new Date(item.timestamp).toLocaleTimeString() : "--:--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
