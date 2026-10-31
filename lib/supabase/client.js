import { createClient } from "@supabase/supabase-js";

let supabaseInstance = null;

/**
 * Validate that a provided Supabase key is safe for client-side use.
 * Rejects secret / service_role keys to prevent privilege escalation or security leaks.
 */
export const validateSupabaseKey = (key) => {
  if (!key || typeof key !== "string") {
    return { valid: false, error: "Key is missing or empty." };
  }

  const trimmed = key.trim();

  // Guard against secret keys on client side!
  if (trimmed.startsWith("sb_secret_") || trimmed.toLowerCase().includes("service_role")) {
    return {
      valid: false,
      isSecretKey: true,
      error: "Security Violation: A secret/service-role key was supplied. Never expose secret keys in client-side code. Use NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (sb_publishable_...) or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  if (trimmed.length < 10) {
    return { valid: false, error: "Supabase key is too short to be valid." };
  }

  const isPublishable = trimmed.startsWith("sb_publishable_");
  const isJwtAnon = trimmed.startsWith("ey");

  return {
    valid: true,
    isPublishable,
    isJwtAnon,
    keyFormat: isPublishable ? "publishable" : isJwtAnon ? "jwt_anon" : "custom_public",
  };
};

/**
 * Validate that a provided Supabase project URL is valid.
 */
export const validateSupabaseUrl = (url) => {
  if (!url || typeof url !== "string") {
    return { valid: false, error: "NEXT_PUBLIC_SUPABASE_URL is missing or empty." };
  }
  const trimmed = url.trim();
  if (
    !trimmed.startsWith("https://") &&
    !trimmed.startsWith("http://localhost") &&
    !trimmed.startsWith("http://127.0.0.1")
  ) {
    return {
      valid: false,
      error: "NEXT_PUBLIC_SUPABASE_URL must start with 'https://' (or http://localhost for local development).",
    };
  }
  return { valid: true, url: trimmed };
};

/**
 * Inspect and resolve Supabase configuration from environment variables.
 * Supports both NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export const getSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Support both variable names
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Prefer publishable key if provided, fallback to anon key
  const activeKey = publishableKey || anonKey;
  const activeVarName = publishableKey
    ? "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    : anonKey
    ? "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    : null;

  const expectedVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)",
  ];

  const missingVars = [];
  if (!url) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!activeKey) {
    missingVars.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (missingVars.length > 0) {
    return {
      isConfigured: false,
      url: null,
      key: null,
      activeVarName: null,
      keyFormat: null,
      missingVars,
      expectedVars,
      error: `Missing required Supabase environment variable(s): ${missingVars.join(", ")}. Please define them in .env.local.`,
    };
  }

  const urlCheck = validateSupabaseUrl(url);
  if (!urlCheck.valid) {
    return {
      isConfigured: false,
      url,
      key: null,
      activeVarName,
      keyFormat: null,
      missingVars: [],
      expectedVars,
      error: urlCheck.error,
    };
  }

  const keyCheck = validateSupabaseKey(activeKey);
  if (!keyCheck.valid) {
    return {
      isConfigured: false,
      url,
      key: null,
      activeVarName,
      keyFormat: null,
      missingVars: [],
      expectedVars,
      error: keyCheck.error,
      isSecretKey: Boolean(keyCheck.isSecretKey),
    };
  }

  return {
    isConfigured: true,
    url: urlCheck.url,
    key: activeKey,
    activeVarName,
    keyFormat: keyCheck.keyFormat,
    missingVars: [],
    expectedVars,
    error: null,
  };
};

export const isSupabaseConfigured = () => {
  return getSupabaseConfig().isConfigured;
};

export const getSupabaseConfigError = () => {
  return getSupabaseConfig().error;
};

export const getSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(config.url, config.key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseInstance;
};

export const _resetSupabaseInstanceForTesting = () => {
  supabaseInstance = null;
};
