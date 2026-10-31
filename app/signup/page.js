"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading, signUp, continueAsGuest, isConfigured, configError } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [authLoading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!isConfigured) {
      setErrorMsg(
        configError ||
        "Supabase credentials are not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in your .env.local file."
      );
      return;
    }

    if (!email || !password || !displayName) {
      setErrorMsg("Please complete all required fields.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await signUp({
        email,
        password,
        displayName: displayName.trim(),
        username: username.trim().toLowerCase() || email.split("@")[0],
      });

      if (res?.session) {
        setSuccessMsg("Account created! Entering CYBERLAB dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } else {
        setSuccessMsg("Account created! Please check your email to verify your registration, or sign in now.");
        setTimeout(() => {
          router.push("/login");
        }, 2500);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col justify-center items-center p-4 selection:bg-cyber-emerald selection:text-black">
      <div className="max-w-md w-full mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-cyber-muted hover:text-cyber-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to CYBERLAB Workspace</span>
        </Link>
      </div>

      <div className="bg-cyber-card border border-cyber-border rounded-2xl max-w-md w-full p-6 lg:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-cyber-text tracking-tight">
            Create your <span className="text-cyber-emerald">CYBERLAB</span> Account
          </h1>
          <p className="text-xs text-cyber-muted">
            Track your progress across devices and earn verified certifications
          </p>
        </div>

        {!isConfigured && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Info className="w-4 h-4 shrink-0" />
              <span>Supabase Authentication Not Configured</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/80">
              {configError || "Missing required Supabase credentials in environment configuration."}
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-[11px] font-mono space-y-1">
              <span className="text-amber-300 font-semibold block text-[10px] uppercase tracking-wider">
                Expected Environment Variables in .env.local:
              </span>
              <div className="text-cyber-text text-[10px] space-y-0.5">
                <div>• <code className="text-emerald-400">NEXT_PUBLIC_SUPABASE_URL</code> (e.g. https://xyz.supabase.co)</div>
                <div>• <code className="text-emerald-400">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (or <code className="text-emerald-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)</div>
              </div>
            </div>
            <p className="text-[10px] text-amber-200/70">
              Account registration requires active Supabase credentials. You can still practice anonymously in local mode.
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-cyber-muted font-medium block">Display Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-cyber-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="Alex Morgan"
                className="w-full bg-cyber-bg border border-cyber-border rounded-lg pl-9 pr-3 py-2 text-cyber-text placeholder:text-cyber-muted/50 focus:border-cyber-emerald focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-cyber-muted font-medium block">Username (Optional)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="alex_sec"
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text placeholder:text-cyber-muted/50 focus:border-cyber-emerald focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-cyber-muted font-medium block">Email Address *</label>
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

          <div className="space-y-1">
            <label className="text-cyber-muted font-medium block">Password (min 8 characters) *</label>
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
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-cyber-muted font-medium block">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text placeholder:text-cyber-muted/50 focus:border-cyber-emerald focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all mt-4"
          >
            <span>{loading ? "Creating Profile..." : "Create Account"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Guest Mode Action */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-cyber-border/80"></div>
          <span className="flex-shrink mx-3 text-[10px] font-mono text-cyber-muted uppercase tracking-wider">
            Or
          </span>
          <div className="flex-grow border-t border-cyber-border/80"></div>
        </div>

        <button
          type="button"
          onClick={handleContinueAsGuest}
          className="w-full py-2.5 rounded-xl bg-cyber-surface hover:bg-cyber-card border border-cyber-emerald/40 hover:border-cyber-emerald text-cyber-emerald font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
        >
          <span>Explore in Guest Mode</span>
        </button>

        <div className="pt-2 border-t border-cyber-border/60 text-center text-xs text-cyber-muted">
          Already registered?{" "}
          <Link href="/login" className="text-cyber-emerald hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
