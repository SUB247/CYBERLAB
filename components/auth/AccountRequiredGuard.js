"use client";

import React from "react";
import Link from "next/link";
import { Lock, ShieldAlert, LogIn, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AccountRequiredGuard({
  featureName = "Account Settings & Profile Management",
}) {
  return (
    <div className="p-4 lg:p-8 max-w-xl mx-auto my-12 animate-in fade-in duration-200">
      <div className="p-6 lg:p-8 rounded-2xl bg-cyber-card border border-cyber-border space-y-6 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Private Account Feature</span>
          </div>
          <h1 className="text-xl font-extrabold text-cyber-text tracking-tight">
            Account Required
          </h1>
          <p className="text-xs text-cyber-muted max-w-md mx-auto leading-relaxed">
            You are currently exploring CYBERLAB in <strong>Guest Mode</strong>. {featureName} is reserved for registered accounts to ensure private data isolation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border text-left space-y-2.5 text-xs">
          <span className="text-[11px] font-mono text-cyber-emerald font-semibold uppercase tracking-wider block">
            Registered Account Capabilities:
          </span>
          <ul className="space-y-2 text-cyber-muted text-[11px]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0" />
              <span>Multi-device synchronization of mission progress and skill statistics</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0" />
              <span>Permanent cloud milestone recognition and certification badges</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0" />
              <span>Custom profile handle, public bio, and visibility configuration</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.02]"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Create Account</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-cyber-text text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
