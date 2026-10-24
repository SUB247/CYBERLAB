"use client";

import React from "react";
import {
  Shield,
  Play,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Lock,
  Layers,
  Terminal,
  Activity,
  Award,
  Zap,
} from "lucide-react";
import ProgressOverview from "./ProgressOverview";
import ProgressBar from "../shared/ProgressBar";
import { MISSIONS } from "@/lib/lessons/lesson-data";
import { ACHIEVEMENTS } from "@/lib/progress/progress-store";

export default function Dashboard({
  progressState,
  stats,
  onSelectMission,
  onStartPractice,
}) {
  const completedMissions = progressState?.completedMissions || [];

  // Determine which mission to continue: first uncompleted mission, or mission-01
  const missionIds = ["mission-01", "mission-02", "mission-03"];
  const nextMissionId =
    missionIds.find((id) => !completedMissions.includes(id)) || "mission-01";
  const nextMission = MISSIONS[nextMissionId];

  const unlockedAchievementsSet = new Set(
    progressState?.unlockedAchievements || []
  );

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner & Hero Continue Learning Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Welcome Text */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 rounded-2xl bg-gradient-to-br from-cyber-card via-cyber-surface to-cyber-bg border border-cyber-border space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs font-mono font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Interactive Cybersecurity Lab • v0.1.0</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-cyber-text tracking-tight">
              Welcome to <span className="text-cyber-emerald">CYBERLAB</span>
            </h1>
            <p className="text-xs lg:text-sm text-cyber-muted leading-relaxed max-w-xl">
              An interactive cybersecurity workspace inspired by hands-on engineering labs.
              Learn network mapping, host discovery, and port state analysis through structured missions, simulated terminal execution, and progressive feedback.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => onSelectMission(nextMissionId)}
              className="px-5 py-2.5 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue: {nextMission.title}</span>
            </button>

            <button
              onClick={onStartPractice}
              className="px-4 py-2.5 rounded-xl bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border text-cyber-text text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Practice Sandbox</span>
            </button>
          </div>
        </div>

        {/* Current Path Quick Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyber-muted tracking-wider">
                Current Active Track
              </span>
              <span className="text-xs font-mono font-semibold text-cyber-emerald">
                {stats.completedCount} / 3 Complete
              </span>
            </div>
            <h3 className="text-base font-bold text-cyber-text">Nmap Network Scanning</h3>
            <p className="text-xs text-cyber-muted leading-relaxed">
              Foundational reconnaissance, host discovery ping sweeps, and port state taxonomy.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <ProgressBar value={stats.percentage} size="md" showLabel label="Overall Track Completion" />
            <div className="text-[11px] text-cyber-muted flex items-center justify-between font-mono">
              <span>Next Milestone:</span>
              <span className="text-cyber-text font-semibold">{nextMission.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <ProgressOverview stats={stats} progressState={progressState} />

      {/* Curriculum Missions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-cyber-text">Nmap Foundations Curriculum</h2>
            <p className="text-xs text-cyber-muted">Three fully playable beginner missions with terminal validation</p>
          </div>
          <span className="text-xs font-mono text-cyber-muted hidden sm:inline">
            Safe Environment: RFC 5737
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["mission-01", "mission-02", "mission-03"].map((mId) => {
            const m = MISSIONS[mId];
            const isCompleted = completedMissions.includes(mId);

            return (
              <div
                key={mId}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                  isCompleted
                    ? "bg-cyber-surface border-emerald-500/40 shadow-sm"
                    : "bg-cyber-card border-cyber-border hover:border-cyber-borderSubtle"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-[10px] font-mono font-bold text-cyber-emerald">
                      MISSION {m.number}
                    </span>
                    <span className="text-[11px] text-cyber-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {m.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-cyber-text">{m.title}</h3>
                  <p className="text-xs text-cyber-muted leading-relaxed line-clamp-2">
                    {m.subtitle}
                  </p>

                  <div className="text-[11px] font-mono text-cyan-400 bg-cyber-bg p-2 rounded border border-cyber-border">
                    <span className="text-cyber-muted">Scope: </span>
                    {m.scenarioHost}
                  </div>
                </div>

                <div className="pt-2 border-t border-cyber-border/40 flex items-center justify-between">
                  <span className="text-xs flex items-center gap-1.5 font-medium">
                    {isCompleted ? (
                      <span className="text-cyber-emerald flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-cyber-muted flex items-center gap-1">
                        <Circle className="w-3.5 h-3.5" />
                        Available
                      </span>
                    )}
                  </span>

                  <button
                    onClick={() => onSelectMission(mId)}
                    className="px-3 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-emerald hover:text-black border border-cyber-border text-cyber-text text-xs font-semibold transition-all flex items-center gap-1"
                  >
                    <span>{isCompleted ? "Review" : "Launch"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skills & Achievements Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skills Being Learned */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyber-text">Skills Acquired</h3>
              <p className="text-xs text-cyber-muted">Concepts mastered through verified checkpoints</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {stats.skills.length > 0 ? (
              stats.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 rounded-md bg-cyber-emerald/10 border border-cyber-emerald/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-cyber-emerald" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-cyber-muted py-3">
                Complete your first mission checkpoint to unlock cybersecurity skills here.
              </p>
            )}
          </div>
        </div>

        {/* Meaningful Achievements */}
        <div className="lg:col-span-6 p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-cyber-text">Achievements</h3>
              <p className="text-xs text-cyber-muted">Earned milestone badges</p>
            </div>
          </div>

          <div className="space-y-2">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = unlockedAchievementsSet.has(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                    isUnlocked
                      ? "bg-purple-950/20 border-purple-500/30 text-purple-100"
                      : "bg-cyber-surface/60 border-cyber-border text-cyber-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        isUnlocked
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-cyber-card text-cyber-muted/40"
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs block text-cyber-text">
                        {ach.title}
                      </span>
                      <span className="text-[11px] text-cyber-muted">{ach.description}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyber-card border border-cyber-border">
                    {isUnlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyber-text">Recent Lab Activity</h3>
            <p className="text-xs text-cyber-muted">Real-time log of command runs and mission progress</p>
          </div>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {progressState?.activityFeed?.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-lg bg-cyber-surface border border-cyber-border/80 flex items-center justify-between flex-wrap gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
                <span className="text-cyber-text font-medium">{act.title}</span>
                {act.detail && (
                  <span className="text-cyber-muted text-[11px] hidden sm:inline">
                    — {act.detail}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-cyber-muted/60">
                {new Date(act.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
