"use client";

import React, { useState } from "react";
import {
  Shield,
  LayoutDashboard,
  Terminal,
  BookOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Lock,
  CheckCircle2,
  Circle,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  Layers,
  HelpCircle,
  Cpu,
} from "lucide-react";
import { LEARNING_PATHS } from "@/lib/lessons/lesson-data";

export default function AppSidebar({
  currentView,
  setCurrentView,
  currentMissionId,
  setCurrentMissionId,
  progressState,
  onOpenResetDialog,
  onOpenGlossary,
  onOpenHelp,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const [expandedSections, setExpandedSections] = useState({
    foundations: false,
    "nmap-foundations": true,
    "coming-later": false,
  });

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const completedSet = new Set(progressState?.completedMissions || []);
  const checkpointsSet = new Set(
    Object.keys(progressState?.checkpointsPassed || {}).filter(
      (k) => progressState.checkpointsPassed[k]
    )
  );

  const handleSelectMission = (missionId) => {
    setCurrentMissionId(missionId);
    setCurrentView("mission");
    setMobileOpen(false);
  };

  const handleSelectNav = (viewName) => {
    setCurrentView(viewName);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-cyber-surface border-r border-cyber-border flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header & Brand */}
        <div className="h-14 border-b border-cyber-border flex items-center justify-between px-3.5 bg-cyber-card/30">
          <div
            onClick={() => handleSelectNav("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald group-hover:border-cyber-emerald transition-colors shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wider text-cyber-text group-hover:text-white transition-colors">
                    CYBER<span className="text-cyber-emerald">LAB</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyber-border text-cyber-muted font-mono">
                    MVP
                  </span>
                </div>
                <p className="text-[10px] text-cyber-muted -mt-0.5">Interactive Security</p>
              </div>
            )}
          </div>

          {/* Collapse/Expand Toggle on Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1 text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-md transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-cyber-muted hover:text-cyber-text rounded-md"
            aria-label="Close mobile sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Core */}
        <div className="p-2 border-b border-cyber-border space-y-1">
          <button
            onClick={() => handleSelectNav("dashboard")}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === "dashboard"
                ? "bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 font-semibold"
                : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-card"
            }`}
            title="Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Dashboard</span>}
          </button>

          <button
            onClick={() => handleSelectNav("practice")}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentView === "practice"
                ? "bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 font-semibold"
                : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-card"
            }`}
            title="Practice Lab"
          >
            <Terminal className="w-4 h-4 shrink-0" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>Practice Lab</span>
                <span className="text-[10px] text-cyber-emerald font-mono bg-cyber-emerald/10 px-1 rounded">
                  Sandbox
                </span>
              </div>
            )}
          </button>

          <button
            onClick={onOpenGlossary}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
            title="Glossary"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Glossary</span>}
          </button>
        </div>

        {/* Learning Paths & Mission Tree */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {!isCollapsed && (
            <div className="px-2 text-[10px] font-semibold text-cyber-muted uppercase tracking-wider flex items-center justify-between">
              <span>Curriculum Tree</span>
              <Layers className="w-3 h-3 opacity-60" />
            </div>
          )}

          {LEARNING_PATHS.map((path) => {
            const isSectionOpen = expandedSections[path.id];
            const isActivePath = path.id === "nmap-foundations";

            return (
              <div key={path.id} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(path.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                    isActivePath
                      ? "text-cyber-emerald font-semibold"
                      : "text-cyber-muted hover:text-cyber-text"
                  }`}
                  title={path.title}
                >
                  <div className="flex items-center gap-2 truncate">
                    {path.id === "nmap-foundations" ? (
                      <Cpu className="w-3.5 h-3.5 text-cyber-emerald shrink-0" />
                    ) : (
                      <Layers className="w-3.5 h-3.5 shrink-0 opacity-60" />
                    )}
                    {!isCollapsed && <span className="truncate">{path.title}</span>}
                  </div>
                  {!isCollapsed && (
                    <div className="flex items-center gap-1 shrink-0">
                      {path.status === "coming_soon" && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-cyber-card border border-cyber-border text-cyber-muted">
                          Soon
                        </span>
                      )}
                      {isSectionOpen ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-modules list */}
                {(!isCollapsed && isSectionOpen) && (
                  <div className="pl-3 pr-1 space-y-0.5 border-l border-cyber-border/70 ml-3 mt-1">
                    {path.modules.map((mod) => {
                      const isPlayable = mod.status === "available";
                      const isSelected =
                        currentView === "mission" && currentMissionId === mod.id;
                      const isCompleted = completedSet.has(mod.id);

                      if (isPlayable) {
                        return (
                          <button
                            key={mod.id}
                            onClick={() => handleSelectMission(mod.id)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-all text-left ${
                              isSelected
                                ? "bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 font-medium"
                                : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-card/60"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {isCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0" />
                              ) : (
                                <Circle className="w-3 h-3 text-cyber-muted shrink-0" />
                              )}
                              <span className="truncate">{mod.title}</span>
                            </div>
                            <span className="text-[10px] text-cyber-muted shrink-0 ml-1">
                              {mod.duration}
                            </span>
                          </button>
                        );
                      }

                      // Locked / Coming Soon Item
                      return (
                        <div
                          key={mod.id}
                          className="flex items-center justify-between px-2 py-1.5 rounded-md text-xs text-cyber-muted/50 cursor-not-allowed select-none"
                          title="This lesson is planned for a future milestone."
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Lock className="w-3 h-3 text-cyber-muted/40 shrink-0" />
                            <span className="truncate">{mod.title}</span>
                          </div>
                          <span className="text-[9px] px-1 py-0.2 rounded bg-cyber-card/40 border border-cyber-border/40 text-cyber-muted/40 shrink-0">
                            Locked
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-2 border-t border-cyber-border bg-cyber-card/40 space-y-1">
          <button
            onClick={onOpenHelp}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
            title="Help & Field Guide"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-cyber-emerald" />
            {!isCollapsed && <span>Field Guide & Help</span>}
          </button>

          <button
            onClick={onOpenResetDialog}
            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyber-muted hover:text-cyber-red hover:bg-red-500/10 transition-colors"
            title="Reset Progress"
          >
            <RotateCcw className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Reset Progress</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
