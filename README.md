# CYBERLAB — Interactive Cybersecurity Academy

CYBERLAB is a polished, hands-on cybersecurity learning platform inspired by the interactive coding experience of Replit. It teaches beginners and intermediate practitioners Linux, networking, Nmap, and penetration-testing concepts through structured courses, simulated terminal execution, progressive hints, realistic outputs, knowledge checkpoints, and cross-device progression sync.

---

## 🗺️ Application Information Architecture

The platform is structured into clear functional domains across dedicated Next.js App Router pages:

### 1. LEARN
- **Overview (`/`)**: Main learner dashboard emphasizing the next action, active course progress, quick metrics, and achievements.
- **Learning Paths (`/paths`)**: Progression trees across specialized tracks (Reconnaissance Specialist, Offensive Security Practitioner, Wireless Auditor).
- **Course Library (`/courses`)**: Comprehensive course catalog with search, category filtering, difficulty filters, and availability sorting.
- **Course Detail (`/courses/[id]`)**: Deep-dive into course objectives, prerequisites, and lesson syllabi.
- **My Learning (`/my-learning`)**: Enrolled courses, active track status, and quick-continue actions.

### 2. PRACTICE
- **Practice Labs (`/practice`)**: Free-form terminal sandbox with quick-reference command execution against simulated targets.
- **Missions (`/missions`)**: Catalog of interactive Nmap missions.
- **Interactive Lab Workspace (`/missions/[id]`)**: Full guided environment with Mission Briefing, Progressive Hints, Simulated Terminal, Command Breakdown, and Checkpoints.
- **Challenges (`/challenges`)**: Targeted skill assessments testing command precision and interpretation speed.

### 3. REFERENCE
- **Command Reference (`/reference/commands`)**: Searchable index of Nmap and Linux terminal commands with parameter explanations.
- **Networking Glossary (`/glossary`)**: Full-page dictionary of networking, port state, and protocol concepts with analogies.
- **Learning Resources (`/resources`)**: Curated links to RFC specifications (RFC 5737, RFC 1918, RFC 793), tool manuals, and ethical testing standards.

### 4. PERSONAL & ACCOUNT
- **My Progress (`/progress`)**: Detailed analytics, mission attempts, verified skills, and activity audit trail.
- **Achievements (`/achievements`)**: Milestone gallery showcasing earned and upcoming badges.
- **My Profile (`/profile`)**: User identity, bio, avatar fallback, visibility preferences, and edit modal.
- **Settings (`/settings`)**: Dedicated Account, Profile, Learning preferences, Privacy, and Data Reset controls.

### 5. AUTHENTICATION (SUPABASE)
- **Sign In (`/login`)**: Email/password authentication, validation, password visibility toggle.
- **Sign Up (`/signup`)**: Account creation with display name, username, password confirmation.
- **Forgot Password (`/forgot-password`)**: Secure password recovery workflow.
- **Auth Callback (`/auth/callback`)**: Session exchange route handler for email verification and password recovery.

---

## 🔒 Safe Cybersecurity Architecture

- **Zero OS Command Execution**: The terminal is an isolated in-browser parser. It never calls `child_process`, `exec`, `spawn`, `eval`, or public networks.
- **RFC 5737 Scopes**: Prohibits public or unapproved IP scanning; permits only designated documentation ranges (`192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`).
- **Security Boundaries**: Shell chaining (`&&`, `||`, `;`), subshells (`$()`), and redirection (`>`, `<`) are strictly blocked with educational guidance.

---

## 🗄️ Supabase Database Schema & Setup

A PostgreSQL schema migration with full Row Level Security (RLS) is located at:
`supabase/migrations/001_initial_schema.sql`

### Tables:
1. `profiles`: User display name, unique username, bio, avatar URL, visibility (`public` / `private`).
2. `user_progress`: Per-lesson status (`completed`, `in_progress`), attempts, hints used, completion timestamps.
3. `learning_activity`: Chronological log of commands, checkpoint clears, and mission milestones.
4. `achievements`: Catalog of system milestone badges.
5. `user_achievements`: User-unlocked achievement records.

### Row Level Security (RLS):
- Strict policies ensure users can only view, insert, or modify their own progress and activity records.
- Public profiles are readable by the community only if `profile_visibility = 'public'`.
- Fallback Local Mode: When Supabase environment variables are not configured, CYBERLAB functions in offline guest mode using `localStorage` (`CYBERLAB_STATE_V1`).

---

## 🏃 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional for Supabase Sync)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Supabase Project URL and Anon Public Key. (If omitted, the app runs in Local Guest Mode seamlessly).

### 3. Run Automated Tests
```bash
npm test
```
Runs 21 unit tests covering shell validation, target scopes, mission rule checking, and curriculum data integrity.

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### 5. Production Build
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel

1. Push repository to GitHub or GitLab.
2. Import project into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Environment Variables in Vercel settings (if connecting to Supabase).
4. Deploy!
