"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  HelpCircle,
  User,
  Settings,
  BarChart3,
  LogOut,
  LogIn,
  ChevronDown,
  Shield,
  Layers,
  Sparkles,
  UserX,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function Topbar({
  onOpenSearch,
  onOpenHelp,
  setMobileOpen,
  isSidebarCollapsed,
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isGuest, signOut, exitGuestMode, isConfigured } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute dynamic breadcrumb
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0 || (parts.length === 1 && parts[0] === "dashboard")) {
      return [{ label: "Overview", href: "/dashboard" }];
    }

    const crumbs = [{ label: "Home", href: "/dashboard" }];
    let currentPath = "";

    parts.forEach((part, index) => {
      currentPath += `/${part}`;
      let label = part.replace(/-/g, " ");
      label = label.charAt(0).toUpperCase() + label.slice(1);

      if (part === "dashboard") label = "Dashboard";
      if (part === "missions") label = "Missions";
      if (part === "courses") label = "Courses";
      if (part === "paths") label = "Learning Paths";
      if (part === "practice") label = "Practice Labs";
      if (part === "reference") label = "Reference";
      if (part === "commands") label = "Command Library";
      if (part === "glossary") label = "Glossary";
      if (part === "progress") label = "My Progress";
      if (part === "achievements") label = "Achievements";
      if (part === "profile") label = "Profile";
      if (part === "settings") label = "Settings";

      crumbs.push({ label, href: currentPath });
    });

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleSignOut = async () => {
    setProfileMenuOpen(false);
    await signOut();
  };

  const handleExitGuest = () => {
    setProfileMenuOpen(false);
    exitGuestMode();
  };

  return (
    <header className="h-14 bg-cyber-surface/90 border-b border-cyber-border backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs min-w-0">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href}>
                {idx > 0 && <span className="text-cyber-border font-bold shrink-0">/</span>}
                {isLast ? (
                  <span className="font-semibold text-cyber-text truncate max-w-[140px] sm:max-w-xs md:max-w-none">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-cyber-muted hover:text-cyber-text transition-colors hidden sm:inline shrink-0"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyber-card border border-cyber-border hover:border-cyber-borderSubtle text-cyber-muted hover:text-cyber-text transition-all text-xs"
          title="Search anything (courses, missions, commands)"
        >
          <Search className="w-3.5 h-3.5 text-cyber-muted" />
          <span className="hidden md:inline">Search lab...</span>
          <kbd className="hidden md:inline text-[9px] px-1.5 py-0.5 rounded bg-cyber-surface border border-cyber-border font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Guest Mode vs Environment Badge */}
        {!user ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-mono font-medium text-amber-300">
              <UserX className="w-3.5 h-3.5 text-amber-400" />
              <span>GUEST MODE</span>
            </div>
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyber-emerald/15 hover:bg-cyber-emerald/25 border border-cyber-emerald/40 text-cyber-emerald text-xs font-semibold transition-all shadow-sm"
              title="Sign in with your CYBERLAB account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Sync</span>
            </Link>
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyber-card border border-cyber-border text-[11px] font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-emerald"></span>
            </span>
            <span className="text-cyber-emerald font-semibold">SIMULATED LAB</span>
          </div>
        )}

        {/* Help Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-lg text-cyber-muted hover:text-cyber-emerald hover:bg-cyber-card transition-colors"
          title="Field Guide & Instructions"
          aria-label="Field Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-cyber-card border border-transparent hover:border-cyber-border transition-colors group"
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                user
                  ? "bg-cyber-emerald/20 border border-cyber-emerald/40 text-cyber-emerald"
                  : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
              }`}
            >
              {profile?.display_name ? profile.display_name.charAt(0).toUpperCase() : "G"}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-cyber-text max-w-[100px] truncate">
              {profile?.display_name || "Guest Learner"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-cyber-muted group-hover:text-cyber-text transition-colors" />
          </button>

          {/* Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-cyber-surface border border-cyber-border rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              {/* User Identity Info */}
              <div className="px-3.5 py-2.5 border-b border-cyber-border/70 space-y-0.5">
                <p className="font-semibold text-cyber-text truncate">
                  {profile?.display_name || "Guest Learner"}
                </p>
                <p className="text-[11px] text-cyber-muted truncate font-mono">
                  {user?.email || `@${profile?.username || "learner"}`}
                </p>
                {!user ? (
                  <div className="pt-1">
                    <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                      Guest Mode • Local Storage Only
                    </span>
                  </div>
                ) : (
                  <div className="pt-1">
                    <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 font-mono">
                      Cloud Account Synced
                    </span>
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <User className="w-3.5 h-3.5 text-cyber-emerald" />
                    <span>My Profile</span>
                  </div>
                  {!user && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyber-card border border-cyber-border text-cyber-muted">
                      Account
                    </span>
                  )}
                </Link>

                <Link
                  href="/progress"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span>Learning Progress</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setProfileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-3.5 h-3.5 text-cyber-muted" />
                    <span>Account Settings</span>
                  </div>
                  {!user && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyber-card border border-cyber-border text-cyber-muted">
                      Account
                    </span>
                  )}
                </Link>
              </div>

              {/* Sign In / Sign Out / Exit Guest */}
              <div className="pt-1 border-t border-cyber-border/70">
                {user ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-cyber-emerald hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In / Create Account</span>
                    </Link>

                    <button
                      onClick={handleExitGuest}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-cyber-muted hover:text-cyber-text hover:bg-cyber-card transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Exit Guest Mode</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
