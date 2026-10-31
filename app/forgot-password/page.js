"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  KeyRound,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import {
  isRateLimitError,
  formatPasswordResetError,
} from "@/lib/auth/auth-errors";

export default function ForgotPasswordPage() {
  const { resetPassword, isConfigured, configError } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || cooldown > 0) return;

    setErrorMsg("");
    setIsRateLimited(false);

    if (!isConfigured) {
      setErrorMsg(
        configError ||
        "Supabase credentials are not configured. Password recovery requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local."
      );
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(trimmedEmail);
      setSubmitted(true);
      // Disable reset button temporarily after submission to prevent duplicate clicks
      setCooldown(60);
    } catch (err) {
      const isRate = isRateLimitError(err);
      const friendlyMessage = formatPasswordResetError(err);
      setIsRateLimited(isRate);
      setErrorMsg(friendlyMessage);
      // Disable the reset button temporarily after submission to prevent repeated clicks
      setCooldown(isRate ? 60 : 15);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col justify-center items-center p-4 selection:bg-cyber-emerald selection:text-black">
      <div className="max-w-md w-full mb-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-cyber-muted hover:text-cyber-text transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Sign In</span>
        </Link>
      </div>

      <div className="bg-cyber-card border border-cyber-border rounded-2xl max-w-md w-full p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-cyber-emerald/10 border border-cyber-emerald/30 flex items-center justify-center text-cyber-emerald mx-auto shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-cyber-text tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-cyber-muted">
            Enter your email and we will send you a recovery link
          </p>
        </div>

        {!isConfigured && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200/90 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Supabase Authentication Not Configured</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-200/80">
              {configError || "Password recovery requires active Supabase credentials."}
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 border border-amber-500/20 text-[11px] font-mono space-y-1">
              <span className="text-amber-300 font-semibold block text-[10px] uppercase tracking-wider">
                Expected Environment Variables in .env.local:
              </span>
              <div className="text-cyber-text text-[10px] space-y-0.5">
                <div>• <code className="text-emerald-400">NEXT_PUBLIC_SUPABASE_URL</code></div>
                <div>• <code className="text-emerald-400">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (or <code className="text-emerald-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)</div>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
              isRateLimited
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "bg-red-950/30 border-red-500/40 text-red-200"
            }`}
          >
            {isRateLimited ? (
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              {isRateLimited && (
                <span className="font-semibold text-amber-300 block text-[11px] font-mono uppercase tracking-wider">
                  Request Rate Limit
                </span>
              )}
              <p className="leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs text-emerald-200 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 font-bold text-cyber-emerald">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password Recovery Email Sent</span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              If an account exists for <strong className="text-white font-mono">{email}</strong>, you will receive a secure password reset link shortly.
            </p>
            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="w-full block text-center py-2.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black font-bold text-xs shadow-lg shadow-emerald-950/40 transition-colors"
              >
                Return to Sign In
              </Link>
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={() => {
                  setSubmitted(false);
                  setErrorMsg("");
                }}
                className="w-full text-center py-1.5 text-[11px] text-cyber-muted hover:text-cyber-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cooldown > 0
                  ? `Resend link available in ${cooldown}s`
                  : "Didn't receive the email? Try again"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-cyber-muted font-medium block">Account Email</label>
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

            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full py-2.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : cooldown > 0 ? (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {isRateLimited
                      ? `Rate limited — wait ${cooldown}s`
                      : `Please wait ${cooldown}s before retrying`}
                  </span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
