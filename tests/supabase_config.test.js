import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  validateSupabaseKey,
  validateSupabaseUrl,
  getSupabaseConfig,
  isSupabaseConfigured,
  getSupabaseConfigError,
  getSupabaseClient,
  _resetSupabaseInstanceForTesting,
} from "../lib/supabase/client.js";

describe("Supabase Key and URL Validation", () => {
  it("validates Supabase publishable keys (sb_publishable_*)", () => {
    const res = validateSupabaseKey("sb_publishable_X7EO68RMAQv0lPtRegaiyw_8NGaR2gQ");
    assert.equal(res.valid, true);
    assert.equal(res.isPublishable, true);
    assert.equal(res.keyFormat, "publishable");
  });

  it("validates Supabase legacy anon JWT keys", () => {
    const res = validateSupabaseKey("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyPayload.dummySignature");
    assert.equal(res.valid, true);
    assert.equal(res.isJwtAnon, true);
    assert.equal(res.keyFormat, "jwt_anon");
  });

  it("strictly rejects secret keys (sb_secret_*) on the client", () => {
    const res = validateSupabaseKey("sb_" + "secret_test_placeholder");
    assert.equal(res.valid, false);
    assert.equal(res.isSecretKey, true);
    assert.match(res.error, /Security Violation/);
  });

  it("strictly rejects service_role keys on the client", () => {
    const res = validateSupabaseKey("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.service_role_payload.dummySig");
    assert.equal(res.valid, false);
    assert.equal(res.isSecretKey, true);
    assert.match(res.error, /Security Violation/);
  });

  it("rejects keys that are too short", () => {
    const res = validateSupabaseKey("short");
    assert.equal(res.valid, false);
    assert.match(res.error, /too short/);
  });

  it("validates HTTPS Supabase endpoints", () => {
    const valid = validateSupabaseUrl("https://dbpjuomkaivkvmaizobv.supabase.co");
    assert.equal(valid.valid, true);
    assert.equal(valid.url, "https://dbpjuomkaivkvmaizobv.supabase.co");

    const invalid = validateSupabaseUrl("http://insecure-domain.supabase.co");
    assert.equal(invalid.valid, false);
    assert.match(invalid.error, /must start with 'https:\/\/'/);
  });
});

describe("Supabase Environment Configuration Resolver", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    _resetSupabaseInstanceForTesting();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    _resetSupabaseInstanceForTesting();
  });

  it("reports missing variables clearly when nothing is configured", () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const config = getSupabaseConfig();
    assert.equal(config.isConfigured, false);
    assert.equal(isSupabaseConfigured(), false);
    assert.ok(config.missingVars.includes("NEXT_PUBLIC_SUPABASE_URL"));
    assert.ok(config.missingVars.some((v) => v.includes("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY")));
    assert.match(getSupabaseConfigError(), /Missing required Supabase environment variable/);
    assert.equal(getSupabaseClient(), null);
  });

  it("configures successfully when using NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dbpjuomkaivkvmaizobv.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_X7EO68RMAQv0lPtRegaiyw_8NGaR2gQ";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const config = getSupabaseConfig();
    assert.equal(config.isConfigured, true);
    assert.equal(isSupabaseConfigured(), true);
    assert.equal(config.activeVarName, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    assert.equal(config.keyFormat, "publishable");
    assert.equal(config.error, null);

    const client = getSupabaseClient();
    assert.ok(client !== null, "Supabase client should be initialized");
    assert.ok(client.auth !== undefined, "Client auth should be available");
  });

  it("configures successfully when using NEXT_PUBLIC_SUPABASE_ANON_KEY", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dbpjuomkaivkvmaizobv.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy.sig";

    const config = getSupabaseConfig();
    assert.equal(config.isConfigured, true);
    assert.equal(isSupabaseConfigured(), true);
    assert.equal(config.activeVarName, "NEXT_PUBLIC_SUPABASE_ANON_KEY");
    assert.equal(config.keyFormat, "jwt_anon");

    const client = getSupabaseClient();
    assert.ok(client !== null, "Supabase client should be initialized");
  });

  it("blocks initialization if a secret key is mistakenly provided", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dbpjuomkaivkvmaizobv.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_" + "secret_do_not_leak_in_client";

    const config = getSupabaseConfig();
    assert.equal(config.isConfigured, false);
    assert.equal(isSupabaseConfigured(), false);
    assert.match(config.error, /Security Violation/);
    assert.equal(getSupabaseClient(), null);
  });
});
