/**
 * CYBERLAB Simulator Validators
 * Safe syntax validation, target sanitization, and scope boundary checks.
 */

// Characters and patterns indicating forbidden shell syntax
const SHELL_METACHARACTERS = [
  "&&",
  "||",
  ";",
  "|",
  "`",
  "$(",
  "${",
  ">",
  ">>",
  "<",
  "&",
  "\n",
  "\r",
];

// RFC 5737 Documentation Prefixes & safe ranges
export const AUTHORIZED_LAB_PREFIXES = [
  "192.0.2.",     // TEST-NET-1
  "198.51.100.",  // TEST-NET-2
  "203.0.113.",   // TEST-NET-3
];

/**
 * Checks if input contains disallowed shell metacharacters (pipes, chaining, redirection).
 * @param {string} input 
 * @returns {{ isClean: boolean, detected?: string, explanation?: string }}
 */
export function validateSafeShellInput(input) {
  if (!input || typeof input !== "string") {
    return { isClean: false, explanation: "Empty command entered." };
  }

  const trimmed = input.trim();
  for (const meta of SHELL_METACHARACTERS) {
    if (trimmed.includes(meta)) {
      return {
        isClean: false,
        detected: meta,
        explanation: `Shell chaining or redirection operator '${meta}' is not permitted in this educational simulator. Run individual commands directly.`,
      };
    }
  }

  return { isClean: true };
}

/**
 * Basic IPv4 regex validator (0.0.0.0 to 255.255.255.255)
 */
export function isValidIPv4(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return false;
    const num = parseInt(part, 10);
    if (num < 0 || num > 255) return false;
    if (part.length > 1 && part.startsWith("0")) return false; // no leading zeros
  }
  return true;
}

/**
 * Validates CIDR notation like 192.0.2.0/28
 */
export function isValidCIDR(cidr) {
  const [ip, prefix] = cidr.split("/");
  if (!ip || prefix === undefined) return false;
  if (!isValidIPv4(ip)) return false;
  const numPrefix = parseInt(prefix, 10);
  return !isNaN(numPrefix) && numPrefix >= 16 && numPrefix <= 32;
}

/**
 * Checks if target is within authorized RFC 5737 lab scope.
 */
export function isAuthorizedLabTarget(target) {
  const cleanTarget = target.split("/")[0];
  return AUTHORIZED_LAB_PREFIXES.some((prefix) => cleanTarget.startsWith(prefix));
}

/**
 * Tokenizes a clean command line into command, options, and arguments.
 * Safe tokenizer without regex backtracking risks.
 */
export function tokenizeCommand(commandStr) {
  const tokens = [];
  let current = "";
  let inQuote = false;
  let quoteChar = "";

  for (let i = 0; i < commandStr.length; i++) {
    const char = commandStr[i];
    if ((char === '"' || char === "'") && !inQuote) {
      inQuote = true;
      quoteChar = char;
    } else if (char === quoteChar && inQuote) {
      inQuote = false;
      quoteChar = "";
    } else if (char === " " && !inQuote) {
      if (current.length > 0) {
        tokens.push(current);
        current = "";
      }
    } else {
      current += char;
    }
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  if (tokens.length === 0) {
    return { binary: "", options: [], args: [] };
  }

  const binary = tokens[0].toLowerCase();
  const options = [];
  const args = [];

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith("-")) {
      options.push(token);
    } else {
      args.push(token);
    }
  }

  return { binary, options, args, rawTokens: tokens };
}
