"use client";

import React from "react";
import { X, HelpCircle, Terminal, Lightbulb, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-cyber-surface border border-cyber-border rounded-xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-cyber-border flex items-center justify-between bg-cyber-card/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-cyber-text">CYBERLAB Student Field Guide</h2>
              <p className="text-xs text-cyber-muted">How to navigate, practice, and learn safely</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cyber-muted hover:text-cyber-text p-1.5 rounded-lg hover:bg-cyber-border transition-colors"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-cyber-muted leading-relaxed">
          {/* Loop section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-cyber-text flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyber-emerald" />
              The CYBERLAB Core Learning Loop
            </h3>
            <p>
              CYBERLAB is built to develop genuine intuition rather than rote copying. Every mission follows a 7-step progression:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-cyber-card border border-cyber-border text-cyber-text flex items-center gap-2">
                <span className="text-cyber-emerald font-bold">1</span> Understand Objective
              </div>
              <div className="p-2 rounded bg-cyber-card border border-cyber-border text-cyber-text flex items-center gap-2">
                <span className="text-cyber-emerald font-bold">2</span> Attempt in Terminal
              </div>
              <div className="p-2 rounded bg-cyber-card border border-cyber-border text-cyber-text flex items-center gap-2">
                <span className="text-cyber-emerald font-bold">3</span> Educational Errors
              </div>
              <div className="p-2 rounded bg-cyber-card border border-cyber-border text-cyber-text flex items-center gap-2">
                <span className="text-cyber-emerald font-bold">4</span> Progressive Hints
              </div>
              <div className="p-2 rounded bg-cyber-card border border-cyber-border text-cyber-text flex items-center gap-2">
                <span className="text-cyber-emerald font-bold">5</span> Command Breakdown
              </div>
              <div className="p-2 rounded bg-cyber-card border border-cyber-border text-cyber-text flex items-center gap-2">
                <span className="text-cyber-emerald font-bold">6</span> Interpret Output
              </div>
            </div>
            <div className="p-2 rounded bg-cyber-emerald/10 border border-cyber-emerald/20 text-cyber-text font-mono text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0" />
              <span><strong className="text-cyber-emerald">Step 7:</strong> Pass the Knowledge Checkpoint to complete the mission!</span>
            </div>
          </div>

          {/* Terminal Shortcuts */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-cyber-text flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-cyber-amber" />
              Keyboard Shortcuts & Controls
            </h3>
            <ul className="space-y-1.5 list-disc pl-4">
              <li><strong className="text-cyber-text font-mono">Enter</strong>: Submit the command in the active terminal input.</li>
              <li><strong className="text-cyber-text font-mono">Arrow Up / Down</strong>: Cycle through command history.</li>
              <li><strong className="text-cyber-text font-mono">clear</strong> or <strong className="text-cyber-text font-mono">cls</strong>: Clears terminal screen output.</li>
              <li><strong className="text-cyber-text font-mono">help</strong>: Prints available simulated lab commands.</li>
            </ul>
          </div>

          {/* Safety Notice */}
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200/90 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-red-300">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Simulated Safety Boundary
            </div>
            <p className="text-[11px] leading-relaxed">
              CYBERLAB executes inside a secure, deterministic in-browser sandbox. It never touches real external networks or public IPs. Only RFC 5737 documentation addresses (192.0.2.x, 198.51.100.x) are simulated.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyber-border bg-cyber-card/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black transition-colors"
          >
            Got it, return to lab
          </button>
        </div>
      </div>
    </div>
  );
}
