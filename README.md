# CYBERLAB — Interactive Cybersecurity Learning Platform

CYBERLAB is a polished, hands-on cybersecurity learning application inspired by the interactive coding experience of Replit. It teaches beginners how to understand Linux, networking, Nmap, and foundational penetration-testing concepts through structured missions, an isolated simulated terminal, strict command validation, progressive hints, realistic simulated output, and knowledge checkpoints.

---

## 🚀 Key Features

### 1. Replit-Inspired Learning Loop
Every mission enforces the core pedagogy:
**UNDERSTAND → ATTEMPT → RECEIVE FEEDBACK → USE HINTS → SOLVE → INTERPRET OUTPUT → PASS CHECKPOINT.**

### 2. Three Playable Nmap Beginner Missions
- **Mission 01: Understand the Target**
  - Fictional isolated lab target: `192.0.2.45` (`training-target-alpha`, RFC 5737 TEST-NET-1).
  - Teaches target specifications, command anatomy, and authorized scope.
  - Interactive token breakdown of binary and target parameters.
  - Checkpoint verifying the difference between a single host IP and a subnet.

- **Mission 02: Discover Live Hosts**
  - Fictional lab subnet: `192.0.2.0/28` (16 IP addresses).
  - Teaches ping sweeping with the `-sn` ("no port scan") flag and latency evaluation.
  - Deterministic simulated output identifying 3 responding hosts (`192.0.2.1`, `192.0.2.4`, `192.0.2.10`).
  - Checkpoint verifying live host identification and explaining why unresponsive hosts do not guarantee absence.

- **Mission 03: Interpret Port States**
  - Fictional services target: `198.51.100.25` (RFC 5737 TEST-NET-2).
  - Teaches TCP handshakes and the 3 core states: `open` (SYN-ACK), `closed` (RST), and `filtered` (no reply / firewall drop).
  - Checkpoint analyzing port states and explaining what an Nmap scan does and does not prove about security vulnerabilities.

### 3. Safe In-Browser Terminal Simulator
- **Zero OS Command Execution**: Does not execute learner input through `child_process`, `exec`, `spawn`, `eval`, or public networks.
- **Strict Scope Boundaries**: Prohibits public or unapproved IP scanning; permits only designated RFC 5737 documentation ranges.
- **Security Parser**: Rejects shell chaining (`&&`, `||`, `;`), subshells (`$()`, `` ` ``), redirection (`>`, `<`), and backgrounding (`&`).
- **Terminal Capabilities**:
  - Command execution via `Enter` or the visible **Run** button.
  - History recall using `Arrow Up` and `Arrow Down`.
  - `clear` / `cls` and `help` commands.
  - Realistic dark terminal styling with colored port states and latency tags.

### 4. Progressive Hint System
- **Hint 1**: Conceptual Clue.
- **Hint 2**: Directional Clue.
- **Hint 3**: Command Structure Clue.
- **Worked Example**: Full command and parameter explanation.
- Step-by-step reveal on demand without grade penalties.
- Adaptive guidance provided after repeated incorrect attempts.

### 5. Progress Tracking & Persistence
- Versioned client-side storage (`CYBERLAB_STATE_V1`) via `localStorage`.
- SSR-safe hydration with zero layout shift.
- Live dashboard metrics: course completion %, commands run, hints used, skills acquired, and recent activity logs.
- Milestone achievements: *First Contact*, *Target Acquired*, *Host Detective*, *Port Analyst*, and *Autonomous Hacker*.
- Safe **Reset Progress** modal with confirmation dialog.

### 6. Practice Lab Sandbox & Glossary
- Unrestricted practice mode for testing supported commands against lab targets.
- Searchable Cybersecurity Glossary covering IP addresses, CIDR notation, ports, Nmap, TCP handshakes, port states, and ethical scope.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+ strictly; no TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Architecture**: Vercel-compatible static export & serverless deployment
- **Testing**: Node.js native test runner (`node:test`)

---

## 📂 Project Structure

```
codex learner/
├── app/
│   ├── globals.css                # Custom theme variables, terminal fonts, scrollbars
│   ├── layout.js                 # App root layout, metadata, viewport
│   └── page.js                   # Client workspace orchestrator & router
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.js          # Main dashboard, stats, achievements, curriculum
│   │   └── ProgressOverview.js   # Metric cards
│   ├── layout/
│   │   ├── AppSidebar.js         # Collapsible sidebar, curriculum tree, locked indicators
│   │   └── Topbar.js             # Breadcrumbs, progress pill, simulated lab badges
│   ├── lessons/
│   │   ├── Checkpoint.js         # Interactive knowledge checkpoint quiz
│   │   ├── CommandExplanation.js # Interactive command token anatomy breakdown
│   │   ├── HintPanel.js          # Progressive hint accordion with step reveals
│   │   ├── LessonViewer.js       # Two-column workspace & lesson controller
│   │   └── MissionBriefing.js    # Mission objectives, concept explanations, references
│   ├── practice/
│   │   └── PracticeLab.js        # Free-form sandbox with cheatsheet
│   ├── shared/
│   │   ├── ConfirmDialog.js      # Accessible confirmation modal for reset
│   │   ├── GlossaryModal.js      # Searchable glossary dialog
│   │   ├── HelpModal.js          # Student field guide & keyboard shortcuts
│   │   └── ProgressBar.js        # Reusable progress bar component
│   └── terminal/
│       ├── SimulatedTerminal.js  # Terminal UI, keyboard history, run button
│       └── TerminalOutput.js     # Formatted ANSI/Nmap-style output renderer
├── lib/
│   ├── glossary/
│   │   └── glossary-data.js      # Definitions and analogies for networking terms
│   ├── lessons/
│   │   └── lesson-data.js        # Mission definitions, briefings, challenges, questions
│   ├── progress/
│   │   └── progress-store.js     # Versioned state, LocalStorage sync, achievements
│   └── simulator/
│       ├── command-engine.js     # Controlled command execution & educational errors
│       ├── scenario-data.js      # Deterministic simulated scan outputs
│       └── validators.js         # Shell safety, IPv4, CIDR, and RFC 5737 validators
└── tests/
    └── engine.test.js            # 16 unit tests for safety, validation & progression
```

---

## 🏃 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Tests
```bash
npm test
```
Executes all 16 unit tests verifying shell safety, IP/CIDR validation, mission rule checking, and progress analytics.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

CYBERLAB is built to be 100% Vercel-compatible:

1. Push this repository to GitHub or GitLab.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository.
4. Framework preset will automatically be detected as **Next.js**.
5. Click **Deploy**.

No environment variables or external databases are required for the MVP.

---

## 🧭 Future Expansion Roadmap

- **Milestone 2**: Service & Version Enumeration (`-sV`, service fingerprints).
- **Milestone 3**: Metasploit Framework Fundamentals (safe workflow simulations, module taxonomy).
- **Milestone 4**: Wireless Security & Fern Wi-Fi Auditor Walkthrough.
- **Milestone 5**: Backend-isolated virtual machine lab integration for authorized live scanning.
