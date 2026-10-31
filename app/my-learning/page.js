"use client";

import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Target,
  Terminal,
  BookOpen,
  Award,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { COURSES } from "@/lib/lessons/courses-data";
import { MISSIONS } from "@/lib/lessons/lesson-data";
import { useUserProgress } from "@/lib/progress/progress-store";
import ProgressBar from "@/components/shared/ProgressBar";

export default function MyLearningPage() {
  const { progressState } = useUserProgress();

  const completedMissions = progressState.completedMissions || [];
  const nmapCourse = COURSES.find((c) => c.id === "nmap-essentials");
  const completionPercentage = Math.round((completedMissions.length / 3) * 100);

  const missionList = ["mission-01", "mission-02", "mission-03"];
  const nextMissionId = missionList.find((id) => !completedMissions.includes(id)) || "mission-01";
  const nextMission = MISSIONS[nextMissionId];

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Enrolled Tracks
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight">My Learning</h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed">
            Manage your active courses, continue where you left off, and review completed lab missions.
          </p>
        </div>

        {/* Current In-Progress Course */}
        <div className="p-6 lg:p-8 rounded-2xl bg-cyber-surface border border-cyber-emerald/40 space-y-6 shadow-xl shadow-emerald-950/20">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-card border border-cyber-border text-cyber-emerald font-bold uppercase">
                Active Course
              </span>
              <h2 className="text-xl font-bold text-cyber-text">{nmapCourse.title}</h2>
              <p className="text-xs text-cyber-muted leading-relaxed">
                {nmapCourse.subtitle}
              </p>
            </div>

            <Link
              href={`/missions/${nextMissionId}`}
              className="px-5 py-2.5 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Continue: {nextMission.title}</span>
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-cyber-border/40">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyber-muted">Progress Status</span>
              <span className="text-cyber-emerald font-semibold">
                {completedMissions.length} of 3 Missions ({completionPercentage}%)
              </span>
            </div>
            <ProgressBar value={completionPercentage} size="md" />
          </div>

          {/* Syllabus Items */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-semibold text-cyber-text uppercase tracking-wider block font-mono">
              Missions in this Track:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {missionList.map((mId) => {
                const m = MISSIONS[mId];
                const isCompleted = completedMissions.includes(mId);

                return (
                  <div
                    key={mId}
                    className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                      isCompleted
                        ? "bg-cyber-bg border-cyber-emerald/40"
                        : "bg-cyber-bg/70 border-cyber-border"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-cyber-muted">MISSION {m.number}</span>
                        {isCompleted && (
                          <span className="text-cyber-emerald flex items-center gap-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Passed
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-cyber-text leading-snug">{m.title}</h4>
                      <p className="text-[11px] text-cyber-muted line-clamp-2">{m.subtitle}</p>
                    </div>

                    <Link
                      href={`/missions/${mId}`}
                      className="text-xs text-cyber-emerald hover:underline flex items-center gap-1 pt-2 font-medium"
                    >
                      <span>{isCompleted ? "Review Mission" : "Launch Mission"}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Explore More Card */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-cyber-text">Want to learn more concepts?</h3>
            <p className="text-xs text-cyber-muted">
              Browse the Course Library to inspect upcoming tracks in Linux, Networking, and Exploitation.
            </p>
          </div>
          <Link
            href="/courses"
            className="px-4 py-2 rounded-xl bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-xs font-medium text-cyber-text hover:text-white transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyber-emerald" />
            <span>Browse Catalog</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
