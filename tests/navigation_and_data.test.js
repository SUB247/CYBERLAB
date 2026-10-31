import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { COURSES, LEARNING_PATHS_DETAILED } from "../lib/lessons/courses-data.js";
import { MISSIONS } from "../lib/lessons/lesson-data.js";
import { GLOSSARY_ITEMS } from "../lib/glossary/glossary-data.js";
import { ACHIEVEMENTS } from "../lib/progress/progress-store.js";

describe("Course Catalog & Syllabus Integrity", () => {
  it("defines the 6 required primary cybersecurity domains", () => {
    const courseIds = COURSES.map((c) => c.id);
    assert.ok(courseIds.includes("linux-fundamentals"), "Must include Linux Fundamentals");
    assert.ok(courseIds.includes("networking-fundamentals"), "Must include Networking Fundamentals");
    assert.ok(courseIds.includes("nmap-essentials"), "Must include Nmap Essentials");
    assert.ok(courseIds.includes("pentest-foundations"), "Must include Penetration Testing Foundations");
    assert.ok(courseIds.includes("metasploit-framework"), "Must include Metasploit Framework");
    assert.ok(courseIds.includes("wireless-security"), "Must include Wireless Security");
  });

  it("ensures Nmap Essentials contains all 3 interactive beginner missions", () => {
    const nmapCourse = COURSES.find((c) => c.id === "nmap-essentials");
    assert.ok(nmapCourse, "Nmap Essentials course must exist");
    assert.equal(nmapCourse.isPlayable, true);

    const missionRefs = nmapCourse.lessons.map((l) => l.missionRef).filter(Boolean);
    assert.ok(missionRefs.includes("mission-01"));
    assert.ok(missionRefs.includes("mission-02"));
    assert.ok(missionRefs.includes("mission-03"));

    // Verify mission references match actual mission definitions
    missionRefs.forEach((ref) => {
      assert.ok(MISSIONS[ref], `Mission ${ref} must exist in lesson-data.js`);
      assert.ok(MISSIONS[ref].checkpoint, `Mission ${ref} must have a checkpoint`);
    });
  });

  it("verifies learning paths structure", () => {
    assert.ok(LEARNING_PATHS_DETAILED.length >= 3);
    LEARNING_PATHS_DETAILED.forEach((path) => {
      assert.ok(path.id);
      assert.ok(path.title);
      assert.ok(path.milestones.length > 0);
    });
  });

  it("verifies glossary items have terms, definitions, and categories", () => {
    assert.ok(GLOSSARY_ITEMS.length >= 10);
    GLOSSARY_ITEMS.forEach((item) => {
      assert.ok(item.term);
      assert.ok(item.definition);
      assert.ok(item.category);
    });
  });

  it("verifies achievements have titles, descriptions, and icons", () => {
    assert.ok(ACHIEVEMENTS.length >= 5);
    ACHIEVEMENTS.forEach((ach) => {
      assert.ok(ach.id);
      assert.ok(ach.title);
      assert.ok(ach.description);
    });
  });
});
