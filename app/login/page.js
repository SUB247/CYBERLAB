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
  ChevronLeft,
  Info,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    loading: authLoading,
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

  if (authLoading || user) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-cyber-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-cyber-muted">
            Checking session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col justify-center items-center p-4 selection:bg-cyber-emerald selection:text-black">
      {/* Return home link */}
      <div className="max-w-md w-full mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-cyber-muted hover:text-cyber-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to CYBERLAB Welcome Page</span>
        </Link>
      </div>

      <div className="bg-cyber-card border border-cyber-border rounded-2xl max-w-md w-full p-6 lg:p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-cyber-text tracking-tight">
            Sign in to <span className="text-cyber-emerald">CYBERLAB</span>
          </h1>
          <p className="text-xs text-cyber-muted">
            Access your synchronized missions, certifications, and lab progress
          </p>
        </div>

        {/* Supabase Notice if not configured */}
        {!isConfigured && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Info className="w-4 h-4 shrink-0" />
              <span>Supabase Authentication Not Configured</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/80">
              {configError || "Missing required Supabase credentials in environment configuration."}
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
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
                className="text-[11px] text-cyber-emerald hover:underline"
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
            className="w-full py-2.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover disabled:opacity-50 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all mt-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Dashboard"}</span>
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
          <Terminal className="w-3.5 h-3.5" />
          <span>Continue as Guest</span>
        </button>

        {/* Footer */}
        <div className="pt-2 border-t border-cyber-border/60 text-center text-xs text-cyber-muted">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="text-cyber-emerald hover:underline font-semibold">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
