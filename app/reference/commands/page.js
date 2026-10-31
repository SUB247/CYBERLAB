"use client";

import React, { useState, useMemo } from "react";
import {
  Code2,
  Search,
  Copy,
  Check,
  Terminal,
  Filter,
  Info,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";

const COMMAND_DATA = [
  {
    cmd: "nmap <target>",
    category: "Nmap Port Scanning",
    description: "Performs default scan against the top 1,000 most common TCP ports on a single host.",
    example: "nmap 192.0.2.45",
    options: "None (baseline top 1,000 port scan)",
    impact: "Dispatches probe packets to determine if services reply with SYN-ACK, RST, or drop.",
  },
  {
    cmd: "nmap -sn <target>",
    category: "Nmap Host Discovery",
    description: "Host discovery ping scan ('No Port Scan'). Skips port inspection to quickly map live IPs.",
    example: "nmap -sn 192.0.2.0/28",
    options: "-sn (disable port scan)",
    impact: "Substantially faster; generates minimal packet overhead across larger subnets.",
  },
  {
    cmd: "nmap -sV <target>",
    category: "Nmap Service Detection",
    description: "Service and version detection. Probes open ports for application banners and version numbers.",
    example: "nmap -sV 198.51.100.25",
    options: "-sV (probe service/version info)",
    impact: "Sends application-specific protocol queries to determine daemon signatures.",
  },
  {
    cmd: "nmap -Pn <target>",
    category: "Nmap Host Discovery",
    description: "Treat all hosts as online. Skips initial ping discovery and scans ports immediately.",
    example: "nmap -Pn 192.0.2.45",
    options: "-Pn (skip ping)",
    impact: "Useful when target firewalls drop ICMP/probe discovery packets.",
  },
  {
    cmd: "nmap -p <port-spec> <target>",
    category: "Nmap Port Scanning",
    description: "Specify individual port numbers or ranges to scan (e.g. -p 80,443 or -p 1-1024).",
    example: "nmap -p 80,443 192.0.2.45",
    options: "-p (port specification)",
    impact: "Restricts probes strictly to designated port endpoints.",
  },
  {
    cmd: "ip addr",
    category: "Linux Network CLI",
    description: "Displays simulated network interfaces, IP addresses, MAC addresses, and subnet prefixes.",
    example: "ip addr",
    options: "addr (show IP configuration)",
    impact: "Reveals local host interface name, IPv4 address, and broadcast domain.",
  },
  {
    cmd: "ping -c <count> <target>",
    category: "Linux Network CLI",
    description: "Sends specified number of ICMP echo request packets to verify network reachability and round-trip time.",
    example: "ping -c 3 192.0.2.45",
    options: "-c <count> (stop after sending count packets)",
    impact: "Measures latency and confirms packet transit between nodes.",
  },
  {
    cmd: "clear / cls",
    category: "Terminal Utilities",
    description: "Clears the active simulated terminal screen output history.",
    example: "clear",
    options: "None",
    impact: "Resets the visual terminal output buffer.",
  },
  {
    cmd: "help",
    category: "Terminal Utilities",
    description: "Lists all supported educational commands and authorized RFC 5737 lab targets.",
    example: "help",
    options: "None",
    impact: "Prints the laboratory interactive field reference.",
  },
];

const CATEGORIES = ["All", "Nmap Port Scanning", "Nmap Host Discovery", "Nmap Service Detection", "Linux Network CLI", "Terminal Utilities"];

export default function CommandReferencePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedCmd, setCopiedCmd] = useState(null);

  const filteredCommands = useMemo(() => {
    return COMMAND_DATA.filter((c) => {
      const matchesSearch =
        c.cmd.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.example.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const handleCopy = (cmd) => {
    navigator.clipboard?.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150 w-full min-w-0">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              CLI Quick Reference
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight break-words">
            Command Reference Library
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed break-words">
            Essential syntax patterns, flags, and operational parameters for Nmap and Linux terminal tools.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border flex items-center justify-between flex-wrap gap-3 min-w-0">
          <div className="relative w-full sm:flex-1 min-w-0">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search command syntax, options, or flags..."
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-4 py-2 text-xs text-cyber-text placeholder:text-cyber-muted/60 focus:border-cyber-emerald focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? "bg-cyber-emerald text-black font-semibold"
                    : "bg-cyber-card text-cyber-muted hover:text-cyber-text border border-cyber-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Command Cards List */}
        <div className="space-y-4 min-w-0">
          {filteredCommands.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-borderSubtle transition-all space-y-3 min-w-0"
            >
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-sm font-bold text-cyber-emerald bg-cyber-bg px-3 py-1 rounded border border-cyber-border break-all">
                    {item.cmd}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted uppercase">
                    {item.category}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(item.example)}
                  className="px-2.5 py-1 rounded-lg bg-cyber-surface hover:bg-cyber-bg border border-cyber-border text-xs text-cyber-muted hover:text-cyber-text flex items-center gap-1.5 transition-colors shrink-0"
                  title="Copy example to clipboard"
                >
                  {copiedCmd === item.example ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyber-emerald" />
                      <span className="text-cyber-emerald font-mono text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">Copy Example</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-cyber-text leading-relaxed break-words">{item.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px] font-mono">
                <div className="p-2.5 rounded bg-cyber-surface border border-cyber-border/70 text-cyber-muted min-w-0">
                  <span className="text-cyber-text font-bold block mb-0.5">Parameters:</span>
                  <span className="break-words">{item.options}</span>
                </div>

                <div className="p-2.5 rounded bg-cyber-surface border border-cyber-border/70 text-cyber-muted min-w-0">
                  <span className="text-cyber-text font-bold block mb-0.5">Behavior & Impact:</span>
                  <span className="break-words">{item.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
