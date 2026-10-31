"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Target,
  Terminal,
  Clock,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useUserProgress } from "@/lib/progress/progress-store";

export default function ChallengesPage() {
  const { progressState } = useUserProgress();
  const completedMissions = progressState.completedMissions || [];

  const challenges = [
    {
      id: "ch-01",
      title: "Perimeter Target Acquisition",
      difficulty: "Beginner",
      points: "100 XP",
      missionLink: "/missions/mission-01",
      completed: completedMissions.includes("mission-01"),
      description: "Execute a single-target port scan against training-target-alpha (192.0.2.45) without passing unnecessary options.",
      objective: "nmap 192.0.2.45",
    },
    {
      id: "ch-02",
      title: "Subnet Host Enumeration",
      difficulty: "Beginner",
      points: "150 XP",
      missionLink: "/missions/mission-02",
      completed: completedMissions.includes("mission-02"),
      description: "Discover all active machines inside the 16-address /28 subnet using -sn to skip port scanning.",
      objective: "nmap -sn 192.0.2.0/28",
    },
    {
      id: "ch-03",
      title: "Port State Triage & Analysis",
      difficulty: "Intermediate",
      points: "200 XP",
      missionLink: "/missions/mission-03",
      completed: completedMissions.includes("mission-03"),
      description: "Probe lab-services.internal (198.51.100.25) to identify open, closed, and firewall-filtered TCP ports.",
      objective: "nmap 198.51.100.25",
    },
    {
      id: "ch-04",
      title: "Local Workstation Interface Inspection",
      difficulty: "Beginner",
      points: "50 XP",
      missionLink: "/practice",
      completed: (progressState.commandsRun || 0) > 0,
      description: "Inspect the network configuration and IP mask of your simulated workstation.",
      objective: "ip addr",
    },
    {
      id: "ch-05",
      title: "ICMP Reachability Triangulation",
      difficulty: "Beginner",
      points: "50 XP",
      missionLink: "/practice",
      completed: (progressState.commandsRun || 0) > 2,
      description: "Send 3 simulated ICMP echo requests to verify network latency.",
      objective: "ping -c 3 192.0.2.45",
    },
  ];

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-cyber-amber border border-amber-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-amber font-semibold">
              Hands-On Scenarios
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight">
            Security Practice Challenges
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed">
            Targeted objectives to test your command speed, syntax precision, and output interpretation skills.
          </p>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((ch, idx) => (
            <div
              key={ch.id}
              className={`p-5 rounded-2xl border flex items-center justify-between flex-wrap gap-4 transition-all ${
                ch.completed
                  ? "bg-cyber-surface border-cyber-emerald/40"
                  : "bg-cyber-card border-cyber-border hover:border-cyber-borderSubtle"
              }`}
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted uppercase">
                    Challenge 0{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-cyber-emerald font-semibold">
                    {ch.points}
                  </span>
                  <span className="text-xs text-cyber-muted font-mono">• {ch.difficulty}</span>
                </div>

                <h3 className="text-base font-bold text-cyber-text">{ch.title}</h3>
                <p className="text-xs text-cyber-muted leading-relaxed">{ch.description}</p>

                <div className="pt-1 text-[11px] font-mono text-emerald-400 bg-cyber-bg/80 px-2.5 py-1 rounded inline-block border border-cyber-border">
                  <span className="text-cyber-muted">Command Syntax: </span>
                  {ch.objective}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {ch.completed && (
                  <span className="text-xs font-mono text-cyber-emerald flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Passed
                  </span>
                )}

                <Link
                  href={ch.missionLink}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    ch.completed
                      ? "bg-cyber-surface hover:bg-cyber-card text-cyber-text border border-cyber-border"
                      : "bg-cyber-emerald hover:bg-cyber-emeraldHover text-black shadow-md shadow-emerald-950/30"
                  }`}
                >
                  <span>{ch.completed ? "Replay" : "Start Challenge"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
