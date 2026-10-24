"use client";

import React, { useState, useMemo } from "react";
import { X, Search, BookOpen, ExternalLink, HelpCircle } from "lucide-react";
import { GLOSSARY_ITEMS } from "@/lib/glossary/glossary-data";

export default function GlossaryModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(GLOSSARY_ITEMS.map((item) => item.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredItems = useMemo(() => {
    return GLOSSARY_ITEMS.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.example.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-cyber-surface border border-cyber-border rounded-xl max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-cyber-border flex items-center justify-between bg-cyber-card/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-cyber-text">Cybersecurity Knowledge Glossary</h2>
              <p className="text-xs text-cyber-muted">Core terminology for networking and security exploration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-cyber-muted hover:text-cyber-text p-1.5 rounded-lg hover:bg-cyber-border transition-colors"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 border-b border-cyber-border bg-cyber-surface/80 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search concepts (e.g., CIDR, Open Port, SYN-ACK, Scope)..."
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-4 py-2 text-xs text-cyber-text placeholder:text-cyber-muted focus:border-cyber-emerald focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors whitespace-nowrap ${
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

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-cyber-muted space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-cyber-muted opacity-50" />
              <p className="text-sm">No glossary entries match your search.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="text-xs text-cyber-emerald hover:underline"
              >
                Clear search filters
              </button>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-cyber-card border border-cyber-border hover:border-cyber-emerald/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-cyber-text">{item.term}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-surface border border-cyber-border text-cyber-emerald uppercase tracking-wider font-mono">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-cyber-muted leading-relaxed">{item.definition}</p>
                {item.analogy && (
                  <div className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 p-2 rounded">
                    <span className="font-semibold text-amber-200">Analogy: </span>
                    {item.analogy}
                  </div>
                )}
                {item.example && (
                  <div className="text-[11px] font-mono text-emerald-400/90 bg-cyber-bg/80 px-2 py-1 rounded border border-cyber-border">
                    <span className="text-cyber-muted">Example: </span>
                    {item.example}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
