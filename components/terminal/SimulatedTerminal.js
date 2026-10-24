"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Play,
  Trash2,
  RotateCcw,
  Maximize2,
  Minimize2,
  Shield,
  CornerDownLeft,
} from "lucide-react";
import TerminalOutput from "./TerminalOutput";
import { executeCommand } from "@/lib/simulator/command-engine";

export default function SimulatedTerminal({
  missionId,
  mode = "mission",
  onCommandExecuted,
  onResetExercise,
  isMaximized,
  setIsMaximized,
}) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState([]);
  const [commandHistoryList, setCommandHistoryList] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);

  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of terminal when history changes
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isExecuting]);

  // Keep input focused
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Keyboard navigation for command history (Up / Down)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRun();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistoryList.length === 0) return;
      const nextIndex =
        historyIndex === -1
          ? commandHistoryList.length - 1
          : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistoryList[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistoryList.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistoryList[nextIndex]);
      }
    }
  };

  const handleRun = () => {
    if (!inputVal.trim() || isExecuting) return;

    const command = inputVal.trim();
    setInputVal("");
    setHistoryIndex(-1);

    // Save to command history list
    setCommandHistoryList((prev) => [...prev, command]);

    setIsExecuting(true);

    // Simulate realistic terminal response time (250ms)
    setTimeout(() => {
      const result = executeCommand(command, { missionId, mode });

      if (result.action === "clear") {
        setHistory([]);
        setIsExecuting(false);
        focusInput();
        return;
      }

      const timestamp = new Date().toLocaleTimeString();
      const newEntry = {
        command,
        timestamp,
        status: result.status,
        outputLines: result.outputLines || [],
        isMissionSuccess: result.isMissionSuccess,
      };

      setHistory((prev) => [...prev, newEntry]);
      setIsExecuting(false);

      if (onCommandExecuted) {
        onCommandExecuted(result, command);
      }

      focusInput();
    }, 250);
  };

  const handleClear = () => {
    setHistory([]);
    focusInput();
  };

  const handleReset = () => {
    setHistory([]);
    setInputVal("");
    setHistoryIndex(-1);
    if (onResetExercise) {
      onResetExercise();
    }
    focusInput();
  };

  return (
    <div
      onClick={focusInput}
      className={`bg-cyber-surface border border-cyber-border rounded-xl flex flex-col shadow-xl overflow-hidden transition-all duration-300 ${
        isMaximized ? "fixed inset-4 z-50 bg-cyber-surface/98" : "h-full min-h-[460px]"
      }`}
    >
      {/* Terminal Top Bar */}
      <div className="h-10 px-3.5 bg-cyber-card/80 border-b border-cyber-border flex items-center justify-between select-none">
        {/* Left window badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono font-medium text-cyber-text flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-cyber-emerald" />
            simulated-bash [node-1]
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-emerald font-mono hidden sm:inline-block">
            {mode === "mission" ? `Mission: ${missionId}` : "Practice Sandbox"}
          </span>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1.5 text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface rounded-md transition-colors text-xs flex items-center gap-1"
            title="Clear Terminal Output (clear)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Clear</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleReset();
            }}
            className="p-1.5 text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface rounded-md transition-colors text-xs flex items-center gap-1"
            title="Reset Mission Exercise"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Reset</span>
          </button>

          {setIsMaximized && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized(!isMaximized);
              }}
              className="p-1.5 text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface rounded-md transition-colors text-xs"
              title={isMaximized ? "Minimize Terminal" : "Maximize Terminal"}
            >
              {isMaximized ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs bg-cyber-bg/90">
        <TerminalOutput history={history} />
        {isExecuting && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyber-emerald py-1">
            <span className="animate-spin text-sm">⠋</span>
            <span>Executing simulated scan against lab targets...</span>
          </div>
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Bar */}
      <div className="p-3 bg-cyber-card/70 border-t border-cyber-border">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRun();
          }}
          className="flex items-center gap-2"
        >
          {/* Prompt prefix */}
          <span className="text-xs font-mono font-bold text-cyber-emerald select-none shrink-0">
            learner@cyberlab-node:~$
          </span>

          {/* Accessible input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type nmap command (e.g. nmap 192.0.2.45)..."
            className="flex-1 bg-cyber-bg border border-cyber-border rounded-lg px-3 py-1.5 text-xs font-mono text-cyber-text placeholder:text-cyber-muted/40 focus:border-cyber-emerald focus:outline-none transition-colors"
            autoComplete="off"
            spellCheck="false"
            disabled={isExecuting}
            aria-label="Terminal command input"
          />

          {/* Visible Run Button */}
          <button
            type="submit"
            disabled={!inputVal.trim() || isExecuting}
            className="px-3 py-1.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            title="Execute Command (Enter)"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run</span>
          </button>
        </form>
      </div>
    </div>
  );
}
