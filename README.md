# 🐾 Animal Rescue Network

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=flat-square)](https://github.com/Phanikarthik919/ANIMALRESC)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%20Vision-blue?style=flat-square)](https://ai.google.dev/)
[![Stack](https://img.shields.io/badge/Stack-MERN-success?style=flat-square)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](LICENSE)
[![Patent Strategy](https://img.shields.io/badge/Innovation-Patent--Pending-orange?style=flat-square)](#-patentable-innovation-ai-veterinary-visual-triage--priority-dispatch)

> **An intelligent, AI-powered animal rescue network and emergency response platform.** Bridges bystanders, volunteers, and veterinary teams through automated computer vision injury triage, algorithmic priority dispatch, crowdsourced medical donations, and adoption workflows.

---

## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [🌟 Patent-Pending Innovation](#-patentable-innovation-ai-veterinary-visual-triage--priority-dispatch)
- [Key Features](#-key-features)
- [System Architecture & Technologies](#-system-architecture--technologies)
- [API Endpoints](#-api-endpoints)
- [Getting Started Locally](#-getting-started-locally)
- [Environment Variables](#-environment-variables)
- [Team & Authors](#-team--authors)

---

## 📖 About the Project

Street animals face critical life-threatening injuries daily from road accidents and abuse. Traditional rescue platforms rely on manual text forms and chronological (First-In, First-Out) dispatch lists, causing delays in treating critically injured animals.

**Animal Rescue Network** solves this by embedding **multimodal computer vision triage** directly into the intake workflow. When a bystander uploads a photo of an injured animal, our AI triage engine assesses species, detects visible trauma, scores emergency severity (1–100), gives immediate first-aid instructions, and automatically prioritizes the case on the volunteer response dashboard.

### 🌐 Live Production Links
- **Frontend App:** [https://animalresc.vercel.app](https://animalresc.vercel.app)
- **Backend API:** [https://animalresc.onrender.com](https://animalresc.onrender.com)

---

## 🌟 Patentable Innovation: AI Veterinary Visual Triage & Priority Dispatch

Unlike standard CRUD rescue directories, this platform implements a novel **System and Method for Automated Multimodal Triage and Emergency Dispatch in Animal Rescue Networks**:

```
[Bystander Uploads Photo]
          │
          ▼
[Google Gemini Multimodal Vision Engine]
          │
  ┌───────┴───────────────────────────────┐
  ▼                                       ▼
[Clinical Assessment]             [Algorithmic Priority Score: 1-100]
• Species & Breed Identification   • Critical (80-100) -> Immediate Dispatch
• Trauma Classification            • High (60-79)     -> Urgent Care (< 2h)
• Clinical Diagnostic Telemetry    • Medium (30-59)   -> Medical Attention
• Immediate First-Aid Guide        • Low (1-29)       -> Stray Wellness
          │                                       │
          └───────────────┬───────────────────────┘
                          ▼
        [Emergency Priority Queue & Feed]
        • Automated volunteer alert banner
        • Dynamic priority ranking (severity > timestamp)
        • Detailed AI Diagnostic Modal for rescuers
```

### 🔬 Core Novel Capabilities:
1. **Multimodal Visual Triage**: Evaluates wound depth, physical trauma, posture, and facial distress using Google Gemini Vision (`gemini-3.1-flash-lite`, `gemini-flash-latest`, `gemini-3.5-flash` with resilient automatic failover).
2. **Context-Aware First-Aid Guidance**: Instantly gives the reporter actionable instructions (e.g., limb stabilization, burn flushing, thermal regulation) while rescue teams are en route.
3. **Emergency Dispatch Queue**: Replaces standard timestamp-based feeds with an algorithmic priority score ($1 \le S \le 100$) so critical life-or-death emergencies are dispatched first.
4. **Interactive Clinical Telemetry**: Volunteers and veterinarians can open an AI Diagnostic Report on any card to view species classification, suspected injury type, urgency window, and recommended medical kit.

---

## 🚀 Key Features

### 1. 🚨 AI Triage & Rescue Reporting
- Real-time photo analysis with instant diagnostic card.
- One-click **"Auto-Fill Title & Description from AI"**.
- Interactive Leaflet map with drag-and-drop GPS pin drop and reverse geocoding via OpenStreetMap.
- Automatic medical donation goal estimation based on trauma severity.

### 2. 🎯 Volunteer Coordination & Pipeline
- Multi-state rescue lifecycle tracking:
  $$\text{Pending} \rightarrow \text{Rescued from Location} \rightarrow \text{Rescued and Treated} \rightarrow \text{Ready for Adoption} \rightarrow \text{Rehomed}$$
- Single-click Google Maps turn-by-turn directions to the rescue coordinates.
- Filter feed by triage severity (`Critical`, `High`, `Medium`, `Low`) or sort by AI Priority Score.
- "Show My Claims Only" toggle for active volunteer tracking.

### 3. 💳 Crowdfunded Medical Care (Razorpay)
- In-app micro-donations directly linked to specific animal cases.
- Secure server-side signature verification using HMAC-SHA256.
- Dynamic progress bars tracking funds raised vs. medical target.

### 4. 🏡 Verified Adoption Workflow
- Formal application process requiring applicant details, Aadhar verification, and living condition photos.
- Volunteer approval/rejection panel with automated notification status.
- Single-click adoption completion which automatically marks the pet as **Rehomed**.

### 5. 🔐 Authentication & Role-Based Access
- Secure JWT authentication with 5-day session duration.
- Google OAuth 2.0 integration with automatic role configuration (`user`, `volunteer`, `admin`).
- Role-gated volunteer claiming and administrative dashboards.

---

## 🛠 System Architecture & Technologies

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **AI Vision Engine** | Google Gemini API | 3.x Flash | Autonomous visual triage, species detection & emergency priority scoring |
| **Frontend SPA** | React + Vite | 19 / 8 | Responsive, high-performance user interface |
| **Styling** | Tailwind CSS | 4+ | Utility-first design tokens and responsive layout |
| **Mapping & GIS** | Leaflet + OpenStreetMap | 1.9+ | Interactive GPS pin placement and reverse geocoding |
| **Backend API** | Node.js + Express | 18+ / 5.x | REST API server, authentication, and triage routing |
| **Database** | MongoDB Atlas | 6+ | Cloud document database with Mongoose schemas |
| **Payments** | Razorpay SDK | 2.x | Real-time payment processing and signature verification |
| **Authentication** | JWT + Google Auth | Latest | Secure token sessions and Google OAuth 2.0 |
| **Deployment** | Vercel + Render | Cloud | Continuous frontend and backend deployment |

---

## 📡 API Endpoints

### 🩺 AI Triage & Rescues (`/api/rescues`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/rescues/ai-triage` | Analyzes image and returns veterinary triage telemetry | Optional |
| `GET` | `/api/rescues` | Retrieves rescues (supports `?sort=priority` or `?sort=recent`) | No |
| `POST` | `/api/rescues` | Creates a new rescue report with AI triage data | Optional |
| `PUT` | `/api/rescues/:id/claim` | Volunteer claims a pending rescue | Yes (`volunteer`/`admin`) |
| `PUT` | `/api/rescues/:id/status` | Updates status along the rescue pipeline | Yes (Claimant) |
| `PUT` | `/api/rescues/:id/donate` | Records donation against target | No |

### 🔐 Auth (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user or volunteer |
| `POST` | `/api/auth/login` | Email/password login |
| `POST` | `/api/auth/google` | Google OAuth token verification |
| `GET` | `/api/auth/me` | Current user profile |

### 🐾 Adoptions & Payments (`/api/adoptions`, `/api/payment`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/adoptions` | Submit pet adoption application |
| `GET` | `/api/adoptions/my` | View user's submitted applications |
| `PUT` | `/api/adoptions/:id/status`| Volunteer approve/reject adoption |
| `POST` | `/api/payment/orders` | Create Razorpay order |
| `POST` | `/api/payment/verify` | Verify payment signature |

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18+) & npm
- MongoDB Atlas cluster URL
- Google AI Studio Gemini API Key
- Razorpay Test Account credentials

### 1. Clone the repository
```bash
git clone https://github.com/Phanikarthik919/ANIMALRESC.git
cd Animal-Rescue
```

### 2. Configure & Run Backend
```bash
cd BACKEND
npm install
```

Create a `.env` file in `BACKEND/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
PORT=5001

# Google Gemini AI Triage Engine
GEMINI_API_KEY=your_google_ai_studio_api_key
GEMINI_MODEL=gemini-3.5-flash

# Payment & OAuth Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
```

Start the backend server:
```bash
npm run dev
```

### 3. Configure & Run Frontend
```bash
cd ../FRONTEND
npm install
```

Create a `.env` file in `FRONTEND/`:
```env
VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the Vite development server:
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 👨‍💻 Team & Authors

* **Kandukoori Phani Karthik** — Full-Stack Developer & AI Systems Architect
  * GitHub: [@Phanikarthik919](https://github.com/Phanikarthik919)

---

## 📄 License
This project is licensed under the ISC License.
