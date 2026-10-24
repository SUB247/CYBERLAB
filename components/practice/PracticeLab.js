"use client";

import React, { useState } from "react";
import {
  Terminal,
  Shield,
  BookOpen,
  Info,
  Copy,
  Check,
  Play,
  RotateCcw,
} from "lucide-react";
import SimulatedTerminal from "../terminal/SimulatedTerminal";

export default function PracticeLab({
  onRecordCommandAttempt,
  onOpenGlossary,
}) {
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);

  const practiceScenarios = [
    {
      title: "Local Lab Interface",
      command: "ip addr",
      description: "Inspect your simulated workstation's network interface and subnet address.",
    },
    {
      title: "ICMP Probe",
      command: "ping -c 3 192.0.2.45",
      description: "Send 3 simulated ICMP echo requests to verify network reachability.",
    },
    {
      title: "Single Host Baseline",
      command: "nmap 192.0.2.45",
      description: "Perform default port scan against training-target-alpha.",
    },
    {
      title: "Subnet Discovery",
      command: "nmap -sn 192.0.2.0/28",
      description: "Execute a ping sweep across 16 addresses to find live hosts.",
    },
    {
      title: "Port State Analysis",
      command: "nmap 198.51.100.25",
      description: "Probe services on the lab-services node to observe Open, Closed, and Filtered states.",
    },
  ];

  const handleCommandExecuted = (result, rawCommand) => {
    onRecordCommandAttempt(null, result.isMissionSuccess, rawCommand);
  };

  const handleCopy = (cmd) => {
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <div className="h-full flex flex-col p-4 lg:p-6 space-y-6 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-5 rounded-xl bg-cyber-card border border-cyber-border flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan text-xs font-mono font-semibold">
              UNRESTRICTED LAB SANDBOX
            </span>
            <span className="text-xs text-cyber-muted font-mono">RFC 5737 Boundary</span>
          </div>
          <h1 className="text-xl font-bold text-cyber-text">Practice Lab Sandbox</h1>
          <p className="text-xs text-cyber-muted leading-relaxed max-w-2xl">
            Experiment with supported educational commands against the simulated lab network.
            Test different scan options and verify deterministic outputs in a safe sandbox.
          </p>
        </div>

        <button
          onClick={onOpenGlossary}
          className="px-3.5 py-2 rounded-lg bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-xs font-medium text-cyber-text transition-colors flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5 text-cyber-emerald" />
          <span>Open Glossary</span>
        </button>
      </div>

      {/* Main Grid: Cheatsheet on left, Terminal on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
        {/* Left: Command reference cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xs font-bold text-cyber-text uppercase tracking-wider">
              Quick Reference Commands
            </h2>
            <span className="text-[11px] text-cyber-muted">Simulated Targets</span>
          </div>

          <div className="space-y-2.5">
            {practiceScenarios.map((sc, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-cyber-surface border border-cyber-border hover:border-cyber-borderSubtle transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyber-text">{sc.title}</span>
                  <button
                    onClick={() => handleCopy(sc.command)}
                    className="p-1 text-cyber-muted hover:text-cyber-emerald rounded transition-colors"
                    title="Copy command to clipboard"
                  >
                    {copiedCmd === sc.command ? (
                      <Check className="w-3.5 h-3.5 text-cyber-emerald" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <div className="p-1.5 rounded bg-cyber-bg border border-cyber-border font-mono text-xs text-cyber-emerald">
                  {sc.command}
                </div>
                <p className="text-[11px] text-cyber-muted leading-relaxed">
                  {sc.description}
                </p>
              </div>
            ))}
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-lg bg-cyber-card border border-cyber-border text-[11px] text-cyber-muted space-y-1">
            <span className="font-semibold text-cyber-text block">Safety Guardrail:</span>
            <p>
              Real external targets (e.g. 8.8.8.8, google.com) are blocked by the simulator. Use only the designated RFC 5737 lab addresses.
            </p>
          </div>
        </div>

        {/* Right: Simulated Terminal */}
        <div className="lg:col-span-7 flex flex-col">
          <SimulatedTerminal
            missionId={null}
            mode="practice"
            onCommandExecuted={handleCommandExecuted}
            isMaximized={isTerminalMaximized}
            setIsMaximized={setIsTerminalMaximized}
          />
        </div>
      </div>
    </div>
  );
}
