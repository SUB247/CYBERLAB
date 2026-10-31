"use client";

import React from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  BookOpen,
  Clock,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Layers,
  ChevronLeft,
  Play,
  Info,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { COURSES } from "@/lib/lessons/courses-data";
import { useUserProgress } from "@/lib/progress/progress-store";
import ProgressBar from "@/components/shared/ProgressBar";

export default function CourseDetailPage() {
  const params = useParams();
  const courseSlug = params?.id;
  const course = COURSES.find((c) => c.slug === courseSlug || c.id === courseSlug);

  const { progressState } = useUserProgress();
  const completedMissions = progressState.completedMissions || [];

  if (!course) {
    return (
      <AppShell>
        <div className="p-8 text-center text-cyber-muted space-y-3">
          <p className="text-base font-semibold text-cyber-text">Course Not Found</p>
          <p className="text-xs">The requested course track does not exist in the curriculum.</p>
          <Link href="/courses" className="text-xs text-cyber-emerald hover:underline">
            Back to Course Library
          </Link>
        </div>
      </AppShell>
    );
  }

  const isNmap = course.id === "nmap-essentials";
  const completedCount = isNmap ? completedMissions.length : 0;
  const percentage = isNmap ? Math.round((completedCount / 3) * 100) : 0;

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Back Link */}
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs text-cyber-muted hover:text-cyber-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Course Catalog</span>
        </Link>

        {/* Hero Card */}
        <div className="p-6 lg:p-8 rounded-2xl bg-cyber-card border border-cyber-border space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald text-xs font-mono font-semibold uppercase">
                {course.category}
              </span>
              <span className="text-xs text-cyber-muted font-mono">{course.difficulty}</span>
              <span className="text-xs text-cyber-muted">•</span>
              <span className="text-xs text-cyber-muted font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration}
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-cyber-text tracking-tight">
              {course.title}
            </h1>
            <p className="text-sm text-cyber-muted leading-relaxed max-w-3xl">
              {course.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-cyber-border/60 flex-wrap gap-4">
            <div className="space-y-1">
              <span className="text-xs text-cyber-muted font-mono block">Course Completion</span>
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <ProgressBar value={percentage} size="sm" />
                </div>
                <span className="text-xs font-semibold text-cyber-emerald font-mono">
                  {percentage}%
                </span>
              </div>
            </div>

            {course.isPlayable ? (
              <Link
                href="/missions/mission-01"
                className="px-5 py-2.5 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{percentage > 0 ? "Continue Missions" : "Start Course"}</span>
              </Link>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-cyber-surface border border-cyber-border text-xs text-cyber-muted/70 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Planned for Future Milestone</span>
              </span>
            )}
          </div>
        </div>

        {/* Objectives & Prerequisites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objectives */}
          <div className="p-6 rounded-2xl bg-cyber-surface border border-cyber-border space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
                <Target className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-cyber-text">What You Will Learn</h2>
            </div>
            <ul className="space-y-2.5 pt-1">
              {course.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-cyber-muted">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div className="p-6 rounded-2xl bg-cyber-surface border border-cyber-border space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyber-cyan border border-cyan-500/20">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-cyber-text">Prerequisites & Scope</h2>
            </div>
            <ul className="space-y-2.5 pt-1">
              {course.prerequisites.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-cyber-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 rounded-lg bg-cyber-card border border-cyber-border text-[11px] text-cyber-muted font-mono leading-relaxed">
              Target Scope: RFC 5737 Documentation Network (100% simulated in browser).
            </div>
          </div>
        </div>

        {/* Lessons Syllabus */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-cyber-text">Course Modules & Lessons</h2>
              <p className="text-xs text-cyber-muted">
                Step-by-step syllabus with hands-on simulated exercises
              </p>
            </div>
            <span className="text-xs font-mono text-cyber-muted">
              {course.lessons.length} Total Lessons
            </span>
          </div>

          <div className="space-y-3">
            {course.lessons.map((lesson) => {
              const isPlayable = lesson.status === "available" && lesson.missionRef;
              const isCompleted = completedMissions.includes(lesson.missionRef);

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    isCompleted
                      ? "bg-cyber-surface border-cyber-emerald/40"
                      : isPlayable
                      ? "bg-cyber-card border-cyber-border hover:border-cyber-borderSubtle"
                      : "bg-cyber-surface/60 border-cyber-border/60 text-cyber-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0 pr-4">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                        isCompleted
                          ? "bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40"
                          : isPlayable
                          ? "bg-cyber-surface text-cyber-text border border-cyber-border"
                          : "bg-cyber-card text-cyber-muted/40 border border-cyber-border/40"
                      }`}
                    >
                      {lesson.number}
                    </div>

                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-xs text-cyber-text truncate">
                          {lesson.title}
                        </span>
                        {lesson.isInteractiveLab && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
                            Interactive Lab
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-cyber-muted truncate">{lesson.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-cyber-muted hidden sm:inline">
                      {lesson.duration}
                    </span>

                    {isPlayable ? (
                      <Link
                        href={`/missions/${lesson.missionRef}`}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isCompleted
                            ? "bg-cyber-surface hover:bg-cyber-card text-cyber-emerald border border-cyber-emerald/30"
                            : "bg-cyber-emerald hover:bg-cyber-emeraldHover text-black"
                        }`}
                      >
                        <span>{isCompleted ? "Review Lab" : "Launch Lab"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-cyber-card border border-cyber-border text-[10px] text-cyber-muted/60 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
