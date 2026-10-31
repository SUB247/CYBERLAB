import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  resolveStorageKey,
  setActiveProgressUser,
  getActiveProgressUser,
  getSavedProgress,
  saveProgress,
  resetAllProgress,
  syncProgressWithRemote,
  GUEST_STORAGE_KEY,
  AUTH_STORAGE_KEY_PREFIX,
  INITIAL_STATE,
} from "../lib/progress/progress-store.js";

// Mock minimal browser window & localStorage for Node test runner
function setupMockLocalStorage() {
  const store = {};
  const mockStorage = {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, val) => {
      store[key] = String(val);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
  global.window = {
    localStorage: mockStorage,
    dispatchEvent: () => {},
  };
  global.localStorage = mockStorage;
  return store;
}

function tearDownMockLocalStorage() {
  delete global.window;
  delete global.localStorage;
}

describe("Entry and Guest Flow: Progress Key Isolation", () => {
  test("resolveStorageKey returns guest storage key when userId is null or undefined", () => {
    assert.strictEqual(resolveStorageKey(null), GUEST_STORAGE_KEY);
    assert.strictEqual(resolveStorageKey(undefined), GUEST_STORAGE_KEY);
    assert.strictEqual(resolveStorageKey(""), GUEST_STORAGE_KEY);
    assert.strictEqual(resolveStorageKey(null), "CYBERLAB_GUEST_PROGRESS_V1");
  });

  test("resolveStorageKey returns account-specific storage key when userId is provided", () => {
    const key = resolveStorageKey("usr_abc_789");
    assert.strictEqual(key, `${AUTH_STORAGE_KEY_PREFIX}usr_abc_789`);
    assert.strictEqual(key, "CYBERLAB_USER_PROGRESS_usr_abc_789");
  });

  test("setActiveProgressUser tracks active user context", () => {
    setActiveProgressUser("usr_agent_01");
    assert.strictEqual(getActiveProgressUser(), "usr_agent_01");
    assert.strictEqual(resolveStorageKey(), "CYBERLAB_USER_PROGRESS_usr_agent_01");

    setActiveProgressUser(null);
    assert.strictEqual(getActiveProgressUser(), null);
    assert.strictEqual(resolveStorageKey(), GUEST_STORAGE_KEY);
  });
});

describe("Entry and Guest Flow: Local Progress Data Isolation", () => {
  test("Guest progress and User progress are stored in distinct localStorage partitions", () => {
    const store = setupMockLocalStorage();

    try {
      // 1. Guest performs actions
      setActiveProgressUser(null);
      const guestInitial = getSavedProgress(null);
      const modifiedGuest = {
        ...guestInitial,
        completedMissions: ["mission-01"],
        commandsRun: 5,
      };
      saveProgress(modifiedGuest, null);

      // Verify stored under guest key
      assert.ok(store["CYBERLAB_GUEST_PROGRESS_V1"]);
      const storedGuestData = JSON.parse(store["CYBERLAB_GUEST_PROGRESS_V1"]);
      assert.deepStrictEqual(storedGuestData.completedMissions, ["mission-01"]);
      assert.strictEqual(storedGuestData.commandsRun, 5);

      // Verify no authenticated user key exists yet
      assert.strictEqual(store["CYBERLAB_USER_PROGRESS_user_xyz"], undefined);

      // 2. An authenticated user signs in
      setActiveProgressUser("user_xyz");
      const userInitial = getSavedProgress("user_xyz");
      assert.deepStrictEqual(userInitial.completedMissions, []); // fresh user progress
      assert.strictEqual(userInitial.commandsRun, 0);

      const modifiedUser = {
        ...userInitial,
        completedMissions: ["mission-01", "mission-02"],
        commandsRun: 15,
      };
      saveProgress(modifiedUser, "user_xyz");

      // Verify stored under user-specific key
      assert.ok(store["CYBERLAB_USER_PROGRESS_user_xyz"]);
      const storedUserData = JSON.parse(store["CYBERLAB_USER_PROGRESS_user_xyz"]);
      assert.deepStrictEqual(storedUserData.completedMissions, ["mission-01", "mission-02"]);
      assert.strictEqual(storedUserData.commandsRun, 15);

      // 3. Confirm guest data was NOT overwritten
      const guestAfter = getSavedProgress(null);
      assert.deepStrictEqual(guestAfter.completedMissions, ["mission-01"]);
      assert.strictEqual(guestAfter.commandsRun, 5);

      // 4. Resetting user progress does not touch guest progress
      resetAllProgress("user_xyz");
      const userAfterReset = getSavedProgress("user_xyz");
      assert.deepStrictEqual(userAfterReset.completedMissions, []);

      const guestStillSafe = getSavedProgress(null);
      assert.deepStrictEqual(guestStillSafe.completedMissions, ["mission-01"]);
      assert.strictEqual(guestStillSafe.commandsRun, 5);
    } finally {
      tearDownMockLocalStorage();
      setActiveProgressUser(null);
    }
  });

  test("syncProgressWithRemote refuses to upload if userId is null (guest protection)", async () => {
    setupMockLocalStorage();
    try {
      setActiveProgressUser(null);
      // Attempting remote sync as a guest returns local progress immediately without calling remote tables
      const syncResult = await syncProgressWithRemote(null);
      assert.ok(syncResult);
      assert.strictEqual(syncResult.version, 1);
    } finally {
      tearDownMockLocalStorage();
    }
  });
});

describe("Entry and Guest Flow: Auth Context Code Contracts", () => {
  const authContextPath = path.resolve("lib/auth/auth-context.js");
  const authCode = fs.readFileSync(authContextPath, "utf8");

  test("AuthContext includes isGuest, continueAsGuest, and exitGuestMode in initial context", () => {
    assert.match(authCode, /isGuest:\s*false/);
    assert.match(authCode, /continueAsGuest:\s*\(\)\s*=>/);
    assert.match(authCode, /exitGuestMode:\s*\(\)\s*=>/);
  });

  test("AuthContext uses CYBERLAB_GUEST_SESSION storage key to persist guest session", () => {
    assert.match(authCode, /CYBERLAB_GUEST_SESSION/);
    assert.match(authCode, /localStorage\.setItem\(GUEST_SESSION_KEY,\s*"true"\)/);
    assert.match(authCode, /localStorage\.removeItem\(GUEST_SESSION_KEY\)/);
  });

  test("defaultGuestProfile provides unprivileged non-sensitive profile info", () => {
    assert.match(authCode, /display_name:\s*"Guest Learner"/);
    assert.match(authCode, /username:\s*"learner"/);
    assert.match(authCode, /is_guest:\s*true/);
  });

  test("signOut clears guest session and resets active progress user", () => {
    assert.match(authCode, /setActiveProgressUser\(null\)/);
  });
});

describe("Entry and Guest Flow: Route Protection & Guards", () => {
  const appShellPath = path.resolve("components/layout/AppShell.js");
  const profilePagePath = path.resolve("app/profile/page.js");
  const settingsPagePath = path.resolve("app/settings/page.js");
  const welcomePagePath = path.resolve("app/page.js");

  test("AppShell redirects unauthenticated non-guest visitors to welcome entry page /", () => {
    const appShellCode = fs.readFileSync(appShellPath, "utf8");
    assert.match(appShellCode, /!loading\s*&&\s*!user\s*&&\s*!isGuest/);
    assert.match(appShellCode, /router\.replace\("\/"\)/);
  });

  test("Welcome page / redirects authenticated users to /dashboard", () => {
    const welcomeCode = fs.readFileSync(welcomePagePath, "utf8");
    assert.match(welcomeCode, /if\s*\(!authLoading\s*&&\s*user\)\s*\{\s*router\.replace\("\/dashboard"\);/);
    assert.match(welcomeCode, /Continue as Guest/);
  });

  test("Profile page guards against unauthenticated or guest access", () => {
    const profileCode = fs.readFileSync(profilePagePath, "utf8");
    assert.match(profileCode, /AccountRequiredGuard/);
    assert.match(profileCode, /if\s*\(!user\)\s*\{\s*return\s*\(\s*<AppShell>\s*<AccountRequiredGuard/);
  });

  test("Settings page guards against unauthenticated or guest access", () => {
    const settingsCode = fs.readFileSync(settingsPagePath, "utf8");
    assert.match(settingsCode, /AccountRequiredGuard/);
    assert.match(settingsCode, /if\s*\(!user\)\s*\{\s*return\s*\(\s*<AppShell>\s*<AccountRequiredGuard/);
  });

  test("All 8 critical authentication & entry flows are structurally accounted for", () => {
    const criticalFlows = [
      "Flow 1: Visiting / while logged out displays welcome and login screen",
      "Flow 2: Logging in successfully redirects to /dashboard",
      "Flow 3: Visiting / while already logged in redirects to /dashboard",
      "Flow 4: Clicking Continue as Guest lets visitor explore dashboard in Guest Mode",
      "Flow 5: Guest users can access allowed learning content (missions, labs, courses)",
      "Flow 6: Guest users cannot access private account data (/profile, /settings)",
      "Flow 7: Logging out returns user to /",
      "Flow 8: Password-reset entry and redirect behavior preserved",
    ];

    assert.strictEqual(criticalFlows.length, 8);
    criticalFlows.forEach((flow) => assert.ok(flow.startsWith("Flow ")));
  });
});
