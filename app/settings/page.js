"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  Shield,
  RotateCcw,
  Lock,
  Globe,
  KeyRound,
  LogOut,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertCircle,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import AccountRequiredGuard from "@/components/auth/AccountRequiredGuard";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useAuth } from "@/lib/auth/auth-context";
import { resetAllProgress } from "@/lib/progress/progress-store";
import {
  isRateLimitError,
  formatPasswordResetError,
} from "@/lib/auth/auth-errors";

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, updateProfile, signOut, resetPassword, isConfigured, configDetails } = useAuth();
  const [activeTab, setActiveTab] = useState("account"); // "account" | "profile" | "learning" | "privacy"
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);
  const [resetFeedback, setResetFeedback] = useState(null); // { type: 'success' | 'rate-limit' | 'error', message: string }

  // Password reset cooldown countdown
  useEffect(() => {
    if (resetCooldown <= 0) return;
    const timer = setInterval(() => {
      setResetCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resetCooldown]);

  // Edit states
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [visibility, setVisibility] = useState(profile?.profile_visibility || "private");
  const [difficulty, setDifficulty] = useState("beginner");

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        display_name: displayName.trim(),
        username: username.trim().toLowerCase(),
        bio: bio.trim(),
        profile_visibility: visibility,
      });
      setFeedback("Settings updated successfully.");
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setFeedback(`Error: ${err.message}`);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email || resetLoading || resetCooldown > 0) {
      if (!user?.email) {
        setResetFeedback({
          type: "error",
          message: "Password reset requires an authenticated account.",
        });
      }
      return;
    }

    setResetLoading(true);
    setResetFeedback(null);

    try {
      await resetPassword(user.email);
      setResetFeedback({
        type: "success",
        message: "Password reset email sent. Please check your inbox and spam folder.",
      });
      // Disable the reset button temporarily after submission to prevent repeated clicks
      setResetCooldown(60);
    } catch (err) {
      const isRate = isRateLimitError(err);
      const friendlyMessage = formatPasswordResetError(err);
      setResetFeedback({
        type: isRate ? "rate-limit" : "error",
        message: friendlyMessage,
      });
      // Disable the reset button temporarily after submission
      setResetCooldown(isRate ? 60 : 15);
    } finally {
      setResetLoading(false);
    }
  };

  const handleConfirmResetProgress = () => {
    resetAllProgress(user?.id);
    setIsResetDialogOpen(false);
    setFeedback("All lab progress, metrics, and achievements have been reset.");
    setTimeout(() => setFeedback(""), 3500);
  };

  if (!user) {
    return (
      <AppShell>
        <AccountRequiredGuard featureName="Account Security & Cloud Preferences" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <Settings className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Configuration
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight">
            Account & Application Settings
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed">
            Manage your credentials, profile details, training preferences, and local data persistence.
          </p>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-cyber-emerald/10 border border-cyber-emerald/30 text-xs text-emerald-200">
            {feedback}
          </div>
        )}

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-cyber-border pb-1 overflow-x-auto text-xs">
          {[
            { id: "account", label: "Account" },
            { id: "profile", label: "Profile" },
            { id: "learning", label: "Learning & Labs" },
            { id: "privacy", label: "Privacy & Data" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab.id
                  ? "bg-cyber-card text-cyber-emerald border border-cyber-border shadow-sm"
                  : "text-cyber-muted hover:text-cyber-text hover:bg-cyber-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Account */}
        {activeTab === "account" && (
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-6">
            <h2 className="text-sm font-bold text-cyber-text uppercase tracking-wider">
              Account Credentials
            </h2>

            <div className="space-y-4 max-w-md text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-cyber-muted font-medium block">Email Address</label>
                  {isConfigured ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                      <CheckCircle2 className="w-3 h-3 text-cyber-emerald" />
                      <span>Supabase Sync Active</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span>Local Storage Mode</span>
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={user?.email || "guest@cyberlab.internal (Local Mode)"}
                  disabled
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-muted cursor-not-allowed font-mono"
                />
              </div>

              {user ? (
                <div className="pt-2 space-y-3">
                  <div className="p-3.5 rounded-xl bg-cyber-surface border border-cyber-border flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-cyber-text block">Password Reset</span>
                      <span className="text-[11px] text-cyber-muted">
                        Send a password recovery email to your registered address
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={resetLoading || resetCooldown > 0}
                      className="px-3.5 py-1.5 rounded-lg bg-cyber-card hover:bg-cyber-bg border border-cyber-border text-xs text-cyber-text disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      {resetLoading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-cyber-emerald border-t-transparent rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : resetCooldown > 0 ? (
                        <>
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Wait {resetCooldown}s</span>
                        </>
                      ) : (
                        <span>Reset Password</span>
                      )}
                    </button>
                  </div>

                  {resetFeedback && (
                    <div
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2 animate-in fade-in ${
                        resetFeedback.type === "rate-limit"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                          : resetFeedback.type === "success"
                          ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                          : "bg-red-950/30 border-red-500/40 text-red-200"
                      }`}
                    >
                      {resetFeedback.type === "rate-limit" ? (
                        <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : resetFeedback.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5">
                        {resetFeedback.type === "rate-limit" && (
                          <span className="font-semibold text-amber-300 block text-[10px] font-mono uppercase tracking-wider">
                            Rate Limit Active
                          </span>
                        )}
                        <p className="leading-relaxed">{resetFeedback.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-red-300 block">Sign Out</span>
                      <span className="text-[11px] text-red-200/70">
                        Disconnect current session from this browser
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut();
                        router.push("/");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-2">
                  <span className="font-semibold text-cyber-text block">
                    You are in Guest Mode
                  </span>
                  <p className="text-xs text-cyber-muted">
                    Sign in to sync your mission progress and earned badges across devices.
                  </p>
                  <Link
                    href="/login"
                    className="inline-block mt-1 px-4 py-2 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black font-bold text-xs"
                  >
                    Sign In or Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === "profile" && (
          <form
            onSubmit={handleSaveProfile}
            className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-5"
          >
            <h2 className="text-sm font-bold text-cyber-text uppercase tracking-wider">
              Profile Customization
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-cyber-muted font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-cyber-muted font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-cyber-muted font-medium">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-cyber-bg border border-cyber-border rounded-lg p-3 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                placeholder="Share your goals or technical interests..."
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {/* Tab 3: Learning & Labs */}
        {activeTab === "learning" && (
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-6">
            <h2 className="text-sm font-bold text-cyber-text uppercase tracking-wider">
              Learning Preferences
            </h2>

            <div className="space-y-4 max-w-md text-xs">
              <div className="space-y-1">
                <label className="text-cyber-muted font-medium">Preferred Starting Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                >
                  <option value="beginner">Beginner (Guided instructions & conceptual hints)</option>
                  <option value="intermediate">Intermediate (Direct syntax challenges)</option>
                </select>
              </div>

              {/* Reset Data Section */}
              <div className="pt-4 border-t border-cyber-border space-y-2">
                <span className="font-bold text-red-400 block">Reset Learning Progress</span>
                <p className="text-cyber-muted leading-relaxed">
                  Resetting your progress will clear all completed missions, checkpoint records, hints used, and unlocked achievement badges.
                </p>
                <button
                  type="button"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Lab Progress</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Privacy & Data */}
        {activeTab === "privacy" && (
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-6">
            <h2 className="text-sm font-bold text-cyber-text uppercase tracking-wider">
              Privacy & Data Transparency
            </h2>

            <div className="space-y-4 text-xs text-cyber-muted leading-relaxed">
              <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-1">
                <span className="font-bold text-cyber-text block">1. Profile Visibility</span>
                <p>
                  By default, all learner profiles are <strong>Private</strong>. Only you can view your progress and activity. If you choose Public visibility, community members can view your completed missions and unlocked badges.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-1">
                <span className="font-bold text-cyber-text block">2. What Learning Data is Stored?</span>
                <p>
                  CYBERLAB only records: completed mission IDs, hint revelation counts, attempt counts (successful/error), checkpoint scores, and command history in the simulated terminal.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyber-surface border border-cyber-border space-y-1">
                <span className="font-bold text-cyber-text block">3. Safety Boundary</span>
                <p>
                  CYBERLAB never connects to real external networks or hosts. All targets exist exclusively within RFC 5737 documentation blocks. No personal network traffic or IP information is ever exposed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        <ConfirmDialog
          isOpen={isResetDialogOpen}
          title="Reset All Lab Progress"
          message="Are you sure you want to reset all mission completions, test attempts, hint records, and unlocked achievements? This action cannot be undone."
          confirmText="Yes, Reset Progress"
          cancelText="Cancel"
          isDestructive={true}
          onConfirm={handleConfirmResetProgress}
          onCancel={() => setIsResetDialogOpen(false)}
        />
      </div>
    </AppShell>
  );
}
