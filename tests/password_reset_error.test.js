import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  isRateLimitError,
  formatPasswordResetError,
  RATE_LIMIT_USER_MESSAGE,
} from "../lib/auth/auth-errors.js";

describe("Password Reset Error Handling: Rate Limit Detection", () => {
  it("detects HTTP 429 status code", () => {
    assert.strictEqual(isRateLimitError({ status: 429 }), true);
    assert.strictEqual(isRateLimitError({ statusCode: 429 }), true);
    assert.strictEqual(isRateLimitError({ status_code: 429 }), true);
  });

  it("detects Supabase error codes for rate limiting", () => {
    assert.strictEqual(isRateLimitError({ code: "over_email_send_rate_limit" }), true);
    assert.strictEqual(isRateLimitError({ code: "OVER_EMAIL_SEND_RATE_LIMIT" }), true);
    assert.strictEqual(isRateLimitError({ code: "rate_limit_exceeded" }), true);
    assert.strictEqual(isRateLimitError({ code: "too_many_requests" }), true);
    assert.strictEqual(isRateLimitError({ error_code: "over_email_send_rate_limit" }), true);
  });

  it("detects rate limit patterns in error messages", () => {
    assert.strictEqual(
      isRateLimitError({ message: "Email rate limit exceeded" }),
      true
    );
    assert.strictEqual(
      isRateLimitError({
        message: "For security purposes, you can only request this once every 60 seconds",
      }),
      true
    );
    assert.strictEqual(
      isRateLimitError({ message: "Too many requests" }),
      true
    );
    assert.strictEqual(
      isRateLimitError("over_email_send_rate_limit"),
      true
    );
    assert.strictEqual(
      isRateLimitError(new Error("Email rate limit reached. Please wait a while before trying again.")),
      true
    );
  });

  it("returns false for non-rate-limit errors", () => {
    assert.strictEqual(isRateLimitError(null), false);
    assert.strictEqual(isRateLimitError(undefined), false);
    assert.strictEqual(isRateLimitError({ status: 400, message: "Invalid email" }), false);
    assert.strictEqual(isRateLimitError({ status: 500, message: "Internal server error" }), false);
    assert.strictEqual(isRateLimitError(new Error("Failed to fetch")), false);
  });
});

describe("Password Reset Error Handling: Sanitized Error Messages", () => {
  const EXPECTED_RATE_LIMIT_MSG =
    "Too many reset requests. Please wait a while before trying again. If you already requested a link, check your inbox and spam folder.";

  it("returns the exact rate-limit message when Supabase returns an email rate-limit error", () => {
    assert.strictEqual(RATE_LIMIT_USER_MESSAGE, EXPECTED_RATE_LIMIT_MSG);

    const err429 = { status: 429, message: "over_email_send_rate_limit" };
    assert.strictEqual(formatPasswordResetError(err429), EXPECTED_RATE_LIMIT_MSG);

    const errMessage = {
      message: "For security purposes, you can only request this once every 60 seconds",
    };
    assert.strictEqual(formatPasswordResetError(errMessage), EXPECTED_RATE_LIMIT_MSG);

    const errCode = { code: "over_email_send_rate_limit" };
    assert.strictEqual(formatPasswordResetError(errCode), EXPECTED_RATE_LIMIT_MSG);
  });

  it("sanitizes network failures cleanly without technical jargon", () => {
    const fetchErr = new Error("Failed to fetch");
    const formatted = formatPasswordResetError(fetchErr);
    assert.ok(formatted.includes("Unable to connect to the authentication service"));
    assert.ok(!formatted.includes("TypeError"));
    assert.ok(!formatted.includes("fetch"));
  });

  it("sanitizes unexpected backend internal errors avoiding raw backend exposures", () => {
    const internalErr = {
      status: 500,
      message: "Database connection failed at postgres.internal:5432 with pool exhaustion",
      code: "PG_ERROR_9921",
    };
    const formatted = formatPasswordResetError(internalErr);
    assert.ok(!formatted.includes("postgres"));
    assert.ok(!formatted.includes("PG_ERROR"));
    assert.ok(formatted.includes("temporarily unavailable"));
  });

  it("preserves actionable environment configuration instructions", () => {
    const configErr = new Error(
      "Supabase credentials are not configured. Expected NEXT_PUBLIC_SUPABASE_URL in .env.local."
    );
    const formatted = formatPasswordResetError(configErr);
    assert.ok(formatted.includes("NEXT_PUBLIC_SUPABASE_URL"));
  });
});

describe("Password Reset Component Architecture: Forgot Password Page", () => {
  const forgotPasswordPath = path.resolve("app/forgot-password/page.js");
  const code = fs.readFileSync(forgotPasswordPath, "utf8");

  it("uses isRateLimitError and formatPasswordResetError", () => {
    assert.match(code, /isRateLimitError/);
    assert.match(code, /formatPasswordResetError/);
  });

  it("disables reset button while in-flight loading or during cooldown", () => {
    assert.match(code, /disabled=\{loading\s*\|\|\s*cooldown\s*>\s*0\}/);
  });

  it("sets a cooldown timer to prevent repeated clicks after submission", () => {
    assert.match(code, /setCooldown\(isRate\s*\?\s*60\s*:\s*15\)/);
  });

  it("shows an explicit loading state when request is in-flight", () => {
    assert.match(code, /Sending Reset Link\.\.\./);
    assert.match(code, /animate-spin/);
  });

  it("renders distinct alert for rate limit with clear instructions", () => {
    assert.match(code, /isRateLimited/);
    assert.match(code, /Request Rate Limit/);
  });

  it("does not fake successful submission on failure", () => {
    // setSubmitted(true) must be inside try block after await resetPassword
    const tryBlock = code.slice(code.indexOf("try {"), code.indexOf("} catch"));
    assert.match(tryBlock, /await resetPassword\(trimmedEmail\);/);
    assert.match(tryBlock, /setSubmitted\(true\);/);

    const catchBlock = code.slice(code.indexOf("} catch"), code.indexOf("} finally"));
    assert.doesNotMatch(catchBlock, /setSubmitted\(true\)/);
  });
});

describe("Password Reset Component Architecture: Settings Page", () => {
  const settingsPath = path.resolve("app/settings/page.js");
  const code = fs.readFileSync(settingsPath, "utf8");

  it("disables reset button while loading or on cooldown in settings", () => {
    assert.match(code, /disabled=\{resetLoading\s*\|\|\s*resetCooldown\s*>\s*0\}/);
  });

  it("formats error with formatPasswordResetError and avoids exposing raw backend error in handlePasswordReset", () => {
    const handleResetCode = code.slice(
      code.indexOf("const handlePasswordReset ="),
      code.indexOf("const handleConfirmResetProgress =")
    );
    assert.match(handleResetCode, /formatPasswordResetError\(err\)/);
    assert.doesNotMatch(handleResetCode, /err\.message/);
  });

  it("shows loading state and cooldown timer on settings reset button", () => {
    assert.match(code, /Sending\.\.\./);
    assert.match(code, /Wait \{resetCooldown\}s/);
  });
});
