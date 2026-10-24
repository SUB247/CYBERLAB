/**
 * CYBERLAB Deterministic Scenario Data
 * Provides realistic, educational simulated outputs for Nmap missions and sandbox mode.
 * RFC 5737 compliant documentation targets.
 */

export const SCENARIOS = {
  // Mission 01: Single target scan on 192.0.2.45
  "mission-01": {
    target: "192.0.2.45",
    hostname: "training-target-alpha.cyberlab.internal",
    allowedOptions: [],
    generateOutput: (timestamp = "2026-10-23 12:00:00 UTC") => [
      `Starting Nmap 7.94 ( https://nmap.org ) at ${timestamp}`,
      `[SIMULATED LAB ENVIRONMENT - RFC 5737 TEST-NET-1]`,
      `Initiating SYN Stealth Scan at 12:00`,
      `Scanning training-target-alpha.cyberlab.internal (192.0.2.45) [1000 ports]`,
      `Discovered open port 80/tcp on 192.0.2.45`,
      `Discovered open port 22/tcp on 192.0.2.45`,
      `Completed SYN Stealth Scan at 12:00, 0.42s elapsed (1000 total ports)`,
      `Nmap scan report for training-target-alpha.cyberlab.internal (192.0.2.45)`,
      `Host is up (0.0019s latency).`,
      `Not shown: 997 closed tcp ports (reset)`,
      `PORT     STATE    SERVICE`,
      `22/tcp   open     ssh`,
      `80/tcp   open     http`,
      `443/tcp  filtered https`,
      `MAC Address: 02:42:C0:00:02:2D (Simulated Virtual Interface)`,
      ``,
      `Nmap done: 1 IP address (1 host up) scanned in 0.48 seconds`,
    ],
  },

  // Mission 02: Host discovery ping scan on subnet 192.0.2.0/28
  "mission-02": {
    target: "192.0.2.0/28",
    subnetRange: "192.0.2.0 - 192.0.2.15",
    allowedOptions: ["-sn"],
    liveHosts: [
      { ip: "192.0.2.1", name: "gw-router.cyberlab.internal", latency: "0.0011s" },
      { ip: "192.0.2.4", name: "web-node-01.cyberlab.internal", latency: "0.0023s" },
      { ip: "192.0.2.10", name: "db-node-primary.cyberlab.internal", latency: "0.0018s" },
    ],
    generateOutput: (timestamp = "2026-10-23 12:05:00 UTC") => [
      `Starting Nmap 7.94 ( https://nmap.org ) at ${timestamp}`,
      `[SIMULATED LAB ENVIRONMENT - RFC 5737 TEST-NET-1 SUBNET /28]`,
      `Initiating Ping Scan at 12:05`,
      `Scanning 16 hosts in subnet 192.0.2.0/28 [4 ports/host]`,
      `Completed Ping Scan at 12:05, 0.28s elapsed (16 total hosts)`,
      ``,
      `Nmap scan report for gw-router.cyberlab.internal (192.0.2.1)`,
      `Host is up (0.0011s latency).`,
      `MAC Address: 02:42:C0:00:02:01 (Simulated Lab Gateway)`,
      ``,
      `Nmap scan report for web-node-01.cyberlab.internal (192.0.2.4)`,
      `Host is up (0.0023s latency).`,
      `MAC Address: 02:42:C0:00:02:04 (Simulated Web Instance)`,
      ``,
      `Nmap scan report for db-node-primary.cyberlab.internal (192.0.2.10)`,
      `Host is up (0.0018s latency).`,
      `MAC Address: 02:42:C0:00:02:0A (Simulated Database Node)`,
      ``,
      `Nmap done: 16 IP addresses (3 hosts up) scanned in 0.35 seconds`,
    ],
  },

  // Mission 03: Port states scan on 198.51.100.25
  "mission-03": {
    target: "198.51.100.25",
    hostname: "lab-services.cyberlab.internal",
    allowedOptions: [],
    portStates: [
      { port: "80/tcp", state: "open", service: "http", reason: "syn-ack" },
      { port: "22/tcp", state: "closed", service: "ssh", reason: "reset" },
      { port: "443/tcp", state: "filtered", service: "https", reason: "no-response" },
    ],
    generateOutput: (timestamp = "2026-10-23 12:10:00 UTC") => [
      `Starting Nmap 7.94 ( https://nmap.org ) at ${timestamp}`,
      `[SIMULATED LAB ENVIRONMENT - RFC 5737 TEST-NET-2]`,
      `Initiating SYN Stealth Scan at 12:10`,
      `Scanning lab-services.cyberlab.internal (198.51.100.25) [1000 ports]`,
      `Completed SYN Stealth Scan at 12:10, 0.52s elapsed (1000 total ports)`,
      `Nmap scan report for lab-services.cyberlab.internal (198.51.100.25)`,
      `Host is up (0.0021s latency).`,
      `Not shown: 997 closed tcp ports (reset)`,
      `PORT     STATE    SERVICE  REASON`,
      `22/tcp   closed   ssh      reset ttl 64`,
      `80/tcp   open     http     syn-ack ttl 64`,
      `443/tcp  filtered https    no-response`,
      `MAC Address: 02:42:C6:33:64:19 (Simulated Services Interface)`,
      ``,
      `PORT STATE INTERPRETATION:`,
      `  - 80/tcp  [OPEN]    : Web server is active and sent SYN-ACK. Accepts connections.`,
      `  - 22/tcp  [CLOSED]  : Port is reachable; OS replied with RST. No SSH daemon listening.`,
      `  - 443/tcp [FILTERED]: Probe dropped without reply. Host firewall or network filter active.`,
      ``,
      `Nmap done: 1 IP address (1 host up) scanned in 0.58 seconds`,
    ],
  },

  // Sandbox / Practice mode
  practice: {
    validTargets: ["192.0.2.45", "192.0.2.0/28", "198.51.100.25", "192.0.2.1"],
    systemCommands: {
      help: [
        "CYBERLAB SIMULATED PRACTICE ENVIRONMENT",
        "Available educational commands:",
        "  nmap <target>          : Scan default ports on a simulated target",
        "  nmap -sn <subnet>      : Host discovery (ping scan) on a subnet",
        "  ip addr                : Display simulated local network interface info",
        "  ping -c 3 <target>     : Send 3 simulated ICMP echo probes",
        "  clear                  : Clear terminal screen",
        "",
        "Authorized Lab Targets (RFC 5737):",
        "  - 192.0.2.45           : Training target Alpha",
        "  - 192.0.2.0/28         : Lab subnet Bravo (16 IPs)",
        "  - 198.51.100.25        : Lab services host",
        "",
        "Note: Real network scanning is prohibited. Only lab targets are simulated.",
      ],
      "ip addr": [
        "1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000",
        "    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00",
        "    inet 127.0.0.1/8 scope host lo",
        "       valid_lft forever preferred_lft forever",
        "2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000",
        "    link/ether 02:42:0a:00:01:02 brd ff:ff:ff:ff:ff:ff",
        "    inet 192.0.2.100/24 brd 192.0.2.255 scope global eth0",
        "       valid_lft forever preferred_lft forever",
        "[LAB INTERFACE: learner-workstation.cyberlab.internal]",
      ],
    },
  },
};
