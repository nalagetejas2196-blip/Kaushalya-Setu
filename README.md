# KAUSHALYA SETU (कौशल्य सेतू)
### *"From Skills to Opportunity"*
**Smart India Hackathon 2026 — Problem Statement PS 26097**
*Inclusive, Multilingual, AI-Powered Livelihood Navigator for SC Communities under the PM-AJAY / GIA Context*



## 1. Project Overview

**Kaushalya Setu** bridges the critical divide between underserved Scheduled Caste (SC) beneficiaries—specifically in rural, peri-urban, and aspirational districts—and viable livelihood opportunities. 

Under the aegis of the **Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)** and **Grant-in-Aid (GIA)** frameworks, the platform simplifies a fragmented, bureaucratic maze into a unified, guided 8-step citizen pathway:

$$\text{Discovery} \longrightarrow \text{Skill Assessment} \longrightarrow \text{Skill Gap Analysis} \longrightarrow \text{NSQF Training} \longrightarrow \text{PM-AJAY Schemes} \longrightarrow \text{Local Opportunities} \longrightarrow \text{Application} \longrightarrow \text{Officer Verification} \longrightarrow \text{Outcome}$$

### Core Problems Solved
- **No Middlemen**: Transparent, direct citizen-to-officer digital processing.
- **No Repeated Office Visits**: Online Digital Locker for caste, income, and educational credentials.
- **Overcoming Language Barriers**: True 3-way language parity across **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**.
- **Overcoming Digital Literacy Barriers**: Voice-first AI Assistant (**Kaushalya Sahayak**) utilizing browser speech recognition and speech synthesis.
- **Skill-Opportunity Mismatch**: Conversational AI extracts practical skills from rural colloquial descriptions and matches them to **NSQF Level 3 & 4** qualification packs.
- **Predictive Decision Support**: First-of-its-kind **"What If?" Career Pathway Simulator** comparing pathways (e.g. *Solar PV Technician* vs *Agro-Pump Maintenance*).

---

## 2. Complete Evaluator Demonstration Journey (5–7 Minutes)

An SIH evaluator can test the entire closed-loop system in under 7 minutes:

| Step | Action | What to Observe |
|---|---|---|
| **1. Landing & A11y** | Open `http://localhost:5173` | Government-standard header, tricolor accent, disclaimer marquee, font-scaling (`A-`, `A`, `A+`), high-contrast toggle, and Marathi/Hindi/English switcher. |
| **2. Instant Demo Login** | Click `[Beneficiary Demo: Savita Patil]` on the top Demo Bar | Instant 1-click access as **Savita Patil** (22, SC, Sangamner Taluka, Ahilyanagar District). |
| **3. Voice Assistant** | Click the floating **"कौशल्य सहायक (Voice)"** button | Ask or click: *"माझ्यासाठी कोणत्या योजना आहेत?"* or *"माझ्या जवळ नोकरी कुठे आहे?"*. The assistant responds in spoken voice and grounded text. |
| **4. AI Skill Discovery** | Navigate to **"My Skills & Discovery"** (`/skills`) | Type or pick: *"I help my father repair agricultural pumps and maintain farm equipment."* Click **"Extract Skills"**. Observe AI extraction of *Agro-Pump Troubleshooting*, *Mechanical Repair*, and *Tool Handling* mapped to NSQF packs. Click **"Confirm Skills"**. |
| **5. Skill Gap Analysis** | Navigate to **"Skill Gap Analysis"** (`/skill-gap`) | Select **Solar PV Installation Technician**. Observe the visual match meter (60%), skills you have vs skills you need, and the recommended 100% free training batch at **Govt ITI Sangamner** with ₹1,500/mo stipend. |
| **6. "What If?" Simulator** | Navigate to **"'What If?' Simulator"** (`/simulator`) | Compare **Pathway A (Solar Tech)** vs **Pathway B (Pump Specialist)**. Observe comparative skill alignment, duration, and local opportunity demand. |
| **7. Scheme Eligibility** | Navigate to **"Government Schemes"** (`/schemes`) | Click **"Check Eligibility"** on *PM-AJAY Grant-in-Aid for SC Livelihood Projects*. Review the transparent rule-by-rule criteria breakdown (SC category, age, income ceiling). |
| **8. Apply for Opportunity** | Navigate to **"Local Opportunities"** (`/opportunities`) | Toggle **Map View** to view OpenStreetMap pins around Sangamner. Click **"Apply"** on *Solar Installation Technician Apprentice*. Review profile, inspect mock digital documents, accept declaration, and submit. An official ID **`KAUS-2026-XXXX`** is generated! |
| **9. Officer Verification** | Click `[Officer Demo: Rajesh Deshmukh]` on the top Demo Bar | Enter District Welfare Officer portal (`/officer`). Open the submitted application, review Savita's uploaded documents, click **"Verify Document"**, select status **"Approved"**, enter remark, and submit decision. |
| **10. Citizen Notification** | Click `[Beneficiary Demo: Savita Patil]` on the top Demo Bar | Observe the notification bell badge increment! Open notifications to see: *"Your application has been Approved by District Welfare Officer."* |

---

## 3. Demo Accounts & Credentials

The system includes pre-configured demo personas:

| Role | Name / Title | Email / Identifier | Password / OTP |
|---|---|---|---|
| **Beneficiary** | Savita Patil (SC Rural Candidate, Sangamner) | `demo.beneficiary@kaushalyasetu.local` or `9876543210` | **Demo OTP: `123456`** |
| **District Officer** | Rajesh Deshmukh (District Welfare Officer, DWO) | `demo.officer@kaushalyasetu.local` | `Officer@2026` |
| **System Admin** | Sunil Gaikwad (State Operations Lead) | `demo.admin@kaushalyasetu.local` | `Admin@2026` |

*Tip: Evaluators can click the 1-Click Demo buttons on the top Demo Bar to switch instantly without typing credentials.*

---

## 4. Architecture & Technical Stack

```
kaushalya-setu/
├── backend/
│   ├── config/db.js            # Dual-mode DB: MongoDB + embedded persistent JSON fallback
│   ├── data/seed.json          # Pre-seeded PM-AJAY schemes, NSQF jobs, training institutes
│   ├── data/store.json         # Dynamic persistent local datastore
│   ├── routes/                 # Express REST APIs (Auth, Skills, Schemes, Apps, Notifications)
│   ├── services/               # NLP Skill Extractor, Rule-based Eligibility Evaluator
│   └── server.js               # Express server (Port 5000)
├── frontend/
│   ├── src/
│   │   ├── components/layout/  # GovTopBar, GovDisclaimer, DemoBar, GovHeader, GovFooter
│   │   ├── components/voice/   # KaushalyaSahayakVoice (Web Speech API + SpeechSynthesis)
│   │   ├── components/map/     # OpportunityMap (OpenStreetMap visual coordinate pins)
│   │   ├── context/            # Auth, Multilingual (i18n), Accessibility, Notifications
│   │   ├── locales/            # mr.json (Marathi), hi.json (Hindi), en.json (English)
│   │   ├── pages/              # 12 Core Pages (Home, Skills, Gap, Simulator, Schemes, etc.)
│   │   ├── App.jsx             # Route manager
│   │   └── main.jsx            # Entry point
│   ├── tailwind.config.js      # Indian Government Color System (Navy, Saffron, Green)
│   └── vite.config.js          # Vite configuration with /api backend proxy
└── README.md
```

### Technology Highlights
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Node.js, Express.
- **Database Resilience**: Connects to MongoDB if `MONGODB_URI` is provided; automatically falls back to an **embedded persistent JSON file store** with zero configuration required.
- **Mapping**: OpenStreetMap coordinates and visual cluster layout without requiring any paid Google Maps API keys.
- **Voice**: Browser-native Web Speech API with Marathi (`mr-IN`), Hindi (`hi-IN`), and English (`en-IN`) recognition and voice synthesis.
- **Accessibility**: Meets WCAG 2.1 AA and Guidelines for Indian Government Websites (GIGW).

---

## 5. Quick Installation & Running Guide

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### Step 1: Install Dependencies
```bash
# In the project root directory:
npm run install:all
```
*(Or run `npm install` inside both `backend/` and `frontend/`)*

### Step 2: Start Backend Server
```bash
# Terminal 1:
cd backend
npm start
```
*Backend runs on `http://localhost:5000`*

### Step 3: Start Frontend Client
```bash
# Terminal 2:
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### Step 4: Open in Browser
Visit **`http://localhost:5173`** and click **`[Beneficiary Demo: Savita Patil]`** to start the evaluation journey.

---

## 6. SIH 2026 Innovation Highlights

1. **Grounded AI (Zero Hallucination)**: The assistant never invents government benefits, funding amounts, or qualification codes. All responses are verified against the PM-AJAY repository.
2. **Transparent "Why this Matches You"**: Every scheme, training, and job recommendation includes explicit rationale chips explaining the exact profile criteria matched.
3. **Audit Trail Compliance**: Every status modification performed by the District Welfare Officer is recorded in an immutable audit timeline viewable by the applicant.
4. **State/District Real-Time Analytics**: Built-in Recharts dashboards for district magistrates and welfare officers to track scheme uptake, taluka penetration, and training demand.
