/**
 * CYBERLAB Simulator Command Engine
 * Safe parsing, deterministic simulation, and targeted educational error diagnostics.
 * Completely decoupled from React presentation logic.
 */

import {
  validateSafeShellInput,
  tokenizeCommand,
  isValidIPv4,
  isValidCIDR,
  isAuthorizedLabTarget,
} from "./validators.js";
import { SCENARIOS } from "./scenario-data.js";
import { MISSIONS } from "../lessons/lesson-data.js";

/**
 * Common network options dictionary with pedagogical explanations
 */
const KNOWN_NMAP_OPTIONS = {
  "-sn": "Host discovery (ping scan) - disables port scanning.",
  "-sp": "Deprecated legacy alias for -sn (host discovery ping scan).",
  "-sv": "Service and version detection (probes open ports for software names/versions).",
  "-o": "Operating system detection (probes TCP/IP stack fingerprints).",
  "-a": "Aggressive scan mode (enables OS detection, version detection, script scanning, and traceroute).",
  "-pn": "Treat all hosts as online - skip host discovery.",
  "-p": "Port specification flag (e.g., -p 80 or -p 1-1000).",
  "-st": "TCP Connect full handshake scan.",
  "-ss": "TCP SYN stealth half-open scan (default for privileged users).",
};

/**
 * Execute or validate a command in the context of CYBERLAB.
 *
 * @param {string} rawInput - The user typed command
 * @param {Object} context - { missionId: string | null, mode: "mission" | "practice" }
 * @returns {Object} Execution result with status, output lines, error feedback, breakdown
 */
export function executeCommand(rawInput, context = {}) {
  const { missionId = null, mode = "mission" } = context;

  if (!rawInput || typeof rawInput !== "string") {
    return {
      status: "empty",
      outputLines: [],
    };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length === 0) {
    return {
      status: "empty",
      outputLines: [],
    };
  }

  // 1. Enforce shell security: reject pipes, chaining, redirection, subshells
  const safetyCheck = validateSafeShellInput(trimmed);
  if (!safetyCheck.isClean) {
    return {
      status: "security_error",
      isMissionSuccess: false,
      outputLines: [
        `[CYBERLAB SECURITY BOUNDARY] Command rejected:`,
        safetyCheck.explanation,
        `Detected operator: '${safetyCheck.detected}'`,
        `Safety notice: CYBERLAB is an educational simulator. Real shell execution and chaining are strictly forbidden.`,
      ],
      errorType: "SHELL_CHAINING_DISALLOWED",
      errorMessage: safetyCheck.explanation,
      suggestedHintLevel: 1,
    };
  }

  // 2. Tokenize command safely
  const { binary, options, args, rawTokens } = tokenizeCommand(trimmed);

  // 3. Global utility commands: clear, help
  if (binary === "clear" || binary === "cls") {
    return {
      status: "clear",
      action: "clear",
      outputLines: [],
    };
  }

  if (binary === "help") {
    const helpLines = SCENARIOS.practice.systemCommands.help;
    return {
      status: "info",
      isMissionSuccess: false,
      outputLines: helpLines,
    };
  }

  // 4. Handle PRACTICE / SANDBOX mode
  if (mode === "practice" || !missionId) {
    return handlePracticeMode(binary, options, args, trimmed);
  }

  // 5. Handle GUIDED MISSION mode
  return handleMissionMode(binary, options, args, missionId, trimmed);
}

/**
 * Handles evaluation inside a guided mission scenario.
 */
function handleMissionMode(binary, options, args, missionId, rawCommand) {
  const mission = MISSIONS[missionId];
  if (!mission) {
    return {
      status: "error",
      isMissionSuccess: false,
      outputLines: [`Unknown mission ID: ${missionId}`],
      errorType: "UNKNOWN_MISSION",
      errorMessage: "The requested mission does not exist in the curriculum.",
    };
  }

  const { challenge, commandBreakdown } = mission;
  const scenario = SCENARIOS[missionId];

  // A. Binary Validation: Mission strictly teaches Nmap
  if (binary !== "nmap") {
    const otherKnownTools = ["ping", "traceroute", "curl", "nc", "netcat", "telnet", "ssh"];
    let customNote = `Expected command: 'nmap'`;
    if (otherKnownTools.includes(binary)) {
      customNote = `While '${binary}' is a standard networking utility, this module focuses strictly on mastering 'nmap'.`;
    } else if (["cat", "ls", "cd", "rm", "sudo", "bash", "sh"].includes(binary)) {
      customNote = `'${binary}' is an OS command. The current objective requires using the Network Mapper scanner ('nmap').`;
    }

    return {
      status: "error",
      isMissionSuccess: false,
      outputLines: [
        `Command '${binary}' unrecognized or not applicable for ${mission.title}.`,
        customNote,
        `Type 'help' for available lab commands or check your mission briefing.`,
      ],
      errorType: "INCORRECT_BINARY",
      errorMessage: `Unrecognized command '${binary}'. Use 'nmap' for this mission.`,
      suggestedHintLevel: 1,
    };
  }

  // B. Target Argument Validation
  if (args.length === 0) {
    return {
      status: "error",
      isMissionSuccess: false,
      outputLines: [
        `nmap: Missing target specification!`,
        `Usage: nmap [Scan Type(s)] [Options] {target specification}`,
        `Educational tip: Nmap needs to know who to scan. Review the assigned target in your mission briefing.`,
      ],
      errorType: "MISSING_TARGET",
      errorMessage: "Missing target argument. You must supply a target IP or subnet.",
      suggestedHintLevel: 2,
    };
  }

  if (args.length > 1) {
    return {
      status: "error",
      isMissionSuccess: false,
      outputLines: [
        `nmap: Too many targets specified (${args.join(", ")}).`,
        `This lab mission is designed to evaluate a single assigned target: ${challenge.targetIp}.`,
      ],
      errorType: "TOO_MANY_TARGETS",
      errorMessage: `Too many targets provided. Only supply the single target: ${challenge.targetIp}`,
      suggestedHintLevel: 2,
    };
  }

  const target = args[0];

  // C. Target Format Validation
  const hasSlash = target.includes("/");
  if (hasSlash) {
    if (!isValidCIDR(target)) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `nmap: Invalid CIDR subnet mask in target: '${target}'.`,
          `Educational tip: A valid IPv4 CIDR consists of an IP address followed by a slash and prefix length between /16 and /32 (e.g. 192.0.2.0/28).`,
        ],
        errorType: "INVALID_CIDR_FORMAT",
        errorMessage: `Malformed CIDR format: '${target}'.`,
        suggestedHintLevel: 2,
      };
    }
  } else {
    if (!isValidIPv4(target)) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `nmap: Failed to resolve or invalid IPv4 target: '${target}'.`,
          `Educational tip: IPv4 addresses have 4 decimal octets between 0 and 255 (e.g. 192.0.2.45).`,
        ],
        errorType: "INVALID_IP_FORMAT",
        errorMessage: `Invalid target IP format: '${target}'.`,
        suggestedHintLevel: 2,
      };
    }
  }

  // D. Scope & Authorized Target Boundary Check
  if (!isAuthorizedLabTarget(target)) {
    return {
      status: "error",
      isMissionSuccess: false,
      outputLines: [
        `[SCOPE VIOLATION] Target '${target}' is outside the authorized lab boundary.`,
        `Safety notice: CYBERLAB strictly permits scanning reserved RFC 5737 documentation ranges:`,
        `  - TEST-NET-1: 192.0.2.0/24`,
        `  - TEST-NET-2: 198.51.100.0/24`,
        `Real-world scanning of public or unapproved IPs is unauthorized. Please use the assigned lab target.`,
      ],
      errorType: "UNAUTHORIZED_TARGET_SCOPE",
      errorMessage: `Target '${target}' is not within the authorized lab subnet.`,
      suggestedHintLevel: 1,
    };
  }

  // E. Lesson-specific Target Match
  if (target !== challenge.targetIp) {
    let explanation = `The target '${target}' is valid in RFC 5737, but does not match the target assigned for ${mission.title}.`;
    if (missionId === "mission-01") {
      explanation += ` Mission 01 requires targeting single host '${challenge.targetIp}'.`;
    } else if (missionId === "mission-02") {
      explanation += ` Mission 02 requires the entire /28 subnet '${challenge.targetIp}' to discover multiple live hosts.`;
    } else if (missionId === "mission-03") {
      explanation += ` Mission 03 requires the designated services host '${challenge.targetIp}'.`;
    }

    return {
      status: "error",
      isMissionSuccess: false,
      outputLines: [
        `Target mismatch: '${target}'`,
        explanation,
        `Check the Mission Briefing on the left panel.`,
      ],
      errorType: "TARGET_MISMATCH",
      errorMessage: `Incorrect target for this mission. Expected: ${challenge.targetIp}`,
      suggestedHintLevel: 2,
    };
  }

  // F. Options & Flags Validation
  const normalizedOptions = options.map((opt) => opt.toLowerCase());

  // Check for unknown or arbitrary options
  for (const opt of normalizedOptions) {
    if (!KNOWN_NMAP_OPTIONS[opt]) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `nmap: Unrecognized or unsupported option '${opt}'.`,
          `Educational tip: Check the syntax. Common flags include -sn for ping scan.`,
        ],
        errorType: "UNKNOWN_OPTION",
        errorMessage: `Unrecognized option '${opt}'.`,
        suggestedHintLevel: 2,
      };
    }
  }

  // Mission 01: Wants bare scan without options
  if (missionId === "mission-01") {
    if (normalizedOptions.length > 0) {
      const opt = normalizedOptions[0];
      let msg = `Option '${opt}' is not required for Mission 01.`;
      if (opt === "-sn" || opt === "-sp") {
        msg = `Option '${opt}' disables port scanning. Mission 01 introduces a basic default port scan on a single target without options.`;
      }
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          msg,
          `Objective: Run a baseline scan using only the command name and the target IP address:`,
          `  nmap 192.0.2.45`,
        ],
        errorType: "UNEXPECTED_OPTION",
        errorMessage: msg,
        suggestedHintLevel: 3,
      };
    }
  }

  // Mission 02: Requires -sn (or -sp)
  if (missionId === "mission-02") {
    const hasPingScan = normalizedOptions.includes("-sn") || normalizedOptions.includes("-sp");
    if (!hasPingScan) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `Missing host discovery flag!`,
          `You provided target '${target}', but omitted the host discovery option.`,
          `Scanning all 1,000 ports across all 16 IP addresses without discovery would take too long.`,
          `Educational tip: Use the '-sn' flag to instruct Nmap to 'skip port scan' and discover live hosts only.`,
        ],
        errorType: "MISSING_DISCOVERY_FLAG",
        errorMessage: "Missing required '-sn' flag for subnet host discovery.",
        suggestedHintLevel: 3,
      };
    }

    const unexpected = normalizedOptions.filter((opt) => opt !== "-sn" && opt !== "-sp");
    if (unexpected.length > 0) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `Option '${unexpected[0]}' is not needed for this host discovery exercise.`,
          `To discover live hosts quickly, only the '-sn' option is required.`,
        ],
        errorType: "UNEXPECTED_OPTION",
        errorMessage: `Extra option '${unexpected[0]}' provided. Only '-sn' is required.`,
        suggestedHintLevel: 3,
      };
    }
  }

  // Mission 03: Requires baseline port scan on 198.51.100.25 (no -sn)
  if (missionId === "mission-03") {
    if (normalizedOptions.includes("-sn") || normalizedOptions.includes("-sp")) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `Conflict: The '-sn' option disables port scanning!`,
          `Mission 03 specifically focuses on analyzing PORT STATES (open, closed, filtered).`,
          `Remove '-sn' so Nmap can probe the services on ${challenge.targetIp}.`,
        ],
        errorType: "PORT_SCAN_DISABLED",
        errorMessage: "You included '-sn', which disables port scanning. Omit '-sn' to see port states.",
        suggestedHintLevel: 3,
      };
    }

    if (normalizedOptions.length > 0) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `Option '${normalizedOptions[0]}' is not required for this port state analysis mission.`,
          `A standard scan: 'nmap 198.51.100.25' provides the required port state output table.`,
        ],
        errorType: "UNEXPECTED_OPTION",
        errorMessage: `Extra option '${normalizedOptions[0]}' provided.`,
        suggestedHintLevel: 3,
      };
    }
  }

  // G. SUCCESS! Command passed all checks. Generate realistic simulated output.
  const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";
  const outputLines = scenario ? scenario.generateOutput(now) : [`Scan completed successfully on ${target}`];

  return {
    status: "success",
    isMissionSuccess: true,
    missionId,
    executedCommand: rawCommand,
    outputLines,
    commandBreakdown,
    message: "Command validated successfully. Output generated below.",
  };
}

/**
 * Handles evaluation in free-form sandbox/practice mode.
 */
function handlePracticeMode(binary, options, args, rawCommand) {
  // Practice mode accepts:
  // ip addr
  if (binary === "ip" && args[0] === "addr") {
    return {
      status: "success",
      isMissionSuccess: false,
      outputLines: SCENARIOS.practice.systemCommands["ip addr"],
    };
  }

  // ping -c 3 <target>
  if (binary === "ping") {
    const target = args[args.length - 1];
    if (!target) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: ["ping: usage error: Destination address required."],
      };
    }
    if (!isAuthorizedLabTarget(target)) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `[SCOPE VIOLATION] Target '${target}' outside authorized lab scope.`,
          `Use lab targets: 192.0.2.45 or 198.51.100.25`,
        ],
      };
    }
    return {
      status: "success",
      isMissionSuccess: false,
      outputLines: [
        `PING ${target} (${target}) 56(84) bytes of data.`,
        `64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.84 ms`,
        `64 bytes from ${target}: icmp_seq=2 ttl=64 time=1.92 ms`,
        `64 bytes from ${target}: icmp_seq=3 ttl=64 time=1.89 ms`,
        ``,
        `--- ${target} ping statistics ---`,
        `3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
        `rtt min/avg/max/mdev = 1.842/1.884/1.921/0.032 ms`,
      ],
    };
  }

  // nmap in practice mode
  if (binary === "nmap") {
    if (args.length === 0) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `nmap: Missing target specification.`,
          `Available practice targets: 192.0.2.45, 192.0.2.0/28, 198.51.100.25`,
        ],
      };
    }

    const target = args[0];
    if (!isAuthorizedLabTarget(target)) {
      return {
        status: "error",
        isMissionSuccess: false,
        outputLines: [
          `[SCOPE VIOLATION] '${target}' is not an authorized lab target.`,
          `CYBERLAB only simulates RFC 5737 documentation addresses:`,
          `  - 192.0.2.45 (Single Host)`,
          `  - 192.0.2.0/28 (Subnet)`,
          `  - 198.51.100.25 (Services Host)`,
        ],
      };
    }

    const hasSn = options.some((opt) => opt.toLowerCase() === "-sn" || opt.toLowerCase() === "-sp");
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC";

    if (hasSn && (target.includes("/") || target === "192.0.2.0/28")) {
      return {
        status: "success",
        isMissionSuccess: false,
        outputLines: SCENARIOS["mission-02"].generateOutput(now),
      };
    }

    if (target === "198.51.100.25") {
      return {
        status: "success",
        isMissionSuccess: false,
        outputLines: SCENARIOS["mission-03"].generateOutput(now),
      };
    }

    // Default to mission-01 host
    return {
      status: "success",
      isMissionSuccess: false,
      outputLines: SCENARIOS["mission-01"].generateOutput(now),
    };
  }

  return {
    status: "error",
    isMissionSuccess: false,
    outputLines: [
      `Command '${binary}' unrecognized in practice lab.`,
      `Type 'help' to see supported educational commands.`,
    ],
  };
}
