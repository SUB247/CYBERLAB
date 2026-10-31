"use client";

import React from "react";
import Link from "next/link";
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
  BookOpen,
  Route,
  Flame,
  ChevronRight,
  TrendingUp,
  Target,
} from "lucide-react";
import { COURSES } from "@/lib/lessons/courses-data";
import { MISSIONS } from "@/lib/lessons/lesson-data";
import {
  useUserProgress,
  computeProgressStats,
  ACHIEVEMENTS,
} from "@/lib/progress/progress-store";
import { useAuth } from "@/lib/auth/auth-context";
import ProgressBar from "../shared/ProgressBar";

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { progressState } = useUserProgress();

  const stats = computeProgressStats(progressState);
  const completedMissions = progressState.completedMissions || [];

  // Determine current active mission to continue
  const missionOrder = ["mission-01", "mission-02", "mission-03"];
  const nextMissionId = missionOrder.find((id) => !completedMissions.includes(id)) || "mission-01";
  const nextMission = MISSIONS[nextMissionId];
  const allMissionsComplete = completedMissions.length === missionOrder.length;

  const unlockedAchSet = new Set(progressState.unlockedAchievements || []);
  const isNewUser = completedMissions.length === 0 && (progressState.commandsRun || 0) === 0;

  // Selected paths for dashboard cards
  const featuredCourses = COURSES.slice(0, 4);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200 w-full min-w-0">
      {/* A. Welcome Section & Hero Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-w-0">
        {/* Welcome Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-gradient-to-br from-cyber-card via-cyber-surface to-cyber-bg border border-cyber-border flex flex-col justify-between space-y-4 min-w-0">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs font-mono font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Simulated Cybersecurity Training</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-cyber-text tracking-tight break-words">
              Welcome back,{" "}
              <span className="text-cyber-emerald">
                {profile?.display_name || "Learner"}
              </span>
            </h1>
            <p className="text-xs lg:text-sm text-cyber-muted leading-relaxed max-w-xl break-words">
              {isNewUser
                ? "Your isolated training workstation is online. Start with Nmap Essentials Mission 01 to master target specification and RFC 5737 scopes."
                : `You are making steady progress in Nmap Essentials. You have completed ${completedMissions.length} of 3 interactive missions.`}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href={`/missions/${nextMissionId}`}
              className="px-5 py-2.5 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {allMissionsComplete ? "Review Mission 01" : `Continue: ${nextMission.title}`}
              </span>
            </Link>

            <Link
              href="/practice"
              className="px-4 py-2.5 rounded-xl bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border text-cyber-text text-xs font-medium flex items-center gap-2 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
              <span>Open Practice Sandbox</span>
            </Link>
          </div>
        </div>

        {/* B. Continue Learning Status Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-cyber-card border border-cyber-border flex flex-col justify-between space-y-4 min-w-0">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-cyber-muted tracking-wider">
                Current Learning Track
              </span>
              <span className="text-xs font-mono font-semibold text-cyber-emerald">
                {stats.percentage}% Mastered
              </span>
            </div>
            <h3 className="text-base font-bold text-cyber-text">Nmap Essentials</h3>
            <p className="text-xs text-cyber-muted leading-relaxed">
              Target representation, host discovery ping scans (-sn), and port state taxonomy.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <ProgressBar value={stats.percentage} size="md" showLabel label="Track Progress" />
            <div className="text-[11px] text-cyber-muted flex items-center justify-between font-mono">
              <span>Next Mission:</span>
              <span className="text-cyber-text font-semibold">{nextMission.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* E. Metrics Overview Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-muted font-medium">Missions Completed</span>
            <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-text">
            {stats.completedCount} / {stats.totalMissions}
          </div>
          <p className="text-[11px] text-cyber-muted">Interactive Labs Passed</p>
        </div>

        <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-muted font-medium">Terminal Commands</span>
            <Terminal className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-text">
            {progressState.commandsRun || 0}
          </div>
          <p className="text-[11px] text-cyber-muted">{stats.totalAttempts} Evaluated Runs</p>
        </div>

        <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-muted font-medium">Skills Verified</span>
            <Zap className="w-4 h-4 text-cyber-amber" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-text">
            {stats.skills.length}
          </div>
          <p className="text-[11px] text-cyber-muted">Competencies Mastered</p>
        </div>

        <div className="p-4 rounded-xl bg-cyber-card border border-cyber-border space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-cyber-muted font-medium">Achievements</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyber-text">
            {stats.unlockedAchievementsCount} / {ACHIEVEMENTS.length}
          </div>
          <p className="text-[11px] text-cyber-muted">Badges Earned</p>
        </div>
      </div>

      {/* C. Learning Paths Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-cyber-text">Learning Paths & Courses</h2>
            <p className="text-xs text-cyber-muted">
              Structured progressive modules designed for cybersecurity practitioners
            </p>
          </div>
          <Link
            href="/courses"
            className="text-xs text-cyber-emerald hover:underline flex items-center gap-1 font-medium"
          >
            <span>View All Courses</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCourses.map((c) => {
            const isNmap = c.id === "nmap-essentials";
            return (
              <div
                key={c.id}
                className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 transition-all ${
                  isNmap
                    ? "bg-cyber-surface border-cyber-emerald/40 hover:border-cyber-emerald shadow-sm"
                    : "bg-cyber-card border-cyber-border hover:border-cyber-borderSubtle opacity-90"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted uppercase">
                      {c.category}
                    </span>
                    <span className="text-[11px] text-cyber-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {c.duration}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-cyber-text leading-snug">{c.title}</h3>
                  <p className="text-xs text-cyber-muted leading-relaxed line-clamp-2">
                    {c.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-cyber-border/40 flex items-center justify-between">
                  <span className="text-xs font-mono text-cyber-muted">
                    {c.isPlayable ? (
                      <span className="text-cyber-emerald font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {stats.completedCount}/3 Lessons
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-cyber-muted/60">
                        <Lock className="w-3 h-3" />
                        Coming Soon
                      </span>
                    )}
                  </span>

                  <Link
                    href={`/courses/${c.slug}`}
                    className="px-3 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-xs font-medium text-cyber-text hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* D & G. Practice & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Practice & Recommended Missions */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyber-text">Recommended Next Mission</h3>
                <p className="text-xs text-cyber-muted">Curated for your current skill boundary</p>
              </div>
            </div>
            <Link href="/missions" className="text-xs text-cyber-emerald hover:underline">
              All Missions
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border/80 space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-[10px] font-mono font-bold text-cyber-emerald">
                MISSION {nextMission.number}
              </span>
              <span className="text-xs text-cyber-muted">{nextMission.estimatedMinutes} mins</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-cyber-text">{nextMission.title}</h4>
              <p className="text-xs text-cyber-muted mt-1 leading-relaxed">
                {nextMission.briefing.overview}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/20 border border-cyan-800/30 px-2 py-0.5 rounded">
                Target: {nextMission.scenarioHost}
              </span>
              <Link
                href={`/missions/${nextMissionId}`}
                className="px-4 py-2 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <span>Launch Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick link to practice sandbox */}
          <div className="p-3.5 rounded-xl bg-cyber-bg/80 border border-cyber-border flex items-center justify-between flex-wrap sm:flex-nowrap gap-3 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <Terminal className="w-4 h-4 text-cyber-cyan shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-cyber-text block truncate">
                  Free-Form Sandbox
                </span>
                <span className="text-[11px] text-cyber-muted truncate block">
                  Test custom flags and documentation targets without guided steps
                </span>
              </div>
            </div>
            <Link
              href="/practice"
              className="px-3 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-cardHover border border-cyber-border text-xs font-medium text-cyber-text transition-colors shrink-0"
            >
              Open Sandbox
            </Link>
          </div>
        </div>

        {/* F. Achievements Showcase */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-cyber-text">Milestones & Badges</h3>
                <p className="text-xs text-cyber-muted">Earned milestone achievements</p>
              </div>
            </div>
            <Link href="/achievements" className="text-xs text-cyber-emerald hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2 min-w-0">
            {ACHIEVEMENTS.slice(0, 4).map((ach) => {
              const isUnlocked = unlockedAchSet.has(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors min-w-0 ${
                    isUnlocked
                      ? "bg-purple-950/20 border-purple-500/30 text-purple-100"
                      : "bg-cyber-surface/60 border-cyber-border text-cyber-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isUnlocked
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-cyber-card text-cyber-muted/40 border border-cyber-border"
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="truncate min-w-0">
                      <span className="font-semibold text-xs block text-cyber-text truncate">
                        {ach.title}
                      </span>
                      <span className="text-[11px] text-cyber-muted truncate block">
                        {ach.description}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-card border border-cyber-border shrink-0 ml-2">
                    {isUnlocked ? "Earned" : "Locked"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
