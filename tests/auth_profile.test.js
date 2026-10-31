import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("Profiles SQL Migration & Schema Specification", () => {
  const migrationPath = path.resolve("supabase/migrations/002_create_profiles_table.sql");
  assert.ok(fs.existsSync(migrationPath), "Migration file 002_create_profiles_table.sql must exist");
  const sql = fs.readFileSync(migrationPath, "utf8");

  it("creates public.profiles table with all expected columns and data types", () => {
    assert.match(sql, /CREATE TABLE IF NOT EXISTS public\.profiles/);
    assert.match(sql, /id UUID PRIMARY KEY REFERENCES auth\.users\(id\) ON DELETE CASCADE/);
    assert.match(sql, /username TEXT UNIQUE/);
    assert.match(sql, /display_name TEXT/);
    assert.match(sql, /bio TEXT/);
    assert.match(sql, /avatar_url TEXT/);
    assert.match(sql, /profile_visibility TEXT DEFAULT 'private'/);
    assert.match(sql, /created_at TIMESTAMPTZ DEFAULT NOW\(\)/);
    assert.match(sql, /updated_at TIMESTAMPTZ DEFAULT NOW\(\)/);
  });

  it("enables Row Level Security on public.profiles", () => {
    assert.match(sql, /ALTER TABLE public\.profiles ENABLE ROW LEVEL SECURITY;/);
  });

  it("strictly restricts SELECT to the owner (no public profile exposure)", () => {
    assert.match(sql, /CREATE POLICY "Users can view own profile"/);
    assert.match(sql, /ON public\.profiles FOR SELECT\s+USING \(auth\.uid\(\) = id\);/);
    assert.doesNotMatch(
      sql,
      /ON public\.profiles FOR SELECT\s+USING \([^)]*profile_visibility = 'public'[^)]*\);/,
      "Must not expose profiles publicly in SELECT policy"
    );
  });

  it("strictly restricts INSERT, UPDATE, and DELETE to owner", () => {
    assert.match(sql, /CREATE POLICY "Users can insert own profile"/);
    assert.match(sql, /ON public\.profiles FOR INSERT\s+WITH CHECK \(auth\.uid\(\) = id\);/);

    assert.match(sql, /CREATE POLICY "Users can update own profile"/);
    assert.match(sql, /ON public\.profiles FOR UPDATE\s+USING \(auth\.uid\(\) = id\)\s+WITH CHECK \(auth\.uid\(\) = id\);/);

    assert.match(sql, /CREATE POLICY "Users can delete own profile"/);
    assert.match(sql, /ON public\.profiles FOR DELETE\s+USING \(auth\.uid\(\) = id\);/);
  });

  it("includes automatic profile creation trigger on auth.users with conflict safety", () => {
    assert.match(sql, /CREATE OR REPLACE FUNCTION public\.handle_new_user\(\)/);
    assert.match(sql, /CREATE TRIGGER on_auth_user_created/);
    assert.match(sql, /AFTER INSERT ON auth\.users/);
    assert.match(sql, /ON CONFLICT \(id\) DO NOTHING/);
    assert.match(sql, /EXCEPTION WHEN OTHERS THEN/);
  });

  it("includes backfill for existing auth.users", () => {
    assert.match(sql, /INSERT INTO public\.profiles \(id, username, display_name, avatar_url, profile_visibility\)/);
    assert.match(sql, /FROM auth\.users/);
    assert.match(sql, /ON CONFLICT \(id\) DO NOTHING/);
  });
});
