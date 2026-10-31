"use client";

import React from "react";
import {
  Award,
  Terminal,
  Crosshair,
  Network,
  ShieldAlert,
  Zap,
  Clock,
  CheckCircle2,
  Lock,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { ACHIEVEMENTS, useUserProgress } from "@/lib/progress/progress-store";

export default function AchievementsPage() {
  const { progressState } = useUserProgress();

  const unlockedAchSet = new Set(progressState.unlockedAchievements || []);
  const unlockedCount = unlockedAchSet.size;

  const iconMap = {
    Terminal,
    Crosshair,
    Network,
    ShieldAlert,
    Zap,
    Clock,
    Award,
  };

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150 w-full min-w-0">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-purple-400 font-semibold">
              Milestone Recognition
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight break-words">
            Achievements & Badges
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed break-words">
            Earned for operational milestones, precise command syntax, autonomous problem-solving, and speed.
          </p>
        </div>

        {/* Counter Card */}
        <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border flex items-center justify-between flex-wrap sm:flex-nowrap gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold font-mono text-base shrink-0">
              {unlockedCount}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold text-cyber-text block truncate">
                {unlockedCount} of {ACHIEVEMENTS.length} Badges Unlocked
              </span>
              <span className="text-xs text-cyber-muted break-words">
                Achievements automatically unlock when you complete relevant lab conditions.
              </span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedAchSet.has(ach.id);
            const IconComp = iconMap[ach.icon] || Award;

            return (
              <div
                key={ach.id}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                  isUnlocked
                    ? "bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-950/20"
                    : "bg-cyber-card border-cyber-border opacity-70"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          : "bg-cyber-surface text-cyber-muted/40 border border-cyber-border"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        isUnlocked
                          ? "bg-purple-500/20 text-purple-200 border border-purple-500/30 font-semibold"
                          : "bg-cyber-surface text-cyber-muted/50 border border-cyber-border"
                      }`}
                    >
                      {isUnlocked ? "UNLOCKED" : "LOCKED"}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-cyber-text">{ach.title}</h3>
                    <p className="text-xs text-cyber-muted mt-1 leading-relaxed">
                      {ach.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-cyber-border/40 text-[11px] font-mono">
                  {isUnlocked ? (
                    <span className="text-purple-300 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed & Awarded
                    </span>
                  ) : (
                    <span className="text-cyber-muted/50 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      Locked Milestone
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
