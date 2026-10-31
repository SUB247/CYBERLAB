"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "./AppSidebar";
import Topbar from "./Topbar";
import GlobalSearchModal from "../shared/GlobalSearchModal";
import HelpModal from "../shared/HelpModal";
import { useAuth } from "@/lib/auth/auth-context";

export default function AppShell({ children }) {
  const router = useRouter();
  const { user, isGuest, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // If visitor is unauthenticated and not in Guest Mode, route to welcome/login entry page
  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.replace("/");
    }
  }, [loading, user, isGuest, router]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K / '/' for search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyber-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyber-muted">
            Initializing CYBERLAB environment...
          </span>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col font-sans selection:bg-cyber-emerald selection:text-black">
      {/* Sidebar Navigation */}
      <AppSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Top Bar with Profile Menu & Breadcrumbs */}
        <Topbar
          onOpenSearch={() => setSearchOpen(true)}
          onOpenHelp={() => setHelpOpen(true)}
          setMobileOpen={setMobileOpen}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Dynamic Route Content */}
        <main className="flex-1 flex flex-col min-w-0 max-w-full">{children}</main>
      </div>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
