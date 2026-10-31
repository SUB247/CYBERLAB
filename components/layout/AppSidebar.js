"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Route,
  BookOpen,
  GraduationCap,
  Terminal,
  Target,
  Flame,
  Code2,
  HelpCircle,
  FileText,
  BarChart3,
  Award,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function AppSidebar({
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navSections = [
    {
      title: "LEARN",
      items: [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Learning Paths", href: "/paths", icon: Route },
        { label: "Course Library", href: "/courses", icon: BookOpen },
        { label: "My Learning", href: "/my-learning", icon: GraduationCap },
      ],
    },
    {
      title: "PRACTICE",
      items: [
        { label: "Practice Labs", href: "/practice", icon: Terminal, badge: "Sandbox" },
        { label: "Missions", href: "/missions", icon: Target, badge: "3 Playable" },
        { label: "Challenges", href: "/challenges", icon: Flame },
      ],
    },
    {
      title: "REFERENCE",
      items: [
        { label: "Command Reference", href: "/reference/commands", icon: Code2 },
        { label: "Networking Glossary", href: "/glossary", icon: HelpCircle },
        { label: "Learning Resources", href: "/resources", icon: FileText },
      ],
    },
    {
      title: "PERSONAL",
      items: [
        { label: "My Progress", href: "/progress", icon: BarChart3 },
        { label: "Achievements", href: "/achievements", icon: Award },
        {
          label: "My Profile",
          href: "/profile",
          icon: User,
          badge: !user ? "Account" : undefined,
        },
        {
          label: "Settings",
          href: "/settings",
          icon: Settings,
          badge: !user ? "Account" : undefined,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-cyber-surface border-r border-cyber-border flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-14 border-b border-cyber-border flex items-center justify-between px-3.5 bg-cyber-card/30 min-w-0">
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="w-8 h-8 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald group-hover:border-cyber-emerald transition-colors shadow-sm shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="truncate min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wider text-cyber-text group-hover:text-white transition-colors truncate">
                    CYBER<span className="text-cyber-emerald">LAB</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyber-border text-cyber-muted font-mono shrink-0">
                    v0.2
                  </span>
                </div>
                <p className="text-[10px] text-cyber-muted -mt-0.5 truncate">
                  Cybersecurity Academy
                </p>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-md transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-cyber-muted hover:text-cyber-text rounded-md"
            aria-label="Close mobile navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-2 pb-1.5 text-[10px] font-semibold font-mono uppercase tracking-wider text-cyber-muted/70">
                  {section.title}
                </div>
              ) : (
                <div className="h-2" />
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all group ${
                        isActive
                          ? "bg-cyber-emerald/15 text-cyber-emerald font-semibold border border-cyber-emerald/30 shadow-sm"
                          : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-card"
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-cyber-emerald" : "text-cyber-muted group-hover:text-cyber-text"}`} />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between w-full min-w-0">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-medium bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 ml-1.5 shrink-0">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        {!isCollapsed && (
          <div className="p-3 border-t border-cyber-border bg-cyber-card/30 text-[11px] font-mono text-cyber-muted flex items-center justify-between">
            <span>RFC 5737 Safe Lab</span>
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
          </div>
        )}
      </aside>
    </>
  );
}
