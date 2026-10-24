/**
 * CYBERLAB Glossary Data
 * Defines key cybersecurity, networking, and scanning concepts for beginners.
 */

export const GLOSSARY_ITEMS = [
  {
    id: "ip-address",
    term: "IP Address",
    category: "Networking",
    definition:
      "A unique numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication.",
    example: "192.0.2.45 (IPv4)",
    analogy: "Like a unique postal street address for a building on the internet.",
  },
  {
    id: "subnet-cidr",
    term: "Subnet & CIDR Notation",
    category: "Networking",
    definition:
      "A logical subdivision of an IP network. Classless Inter-Domain Routing (CIDR) notation expresses an IP address and its network prefix length with a slash followed by the prefix bit length.",
    example: "192.0.2.0/28 (specifies a block of 16 contiguous IP addresses)",
    analogy: "Like specifying a whole block or neighborhood rather than just a single house number.",
  },
  {
    id: "port",
    term: "Network Port",
    category: "Networking",
    definition:
      "A 16-bit virtual communication endpoint (0 to 65535) mapped to a specific service or application on a host.",
    example: "Port 80 (HTTP Web), Port 22 (SSH Remote Shell), Port 443 (HTTPS Secure Web)",
    analogy: "If an IP address is an apartment building, the port number is the specific apartment door.",
  },
  {
    id: "nmap",
    term: "Nmap (Network Mapper)",
    category: "Security Tooling",
    definition:
      "An open-source utility for network exploration, host discovery, and security auditing. It determines what hosts are available, what services they offer, and what filters/firewalls are in place.",
    example: "nmap -sn 192.0.2.0/28",
    analogy: "Like an inventory inspector checking which doors in a facility are unlocked, secured, or barricaded.",
  },
  {
    id: "host-discovery",
    term: "Host Discovery",
    category: "Scanning",
    definition:
      "The initial reconnaissance phase used to determine which target IP addresses are online and actively responding to probes before attempting deeper port or vulnerability scans.",
    example: "nmap -sn (often called a 'ping scan', disables port scanning)",
    analogy: "Calling roll call in a classroom to see who is present today before assigning specific tasks.",
  },
  {
    id: "open-port",
    term: "Open Port State",
    category: "Port States",
    definition:
      "An application is actively listening for connections on this port. When Nmap sends a probe, the target returns an affirmative response (such as a TCP SYN/ACK).",
    example: "80/tcp open http",
    analogy: "A receptionist sitting behind the front desk ready to accept visitors.",
  },
  {
    id: "closed-port",
    term: "Closed Port State",
    category: "Port States",
    definition:
      "The host is reachable and responds to probes, but no service or daemon is listening on that specific port number. The host sends back a TCP RST (reset) packet.",
    example: "22/tcp closed ssh",
    analogy: "The building is open, but that specific room is empty and locked with a 'Nobody here' sign.",
  },
  {
    id: "filtered-port",
    term: "Filtered Port State",
    category: "Port States",
    definition:
      "Nmap cannot determine whether the port is open because packet filtering (such as a firewall, router ACL, or host packet filter) prevents its probes from reaching the port or blocks response packets.",
    example: "443/tcp filtered https",
    analogy: "A security guard at the gate who shreds your letters without letting them through or sending a reply.",
  },
  {
    id: "rfc-5737",
    term: "RFC 5737 Documentation Ranges",
    category: "Standards & Safety",
    definition:
      "IPv4 address blocks reserved strictly for use in documentation, tutorials, and simulated labs. Packets to these addresses must never be routed over the public Internet.",
    example: "192.0.2.0/24 (TEST-NET-1), 198.51.100.0/24 (TEST-NET-2), 203.0.113.0/24 (TEST-NET-3)",
    analogy: "Like using '555-0199' as a phone number in movies so real people aren't accidentally called.",
  },
  {
    id: "authorized-scope",
    term: "Authorized Scope",
    category: "Ethics & Legal",
    definition:
      "The strictly defined boundaries, targets, systems, and timeframes agreed upon in advance for security testing. Scanning outside of authorized scope is unethical and frequently illegal.",
    example: "Only scanning 192.0.2.45 in the CYBERLAB isolated training sandbox.",
    analogy: "A certified home inspector only checking the specific property they have a written contract to inspect.",
  },
];
