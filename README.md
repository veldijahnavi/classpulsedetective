# ClassPulse Detective

> **"Diagnose the gap. Adapt the learning. Empower the teacher."**

ClassPulse Detective is an AI-assisted adaptive learning platform built specifically for Indian school students in Classes 6–10 across:
1. **CBSE / NCERT** (Secondary Curriculum & Rationalized Textbooks)
2. **Telangana SSC / SCERT** (State Curriculum Framework & Textbooks)
3. **CISCE / ICSE** (Regulations & Syllabuses)

Academic Year: **2026–2027**

---

## 🎯 The Complete Learning Journey

```
SELECT CURRICULUM
      ↓
LEARN THE ENTIRE TOPIC (Comprehensive 16-Point Trilingual Lesson)
      ↓
MULTI-QUESTION PRACTICE (Target: 10 Qs • Live Progress Bar • Honest Shortage Disclosure)
      ↓
ADAPTIVE QUESTIONING (Correct → Higher Bloom's Difficulty; Incorrect → Concept Misconception Analysis)
      ↓
CONCEPT DETECTIVE (Investigative Multi-Probe Root Gap Diagnosis)
      ↓
SMART RECOVERY (Targeted Scaffolding Remediation & Prerequisite Bridge)
      ↓
MASTERY CHECK (Guided Scaffolding Practice)
      ↓
FRESH RETEST (Zero Question Repetition • Before-and-After Performance Delta)
      ↓
REAL-TIME TEACHER DASHBOARD UPDATE (SSE Streaming + Instant Polling Fallback)
```

---

## 👥 Demo Accounts (Fictional Demo Data for Hackathon Evaluation)

### 👨‍🏫 Teacher Portals
| Name | Login ID | Password | Scope / Assignments |
|---|---|---|---|
| **Mrs. Priya Sharma** | `teacher_priya` | `Teacher@2026` | CBSE (Class 8 & 10), Telangana SSC (Class 8 & 10) |
| **Mr. Rajesh Verma** | `teacher_rajesh` | `Teacher@2026` | CBSE (Class 6, 8 & 10) |

### 🎓 Demo Student Profiles (Spanning Classes 6–10 across All 3 Boards)
| Student Name | Login ID | Password | Board | Class | Focus Topic |
|---|---|---|---|---|---|
| **Rahul Sharma** | `rahul.sharma` | `Student@2026` | CBSE | 8 | English Grammar (Adverbs & Tenses) |
| **Ananya Iyer** | `ananya.iyer` | `Student@2026` | CBSE | 10 | Science (Chemical Balancing & Reactions) |
| **Arjun Rao** | `arjun.rao` | `Student@2026` | Telangana SSC | 10 | Physical Science (Curved Mirrors & Lenses) |
| **Kavya Reddy** | `kavya.reddy` | `Student@2026` | Telangana SSC | 8 | Biological Science (Cell & Microorganisms) |
| **Rohan Mehta** | `rohan.mehta` | `Student@2026` | CISCE | 10 | Chemistry (Periodic Table Trends) |
| **Simran Kaur** | `simran.kaur` | `Student@2026` | CISCE | 8 | Computer Studies (Operating Systems & Logic) |
| **Vikram Patel** | `vikram.patel` | `Student@2026` | CBSE | 6 | Science (Food Nutrients & Deficiency) |
| **Deepa Nair** | `deepa.nair` | `Student@2026` | CBSE | 7 | Science (Nutrition in Plants & Animals) |
| **Sanjay Verma** | `sanjay.verma` | `Student@2026` | CBSE | 9 | Science (Matter & Atom Structure) |
| **Sneha Das** | `sneha.das` | `Student@2026` | Telangana SSC | 6 | General Science (Magnets & Simple Circuits) |
| **Manish Gupta** | `manish.gupta` | `Student@2026` | Telangana SSC | 7 | General Science (Heat & Temperature) |
| **Pooja Joshi** | `pooja.joshi` | `Student@2026` | Telangana SSC | 9 | Physical Science (Motion & Laws of Motion) |
| **Tanvi Sen** | `tanvi.sen` | `Student@2026` | CISCE | 6 | Mathematics (Number Systems & Decimals) |
| **Karan Malhotra** | `karan.malhotra` | `Student@2026` | CISCE | 7 | Physics (Force & Motion) |
| **Aditya Roy** | `aditya.roy` | `Student@2026` | CISCE | 9 | Biology (Cell Structure & Tissues) |
| **Meera Nambiar** | `meera.nambiar` | `Student@2026` | CBSE | 8 | Mathematics (Rational Numbers & Linear Eq.) |
| **Tarun Varma** | `tarun.varma` | `Student@2026` | CBSE | 10 | English (Reported Speech & Concord) |
| **Divya Pillai** | `divya.pillai` | `Student@2026` | Telangana SSC | 10 | English (Attitude is Altitude) |

---

## 🛡️ Core Pedagogical & Technical Innovations

1. **Strict Subject, Class, and Board Isolation**:
   - Zero cross-contamination. Class 10 Chemistry queries strictly never receive Class 8 Mathematics questions.
2. **Honest Curriculum Coverage Audit**:
   - The `/api/curriculum/coverage-matrix` computes live percentages against the actual verified database.
   - Never displays 100% when chapters, detailed lessons, or question items are pending.
3. **Multi-Stage Concept Detective**:
   - Stage 1: Detects pattern error tags (`INCORRECT_OXIDE_STOICHIOMETRY`, `ADJECTIVE_ADVERB_CONFUSION`, etc.).
   - Stage 2: Deploys dedicated investigative follow-up probes (`PREREQUISITE` vs `CONCEPTUAL`).
   - Stage 3: Synthesizes diagnosis (`PRACTICING`, `POSSIBLE_MISCONCEPTION`, `PREREQUISITE_GAP`, `STRONG_UNDERSTANDING`).
4. **Smart Recovery & Remediation**:
   - Step-by-step guided remediation with prerequisite bridging and step clues.
   - Retest is unlocked only upon evidence of mastery.
5. **Fresh Retest Assessment**:
   - Distinct question IDs tagged with anti-repetition protection.
   - Computes improvement delta and before-and-after comparison.
6. **Real-Time Teacher Orchestration**:
   - Server-Sent Events (SSE) streaming updates the teacher dashboard instantly upon student practice, recovery, or retest completion.
   - Live synchronization fallback with visible sync timestamps.
7. **Offline & Low-Bandwidth Synchronization**:
   - LocalStorage offline queue (`classpulse_offline_queue_v1`) queues answers when offline.
   - Offline lesson caching (`classpulse_cached_lessons_v1`) enables uninterrupted reading.

---

## 🧪 Verification & Automated Testing

Run the full automated test suites:

```bash
# 1. 13 Mandatory Audit Requirements Suite (npm test)
npm test

# 2. Master End-to-End Verification Suite (All 12 Learning Stages)
node test_e2e_master_suite.js

# 3. Topic-Specific Adverbs & Adaptive Engine Suite
node test_adverbs_topic_engine.js

# 4. TypeScript Strict Compilation & Vite Production Build
npm run lint
npm run build
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Express & Vite server (Port 3000)
npm run dev
```

Server binds to `http://localhost:3000`.
Downloadable master project ZIP: `public/assets/aistudio/ClassPulse-Detective-Fixed-Final.zip`.
## 📦 Download Complete Source Code

The complete ClassPulse Detective project source code is available below.

[📦 Download ClassPulse Detective Source Code (ZIP)](https://github.com/veldijahnavi/classpulsedetective/raw/refs/heads/main/untitled%20%281%29.zip)

Download and extract the ZIP to access the frontend, backend, database, adaptive learning engine, and project configuration files.

## 🚀 Project Repository

[View ClassPulse Detective on GitHub](https://github.com/veldijahnavi/classpulsedetective)
