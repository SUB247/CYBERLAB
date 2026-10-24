"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Terminal,
  BookOpen,
  HelpCircle,
  Code2,
  CheckCircle2,
  Award,
} from "lucide-react";
import MissionBriefing from "./MissionBriefing";
import HintPanel from "./HintPanel";
import CommandExplanation from "./CommandExplanation";
import Checkpoint from "./Checkpoint";
import SimulatedTerminal from "../terminal/SimulatedTerminal";
import { MISSIONS } from "@/lib/lessons/lesson-data";

export default function LessonViewer({
  missionId,
  progressState,
  onRecordCommandAttempt,
  onRecordHintReveal,
  onCompleteCheckpoint,
  onSelectMission,
}) {
  const [activeTab, setActiveTab] = useState("briefing"); // "briefing" | "breakdown" | "checkpoint"
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [lastCommandResult, setLastCommandResult] = useState(null);

  const mission = MISSIONS[missionId];
  if (!mission) {
    return (
      <div className="p-8 text-center text-cyber-muted space-y-2">
        <p className="text-base font-semibold text-cyber-text">Mission not found</p>
        <p className="text-xs">The requested lesson does not exist.</p>
      </div>
    );
  }

  const isCommandPassed = Boolean(lastCommandResult?.isMissionSuccess);
  const isCheckpointPassed = Boolean(progressState?.checkpointsPassed?.[missionId]);
  const revealedHintsCount = progressState?.hintsRevealed?.[missionId] || 0;
  const failedAttemptsCount = progressState?.attempts?.[missionId]?.failed || 0;

  // Handle command execution from the terminal
  const handleCommandExecuted = (result, rawCommand) => {
    onRecordCommandAttempt(missionId, result.isMissionSuccess, rawCommand);

    if (result.isMissionSuccess) {
      setLastCommandResult(result);
      // Auto-switch to breakdown tab to show command anatomy!
      setActiveTab("breakdown");
    }
  };

  const handleResetExercise = () => {
    setLastCommandResult(null);
  };

  const handleNextMission = () => {
    if (missionId === "mission-01") {
      onSelectMission("mission-02");
    } else if (missionId === "mission-02") {
      onSelectMission("mission-03");
    } else {
      // Go to dashboard
      onSelectMission(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Workspace Sub-header */}
      <div className="h-12 border-b border-cyber-border px-4 flex items-center justify-between bg-cyber-card/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-cyber-text flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
            {mission.title}
          </span>
          {isCheckpointPassed && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-emerald/15 text-cyber-emerald border border-cyber-emerald/30 font-mono font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        {/* Tab Controls for Lesson Content */}
        <div className="flex items-center gap-1 bg-cyber-surface p-1 rounded-lg border border-cyber-border text-xs">
          <button
            onClick={() => setActiveTab("briefing")}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "briefing"
                ? "bg-cyber-card text-cyber-emerald font-semibold shadow-sm"
                : "text-cyber-muted hover:text-cyber-text"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mission Brief</span>
          </button>

          <button
            onClick={() => setActiveTab("breakdown")}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "breakdown"
                ? "bg-cyber-card text-cyber-emerald font-semibold shadow-sm"
                : "text-cyber-muted hover:text-cyber-text"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Command Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab("checkpoint")}
            className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === "checkpoint"
                ? "bg-cyber-card text-cyber-emerald font-semibold shadow-sm"
                : "text-cyber-muted hover:text-cyber-text"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Checkpoint</span>
            {isCheckpointPassed && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
            )}
          </button>
        </div>
      </div>

      {/* Main Two-Column Workspace Layout */}
      <div className="flex-1 p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
        {/* Left Column: Lesson Instructions, Hints, Checkpoints */}
        <div className="lg:col-span-6 space-y-6">
          {activeTab === "briefing" && (
            <div className="space-y-6">
              <MissionBriefing mission={mission} />
              <HintPanel
                hints={mission.hints}
                revealedCount={revealedHintsCount}
                onRevealNextHint={(lvl) => onRecordHintReveal(missionId, lvl)}
                failedAttempts={failedAttemptsCount}
                missionTitle={mission.title}
              />
            </div>
          )}

          {activeTab === "breakdown" && (
            <div className="space-y-6">
              {lastCommandResult?.commandBreakdown ? (
                <CommandExplanation
                  breakdown={lastCommandResult.commandBreakdown}
                  executedCommand={lastCommandResult.executedCommand}
                />
              ) : (
                <div className="p-6 rounded-xl bg-cyber-card border border-cyber-border text-center space-y-3">
                  <Code2 className="w-8 h-8 text-cyber-muted mx-auto opacity-40" />
                  <p className="text-sm font-semibold text-cyber-text">
                    No Command Executed Yet
                  </p>
                  <p className="text-xs text-cyber-muted max-w-sm mx-auto leading-relaxed">
                    Run the target scan <code className="text-cyber-emerald font-mono bg-cyber-surface px-1.5 py-0.5 rounded">{mission.challenge.requiredCommand}</code> in the terminal to inspect the detailed breakdown of each token.
                  </p>
                </div>
              )}

              {/* Seamless Checkpoint prompt below breakdown */}
              <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-cyber-text">Ready to test your knowledge?</h4>
                  <p className="text-[11px] text-cyber-muted mt-0.5">
                    Proceed to the mission checkpoint to complete the module.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("checkpoint")}
                  className="px-3 py-1.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black font-semibold text-xs transition-colors flex items-center gap-1"
                >
                  <span>Go to Checkpoint</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === "checkpoint" && (
            <Checkpoint
              missionId={missionId}
              checkpoint={mission.checkpoint}
              isCommandPassed={isCommandPassed}
              isCheckpointPassed={isCheckpointPassed}
              onPassCheckpoint={onCompleteCheckpoint}
              onNextMission={handleNextMission}
            />
          )}
        </div>

        {/* Right Column: Simulated Terminal & Live Feedback */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <SimulatedTerminal
            missionId={missionId}
            mode="mission"
            onCommandExecuted={handleCommandExecuted}
            onResetExercise={handleResetExercise}
            isMaximized={isTerminalMaximized}
            setIsMaximized={setIsTerminalMaximized}
          />
        </div>
      </div>
    </div>
  );
}
