"use client";

import React from "react";
import {
  Menu,
  Shield,
  HelpCircle,
  BookOpen,
  Terminal,
  Activity,
  Award,
  RotateCcw,
} from "lucide-react";
import ProgressBar from "../shared/ProgressBar";
import { MISSIONS } from "@/lib/lessons/lesson-data";

export default function Topbar({
  currentView,
  currentMissionId,
  progressStats,
  onOpenHelp,
  onOpenGlossary,
  onOpenResetDialog,
  setMobileOpen,
  isSidebarCollapsed,
}) {
  const currentMission = MISSIONS[currentMissionId];

  // Dynamic breadcrumb computation
  let breadcrumbTitle = "Dashboard Overview";
  if (currentView === "practice") {
    breadcrumbTitle = "Practice Lab / Free-Form Sandbox";
  } else if (currentView === "mission" && currentMission) {
    breadcrumbTitle = `Nmap Foundations / ${currentMission.title}`;
  }

  return (
    <header className="h-14 bg-cyber-surface/90 border-b border-cyber-border backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4">
      {/* Left: Mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline text-cyber-muted">Curriculum</span>
          <span className="hidden sm:inline text-cyber-border font-bold">/</span>
          <span className="font-medium text-cyber-text truncate max-w-[200px] sm:max-w-[320px] md:max-w-none">
            {breadcrumbTitle}
          </span>
        </div>
      </div>

      {/* Right Controls: Environment Badge, Progress Bar, Help, Glossary */}
      <div className="flex items-center gap-3">
        {/* Safe Lab Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyber-card border border-cyber-border text-[11px] font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
          </span>
          <span className="text-cyber-emerald font-semibold">SIMULATED LAB</span>
          <span className="text-cyber-muted text-[10px]">RFC 5737</span>
        </div>

        {/* Overall Progress Pill */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-lg bg-cyber-card border border-cyber-border">
          <div className="text-right">
            <div className="text-[10px] text-cyber-muted leading-tight">Mastery</div>
            <div className="text-xs font-semibold text-cyber-emerald font-mono leading-tight">
              {progressStats?.percentage || 0}%
            </div>
          </div>
          <div className="w-16">
            <ProgressBar value={progressStats?.percentage || 0} size="sm" />
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenGlossary}
            className="p-2 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
            title="Open Glossary"
            aria-label="Open Glossary"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg text-cyber-muted hover:text-cyber-emerald hover:bg-cyber-card transition-colors"
            title="Help and Field Guide"
            aria-label="Help and Field Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
