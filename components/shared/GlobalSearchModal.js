"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
  Terminal,
  Target,
  FileCode2,
  ExternalLink,
  ChevronRight,
  Layers,
} from "lucide-react";
import { COURSES } from "@/lib/lessons/courses-data";
import { GLOSSARY_ITEMS } from "@/lib/glossary/glossary-data";
import { MISSIONS } from "@/lib/lessons/lesson-data";

export default function GlobalSearchModal({ isOpen, onClose }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Aggregate searchable items
  const allSearchable = useMemo(() => {
    const list = [];

    // Courses
    COURSES.forEach((c) => {
      list.push({
        id: `course-${c.id}`,
        type: "course",
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        category: c.category,
        url: `/courses/${c.slug}`,
        badge: c.difficulty,
        isPlayable: c.isPlayable,
      });

      // Lessons within course
      c.lessons.forEach((l) => {
        list.push({
          id: `lesson-${l.id}`,
          type: "lesson",
          title: `${c.title} • ${l.title}`,
          subtitle: l.description,
          description: l.description,
          category: c.category,
          url: l.missionRef ? `/missions/${l.missionRef}` : `/courses/${c.slug}`,
          badge: l.duration,
          isPlayable: l.status === "available",
        });
      });
    });

    // Glossary items
    GLOSSARY_ITEMS.forEach((g) => {
      list.push({
        id: `glossary-${g.id}`,
        type: "glossary",
        title: g.term,
        subtitle: g.category,
        description: g.definition,
        category: "Glossary",
        url: `/glossary?term=${g.id}`,
        badge: g.example,
        isPlayable: true,
      });
    });

    // Reference commands
    const referenceCommands = [
      { cmd: "nmap <target>", desc: "Scans default top 1,000 TCP ports on a single host.", cat: "Nmap" },
      { cmd: "nmap -sn <subnet>", desc: "Host discovery ping scan, disabling port scanning.", cat: "Nmap" },
      { cmd: "nmap 198.51.100.25", desc: "Inspect open, closed, and filtered port states.", cat: "Nmap" },
      { cmd: "ip addr", desc: "Displays simulated host interface configuration and subnet mask.", cat: "Linux" },
      { cmd: "ping -c 3 <target>", desc: "Sends 3 ICMP echo request packets to verify host reachability.", cat: "Linux" },
    ];

    referenceCommands.forEach((rc, i) => {
      list.push({
        id: `cmd-${i}`,
        type: "command",
        title: rc.cmd,
        subtitle: "Educational Command Reference",
        description: rc.desc,
        category: "Command",
        url: `/reference/commands?q=${encodeURIComponent(rc.cmd)}`,
        badge: rc.cat,
        isPlayable: true,
      });
    });

    return list;
  }, []);

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    return allSearchable
      .filter((item) => {
        const matchesType = selectedType === "all" || item.type === selectedType;
        const matchesQuery =
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q);
        return matchesType && matchesQuery;
      })
      .slice(0, 12);
  }, [allSearchable, query, selectedType]);

  const handleSelectResult = (url) => {
    onClose();
    router.push(url);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-cyber-surface border border-cyber-border rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-cyber-border bg-cyber-card/60 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyber-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, missions, port states, RFC 5737, commands..."
            className="flex-1 bg-transparent text-sm text-cyber-text placeholder:text-cyber-muted/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-border text-cyber-muted hidden sm:inline">
            ESC to close
          </span>
        </div>

        {/* Filter Pills */}
        <div className="p-2.5 border-b border-cyber-border/70 bg-cyber-surface flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Results" },
            { id: "course", label: "Courses" },
            { id: "lesson", label: "Missions & Lessons" },
            { id: "command", label: "Commands" },
            { id: "glossary", label: "Glossary" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedType === type.id
                  ? "bg-cyber-emerald text-black font-semibold"
                  : "bg-cyber-card text-cyber-muted hover:text-cyber-text border border-cyber-border"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {!query.trim() ? (
            <div className="py-12 text-center text-cyber-muted space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-30 text-cyber-emerald" />
              <p className="text-xs">Type a keyword to discover courses, missions, and concepts.</p>
              <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-cyber-muted/80">
                <span className="font-mono bg-cyber-card px-2 py-0.5 rounded border border-cyber-border">
                  nmap -sn
                </span>
                <span className="font-mono bg-cyber-card px-2 py-0.5 rounded border border-cyber-border">
                  open port
                </span>
                <span className="font-mono bg-cyber-card px-2 py-0.5 rounded border border-cyber-border">
                  192.0.2.45
                </span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center text-cyber-muted space-y-2">
              <p className="text-sm font-semibold text-cyber-text">No results found for &quot;{query}&quot;</p>
              <p className="text-xs">Try searching for &quot;Nmap&quot;, &quot;port&quot;, &quot;subnet&quot;, or &quot;ping&quot;.</p>
            </div>
          ) : (
            filteredResults.map((item) => {
              let IconComp = Target;
              if (item.type === "course") IconComp = Layers;
              if (item.type === "command") IconComp = Terminal;
              if (item.type === "glossary") IconComp = BookOpen;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item.url)}
                  className="p-3 rounded-lg bg-cyber-card/80 border border-cyber-border hover:border-cyber-emerald/40 hover:bg-cyber-card cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                    <div className="p-2 rounded-lg bg-cyber-surface border border-cyber-border text-cyber-emerald shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-cyber-text group-hover:text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
                            {item.badge}
                          </span>
                        )}
                        {!item.isPlayable && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-cyber-muted truncate">
                        {item.description || item.subtitle}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyber-muted group-hover:text-cyber-emerald shrink-0 transition-colors" />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
