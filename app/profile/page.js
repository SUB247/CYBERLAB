"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Settings,
  Award,
  CheckCircle2,
  Clock,
  Shield,
  Edit3,
  Save,
  X,
  Lock,
  Globe,
  Activity,
  Terminal,
  BarChart3,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import AccountRequiredGuard from "@/components/auth/AccountRequiredGuard";
import { useAuth } from "@/lib/auth/auth-context";
import {
  useUserProgress,
  computeProgressStats,
  ACHIEVEMENTS,
} from "@/lib/progress/progress-store";
import ProgressBar from "@/components/shared/ProgressBar";

export default function ProfilePage() {
  const { user, profile, updateProfile, isConfigured } = useAuth();
  const { progressState, isMounted } = useUserProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editVisibility, setEditVisibility] = useState("private");
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (profile) {
      setEditDisplayName(profile.display_name || "");
      setEditUsername(profile.username || "");
      setEditBio(profile.bio || "");
      setEditVisibility(profile.profile_visibility || "private");
    }
  }, [profile]);

  const stats = computeProgressStats(progressState);
  const completedMissions = progressState.completedMissions || [];
  const unlockedAchSet = new Set(progressState.unlockedAchievements || []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage("");

    try {
      await updateProfile({
        display_name: editDisplayName.trim() || "Learner",
        username: editUsername.trim().toLowerCase() || "learner",
        bio: editBio.trim(),
        profile_visibility: editVisibility,
      });
      setIsEditing(false);
      setMessage("Profile updated successfully.");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`Error saving profile: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CL";

  if (!user) {
    return (
      <AppShell>
        <AccountRequiredGuard featureName="Learner Profile & Identification" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Profile Header Card */}
        <div className="p-6 lg:p-8 rounded-2xl bg-cyber-card border border-cyber-border space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-cyber-emerald/20 border border-cyber-emerald/40 flex items-center justify-center text-xl font-bold font-mono text-cyber-emerald">
                {initials}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-cyber-text">
                    {profile?.display_name || "Guest Learner"}
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-muted">
                    @{profile?.username || "learner"}
                  </span>
                </div>

                <p className="text-xs text-cyber-muted max-w-md">
                  {profile?.bio || "Cybersecurity student practicing network scanning and reconnaissance."}
                </p>

                <div className="flex items-center gap-3 pt-1 text-[11px] font-mono text-cyber-muted">
                  <span className="flex items-center gap-1">
                    {profile?.profile_visibility === "public" ? (
                      <>
                        <Globe className="w-3 h-3 text-cyber-emerald" /> Public Profile
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3 text-cyber-muted" /> Private Profile
                      </>
                    )}
                  </span>
                  <span>•</span>
                  <span>{user ? `Account: ${user.email}` : "Local Profile"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-3.5 py-1.5 rounded-lg bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-xs font-semibold text-cyber-text transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-cyber-emerald" />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>

              <Link
                href="/settings"
                className="p-2 rounded-lg bg-cyber-surface hover:bg-cyber-card border border-cyber-border text-cyber-muted hover:text-cyber-text transition-colors"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {message && (
            <div className="p-3 rounded-lg bg-cyber-emerald/10 border border-cyber-emerald/30 text-xs text-emerald-200">
              {message}
            </div>
          )}

          {/* Edit Profile Form */}
          {isEditing && (
            <form
              onSubmit={handleSaveProfile}
              className="p-5 rounded-xl bg-cyber-surface border border-cyber-border space-y-4 animate-in fade-in"
            >
              <h2 className="text-xs font-bold text-cyber-text uppercase tracking-wider">
                Edit Profile Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-cyber-muted font-medium">Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    required
                    className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-cyber-muted font-medium">Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                    className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-cyber-muted font-medium">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg p-3 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                  placeholder="Tell other learners about your cybersecurity journey..."
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-cyber-muted font-medium">Profile Visibility</label>
                <select
                  value={editVisibility}
                  onChange={(e) => setEditVisibility(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border rounded-lg px-3 py-2 text-cyber-text focus:border-cyber-emerald focus:outline-none"
                >
                  <option value="private">Private (Only you can view your profile)</option>
                  <option value="public">Public (Visible to community members)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 rounded-lg bg-cyber-card border border-cyber-border text-xs text-cyber-muted hover:text-cyber-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-4 py-1.5 rounded-lg bg-cyber-emerald hover:bg-cyber-emeraldHover text-black text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveLoading ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-cyber-border/60">
            <div className="space-y-0.5">
              <span className="text-[10px] text-cyber-muted font-mono uppercase">Mastery</span>
              <div className="text-lg font-bold font-mono text-cyber-emerald">
                {stats.percentage}%
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-cyber-muted font-mono uppercase">Missions</span>
              <div className="text-lg font-bold font-mono text-cyber-text">
                {stats.completedCount} / 3
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-cyber-muted font-mono uppercase">Commands</span>
              <div className="text-lg font-bold font-mono text-cyber-cyan">
                {progressState.commandsRun || 0}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] text-cyber-muted font-mono uppercase">Badges</span>
              <div className="text-lg font-bold font-mono text-purple-400">
                {stats.unlockedAchievementsCount}
              </div>
            </div>
          </div>
        </div>

        {/* Earned Badges & Recent Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-cyber-text">Earned Badges</h2>
              </div>
              <Link href="/achievements" className="text-xs text-cyber-emerald hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {ACHIEVEMENTS.filter((a) => unlockedAchSet.has(a.id)).length > 0 ? (
                ACHIEVEMENTS.filter((a) => unlockedAchSet.has(a.id)).map((ach) => (
                  <div
                    key={ach.id}
                    className="p-3 rounded-lg bg-cyber-surface border border-purple-500/30 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-cyber-text block">{ach.title}</span>
                      <span className="text-[11px] text-cyber-muted">{ach.description}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-200">
                      Earned
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-cyber-muted">
                  No badges earned yet. Execute commands and complete missions to unlock badges!
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-cyber-text">Recent Lab Activity</h2>
              </div>
              <Link href="/progress" className="text-xs text-cyber-emerald hover:underline">
                Audit Log
              </Link>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto">
              {progressState?.activityFeed?.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg bg-cyber-surface border border-cyber-border flex items-center justify-between text-xs font-mono"
                >
                  <div className="truncate pr-2">
                    <span className="text-cyber-text font-semibold block truncate">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-cyber-muted">{act.detail}</span>
                  </div>
                  <span className="text-[10px] text-cyber-muted/60 shrink-0">
                    {isMounted ? new Date(act.timestamp).toLocaleTimeString() : "--:--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
