/**
 * CYBERLAB Lesson & Mission Definitions
 * Contains pedagogical structures, objectives, briefings, hints, and checkpoints.
 */

export const LEARNING_PATHS = [
  {
    id: "foundations",
    title: "Foundations",
    status: "coming_soon",
    description: "Core operating system, CLI navigation, and foundational networking.",
    modules: [
      { id: "term-basics", title: "Terminal Basics", status: "locked", duration: "10 min" },
      { id: "linux-essentials", title: "Linux Essentials", status: "locked", duration: "15 min" },
      { id: "net-fundamentals", title: "Networking Fundamentals", status: "locked", duration: "20 min" },
    ],
  },
  {
    id: "nmap-foundations",
    title: "Nmap Network Scanning",
    status: "active",
    description: "Hands-on network reconnaissance, host discovery, and port state analysis.",
    modules: [
      { id: "mission-01", title: "Mission 01: Understand the Target", status: "available", duration: "15 min" },
      { id: "mission-02", title: "Mission 02: Discover Live Hosts", status: "available", duration: "20 min" },
      { id: "mission-03", title: "Mission 03: Interpret Port States", status: "available", duration: "25 min" },
    ],
  },
  {
    id: "coming-later",
    title: "Advanced Modules",
    status: "coming_soon",
    description: "Deep reconnaissance, exploitation concepts, and auditing techniques.",
    modules: [
      { id: "service-enum", title: "Service & Version Enumeration", status: "locked", duration: "30 min" },
      { id: "metasploit-basics", title: "Metasploit Framework Fundamentals", status: "locked", duration: "40 min" },
      { id: "wireless-audit", title: "Wireless Security & Fern Walkthrough", status: "locked", duration: "35 min" },
      { id: "final-assessment", title: "Comprehensive Capstone Lab", status: "locked", duration: "45 min" },
    ],
  },
];

export const MISSIONS = {
  "mission-01": {
    id: "mission-01",
    pathId: "nmap-foundations",
    number: "01",
    title: "Understand the Target",
    subtitle: "Command syntax, target specification, and authorized scope",
    difficulty: "Beginner",
    estimatedMinutes: 15,
    scenarioHost: "192.0.2.45",
    scenarioHostname: "training-target-alpha.cyberlab.internal",
    networkContext: "RFC 5737 TEST-NET-1 (Safe Documentation Subnet)",
    
    briefing: {
      overview:
        "Welcome to your first operational mission in CYBERLAB. Before running any scan, a security professional must know exactly how to target a system and how command arguments are structured.",
      importance:
        "In cybersecurity, precision is everything. Targeting the wrong IP address can disrupt critical production infrastructure or cause unauthorized testing against systems you do not own. Mastering target syntax is your foundational duty.",
      objectives: [
        "Distinguish between an individual host IP address and a network subnet.",
        "Understand the anatomy of an Nmap command: binary, options, and target arguments.",
        "Execute a single-target simulated scan against the designated lab host.",
        "Interpret basic scan completion metadata without guessing.",
      ],
      prerequisites: [
        "An IP address (IPv4) consists of four decimal numbers (0-255) separated by dots (e.g., 192.0.2.45).",
        "A command line tool like Nmap expects arguments in a specific order: command [options] target.",
        "Reserved RFC 5737 addresses (192.0.2.0/24) are used here so all actions remain 100% safe and simulated.",
      ],
    },

    conceptExplanation: {
      heading: "How Nmap Sees Targets",
      body: [
        "When you run Nmap, the utility needs to know who you want to inspect. A target can be a single IP address (like 192.0.2.45), a domain name (like scanme.nmap.org), or a CIDR subnet block (like 192.0.2.0/24).",
        "For this mission, our isolated lab has provisioned a single simulated server named 'training-target-alpha' at IP address 192.0.2.45.",
        "The general command structure is:",
      ],
      codeExample: "nmap [optional-flags] <target-ip-or-range>",
      notes: [
        "Target IP: 192.0.2.45 identifies exactly ONE specific machine.",
        "Subnet: 192.0.2.0/24 would identify 256 addresses. Do not use a subnet here—only target the single host.",
        "In this first exercise, we will not supply any optional flags. A bare 'nmap <target>' command performs a standard default top-1000 TCP port scan against that host.",
      ],
    },

    challenge: {
      taskDescription:
        "Construct and execute a valid Nmap command targeting the isolated lab host at 192.0.2.45. Do not include extra options.",
      requiredCommand: "nmap 192.0.2.45",
      acceptedVariants: ["nmap 192.0.2.45"],
      allowedOptions: [],
      targetIp: "192.0.2.45",
    },

    hints: [
      {
        level: 1,
        title: "Conceptual Clue",
        text: "Every command in the terminal begins with the tool name itself, followed by the specific entity you want to inspect.",
      },
      {
        level: 2,
        title: "Directional Clue",
        text: "The tool we are learning is called 'nmap'. You do not need any flag or modifier for a default scan on a single machine.",
      },
      {
        level: 3,
        title: "Command Structure",
        text: "Type the command name 'nmap' followed by a space, and then the exact documentation IP assigned in your briefing: 192.0.2.45.",
      },
      {
        level: 4,
        title: "Worked Example",
        text: "Enter: nmap 192.0.2.45\n\nExplanation: 'nmap' invokes the scanner binary; '192.0.2.45' is the single host argument passed to the tool.",
      },
    ],

    commandBreakdown: [
      {
        token: "nmap",
        type: "Executable Binary",
        description: "The name of the Network Mapper executable. It tells the operating system which program to launch.",
        impact: "Changing this to another name would fail unless an alias or binary with that name exists.",
      },
      {
        token: "192.0.2.45",
        type: "Target Specification",
        description: "The destination host IPv4 address belonging to RFC 5737 TEST-NET-1.",
        impact: "Specifying an incorrect IP would attempt to contact a different device or fail network routing.",
      },
    ],

    checkpoint: {
      question:
        "Why is targeting '192.0.2.45' different from targeting '192.0.2.0/24' in this mission?",
      options: [
        {
          id: "opt-a",
          text: "192.0.2.45 targets a single specific host; 192.0.2.0/24 targets a subnet block of 256 addresses.",
          isCorrect: true,
          explanation: "Correct! An IP address without a CIDR slash identifies one host. A /24 subnet designates 256 IP addresses (from .0 to .255).",
        },
        {
          id: "opt-b",
          text: "192.0.2.45 is a private address while 192.0.2.0/24 is a public internet domain.",
          isCorrect: false,
          explanation: "Incorrect. Both addresses belong to the reserved documentation block RFC 5737. The slash notation indicates a subnet range.",
        },
        {
          id: "opt-c",
          text: "192.0.2.45 automatically enables stealth scanning whereas 192.0.2.0/24 does not.",
          isCorrect: false,
          explanation: "Incorrect. Target notation does not change scanning techniques; options like -sS or -sT determine scan types.",
        },
        {
          id: "opt-d",
          text: "There is no difference; Nmap treats all target specifications identically.",
          isCorrect: false,
          explanation: "Incorrect. Nmap iterates across every address in a subnet range, which requires much more traffic and time than a single host.",
        },
      ],
    },
  },

  "mission-02": {
    id: "mission-02",
    pathId: "nmap-foundations",
    number: "02",
    title: "Discover Live Hosts",
    subtitle: "Subnet ping scanning, the -sn flag, and latency analysis",
    difficulty: "Beginner",
    estimatedMinutes: 20,
    scenarioHost: "192.0.2.0/28",
    scenarioHostname: "lab-subnet-bravo.cyberlab.internal",
    networkContext: "RFC 5737 Subnet (16 IP addresses: .0 through .15)",

    briefing: {
      overview:
        "Before inspecting thousands of ports on individual systems, network engineers and security analysts map out which devices are currently powered on and reachable.",
      importance:
        "Scanning all 65,535 ports on hundreds of inactive IP addresses wastes hours of time and generates needless network noise. Host discovery lets you quickly separate live targets from empty IP slots.",
      objectives: [
        "Understand what host discovery ('ping scanning') accomplishes.",
        "Learn the role of Nmap's -sn flag (no port scan).",
        "Scan an entire simulated /28 subnet (16 IP addresses).",
        "Analyze the simulated results to identify active responding hosts.",
        "Recognize why an unresponsive host is not definite proof of absence.",
      ],
      prerequisites: [
        "A CIDR notation like /28 denotes 16 total IP addresses.",
        "Host discovery checks if a device responds to ICMP echo, TCP SYN to port 443, TCP ACK to port 80, or ARP requests.",
        "The -sn option tells Nmap: 'Find who is up, but do NOT scan any ports right now.'",
      ],
    },

    conceptExplanation: {
      heading: "Ping Scanning with -sn",
      body: [
        "In older versions of Nmap, this option was written as -sP ('ping scan'). Modern Nmap uses -sn, which explicitly stands for 'no port scan'.",
        "When you run 'nmap -sn <target>', Nmap determines whether the target is responsive. Once it receives a reply, it marks the host as 'Host is up' and moves to the next IP without checking individual services.",
        "Crucial cybersecurity lesson: An unresponsive host does NOT guarantee no machine is there. Firewalls and packet filters frequently drop ping probes to conceal systems!",
      ],
      codeExample: "nmap -sn 192.0.2.0/28",
      notes: [
        "Subnet 192.0.2.0/28 contains 16 IP addresses (from 192.0.2.0 to 192.0.2.15).",
        "Option -sn disables port scanning to keep discovery fast and focused.",
        "Notice how the option flag precedes or follows the target: 'nmap -sn 192.0.2.0/28'.",
      ],
    },

    challenge: {
      taskDescription:
        "Run an Nmap host discovery scan against the entire lab subnet 192.0.2.0/28 using the -sn option to discover which hosts are live.",
      requiredCommand: "nmap -sn 192.0.2.0/28",
      acceptedVariants: ["nmap -sn 192.0.2.0/28", "nmap 192.0.2.0/28 -sn"],
      allowedOptions: ["-sn"],
      targetIp: "192.0.2.0/28",
    },

    hints: [
      {
        level: 1,
        title: "Conceptual Clue",
        text: "Think about what you want the tool to discover before inspecting individual services. We only want to know which machines are turned on and reachable.",
      },
      {
        level: 2,
        title: "Directional Clue",
        text: "Nmap has an option that performs host discovery without a conventional port scan. The letters stand for 'no port scan'.",
      },
      {
        level: 3,
        title: "Command Clue",
        text: "The option is -sn. Now combine it with the exact training subnet shown in your mission briefing: 192.0.2.0/28.",
      },
      {
        level: 4,
        title: "Worked Example",
        text: "Enter: nmap -sn 192.0.2.0/28\n\nExplanation: 'nmap' is the scanner, '-sn' disables port scanning, and '192.0.2.0/28' specifies the 16-address range.",
      },
    ],

    commandBreakdown: [
      {
        token: "nmap",
        type: "Executable Binary",
        description: "Invokes the network exploration engine.",
        impact: "Core tool required for scanning.",
      },
      {
        token: "-sn",
        type: "Scan Option (No Port Scan)",
        description: "Instructs Nmap to perform host discovery only, skipping the default top 1,000 port scan.",
        impact: "Significantly reduces scan duration and network packet overhead. Without it, Nmap would scan 1,000 ports on all 16 addresses.",
      },
      {
        token: "192.0.2.0/28",
        type: "Subnet Target (CIDR)",
        description: "Classless Inter-Domain Routing prefix denoting a block of 16 addresses (192.0.2.0 through 192.0.2.15).",
        impact: "Allows scanning all devices inside this segment simultaneously.",
      },
    ],

    checkpoint: {
      question:
        "Based on the simulated terminal output, which hosts in the 192.0.2.0/28 subnet responded as active ('Host is up')?",
      options: [
        {
          id: "opt-a",
          text: "192.0.2.1, 192.0.2.4, and 192.0.2.10 (3 hosts up).",
          isCorrect: true,
          explanation: "Excellent! The simulated scan detected 192.0.2.1 (gateway), 192.0.2.4 (web node), and 192.0.2.10 (database node) as online.",
        },
        {
          id: "opt-b",
          text: "All 16 IP addresses responded as up.",
          isCorrect: false,
          explanation: "Incorrect. Most addresses in the /28 range had no active device responding to discovery probes.",
        },
        {
          id: "opt-c",
          text: "Only 192.0.2.1 responded; all other IP addresses were permanently decommissioned.",
          isCorrect: false,
          explanation: "Incorrect. Review the terminal output: 192.0.2.4 and 192.0.2.10 also reported 'Host is up'.",
        },
        {
          id: "opt-d",
          text: "No hosts responded because -sn disables all network communication.",
          isCorrect: false,
          explanation: "Incorrect. -sn only disables port scanning; it still sends host discovery probes.",
        },
      ],
      secondaryQuestion:
        "If an IP address in the subnet did not respond, does that prove beyond doubt that no physical computer exists at that address?",
      secondaryOptions: [
        {
          id: "sec-a",
          text: "No. A firewall or OS packet filter may simply be dropping discovery probes without replying.",
          isCorrect: true,
          explanation: "Exactly right! Security-hardened hosts frequently drop ICMP/probe traffic to remain stealthy.",
        },
        {
          id: "sec-b",
          text: "Yes. An Nmap ping scan is mathematically guaranteed to detect all hardware plugged into a cable.",
          isCorrect: false,
          explanation: "Incorrect. Firewalls, network ACLs, and software shields regularly silence active machines.",
        },
      ],
    },
  },

  "mission-03": {
    id: "mission-03",
    pathId: "nmap-foundations",
    number: "03",
    title: "Interpret Port States",
    subtitle: "Open, closed, and filtered states; security implications",
    difficulty: "Beginner",
    estimatedMinutes: 25,
    scenarioHost: "198.51.100.25",
    scenarioHostname: "lab-services.cyberlab.internal",
    networkContext: "RFC 5737 TEST-NET-2 (Simulated Web & Services Host)",

    briefing: {
      overview:
        "Now that you know how to identify targets and discover live hosts, it is time to inspect the actual services running on a host and interpret port states.",
      importance:
        "A common beginner misconception is assuming an 'open port' is a security vulnerability, or that a 'filtered port' means a machine was hacked. In this mission, you will learn what each port state really means under the TCP protocol.",
      objectives: [
        "Execute a port scan against simulated host 198.51.100.25.",
        "Differentiate between 'open', 'closed', and 'filtered' port states.",
        "Understand the TCP packet responses that cause each state.",
        "Articulate what an Nmap port scan can and cannot prove about system security.",
      ],
      prerequisites: [
        "TCP uses a three-way handshake (SYN, SYN-ACK, ACK).",
        "If a port replies with SYN-ACK, Nmap marks it 'open'.",
        "If a port replies with RST (reset), Nmap marks it 'closed'.",
        "If no reply arrives or an ICMP unreachable error is received, Nmap marks it 'filtered'.",
      ],
    },

    conceptExplanation: {
      heading: "The Three Fundamental Port States",
      body: [
        "When Nmap probes a TCP port, it analyzes the return packet:",
        "1. OPEN: An application (like Apache web server or OpenSSH) is actively accepting connections. The host returned a SYN-ACK packet.",
        "2. CLOSED: The host received the probe, but no application is listening on that port number. The operating system kernel responded with a RST (reset) packet.",
        "3. FILTERED: Nmap sent probes, but no response was returned, or a firewall sent back an ICMP error code (such as type 3, code 13). Nmap cannot tell if an application is listening because the firewall barricaded the door.",
        "CRITICAL DISTINCTION: An open port is NOT necessarily a vulnerability! An open web server on port 80 is doing its normal intended job. Only unpatched bugs or misconfigurations make services vulnerable.",
      ],
      codeExample: "nmap 198.51.100.25",
      notes: [
        "Target: 198.51.100.25 (RFC 5737 TEST-NET-2).",
        "Standard scan: Inspects the top 1,000 most common ports.",
        "Observe the output table containing PORT, STATE, and SERVICE columns.",
      ],
    },

    challenge: {
      taskDescription:
        "Perform a port scan against the simulated host at 198.51.100.25 to discover and analyze its open, closed, and filtered services.",
      requiredCommand: "nmap 198.51.100.25",
      acceptedVariants: ["nmap 198.51.100.25"],
      allowedOptions: [],
      targetIp: "198.51.100.25",
    },

    hints: [
      {
        level: 1,
        title: "Conceptual Clue",
        text: "You want Nmap to examine the service ports on a single specific host. We do not need the -sn flag here, because -sn disables port scanning!",
      },
      {
        level: 2,
        title: "Directional Clue",
        text: "A standard port scan only requires the command name and the target IP address.",
      },
      {
        level: 3,
        title: "Command Clue",
        text: "Use 'nmap' followed by the designated test server address: 198.51.100.25.",
      },
      {
        level: 4,
        title: "Worked Example",
        text: "Enter: nmap 198.51.100.25\n\nExplanation: This instructs Nmap to inspect the most common ports on 198.51.100.25 and display their states.",
      },
    ],

    commandBreakdown: [
      {
        token: "nmap",
        type: "Executable Binary",
        description: "The scanner engine that crafts and dispatches TCP probe packets.",
        impact: "Core executable.",
      },
      {
        token: "198.51.100.25",
        type: "Target IP Address",
        description: "The destination host from RFC 5737 TEST-NET-2 hosting simulated web and application services.",
        impact: "Directs probes to this specific host.",
      },
    ],

    checkpoint: {
      question:
        "Review the simulated scan results for 198.51.100.25. Which statement accurately describes the observed port states?",
      options: [
        {
          id: "opt-a",
          text: "Port 80/tcp is open (HTTP web), port 22/tcp is closed (SSH), and port 443/tcp is filtered (firewall dropping packets).",
          isCorrect: true,
          explanation: "Correct! The simulated service on port 80 responded with SYN-ACK; port 22 replied with RST; and port 443 had probes dropped by a firewall.",
        },
        {
          id: "opt-b",
          text: "All 1,000 scanned ports are completely open and vulnerable to immediate exploitation.",
          isCorrect: false,
          explanation: "Incorrect. Only port 80 is open. Most ports were closed or filtered.",
        },
        {
          id: "opt-c",
          text: "Port 80 is filtered because HTTP traffic is banned by the operating system kernel.",
          isCorrect: false,
          explanation: "Incorrect. Port 80 clearly reports state 'open', meaning the web server answered positively.",
        },
        {
          id: "opt-d",
          text: "A closed port means an adversary has installed a backdoor on port 22.",
          isCorrect: false,
          explanation: "Incorrect. A closed port simply means no service is listening on that port.",
        },
      ],
      secondaryQuestion:
        "What does an Nmap port scan alone prove about the security posture of target 198.51.100.25?",
      secondaryOptions: [
        {
          id: "sec-a",
          text: "It proves which ports are accepting connections, but cannot prove whether the running web application has security flaws or has been compromised.",
          isCorrect: true,
          explanation: "Spot on! An open port indicates service availability, not whether the software is vulnerable, properly authenticated, or compromised.",
        },
        {
          id: "sec-b",
          text: "It definitively proves that the web server is 100% secure from all cyber threats.",
          isCorrect: false,
          explanation: "Incorrect. An open port could be running obsolete, vulnerable software. Port state alone does not guarantee security.",
        },
      ],
    },
  },
};
