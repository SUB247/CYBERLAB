/**
 * CYBERLAB Progress Store & Hybrid Persistence Layer
 * Versioned, SSR-safe, client-side persistence with optional Supabase remote synchronization.
 */

import { useState, useEffect } from "react";
import { getSupabaseClient } from "../supabase/client.js";

export const GUEST_STORAGE_KEY = "CYBERLAB_GUEST_PROGRESS_V1";
export const AUTH_STORAGE_KEY_PREFIX = "CYBERLAB_USER_PROGRESS_";
export const LEGACY_STORAGE_KEY = "CYBERLAB_STATE_V1";

let activeUserId = null;

export function setActiveProgressUser(userId) {
  activeUserId = userId || null;
}

export function getActiveProgressUser() {
  return activeUserId;
}

export function resolveStorageKey(userId = activeUserId) {
  if (userId) {
    return `${AUTH_STORAGE_KEY_PREFIX}${userId}`;
  }
  return GUEST_STORAGE_KEY;
}

export const ACHIEVEMENTS = [
  {
    id: "first_command",
    title: "First Contact",
    description: "Executed your first valid simulated command in the CYBERLAB terminal.",
    icon: "Terminal",
    category: "Missions",
  },
  {
    id: "target_acquired",
    title: "Target Acquired",
    description: "Completed Mission 01: Understood target notation and RFC 5737 scope.",
    icon: "Crosshair",
    category: "Missions",
  },
  {
    id: "host_detective",
    title: "Host Detective",
    description: "Completed Mission 02: Discovered live hosts across a /28 subnet with -sn.",
    icon: "Network",
    category: "Missions",
  },
  {
    id: "port_analyst",
    title: "Port Analyst",
    description: "Completed Mission 03: Mastered Open, Closed, and Filtered port interpretation.",
    icon: "ShieldAlert",
    category: "Missions",
  },
  {
    id: "hint_independent",
    title: "Autonomous Hacker",
    description: "Completed a mission successfully without revealing any hints.",
    icon: "Zap",
    category: "Excellence",
  },
  {
    id: "fast_learner",
    title: "Speed Recon",
    description: "Completed a mission in under 5 minutes.",
    icon: "Clock",
    category: "Excellence",
  },
];

export const INITIAL_STATE = {
  version: 1,
  activeMissionId: "mission-01",
  completedMissions: [],
  checkpointsPassed: {},
  commandsRun: 0,
  attempts: {
    "mission-01": { successful: 0, failed: 0 },
    "mission-02": { successful: 0, failed: 0 },
    "mission-03": { successful: 0, failed: 0 },
  },
  hintsRevealed: {
    "mission-01": 0,
    "mission-02": 0,
    "mission-03": 0,
  },
  unlockedAchievements: [],
  activityFeed: [
    {
      id: "init-welcome",
      type: "system",
      title: "Welcome to CYBERLAB Workspace",
      detail: "Initialized educational sandbox node.",
      timestamp: "2026-01-01T00:00:00.000Z",
    },
  ],
};

// Event listener subscribers for state updates
const subscribers = new Set();

export function subscribeToProgress(callback) {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

/**
 * React hook for consuming progress safely without hydration mismatches.
 * Initializes with deterministic INITIAL_STATE during SSR and initial client hydration,
 * then hydrates from localStorage / subscription upon client mount.
 */
export function useUserProgress(explicitUserId = null) {
  const [progressState, setProgressState] = useState(INITIAL_STATE);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetUserId = explicitUserId !== null ? explicitUserId : activeUserId;
    setProgressState(getSavedProgress(targetUserId));
    const unsub = subscribeToProgress((updated) => {
      setProgressState(updated);
    });
    return () => unsub();
  }, [explicitUserId]);

  return { progressState, setProgressState, isMounted };
}

function notifySubscribers(state) {
  subscribers.forEach((cb) => {
    try {
      cb(state);
    } catch (e) {
      console.error("Progress listener error:", e);
    }
  });
}

/**
 * Safely loads state from localStorage
 */
export function getSavedProgress(userId = activeUserId) {
  if (typeof window === "undefined") {
    return INITIAL_STATE;
  }

  const primaryKey = resolveStorageKey(userId);

  try {
    const storage = window.localStorage;
    let raw = storage ? storage.getItem(primaryKey) : null;
    // If no progress found under the primary key and it's guest mode, check legacy key
    if (!raw && !userId && storage) {
      raw = storage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) {
      return {
        ...INITIAL_STATE,
        ...parsed,
        attempts: { ...INITIAL_STATE.attempts, ...parsed.attempts },
        hintsRevealed: { ...INITIAL_STATE.hintsRevealed, ...parsed.hintsRevealed },
      };
    }
    return INITIAL_STATE;
  } catch (err) {
    console.warn("CYBERLAB: Failed to read from localStorage:", err);
    return INITIAL_STATE;
  }
}

/**
 * Safely writes state to localStorage and alerts listeners
 */
export function saveProgress(newState, userId = activeUserId) {
  if (typeof window === "undefined") return;

  const key = resolveStorageKey(userId);

  try {
    if (window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(newState));
    }
    notifySubscribers(newState);
  } catch (err) {
    console.warn("CYBERLAB: Failed to write to localStorage:", err);
  }
}

/**
 * Record a command attempt for a mission
 */
export function recordCommandAttempt(missionId, isSuccess, rawCommand, userId = null) {
  const targetUserId = userId || activeUserId;
  const current = getSavedProgress(targetUserId);
  const attempts = { ...current.attempts };
  const missionAttempts = attempts[missionId] || { successful: 0, failed: 0 };

  if (isSuccess) {
    missionAttempts.successful += 1;
  } else {
    missionAttempts.failed += 1;
  }
  if (missionId) {
    attempts[missionId] = missionAttempts;
  }

  const unlocked = [...current.unlockedAchievements];
  // Check for 'first_command' achievement
  if (isSuccess && !unlocked.includes("first_command")) {
    unlocked.push("first_command");
  }

  const newFeed = [
    {
      id: "act-" + Date.now(),
      type: isSuccess ? "command_success" : "command_fail",
      title: isSuccess ? `Command Succeeded: ${rawCommand}` : `Command Error: ${rawCommand}`,
      detail: missionId ? `Mission ${missionId.replace("mission-", "")}` : "Practice Lab",
      timestamp: new Date().toISOString(),
    },
    ...current.activityFeed.slice(0, 19),
  ];

  const updated = {
    ...current,
    commandsRun: (current.commandsRun || 0) + 1,
    attempts,
    unlockedAchievements: unlocked,
    activityFeed: newFeed,
  };

  saveProgress(updated, targetUserId);

  // Sync to Supabase ONLY if user is authenticated (userId is provided)
  const supabase = getSupabaseClient();
  if (userId && supabase) {
    supabase
      .from("learning_activity")
      .insert({
        user_id: userId,
        activity_type: isSuccess ? "command_success" : "command_fail",
        lesson_id: missionId,
        metadata: { rawCommand },
      })
      .then(
        () => {},
        (err) => console.warn("Supabase learning_activity sync notice:", err?.message || err)
      );
  }

  return updated;
}

/**
 * Record progressive hint level reveal
 */
export function recordHintReveal(missionId, level, userId = null) {
  const targetUserId = userId || activeUserId;
  const current = getSavedProgress(targetUserId);
  const currentRevealed = current.hintsRevealed?.[missionId] || 0;
  if (level > currentRevealed) {
    const hintsRevealed = {
      ...current.hintsRevealed,
      [missionId]: level,
    };
    const updated = { ...current, hintsRevealed };
    saveProgress(updated, targetUserId);
    return updated;
  }
  return current;
}

/**
 * Pass a mission checkpoint and mark completed if both command and checkpoint are met
 */
export function completeCheckpoint(missionId, userId = null) {
  const targetUserId = userId || activeUserId;
  const current = getSavedProgress(targetUserId);
  const checkpointsPassed = {
    ...current.checkpointsPassed,
    [missionId]: true,
  };

  const completedMissions = current.completedMissions.includes(missionId)
    ? current.completedMissions
    : [...current.completedMissions, missionId];

  const unlocked = [...current.unlockedAchievements];

  // Specific achievements
  if (missionId === "mission-01" && !unlocked.includes("target_acquired")) {
    unlocked.push("target_acquired");
  }
  if (missionId === "mission-02" && !unlocked.includes("host_detective")) {
    unlocked.push("host_detective");
  }
  if (missionId === "mission-03" && !unlocked.includes("port_analyst")) {
    unlocked.push("port_analyst");
  }

  // Check if completed with 0 hints
  const hintsUsedOnMission = current.hintsRevealed?.[missionId] || 0;
  if (hintsUsedOnMission === 0 && !unlocked.includes("hint_independent")) {
    unlocked.push("hint_independent");
  }

  const newFeed = [
    {
      id: "act-" + Date.now(),
      type: "mission_complete",
      title: `Mission Completed: ${missionId.toUpperCase()}`,
      detail: `Knowledge checkpoint verified and scored.`,
      timestamp: new Date().toISOString(),
    },
    ...current.activityFeed.slice(0, 19),
  ];

  const updated = {
    ...current,
    checkpointsPassed,
    completedMissions,
    unlockedAchievements: unlocked,
    activityFeed: newFeed,
  };

  saveProgress(updated, targetUserId);

  // Sync to Supabase ONLY if user is authenticated (userId is provided)
  const supabase = getSupabaseClient();
  if (userId && supabase) {
    // Upsert user_progress
    supabase
      .from("user_progress")
      .upsert({
        user_id: userId,
        lesson_id: missionId,
        status: "completed",
        hints_used: hintsUsedOnMission,
        completed_at: new Date().toISOString(),
      })
      .then(
        () => {},
        (err) => console.warn("Supabase user_progress sync notice:", err?.message || err)
      );

    // Record activity
    supabase
      .from("learning_activity")
      .insert({
        user_id: userId,
        activity_type: "mission_complete",
        lesson_id: missionId,
      })
      .then(
        () => {},
        (err) => console.warn("Supabase learning_activity sync notice:", err?.message || err)
      );

    // Sync achievements
    unlocked.forEach((achId) => {
      supabase
        .from("user_achievements")
        .upsert({
          user_id: userId,
          achievement_id: achId,
          unlocked_at: new Date().toISOString(),
        })
        .then(
          () => {},
          (err) => console.warn("Supabase user_achievements sync notice:", err?.message || err)
        );
    });
  }

  return updated;
}

/**
 * Merge local progress into remote user account on authentication
 */
export async function syncProgressWithRemote(userId) {
  const supabase = getSupabaseClient();
  if (!userId || !supabase) return getSavedProgress(null);

  try {
    // Strictly load authenticated user's store (never guest store)
    const local = getSavedProgress(userId);

    // 1. Fetch remote user progress
    const { data: remoteProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId);

    // 2. Fetch remote achievements
    const { data: remoteAchievements } = await supabase
      .from("user_achievements")
      .select("*")
      .eq("user_id", userId);

    // Combine completed missions
    const remoteCompleted = (remoteProgress || [])
      .filter((p) => p.status === "completed")
      .map((p) => p.lesson_id);

    const mergedCompleted = Array.from(new Set([...local.completedMissions, ...remoteCompleted]));

    // Combine achievements
    const remoteAchIds = (remoteAchievements || []).map((a) => a.achievement_id);
    const mergedAchievements = Array.from(new Set([...local.unlockedAchievements, ...remoteAchIds]));

    const checkpointsPassed = { ...local.checkpointsPassed };
    mergedCompleted.forEach((mId) => {
      checkpointsPassed[mId] = true;
    });

    const merged = {
      ...local,
      completedMissions: mergedCompleted,
      checkpointsPassed,
      unlockedAchievements: mergedAchievements,
    };

    saveProgress(merged, userId);

    // Push any local completions not yet on server
    for (const mId of local.completedMissions) {
      if (!remoteCompleted.includes(mId)) {
        await supabase.from("user_progress").upsert({
          user_id: userId,
          lesson_id: mId,
          status: "completed",
          completed_at: new Date().toISOString(),
        });
      }
    }

    for (const achId of local.unlockedAchievements) {
      if (!remoteAchIds.includes(achId)) {
        await supabase.from("user_achievements").upsert({
          user_id: userId,
          achievement_id: achId,
          unlocked_at: new Date().toISOString(),
        });
      }
    }

    return merged;
  } catch (err) {
    console.warn("Failed to sync progress with remote:", err);
    return getSavedProgress(userId);
  }
}

/**
 * Reset all progress back to initial default
 */
export function resetAllProgress(userId = null) {
  const targetUserId = userId || activeUserId;
  if (typeof window !== "undefined") {
    try {
      const key = resolveStorageKey(targetUserId);
      if (window.localStorage) {
        window.localStorage.removeItem(key);
        if (!targetUserId) {
          window.localStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.warn("Storage reset failed:", e);
    }
  }

  const cleanState = {
    ...INITIAL_STATE,
    activityFeed: [
      {
        id: "init-welcome",
        type: "system",
        title: "Workspace Reset",
        detail: "All missions and achievements reset to initial state.",
        timestamp: "2026-01-01T00:00:00.000Z",
      },
    ],
  };

  saveProgress(cleanState, targetUserId);

  // If authenticated, clean remote progress as well
  const supabase = getSupabaseClient();
  if (targetUserId && supabase) {
    supabase
      .from("user_progress")
      .delete()
      .eq("user_id", targetUserId)
      .then(
        () => {},
        (err) => console.warn("Supabase user_progress reset notice:", err?.message || err)
      );
    supabase
      .from("user_achievements")
      .delete()
      .eq("user_id", targetUserId)
      .then(
        () => {},
        (err) => console.warn("Supabase user_achievements reset notice:", err?.message || err)
      );
  }

  return cleanState;
}

/**
 * Compute summary statistics from state
 */
export function computeProgressStats(state) {
  const totalMissions = 3;
  const completedCount = state.completedMissions ? state.completedMissions.length : 0;
  const percentage = Math.round((completedCount / totalMissions) * 100);

  const totalHintsUsed = Object.values(state.hintsRevealed || {}).reduce(
    (acc, val) => acc + (val || 0),
    0
  );

  const totalAttempts = Object.values(state.attempts || {}).reduce(
    (acc, item) => acc + (item.successful || 0) + (item.failed || 0),
    0
  );

  const skills = [];
  if (state.completedMissions?.includes("mission-01")) {
    skills.push("Target IP Syntax", "RFC 5737 Boundaries", "Single-Host Scans");
  }
  if (state.completedMissions?.includes("mission-02")) {
    skills.push("Subnet Scanning (CIDR)", "-sn Host Discovery", "Latency Analysis");
  }
  if (state.completedMissions?.includes("mission-03")) {
    skills.push("Open/Closed/Filtered States", "TCP Handshake Probes", "Vulnerability Boundaries");
  }

  return {
    totalMissions,
    completedCount,
    percentage,
    totalHintsUsed,
    totalAttempts,
    unlockedAchievementsCount: state.unlockedAchievements?.length || 0,
    skills,
  };
}
