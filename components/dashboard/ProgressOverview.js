"use client";

import React from "react";
import {
  CheckCircle2,
  Terminal,
  Lightbulb,
  Award,
  Zap,
  Clock,
  Target,
  Cpu,
} from "lucide-react";
import ProgressBar from "../shared/ProgressBar";

export default function ProgressOverview({ stats, progressState }) {
  const cards = [
    {
      label: "Course Mastery",
      value: `${stats.percentage}%`,
      sub: `${stats.completedCount} of ${stats.totalMissions} Missions`,
      icon: Target,
      color: "emerald",
    },
    {
      label: "Commands Executed",
      value: progressState?.commandsRun || 0,
      sub: `${stats.totalAttempts} Evaluated Attempts`,
      icon: Terminal,
      color: "cyan",
    },
    {
      label: "Hints Revealed",
      value: stats.totalHintsUsed,
      sub: "Progressive Clues",
      icon: Lightbulb,
      color: "amber",
    },
    {
      label: "Achievements Unlocked",
      value: stats.unlockedAchievementsCount,
      sub: "Milestone Badges",
      icon: Award,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-cyber-card border border-cyber-border hover:border-cyber-borderSubtle transition-all space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyber-muted font-medium">{item.label}</span>
              <div className="p-1.5 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-emerald">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-cyber-text tracking-tight">
                {item.value}
              </div>
              <div className="text-[11px] text-cyber-muted mt-0.5">{item.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
