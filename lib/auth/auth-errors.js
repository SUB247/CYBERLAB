/**
 * CYBERLAB Authentication Error Normalization & Security Guard
 * Sanitizes backend errors and provides user-friendly messages without exposing
 * internal stack traces or raw Supabase error messages.
 */

export const RATE_LIMIT_USER_MESSAGE =
  "Too many reset requests. Please wait a while before trying again. If you already requested a link, check your inbox and spam folder.";

/**
 * Determines whether an error returned from Supabase Auth represents an email rate limit.
 *
 * @param {any} error
 * @returns {boolean}
 */
export function isRateLimitError(error) {
  if (!error) return false;

  // 1. Check HTTP status code
  const status = error.status || error.statusCode || error.status_code;
  if (status === 429) {
    return true;
  }

  // 2. Check Supabase/GoTrue error code strings
  const code = String(error.code || error.error_code || error.errorCode || "").toLowerCase();
  if (
    code === "over_email_send_rate_limit" ||
    code === "rate_limit_exceeded" ||
    code === "too_many_requests" ||
    code === "over_request_rate_limit" ||
    code.includes("rate_limit")
  ) {
    return true;
  }

  // 3. Inspect message, error_description, or string representation
  const message = String(
    error.message ||
    error.error_description ||
    error.description ||
    (typeof error === "string" ? error : "")
  ).toLowerCase();

  if (
    message.includes("rate limit") ||
    message.includes("over_email_send_rate_limit") ||
    message.includes("too many requests") ||
    message.includes("security purposes") ||
    message.includes("wait a while before trying again") ||
    message.includes("once every") ||
    message.includes("email rate limit exceeded")
  ) {
    return true;
  }

  return false;
}

/**
 * Normalizes password-reset errors into secure, user-friendly messages.
 * Prevents raw backend error traces (e.g. AuthApiError, GoTrue internals) from reaching UI.
 *
 * @param {any} error
 * @returns {string}
 */
export function formatPasswordResetError(error) {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  // 1. Email Rate Limit
  if (isRateLimitError(error)) {
    return RATE_LIMIT_USER_MESSAGE;
  }

  const rawMessage = String(
    error.message ||
    error.error_description ||
    (typeof error === "string" ? error : "")
  ).trim();

  // 2. Missing Environment Configuration
  if (
    rawMessage.includes("NEXT_PUBLIC_SUPABASE_URL") ||
    rawMessage.includes("Supabase credentials are not configured")
  ) {
    return rawMessage;
  }

  const lower = rawMessage.toLowerCase();

  // 3. Invalid Email Format
  if (
    lower.includes("invalid email") ||
    lower.includes("unable to validate email") ||
    lower.includes("malformed email")
  ) {
    return "Please enter a valid email address.";
  }

  // 4. Network / Connectivity Error
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network request failed") ||
    lower.includes("fetch failed") ||
    lower.includes("enotfound") ||
    lower.includes("econnrefused")
  ) {
    return "Unable to connect to the authentication service. Please check your internet connection and try again.";
  }

  // 5. Server-side Error (5xx)
  const status = error.status || error.statusCode;
  if (status >= 500 && status < 600) {
    return "The authentication service is temporarily unavailable. Please try again later.";
  }

  // 6. Generic Sanitized Fallback (Never leak raw backend error internals to user)
  return "Unable to send password reset email at this time. Please try again later.";
}
