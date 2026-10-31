"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  getSupabaseClient,
  getSupabaseConfig,
  getSupabaseConfigError,
} from "../supabase/client.js";
import {
  setActiveProgressUser,
  syncProgressWithRemote,
} from "../progress/progress-store.js";

const AuthContext = createContext({
  user: null,
  profile: null,
  session: null,
  loading: true,
  isGuest: false,
  isAuthenticated: false,
  continueAsGuest: () => {},
  exitGuestMode: () => {},
  isConfigured: false,
  configError: null,
  configDetails: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

const LOCAL_PROFILE_KEY = "CYBERLAB_GUEST_PROFILE";
const GUEST_SESSION_KEY = "CYBERLAB_GUEST_SESSION";

const defaultGuestProfile = {
  id: "guest",
  display_name: "Guest Learner",
  username: "learner",
  bio: "Exploring cybersecurity fundamentals in the simulated lab.",
  avatar_url: null,
  profile_visibility: "private",
  is_guest: true,
};

/**
 * Construct safe fallback profile object from auth session user metadata.
 */
function buildFallbackProfile(authUser, userId) {
  const metadata = authUser?.user_metadata || {};
  const emailPrefix = authUser?.email?.split("@")[0] || "learner";

  return {
    id: userId || authUser?.id || "guest",
    display_name: metadata.display_name || emailPrefix || "CyberLab Learner",
    username: metadata.username || emailPrefix,
    bio: "",
    avatar_url: metadata.avatar_url || null,
    profile_visibility: "private",
    is_guest: false,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(defaultGuestProfile);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Mutable refs to prevent re-triggering effects and endless render loops
  const userRef = useRef(null);
  const inFlightFetchRef = useRef(null);
  const lastFetchedUserIdRef = useRef(null);
  const missingTableLoggedRef = useRef(false);

  const config = getSupabaseConfig();
  const configured = config.isConfigured;
  const configError = config.error;

  // Keep userRef updated with latest user state without causing effect re-runs
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Load initial guest mode state from storage on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedGuest = localStorage.getItem(GUEST_SESSION_KEY);
        if (storedGuest === "true") {
          setIsGuest(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Load guest profile from localStorage if offline/guest
  const loadLocalProfile = useCallback(() => {
    if (typeof window === "undefined") return defaultGuestProfile;
    try {
      const stored = localStorage.getItem(LOCAL_PROFILE_KEY);
      if (stored) {
        return { ...defaultGuestProfile, ...JSON.parse(stored), is_guest: true };
      }
    } catch (e) {
      console.warn("[CyberLab Auth] Failed to load local profile:", e);
    }
    return defaultGuestProfile;
  }, []);

  const saveLocalProfile = useCallback((newProfile) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(newProfile));
    } catch (e) {
      console.warn("[CyberLab Auth] Failed to save local profile:", e);
    }
  }, []);

  /**
   * Fetch remote user profile from Supabase with loop prevention and error resilience.
   * Never loops on missing tables or network errors.
   */
  const fetchRemoteProfile = useCallback(async (userId, supabase, authUser = null) => {
    if (!userId || !supabase) return null;

    // Prevent concurrent duplicate in-flight requests for the exact same user
    if (inFlightFetchRef.current === userId) {
      return null;
    }

    inFlightFetchRef.current = userId;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Table not found in schema cache (PGRST205 / PostgreSQL 42P01)
        if (
          error.code === "PGRST205" ||
          error.message?.includes("Could not find the table 'public.profiles'")
        ) {
          if (!missingTableLoggedRef.current) {
            console.warn(
              "[CyberLab Auth] 'public.profiles' table not found in Supabase (PGRST205). Operating with session metadata fallback until migration 002_create_profiles_table.sql is executed."
            );
            missingTableLoggedRef.current = true;
          }
        } else if (error.code !== "PGRST116") {
          // PGRST116 is normal when user doesn't have a profile row yet
          console.warn("[CyberLab Auth] Supabase fetch profile error:", error.message || error);
        }

        const fallback = buildFallbackProfile(authUser || userRef.current, userId);
        setProfile(fallback);
        lastFetchedUserIdRef.current = userId;
        return fallback;
      }

      if (data) {
        const enriched = { ...data, is_guest: false };
        setProfile(enriched);
        lastFetchedUserIdRef.current = userId;
        return enriched;
      } else {
        const fallback = buildFallbackProfile(authUser || userRef.current, userId);
        setProfile(fallback);
        lastFetchedUserIdRef.current = userId;
        return fallback;
      }
    } catch (err) {
      console.warn("[CyberLab Auth] Profile fetch exception:", err);
      const fallback = buildFallbackProfile(authUser || userRef.current, userId);
      setProfile(fallback);
      lastFetchedUserIdRef.current = userId;
      return fallback;
    } finally {
      inFlightFetchRef.current = null;
    }
  }, []);

  // Continue as Guest: enables guest mode without creating a remote account
  const continueAsGuest = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(GUEST_SESSION_KEY, "true");
      } catch (e) {
        console.warn("[CyberLab Auth] Could not store guest session:", e);
      }
    }
    setActiveProgressUser(null);
    setIsGuest(true);
    setUser(null);
    setSession(null);
    setProfile(loadLocalProfile());
  }, [loadLocalProfile]);

  // Exit Guest Mode: returns user to welcome/login entry flow
  const exitGuestMode = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(GUEST_SESSION_KEY);
      } catch (e) {
        console.warn("[CyberLab Auth] Could not clear guest session:", e);
      }
    }
    setActiveProgressUser(null);
    setIsGuest(false);
    setUser(null);
    setSession(null);
    setProfile(defaultGuestProfile);
  }, []);

  // Initial Auth Lifecycle: Runs ONCE on mount
  useEffect(() => {
    const supabase = getSupabaseClient();

    let storedGuestMode = false;
    if (typeof window !== "undefined") {
      try {
        storedGuestMode = localStorage.getItem(GUEST_SESSION_KEY) === "true";
      } catch (e) {
        // ignore
      }
    }

    if (!supabase) {
      // Supabase is not configured -> operate in Guest / Local mode
      setIsGuest(storedGuestMode);
      setProfile(loadLocalProfile());
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      const newUser = newSession?.user || null;
      setSession(newSession);
      setUser(newUser);
      userRef.current = newUser;

      if (newUser) {
        // Authenticated user
        setIsGuest(false);
        setActiveProgressUser(newUser.id);
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem(GUEST_SESSION_KEY);
          } catch (e) {
            // ignore
          }
        }

        // Only fetch remote profile if user changed or on explicit SIGNED_IN event
        if (lastFetchedUserIdRef.current !== newUser.id || event === "SIGNED_IN") {
          await fetchRemoteProfile(newUser.id, supabase, newUser);
        }
      } else {
        lastFetchedUserIdRef.current = null;
        setActiveProgressUser(null);

        let guestActive = false;
        if (typeof window !== "undefined") {
          try {
            guestActive = localStorage.getItem(GUEST_SESSION_KEY) === "true";
          } catch (e) {
            // ignore
          }
        }
        setIsGuest(guestActive);
        setProfile(loadLocalProfile());
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    // 2. Fetch current session once on initial mount
    supabase.auth
      .getSession()
      .then(async ({ data: { session: currentSession } }) => {
        if (!isMounted) return;

        const currentUser = currentSession?.user || null;
        setSession(currentSession);
        setUser(currentUser);
        userRef.current = currentUser;

        if (currentUser) {
          setIsGuest(false);
          setActiveProgressUser(currentUser.id);
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem(GUEST_SESSION_KEY);
            } catch (e) {
              // ignore
            }
          }

          if (lastFetchedUserIdRef.current !== currentUser.id) {
            await fetchRemoteProfile(currentUser.id, supabase, currentUser);
          }
        } else {
          lastFetchedUserIdRef.current = null;
          setActiveProgressUser(null);

          let guestActive = false;
          if (typeof window !== "undefined") {
            try {
              guestActive = localStorage.getItem(GUEST_SESSION_KEY) === "true";
            } catch (e) {
              // ignore
            }
          }
          setIsGuest(guestActive);
          setProfile(loadLocalProfile());
        }

        if (isMounted) {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("[CyberLab Auth] getSession error:", err);
        if (isMounted) {
          setProfile(loadLocalProfile());
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchRemoteProfile, loadLocalProfile]);

  // Sign In
  const signIn = useCallback(async ({ email, password }) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      const err = getSupabaseConfigError();
      throw new Error(
        err ||
          "Supabase credentials are not configured. Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local."
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(GUEST_SESSION_KEY);
      } catch (e) {
        // ignore
      }
    }
    setIsGuest(false);
    if (data?.user) {
      setActiveProgressUser(data.user.id);
      syncProgressWithRemote(data.user.id).catch(() => {});
    }

    return data;
  }, []);

  // Sign Up
  const signUp = useCallback(async ({ email, password, displayName, username }) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      const err = getSupabaseConfigError();
      throw new Error(
        err ||
          "Supabase credentials are not configured. Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local."
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          username: username || email.split("@")[0],
        },
      },
    });

    if (error) throw error;

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(GUEST_SESSION_KEY);
      } catch (e) {
        // ignore
      }
    }
    setIsGuest(false);

    // Create profile entry if user exists immediately (session available)
    if (data.user) {
      setActiveProgressUser(data.user.id);
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          display_name: displayName,
          username: username || email.split("@")[0],
          profile_visibility: "private",
        });
      } catch (profileErr) {
        // Non-blocking: handle_new_user trigger in Supabase also handles profile creation
        console.warn("[CyberLab Auth] Immediate profile upsert notice:", profileErr);
      }
    }

    return data;
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    const supabase = getSupabaseClient();
    lastFetchedUserIdRef.current = null;
    inFlightFetchRef.current = null;
    setActiveProgressUser(null);

    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(GUEST_SESSION_KEY);
      } catch (e) {
        console.warn("[CyberLab Auth] Could not clear guest session:", e);
      }
    }

    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("[CyberLab Auth] signOut error:", err);
      }
    }

    setUser(null);
    setSession(null);
    setIsGuest(false);
    userRef.current = null;
    setProfile(loadLocalProfile());
  }, [loadLocalProfile]);

  // Password Reset
  const resetPassword = useCallback(async (email) => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      const err = getSupabaseConfigError();
      throw new Error(
        err ||
          "Supabase credentials are not configured. Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local."
      );
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?type=recovery`
          : undefined,
    });

    if (error) throw error;
    return data;
  }, []);

  // Update Profile
  const updateProfile = useCallback(
    async (updates) => {
      const supabase = getSupabaseClient();
      const currentUser = userRef.current;

      if (currentUser && supabase) {
        // 1. Keep auth user metadata in sync if display_name or username changed
        const metaUpdates = {};
        if (updates.display_name !== undefined) metaUpdates.display_name = updates.display_name;
        if (updates.username !== undefined) metaUpdates.username = updates.username;

        if (Object.keys(metaUpdates).length > 0) {
          try {
            await supabase.auth.updateUser({ data: metaUpdates });
          } catch (metaErr) {
            console.warn("[CyberLab Auth] Could not update auth user metadata:", metaErr);
          }
        }

        // 2. Upsert to public.profiles table
        const { error } = await supabase.from("profiles").upsert({
          id: currentUser.id,
          ...updates,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          if (
            error.code === "PGRST205" ||
            error.message?.includes("Could not find the table 'public.profiles'")
          ) {
            // Update in-memory profile state so user is not blocked
            setProfile((prev) => ({ ...prev, ...updates }));
            throw new Error(
              "The 'public.profiles' table does not exist in Supabase yet. Please execute migration 002_create_profiles_table.sql in the Supabase SQL Editor."
            );
          }
          throw error;
        }

        setProfile((prev) => ({ ...prev, ...updates }));
      } else {
        // Update guest local profile
        const updated = { ...profile, ...updates };
        setProfile(updated);
        saveLocalProfile(updated);
      }
    },
    [profile, saveLocalProfile]
  );

  // Explicit refresh of remote profile
  const refreshProfile = useCallback(async () => {
    const supabase = getSupabaseClient();
    const current = userRef.current;
    if (current && supabase) {
      lastFetchedUserIdRef.current = null; // Bypass cached check
      return await fetchRemoteProfile(current.id, supabase, current);
    }
    return null;
  }, [fetchRemoteProfile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isGuest,
        isAuthenticated: !!user,
        continueAsGuest,
        exitGuestMode,
        isConfigured: configured,
        configError,
        configDetails: config,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
