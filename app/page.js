"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Terminal,
  Zap,
  Target,
  Sparkles,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function WelcomePage() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    isGuest,
    signIn,
    continueAsGuest,
    isConfigured,
    configError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Authenticated users visiting / are automatically redirected to the dashboard
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isConfigured) {
      setErrorMsg(
        configError ||
          "Supabase credentials are not configured in .env.local. You can continue as a Guest to explore the sandbox."
      );
      return;
    }

    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.push("/dashboard");
  };

  // Prevent flicker during initial session hydration
  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyber-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyber-muted">
            Checking CYBERLAB workstation session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text flex flex-col justify-center items-center p-4 selection:bg-cyber-emerald selection:text-black">
      {/* Background Cyber Glow Accent */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-25">
        <div className="w-[500px] h-[500px] bg-cyber-emerald/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald shadow-lg shadow-emerald-950/40">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-cyber-text">
              CYBER<span className="text-cyber-emerald">LAB</span>
            </h1>
            <p className="text-xs font-mono text-cyber-muted mt-1 uppercase tracking-wider">
              Interactive Cybersecurity Academy & Terminal Sandbox
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-mono text-cyber-muted/80 pt-1">
            <span className="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyber-emerald" /> RFC 5737 Targets
            </span>
            <span className="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400" /> Nmap Simulator
            </span>
            <span className="px-2 py-0.5 rounded bg-cyber-card border border-cyber-border flex items-center gap-1">
              <Target className="w-3 h-3 text-amber-400" /> Guided Missions
            </span>
          </div>
        </div>

        {/* Guest Session Resume Notification */}
        {isGuest && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
            <div className="space-y-0.5">
              <span className="font-semibold block">Active Guest Session Detected</span>
              <span className="text-[11px] text-amber-200/80 block">
                Local progress is available on this browser.
              </span>
            </div>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold text-[11px] transition-colors shrink-0"
            >
              Resume Dashboard
            </Link>
          </div>
        )}

        {/* Authentication Card */}
        <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-cyber-text">Workstation Sign In</h2>
            <p className="text-xs text-cyber-muted leading-relaxed">
              Enter your credentials to synchronize lab certifications and remote progress.
            </p>
          </div>

          {/* Config Alert if Supabase is unconfigured */}
          {!isConfigured && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Info className="w-4 h-4 shrink-0" />
                <span>Supabase Not Configured</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/80">
                Cloud authentication is optional. Click <strong>Continue as Guest</strong> below to explore all courses and missions locally.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-cyber-muted font-medium block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-3 py-2 text-cyber-text placeholder:text-cyber-muted/50 focus:border-cyber-emerald focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-cyber-muted font-medium block">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-cyber-emerald hover:underline font-mono"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-9 py-2 text-cyber-text placeholder:text-cyber-muted/50 focus:border-cyber-emerald focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-cyber-muted hover:text-cyber-text"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all hover:scale-[1.01] mt-1"
            >
              <span>{loading ? "Authenticating Node..." : "Sign In to Workstation"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Account Creation Link */}
          <div className="text-center text-xs text-cyber-muted">
            Don&apos;t have an account yet?{" "}
            <Link href="/signup" className="text-cyber-emerald hover:underline font-semibold">
              Create an Account
            </Link>
          </div>

          {/* Separator */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-cyber-border/80"></div>
            <span className="flex-shrink mx-3 text-[10px] font-mono text-cyber-muted uppercase tracking-wider">
              Or Explore Without An Account
            </span>
            <div className="flex-grow border-t border-cyber-border/80"></div>
          </div>

          {/* Guest Mode Action Button */}
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-3 rounded-xl bg-cyber-surface hover:bg-cyber-card border border-cyber-emerald/40 hover:border-cyber-emerald text-cyber-emerald hover:text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <Terminal className="w-4 h-4 text-cyber-emerald group-hover:scale-110 transition-transform" />
            <span>Continue as Guest</span>
          </button>

          <p className="text-[11px] text-cyber-muted/80 text-center leading-relaxed">
            Full access to learning tracks, missions, and simulated terminal sandboxes. Progress persists locally in this browser.
          </p>
        </div>
      </div>
    </div>
  );
}
