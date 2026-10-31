"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  Shield,
  BookOpen,
  Terminal,
  Scale,
  Award,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";

export default function ResourcesPage() {
  const resourceGroups = [
    {
      title: "Official Specifications & Standards",
      description: "Foundational RFCs and protocol specifications used in security engineering.",
      items: [
        {
          title: "RFC 5737 — IPv4 Address Blocks Reserved for Documentation",
          desc: "Defines TEST-NET-1 (192.0.2.0/24), TEST-NET-2 (198.51.100.0/24), and TEST-NET-3 (203.0.113.0/24).",
          tag: "Standards",
          link: "https://datatracker.ietf.org/doc/html/rfc5737",
        },
        {
          title: "RFC 1918 — Address Allocation for Private Internets",
          desc: "Defines the non-routable private address blocks: 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16.",
          tag: "Standards",
          link: "https://datatracker.ietf.org/doc/html/rfc1918",
        },
        {
          title: "RFC 793 — Transmission Control Protocol (TCP)",
          desc: "The definitive specification of the TCP state machine, SYN/ACK handshakes, and RST behaviors.",
          tag: "Protocols",
          link: "https://datatracker.ietf.org/doc/html/rfc793",
        },
      ],
    },
    {
      title: "Tool Documentation & Manuals",
      description: "Official guides and references for industry-standard security tools.",
      items: [
        {
          title: "Nmap Network Scanning (Official Book)",
          desc: "Written by Gordon 'Fyodor' Lyon. The definitive guide to port scanning, timing, and evasion.",
          tag: "Documentation",
          link: "https://nmap.org/book/man.html",
        },
        {
          title: "Linux Command Line & Man Pages",
          desc: "Complete manual pages for core Linux networking utilities: ip, ping, ss, and iptables.",
          tag: "CLI Tools",
          link: "https://man7.org/linux/man-pages/",
        },
        {
          title: "Metasploit Unleashed (OffSec Free Course)",
          desc: "Free ethical penetration testing walkthrough developed by Offensive Security.",
          tag: "Training",
          link: "https://www.offsec.com/metasploit-unleashed/",
        },
      ],
    },
    {
      title: "Ethics, Law & Responsible Disclosure",
      description: "Legal boundaries, CFAA compliance, and rules of engagement.",
      items: [
        {
          title: "Computer Fraud and Abuse Act (CFAA) Overview",
          desc: "Understanding authorization thresholds and why scanning unauthorized systems violates federal law.",
          tag: "Legal",
          link: "https://www.justice.gov/criminal/criminal-ccips",
        },
        {
          title: "OWASP Vulnerability Disclosure Cheat Sheet",
          desc: "Best practices for coordinating and reporting software vulnerabilities to developers.",
          tag: "Ethics",
          link: "https://cheatsheetseries.owasp.org/",
        },
      ],
    },
  ];

  return (
    <AppShell>
      <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Header */}
        <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-border space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-mono uppercase text-cyber-emerald font-semibold">
              Curated Materials
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-cyber-text tracking-tight">
            Learning Resources & References
          </h1>
          <p className="text-xs lg:text-sm text-cyber-muted max-w-2xl leading-relaxed">
            RFC technical standards, official tool documentations, and professional ethics guidelines for cybersecurity practitioners.
          </p>
        </div>

        {/* Resources Groups */}
        <div className="space-y-8">
          {resourceGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-cyber-text">{group.title}</h2>
                <p className="text-xs text-cyber-muted">{group.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item, iIdx) => (
                  <a
                    key={iIdx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-5 rounded-2xl bg-cyber-card border border-cyber-border hover:border-cyber-emerald/40 hover:bg-cyber-surface transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-surface border border-cyber-border text-cyber-emerald uppercase">
                          {item.tag}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-cyber-muted group-hover:text-cyber-emerald transition-colors" />
                      </div>
                      <h3 className="font-bold text-xs text-cyber-text group-hover:text-white leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-cyber-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 text-[10px] font-mono text-cyber-muted/60 flex items-center gap-1 group-hover:text-cyber-emerald transition-colors">
                      <span>Read Specification</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
