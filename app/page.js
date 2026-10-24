"use client";

import React, { useState, useEffect } from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import Topbar from "@/components/layout/Topbar";
import Dashboard from "@/components/dashboard/Dashboard";
import LessonViewer from "@/components/lessons/LessonViewer";
import PracticeLab from "@/components/practice/PracticeLab";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import GlossaryModal from "@/components/shared/GlossaryModal";
import HelpModal from "@/components/shared/HelpModal";
import {
  getSavedProgress,
  recordCommandAttempt,
  recordHintReveal,
  completeCheckpoint,
  resetAllProgress,
  computeProgressStats,
  subscribeToProgress,
  INITIAL_STATE,
} from "@/lib/progress/progress-store";

export default function CyberLabApp() {
  const [mounted, setMounted] = useState(false);
  const [progressState, setProgressState] = useState(INITIAL_STATE);
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" | "mission" | "practice"
  const [currentMissionId, setCurrentMissionId] = useState("mission-01");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals state
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Safe client hydration & progress subscriber
  useEffect(() => {
    setMounted(true);
    const saved = getSavedProgress();
    setProgressState(saved);
    if (saved.activeMissionId) {
      setCurrentMissionId(saved.activeMissionId);
    }

    const unsubscribe = subscribeToProgress((updated) => {
      setProgressState(updated);
    });

    return () => unsubscribe();
  }, []);

  const stats = computeProgressStats(progressState);

  // Progress Handlers
  const handleRecordCommandAttempt = (missionId, isSuccess, rawCommand) => {
    recordCommandAttempt(missionId, isSuccess, rawCommand);
  };

  const handleRecordHintReveal = (missionId, level) => {
    recordHintReveal(missionId, level);
  };

  const handleCompleteCheckpoint = (missionId) => {
    completeCheckpoint(missionId);
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setIsResetDialogOpen(false);
    setCurrentView("dashboard");
    setCurrentMissionId("mission-01");
  };

  const handleSelectMission = (missionId) => {
    if (!missionId) {
      setCurrentView("dashboard");
      return;
    }
    setCurrentMissionId(missionId);
    setCurrentView("mission");
  };

  if (!mounted) {
    // Elegant loading screen during hydration to avoid layout shifts
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald animate-pulse">
            <span className="font-bold text-sm">CL</span>
          </div>
          <p className="text-xs font-mono text-cyber-muted">Initializing CYBERLAB Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <AppSidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentMissionId={currentMissionId}
        setCurrentMissionId={setCurrentMissionId}
        progressState={progressState}
        onOpenResetDialog={() => setIsResetDialogOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Top Bar */}
        <Topbar
          currentView={currentView}
          currentMissionId={currentMissionId}
          progressStats={stats}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenGlossary={() => setIsGlossaryOpen(true)}
          onOpenResetDialog={() => setIsResetDialogOpen(true)}
          setMobileOpen={setMobileOpen}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* View Router */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          {currentView === "dashboard" && (
            <Dashboard
              progressState={progressState}
              stats={stats}
              onSelectMission={handleSelectMission}
              onStartPractice={() => setCurrentView("practice")}
            />
          )}

          {currentView === "mission" && (
            <LessonViewer
              missionId={currentMissionId}
              progressState={progressState}
              onRecordCommandAttempt={handleRecordCommandAttempt}
              onRecordHintReveal={handleRecordHintReveal}
              onCompleteCheckpoint={handleCompleteCheckpoint}
              onSelectMission={handleSelectMission}
            />
          )}

          {currentView === "practice" && (
            <PracticeLab
              onRecordCommandAttempt={handleRecordCommandAttempt}
              onOpenGlossary={() => setIsGlossaryOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Dialogs & Modals */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Reset All Lab Progress"
        message="Are you sure you want to reset all mission completions, test attempts, hint records, and unlocked achievements? This will reset your local profile."
        confirmText="Yes, Reset Progress"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetDialogOpen(false)}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
