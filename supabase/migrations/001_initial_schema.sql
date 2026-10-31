-- ==============================================================================
-- CYBERLAB DATABASE MIGRATION & RLS POLICIES
-- Target: Supabase (PostgreSQL 15+)
-- ==============================================================================

-- 1. PROFILES TABLE
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

-- Index for fast username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  attempts INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  checkpoint_score INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson ON public.user_progress(lesson_id);

-- 3. LEARNING ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.learning_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  lesson_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_activity_user ON public.learning_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_activity_created ON public.learning_activity(created_at DESC);

-- 4. ACHIEVEMENTS CATALOG TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'Award',
  category TEXT DEFAULT 'general'
);

-- 5. USER ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- Seed Initial Achievements
INSERT INTO public.achievements (id, title, description, icon, category) VALUES
  ('first_command', 'First Contact', 'Executed your first valid simulated command in the CYBERLAB terminal.', 'Terminal', 'missions'),
  ('target_acquired', 'Target Acquired', 'Completed Mission 01: Understood target notation and RFC 5737 scope.', 'Crosshair', 'missions'),
  ('host_detective', 'Host Detective', 'Completed Mission 02: Discovered live hosts across a /28 subnet with -sn.', 'Network', 'missions'),
  ('port_analyst', 'Port Analyst', 'Completed Mission 03: Mastered Open, Closed, and Filtered port interpretation.', 'ShieldAlert', 'missions'),
  ('hint_independent', 'Autonomous Hacker', 'Completed a mission successfully without revealing any hints.', 'Zap', 'excellence'),
  ('fast_learner', 'Speed Recon', 'Completed a mission in under 5 minutes.', 'Clock', 'excellence')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all user tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are readable by all authenticated and anon users
CREATE POLICY "Achievements are public viewable"
  ON public.achievements FOR SELECT
  USING (true);

-- Profiles:
-- 1. Users can select only their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- 2. Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Users can delete only their own profile
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- User Progress:
-- Only owner can read, insert, update
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Learning Activity:
CREATE POLICY "Users can view own activity"
  ON public.learning_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record own activity"
  ON public.learning_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User Achievements:
CREATE POLICY "Users can view own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Profile auto-creation trigger on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url, profile_visibility)
  VALUES (
    NEW.id,
    LOWER(SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'private'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
