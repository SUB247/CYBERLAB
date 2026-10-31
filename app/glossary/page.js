"use client";

import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  Filter,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { GLOSSARY_ITEMS } from "@/lib/glossary/glossary-data";

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(GLOSSARY_ITEMS.map((item) => item.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredItems = useMemo(() => {
    return GLOSSARY_ITEMS.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase()) ||
        item.example.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150 w-full min-w-0">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Cybersecurity Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight break-words">
            Networking & Scanning Glossary
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed break-words">
            Core definitions, packet mechanics, protocol analogies, and ethical standards designed for beginners.
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
              placeholder="Search concepts (e.g. CIDR, open port, RFC 5737, TCP)..."
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-4 py-2 text-xs text-cyber-text placeholder:text-cyber-muted/60 focus:border-cyber-emerald focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs max-w-full">
            {categories.map((cat) => (
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

        {/* Glossary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-emerald/40 transition-all space-y-3 min-w-0"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-cyber-text break-words">{item.term}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-surface border border-cyber-border text-cyber-emerald uppercase shrink-0">
                  {item.category}
                </span>
              </div>

              <p className="text-xs text-cyber-muted leading-relaxed break-words">{item.definition}</p>

              {item.analogy && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed min-w-0">
                  <span className="font-bold text-amber-300">Analogy: </span>
                  <span className="break-words">{item.analogy}</span>
                </div>
              )}

              {item.example && (
                <div className="text-[11px] font-mono text-emerald-400 bg-cyber-bg px-2.5 py-1.5 rounded border border-cyber-border min-w-0 break-all">
                  <span className="text-cyber-muted">Example: </span>
                  {item.example}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
