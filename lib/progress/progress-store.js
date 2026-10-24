/**
 * CYBERLAB Progress Store & LocalStorage Persistence
 * Versioned, SSR-safe, client-side persistence for mission progress, stats, and achievements.
 */

const STORAGE_KEY = "CYBERLAB_STATE_V1";

export const ACHIEVEMENTS = [
  {
    id: "first_command",
    title: "First Contact",
    description: "Executed your first valid simulated command in the CYBERLAB terminal.",
    icon: "Terminal",
  },
  {
    id: "target_acquired",
    title: "Target Acquired",
    description: "Completed Mission 01: Understood target notation and RFC 5737 scope.",
    icon: "Crosshair",
  },
  {
    id: "host_detective",
    title: "Host Detective",
    description: "Completed Mission 02: Discovered live hosts across a /28 subnet with -sn.",
    icon: "Network",
  },
  {
    id: "port_analyst",
    title: "Port Analyst",
    description: "Completed Mission 03: Mastered Open, Closed, and Filtered port interpretation.",
    icon: "ShieldAlert",
  },
  {
    id: "hint_independent",
    title: "Autonomous Hacker",
    description: "Completed a mission successfully without revealing any hints.",
    icon: "Zap",
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
      timestamp: new Date().toISOString(),
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
export function getSavedProgress() {
  if (typeof window === "undefined") {
    return INITIAL_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
export function saveProgress(newState) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    notifySubscribers(newState);
  } catch (err) {
    console.warn("CYBERLAB: Failed to write to localStorage:", err);
  }
}

/**
 * Record a command attempt for a mission
 */
export function recordCommandAttempt(missionId, isSuccess, rawCommand) {
  const current = getSavedProgress();
  const attempts = { ...current.attempts };
  const missionAttempts = attempts[missionId] || { successful: 0, failed: 0 };

  if (isSuccess) {
    missionAttempts.successful += 1;
  } else {
    missionAttempts.failed += 1;
  }
  attempts[missionId] = missionAttempts;

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

  saveProgress(updated);
  return updated;
}

/**
 * Record progressive hint level reveal
 */
export function recordHintReveal(missionId, level) {
  const current = getSavedProgress();
  const currentRevealed = current.hintsRevealed?.[missionId] || 0;
  if (level > currentRevealed) {
    const hintsRevealed = {
      ...current.hintsRevealed,
      [missionId]: level,
    };
    const updated = { ...current, hintsRevealed };
    saveProgress(updated);
    return updated;
  }
  return current;
}

/**
 * Pass a mission checkpoint and mark completed if both command and checkpoint are met
 */
export function completeCheckpoint(missionId) {
  const current = getSavedProgress();
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

  saveProgress(updated);
  return updated;
}

/**
 * Reset all progress back to initial default
 */
export function resetAllProgress() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Storage reset failed:", e);
    }
  }
  const cleanState = {
    ...INITIAL_STATE,
    activityFeed: [
      {
        id: "act-reset-" + Date.now(),
        type: "system",
        title: "Progress Reset",
        detail: "All missions and achievements reset to initial state.",
        timestamp: new Date().toISOString(),
      },
    ],
  };
  saveProgress(cleanState);
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
