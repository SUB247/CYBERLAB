"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Target,
  Terminal,
  Network,
  ShieldAlert,
  Cpu,
  Wifi,
  Lock,
  CheckCircle2,
  X,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { COURSES } from "@/lib/lessons/courses-data";
import { useUserProgress } from "@/lib/progress/progress-store";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  const { progressState } = useUserProgress();
  const completedMissions = progressState.completedMissions || [];

  const categories = ["All", "Foundations", "Networking", "Reconnaissance", "Security", "Exploitation", "Wireless"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || course.difficulty === selectedDifficulty;
      const matchesAvailability =
        selectedAvailability === "All" ||
        (selectedAvailability === "available" ? course.isPlayable : !course.isPlayable);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "duration") return parseInt(a.duration) - parseInt(b.duration);
      return b.isPlayable ? 1 : -1;
    });
  }, [search, selectedCategory, selectedDifficulty, selectedAvailability, sortBy]);

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Curriculum Library
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight">Course Catalog</h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed">
            Explore structured, hands-on cybersecurity courses. Master networking protocols, Linux operating system security, reconnaissance scans, and offensive testing methodologies.
          </p>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by title or keyword..."
                className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-8 py-2 text-xs text-cyber-text placeholder:text-cyber-muted/60 focus:border-cyber-emerald focus:outline-none transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2.5 text-cyber-muted hover:text-cyber-text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text focus:border-cyber-emerald focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>

            {/* Difficulty Dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text focus:border-cyber-emerald focus:outline-none"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  Difficulty: {diff}
                </option>
              ))}
            </select>

            {/* Availability */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text focus:border-cyber-emerald focus:outline-none"
            >
              <option value="All">Availability: All</option>
              <option value="available">Playable Labs</option>
              <option value="coming_soon">Upcoming</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-xs text-cyber-text focus:border-cyber-emerald focus:outline-none ml-auto"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full py-16 text-center text-cyber-muted space-y-2">
              <BookOpen className="w-10 h-10 mx-auto opacity-30 text-cyber-emerald" />
              <p className="text-sm font-semibold text-cyber-text">No courses match your filters</p>
              <p className="text-xs">Try resetting search filters to view available tracks.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                  setSelectedAvailability("All");
                }}
                className="text-xs text-cyber-emerald hover:underline pt-2 inline-block"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isNmap = course.id === "nmap-essentials";
              const completedCount = isNmap ? completedMissions.length : 0;
              const totalLessons = course.lessons.length;

              return (
                <div
                  key={course.id}
                  className={`p-6 rounded-2xl border flex flex-col justify-between space-y-5 transition-all ${
                    course.isPlayable
                      ? "bg-cyber-card border-cyber-emerald/40 hover:border-cyber-emerald shadow-lg shadow-emerald-950/20"
                      : "bg-cyber-card/70 border-cyber-border hover:border-cyber-borderSubtle"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted uppercase">
                        {course.category}
                      </span>
                      <span className="text-[11px] text-cyber-muted flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-cyber-text leading-snug">
                      {course.title}
                    </h2>
                    <p className="text-xs text-cyber-muted leading-relaxed line-clamp-3">
                      {course.description}
                    </p>

                    <div className="pt-1 flex flex-wrap gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted font-mono">
                        {course.difficulty}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-bg border border-cyber-border text-cyber-muted font-mono">
                        {totalLessons} Modules
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyber-border/40 flex items-center justify-between">
                    <div>
                      {course.isPlayable ? (
                        <span className="text-xs text-cyber-emerald font-semibold flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {completedCount} / 3 Completed
                        </span>
                      ) : (
                        <span className="text-xs text-cyber-muted/60 flex items-center gap-1 font-mono">
                          <Lock className="w-3.5 h-3.5" />
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/courses/${course.slug}`}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        course.isPlayable
                          ? "bg-cyber-emerald hover:bg-cyber-emeraldHover text-black shadow-md shadow-emerald-950/30"
                          : "bg-cyber-surface hover:bg-cyber-card text-cyber-text border border-cyber-border"
                      }`}
                    >
                      <span>{course.isPlayable ? "Start Learning" : "View Syllabus"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
