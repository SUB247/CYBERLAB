"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Award,
  AlertCircle,
} from "lucide-react";

export default function Checkpoint({
  missionId,
  checkpoint,
  isCommandPassed,
  isCheckpointPassed,
  onPassCheckpoint,
  onNextMission,
}) {
  const [selectedPrimary, setSelectedPrimary] = useState(null);
  const [selectedSecondary, setSelectedSecondary] = useState(null);
  const [submitted, setSubmitted] = useState(isCheckpointPassed);

  if (!checkpoint) return null;

  const handleSelectPrimary = (optId) => {
    if (submitted && isCheckpointPassed) return;
    setSelectedPrimary(optId);
  };

  const handleSelectSecondary = (optId) => {
    if (submitted && isCheckpointPassed) return;
    setSelectedSecondary(optId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPrimary) return;
    if (checkpoint.secondaryQuestion && !selectedSecondary) return;

    const primaryOpt = checkpoint.options.find((o) => o.id === selectedPrimary);
    const isPrimaryCorrect = primaryOpt?.isCorrect;

    let isSecondaryCorrect = true;
    if (checkpoint.secondaryQuestion) {
      const secOpt = checkpoint.secondaryOptions.find(
        (o) => o.id === selectedSecondary
      );
      isSecondaryCorrect = secOpt?.isCorrect;
    }

    setSubmitted(true);

    if (isPrimaryCorrect && isSecondaryCorrect) {
      onPassCheckpoint(missionId);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
  };

  const primaryChoice = checkpoint.options.find((o) => o.id === selectedPrimary);
  const secondaryChoice = checkpoint.secondaryOptions?.find(
    (o) => o.id === selectedSecondary
  );

  const isAllCorrect =
    primaryChoice?.isCorrect &&
    (!checkpoint.secondaryQuestion || secondaryChoice?.isCorrect);

  return (
    <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border space-y-5 min-w-0 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-cyber-text truncate">Knowledge Checkpoint</h3>
            <p className="text-[11px] text-cyber-muted truncate">Verify your conceptual understanding before completing</p>
          </div>
        </div>

        {isCheckpointPassed && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-cyber-emerald bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full font-mono shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Passed</span>
          </span>
        )}
      </div>

      {/* Lock warning if command not executed yet */}
      {!isCommandPassed && (
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-amber-200/90 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-300">Run Required Command First</span>
            <p className="text-[11px] text-amber-200/70 mt-0.5">
              Execute the simulated scan in the terminal on the right. Once the command completes, this checkpoint unlocks for evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Question 1 */}
      <div className="space-y-3 min-w-0">
        <p className="text-xs font-medium text-cyber-text leading-relaxed">
          <strong className="text-cyber-emerald font-mono mr-1">Q1:</strong>
          {checkpoint.question}
        </p>

        <div className="space-y-2">
          {checkpoint.options.map((opt) => {
            const isSelected = selectedPrimary === opt.id;
            let borderClass = "border-cyber-border";
            let bgClass = "bg-cyber-surface hover:bg-cyber-surface/80";

            if (submitted) {
              if (opt.isCorrect) {
                borderClass = "border-emerald-500/70";
                bgClass = "bg-emerald-950/30 text-emerald-100";
              } else if (isSelected && !opt.isCorrect) {
                borderClass = "border-red-500/70";
                bgClass = "bg-red-950/30 text-red-100";
              }
            } else if (isSelected) {
              borderClass = "border-cyber-emerald";
              bgClass = "bg-cyber-emerald/10 text-cyber-text";
            }

            return (
              <div
                key={opt.id}
                onClick={() => isCommandPassed && handleSelectPrimary(opt.id)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${borderClass} ${bgClass} ${
                  !isCommandPassed ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? "border-cyber-emerald bg-cyber-emerald text-black"
                        : "border-cyber-muted/50"
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="leading-relaxed break-words">{opt.text}</p>
                    {submitted && (isSelected || opt.isCorrect) && (
                      <p
                        className={`text-[11px] font-mono pt-1 break-words ${
                          opt.isCorrect ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {opt.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question 2 (if present) */}
      {checkpoint.secondaryQuestion && (
        <div className="space-y-3 pt-3 border-t border-cyber-border/40 min-w-0">
          <p className="text-xs font-medium text-cyber-text leading-relaxed">
            <strong className="text-cyber-emerald font-mono mr-1">Q2:</strong>
            {checkpoint.secondaryQuestion}
          </p>

          <div className="space-y-2">
            {checkpoint.secondaryOptions.map((opt) => {
              const isSelected = selectedSecondary === opt.id;
              let borderClass = "border-cyber-border";
              let bgClass = "bg-cyber-surface hover:bg-cyber-surface/80";

              if (submitted) {
                if (opt.isCorrect) {
                  borderClass = "border-emerald-500/70";
                  bgClass = "bg-emerald-950/30 text-emerald-100";
                } else if (isSelected && !opt.isCorrect) {
                  borderClass = "border-red-500/70";
                  bgClass = "bg-red-950/30 text-red-100";
                }
              } else if (isSelected) {
                borderClass = "border-cyber-emerald";
                bgClass = "bg-cyber-emerald/10 text-cyber-text";
              }

              return (
                <div
                  key={opt.id}
                  onClick={() => isCommandPassed && handleSelectSecondary(opt.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${borderClass} ${bgClass} ${
                    !isCommandPassed ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "border-cyber-emerald bg-cyber-emerald text-black"
                          : "border-cyber-muted/50"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="leading-relaxed break-words">{opt.text}</p>
                      {submitted && (isSelected || opt.isCorrect) && (
                        <p
                          className={`text-[11px] font-mono pt-1 break-words ${
                            opt.isCorrect ? "text-emerald-300" : "text-red-300"
                          }`}
                        >
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !isCommandPassed ||
              !selectedPrimary ||
              (checkpoint.secondaryQuestion && !selectedSecondary)
            }
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Submit Answers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : !isAllCorrect ? (
          <div className="flex items-center gap-3 w-full justify-between">
            <span className="text-xs text-red-300 font-medium">
              Some answers were incorrect. Review the explanations above.
            </span>
            <button
              type="button"
              onClick={handleRetry}
              className="px-4 py-1.5 rounded-lg bg-cyber-card border border-cyber-border text-cyber-text hover:text-white text-xs font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-sm font-bold text-cyber-emerald">
              <Award className="w-5 h-5" />
              <span>Checkpoint Cleared! Mission Complete.</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              You successfully executed the verified scan and demonstrated conceptual understanding. Your progress has been persisted to your local lab profile.
            </p>
            {onNextMission && (
              <button
                type="button"
                onClick={onNextMission}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
              >
                <span>Continue to Next Mission</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
