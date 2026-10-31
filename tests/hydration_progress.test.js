import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  INITIAL_STATE,
  getSavedProgress,
  computeProgressStats,
  subscribeToProgress,
} from "../lib/progress/progress-store.js";

describe("Hydration Safety & Deterministic Initial State", () => {
  it("INITIAL_STATE contains a deterministic, static timestamp", () => {
    assert.ok(INITIAL_STATE.activityFeed.length > 0);
    assert.equal(INITIAL_STATE.activityFeed[0].timestamp, "2026-01-01T00:00:00.000Z");
  });

  it("getSavedProgress() returns INITIAL_STATE in SSR environment (window undefined)", () => {
    assert.equal(typeof window, "undefined");
    const ssrProgress = getSavedProgress();
    assert.deepEqual(ssrProgress, INITIAL_STATE);
  });

  it("evaluates isNewUser to true deterministically under SSR initial state", () => {
    const ssrProgress = getSavedProgress();
    const completedMissions = ssrProgress.completedMissions || [];
    const commandsRun = ssrProgress.commandsRun || 0;
    const isNewUser = completedMissions.length === 0 && commandsRun === 0;

    assert.equal(isNewUser, true, "SSR initial render must classify as new user");
  });

  it("computes 0% progress and initial mission-01 targeting on initial render", () => {
    const stats = computeProgressStats(INITIAL_STATE);
    assert.equal(stats.completedCount, 0);
    assert.equal(stats.percentage, 0);
    assert.equal(stats.totalAttempts, 0);
    assert.equal(stats.unlockedAchievementsCount, 0);
  });

  it("progress subscribers notify registered callbacks on change", () => {
    let notified = false;
    let receivedState = null;

    const unsubscribe = subscribeToProgress((state) => {
      notified = true;
      receivedState = state;
    });

    assert.equal(typeof unsubscribe, "function");
    unsubscribe();
  });
});
