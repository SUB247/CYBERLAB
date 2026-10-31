"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from "@/lib/auth/auth-context";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isGuest, loading } = useAuth();

  // If visitor is unauthenticated and has not chosen Guest Mode, route to welcome/login entry page
  useEffect(() => {
    if (!loading && !user && !isGuest) {
      router.replace("/");
    }
  }, [loading, user, isGuest, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyber-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyber-muted">
            Initializing CYBERLAB workstation...
          </span>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}
