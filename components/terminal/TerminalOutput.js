"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Info, Terminal as TerminalIcon } from "lucide-react";

export default function TerminalOutput({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="py-6 text-center text-cyber-muted/60 space-y-1 select-none">
        <TerminalIcon className="w-8 h-8 mx-auto opacity-30 text-cyber-emerald" />
        <p className="text-xs">Terminal ready. Enter a simulated Nmap command to begin.</p>
        <p className="text-[11px] text-cyber-muted/40 font-mono">Type &apos;help&apos; for available lab instructions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((entry, idx) => {
        const isSuccess = entry.status === "success";
        const isError = entry.status === "error" || entry.status === "security_error";
        const isInfo = entry.status === "info";

        return (
          <div key={idx} className="space-y-1.5 animate-in fade-in duration-150">
            {/* Command Echo with prompt */}
            {entry.command && (
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-cyber-emerald font-semibold select-none">
                  learner@cyberlab-node:~$
                </span>
                <span className="text-white font-medium">{entry.command}</span>
                {entry.timestamp && (
                  <span className="text-[10px] text-cyber-muted/50 ml-auto select-none font-mono">
                    {entry.timestamp}
                  </span>
                )}
              </div>
            )}

            {/* Output Box */}
            <div
              className={`p-3 rounded-lg text-xs font-mono leading-relaxed overflow-x-auto border ${
                isSuccess
                  ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-200/90"
                  : isError
                  ? "bg-red-950/25 border-red-500/30 text-red-200/90"
                  : "bg-cyber-surface border-cyber-border text-cyber-text"
              }`}
            >
              {/* Status Header Badge */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyber-border/40 text-[10px] select-none">
                <div className="flex items-center gap-1.5">
                  {isSuccess && (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald" />
                      <span className="text-cyber-emerald font-bold uppercase tracking-wider">
                        [EXECUTION SUCCESS - LAB EMULATOR]
                      </span>
                    </>
                  )}
                  {isError && (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5 text-cyber-red" />
                      <span className="text-cyber-red font-bold uppercase tracking-wider">
                        [SYNTAX / SCOPE ERROR]
                      </span>
                    </>
                  )}
                  {isInfo && (
                    <>
                      <Info className="w-3.5 h-3.5 text-cyber-cyan" />
                      <span className="text-cyber-cyan font-bold uppercase tracking-wider">
                        [LAB ENVIRONMENT INFO]
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Line by line formatted output */}
              <div className="space-y-0.5">
                {entry.outputLines.map((line, lIdx) => {
                  // Format specific highlights
                  let colorClass = "text-cyber-muted";
                  if (line.includes("Host is up") || line.includes("open") || line.includes("3 hosts up")) {
                    colorClass = "text-emerald-400 font-semibold";
                  } else if (line.includes("closed")) {
                    colorClass = "text-yellow-400/90";
                  } else if (line.includes("filtered")) {
                    colorClass = "text-orange-400/90";
                  } else if (line.includes("Starting Nmap") || line.includes("Nmap scan report")) {
                    colorClass = "text-cyber-text font-bold";
                  } else if (line.includes("PORT") && line.includes("STATE")) {
                    colorClass = "text-cyber-text font-bold underline";
                  } else if (line.includes("Educational tip:") || line.includes("PORT STATE INTERPRETATION:")) {
                    colorClass = "text-cyan-300 font-medium";
                  } else if (line.includes("[SCOPE VIOLATION]") || line.includes("rejected")) {
                    colorClass = "text-red-400 font-bold";
                  }

                  return (
                    <div key={lIdx} className={`${colorClass} whitespace-pre-wrap`}>
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
