-- ==============================================================================
-- CYBERLAB DATABASE MIGRATION: 002_create_profiles_table.sql
-- Target: Supabase (PostgreSQL 15+)
-- Purpose:
--   1. Creates the public.profiles table linked to auth.users(id).
--   2. Enforces strict Row Level Security (RLS) so users can only read and update
--      their own profile (never exposes profile data publicly).
--   3. Installs a safe database trigger to automatically create a profile on signup
--      with username collision handling and conflict prevention.
--   4. Backfills existing auth.users rows into public.profiles safely.
-- ==============================================================================

-- 1. Create public.profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast username queries
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Clean up any existing policies to ensure idempotency
DROP POLICY IF EXISTS "Profiles readable by owner or if public" ON public.profiles;
DROP POLICY IF EXISTS "Profiles readable by owner only" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

-- 4. Strict Row Level Security Policies
-- SELECT: Users can only read their own profile row.
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- INSERT: Authenticated users can only insert their own profile row.
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can only modify their own profile row.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- DELETE: Users can only delete their own profile row.
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- 5. Safe Automatic Profile Creation Trigger on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  -- Extract sanitized username from user metadata or email address
  base_username := LOWER(COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    SPLIT_PART(NEW.email, '@', 1),
    'learner'
  ));
  final_username := base_username;

  -- Disambiguate if username already exists to respect the UNIQUE constraint
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
    final_username := base_username || '_' || SUBSTRING(NEW.id::TEXT FROM 1 FOR 6);
  END IF;

  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    profile_visibility
  ) VALUES (
    NEW.id,
    final_username,
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''),
      SPLIT_PART(NEW.email, '@', 1),
      'Learner'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'private'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Exception safety: Never block user account creation in auth.users
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Backfill any existing users in auth.users who do not have a profile row yet
INSERT INTO public.profiles (id, username, display_name, avatar_url, profile_visibility)
SELECT
  u.id,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'username'), ''),
    LOWER(SPLIT_PART(u.email, '@', 1)),
    'learner_' || SUBSTRING(u.id::TEXT FROM 1 FOR 6)
  ),
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'display_name'), ''),
    SPLIT_PART(u.email, '@', 1),
    'Learner'
  ),
  u.raw_user_meta_data->>'avatar_url',
  'private'
FROM auth.users u
ON CONFLICT (id) DO NOTHING;
