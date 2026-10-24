import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { executeCommand } from "../lib/simulator/command-engine.js";
import {
  validateSafeShellInput,
  isValidIPv4,
  isValidCIDR,
  isAuthorizedLabTarget,
  tokenizeCommand,
} from "../lib/simulator/validators.js";
import { computeProgressStats, INITIAL_STATE } from "../lib/progress/progress-store.js";

describe("Safety & Shell Validator", () => {
  it("rejects shell chaining operators (&&, ;, ||, |)", () => {
    const dangerous = [
      "nmap 192.0.2.45 && rm -rf /",
      "nmap 192.0.2.45; cat /etc/passwd",
      "nmap 192.0.2.45 | grep open",
      "nmap `whoami`",
      "nmap $(whoami)",
      "nmap 192.0.2.45 > output.txt",
    ];

    for (const cmd of dangerous) {
      const res = validateSafeShellInput(cmd);
      assert.equal(res.isClean, false, `Should reject: ${cmd}`);
      assert.ok(res.detected, "Should identify detected operator");
    }
  });

  it("permits safe command lines", () => {
    const safe = [
      "nmap 192.0.2.45",
      "nmap -sn 192.0.2.0/28",
      "nmap 198.51.100.25",
      "help",
      "clear",
    ];

    for (const cmd of safe) {
      const res = validateSafeShellInput(cmd);
      assert.equal(res.isClean, true, `Should accept: ${cmd}`);
    }
  });
});

describe("IP and CIDR Validators", () => {
  it("validates IPv4 addresses accurately", () => {
    assert.equal(isValidIPv4("192.0.2.45"), true);
    assert.equal(isValidIPv4("198.51.100.25"), true);
    assert.equal(isValidIPv4("256.0.0.1"), false);
    assert.equal(isValidIPv4("192.0.2"), false);
    assert.equal(isValidIPv4("random-string"), false);
  });

  it("validates CIDR subnet notation", () => {
    assert.equal(isValidCIDR("192.0.2.0/28"), true);
    assert.equal(isValidCIDR("192.0.2.0/24"), true);
    assert.equal(isValidCIDR("192.0.2.0/33"), false);
    assert.equal(isValidCIDR("192.0.2.0"), false);
  });

  it("enforces RFC 5737 authorized documentation boundaries", () => {
    assert.equal(isAuthorizedLabTarget("192.0.2.45"), true);
    assert.equal(isAuthorizedLabTarget("192.0.2.0/28"), true);
    assert.equal(isAuthorizedLabTarget("198.51.100.25"), true);
    // Real public/private targets outside lab are strictly unauthorized
    assert.equal(isAuthorizedLabTarget("8.8.8.8"), false);
    assert.equal(isAuthorizedLabTarget("1.1.1.1"), false);
    assert.equal(isAuthorizedLabTarget("10.0.0.1"), false);
  });

  it("tokenizes commands with arguments properly", () => {
    const t1 = tokenizeCommand("nmap -sn 192.0.2.0/28");
    assert.equal(t1.binary, "nmap");
    assert.deepEqual(t1.options, ["-sn"]);
    assert.deepEqual(t1.args, ["192.0.2.0/28"]);
  });
});

describe("Mission 01 Command Engine", () => {
  it("accepts valid mission-01 command 'nmap 192.0.2.45'", () => {
    const res = executeCommand("nmap 192.0.2.45", { missionId: "mission-01", mode: "mission" });
    assert.equal(res.status, "success");
    assert.equal(res.isMissionSuccess, true);
    assert.ok(res.outputLines.some((l) => l.includes("training-target-alpha")));
    assert.ok(res.commandBreakdown.length > 0);
  });

  it("rejects mission-01 command with wrong target", () => {
    const res = executeCommand("nmap 198.51.100.25", { missionId: "mission-01", mode: "mission" });
    assert.equal(res.isMissionSuccess, false);
    assert.equal(res.errorType, "TARGET_MISMATCH");
  });

  it("rejects mission-01 command with out-of-scope public target", () => {
    const res = executeCommand("nmap 8.8.8.8", { missionId: "mission-01", mode: "mission" });
    assert.equal(res.isMissionSuccess, false);
    assert.equal(res.errorType, "UNAUTHORIZED_TARGET_SCOPE");
  });

  it("rejects mission-01 command with missing target", () => {
    const res = executeCommand("nmap", { missionId: "mission-01", mode: "mission" });
    assert.equal(res.isMissionSuccess, false);
    assert.equal(res.errorType, "MISSING_TARGET");
  });

  it("rejects mission-01 with unnecessary options", () => {
    const res = executeCommand("nmap -sn 192.0.2.45", { missionId: "mission-01", mode: "mission" });
    assert.equal(res.isMissionSuccess, false);
    assert.equal(res.errorType, "UNEXPECTED_OPTION");
  });
});

describe("Mission 02 Command Engine", () => {
  it("accepts valid mission-02 command 'nmap -sn 192.0.2.0/28'", () => {
    const res = executeCommand("nmap -sn 192.0.2.0/28", { missionId: "mission-02", mode: "mission" });
    assert.equal(res.status, "success");
    assert.equal(res.isMissionSuccess, true);
    assert.ok(res.outputLines.some((l) => l.includes("gw-router")));
    assert.ok(res.outputLines.some((l) => l.includes("web-node-01")));
    assert.ok(res.outputLines.some((l) => l.includes("db-node-primary")));
    assert.ok(res.outputLines.some((l) => l.includes("3 hosts up")));
  });

  it("rejects mission-02 if -sn flag is missing", () => {
    const res = executeCommand("nmap 192.0.2.0/28", { missionId: "mission-02", mode: "mission" });
    assert.equal(res.isMissionSuccess, false);
    assert.equal(res.errorType, "MISSING_DISCOVERY_FLAG");
  });
});

describe("Mission 03 Command Engine", () => {
  it("accepts valid mission-03 command 'nmap 198.51.100.25'", () => {
    const res = executeCommand("nmap 198.51.100.25", { missionId: "mission-03", mode: "mission" });
    assert.equal(res.status, "success");
    assert.equal(res.isMissionSuccess, true);
    assert.ok(res.outputLines.some((l) => l.includes("80/tcp") && l.includes("open")));
    assert.ok(res.outputLines.some((l) => l.includes("22/tcp") && l.includes("closed")));
    assert.ok(res.outputLines.some((l) => l.includes("443/tcp") && l.includes("filtered")));
  });

  it("rejects mission-03 if -sn is passed because it disables port scans", () => {
    const res = executeCommand("nmap -sn 198.51.100.25", { missionId: "mission-03", mode: "mission" });
    assert.equal(res.isMissionSuccess, false);
    assert.equal(res.errorType, "PORT_SCAN_DISABLED");
  });
});

describe("Progress Statistics Calculation", () => {
  it("computes stats accurately from state", () => {
    const state = {
      ...INITIAL_STATE,
      completedMissions: ["mission-01", "mission-02"],
      hintsRevealed: { "mission-01": 1, "mission-02": 2, "mission-03": 0 },
      attempts: {
        "mission-01": { successful: 1, failed: 2 },
        "mission-02": { successful: 1, failed: 0 },
      },
      unlockedAchievements: ["first_command", "target_acquired"],
    };

    const stats = computeProgressStats(state);
    assert.equal(stats.totalMissions, 3);
    assert.equal(stats.completedCount, 2);
    assert.equal(stats.percentage, 67);
    assert.equal(stats.totalHintsUsed, 3);
    assert.equal(stats.totalAttempts, 4);
    assert.equal(stats.unlockedAchievementsCount, 2);
    assert.ok(stats.skills.includes("Target IP Syntax"));
    assert.ok(stats.skills.includes("-sn Host Discovery"));
  });
});
