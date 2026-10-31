"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Target,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { MISSIONS } from "@/lib/lessons/lesson-data";
import { useUserProgress } from "@/lib/progress/progress-store";

export default function MissionsPage() {
  const { progressState } = useUserProgress();
  const completedMissions = progressState.completedMissions || [];
  const [filter, setFilter] = useState("all");

  const missionKeys = ["mission-01", "mission-02", "mission-03"];
  const filteredMissions = missionKeys.filter((mId) => {
    const isCompleted = completedMissions.includes(mId);
    if (filter === "completed") return isCompleted;
    if (filter === "available") return !isCompleted;
    return true;
  });

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Interactive Scenarios
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight">
            Nmap Beginner Missions
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed">
            Hands-on educational labs executed against isolated, deterministic targets in RFC 5737 documentation blocks. Test real commands with progressive hints and knowledge checkpoints.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2">
          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "All Missions (3)" },
              { id: "completed", label: `Completed (${completedMissions.length})` },
              { id: "available", label: `Incomplete (${3 - completedMissions.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f.id
                    ? "bg-cyber-emerald text-black font-semibold shadow-sm"
                    : "bg-cyber-card text-cyber-muted hover:text-cyber-text border border-cyber-border"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-cyber-muted">
            Environment: RFC 5737 Isolated Lab
          </span>
        </div>

        {/* Missions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredMissions.map((mId) => {
            const m = MISSIONS[mId];
            const isCompleted = completedMissions.includes(mId);

            return (
              <div
                key={mId}
                className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 transition-all ${
                  isCompleted
                    ? "bg-cyber-surface border-cyber-emerald/40 shadow-lg shadow-emerald-950/20"
                    : "bg-cyber-card border-cyber-border hover:border-cyber-borderSubtle"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-xs font-mono font-bold text-cyber-emerald">
                      MISSION {m.number}
                    </span>
                    <span className="text-xs text-cyber-muted flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {m.estimatedMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-cyber-text leading-snug">{m.title}</h3>
                  <p className="text-xs text-cyber-muted leading-relaxed line-clamp-2">
                    {m.subtitle}
                  </p>

                  <div className="p-2.5 rounded-lg bg-cyber-bg border border-cyber-border text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-cyber-muted">Assigned Target:</span>
                      <span className="text-cyan-400 font-bold">{m.scenarioHost}</span>
                    </div>
                    <div className="text-[10px] text-cyber-muted truncate">
                      {m.networkContext}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-cyber-border/40 flex items-center justify-between">
                  <span className="text-xs font-medium">
                    {isCompleted ? (
                      <span className="text-cyber-emerald flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-cyber-muted flex items-center gap-1 font-mono">
                        <Circle className="w-3.5 h-3.5" />
                        Available
                      </span>
                    )}
                  </span>

                  <Link
                    href={`/missions/${mId}`}
                    className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isCompleted
                        ? "bg-cyber-surface hover:bg-cyber-card text-cyber-text border border-cyber-border"
                        : "bg-cyber-emerald hover:bg-cyber-emeraldHover text-black shadow-md shadow-emerald-950/30"
                    }`}
                  >
                    <span>{isCompleted ? "Review Lab" : "Launch Lab"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
