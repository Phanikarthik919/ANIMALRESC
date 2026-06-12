# Animal Rescue Network

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen) ![License](https://img.shields.io/badge/License-ISC-blue) ![Version](https://img.shields.io/badge/Version-1.0.0-orange) ![Stack](https://img.shields.io/badge/Stack-MERN-success)

*A full-stack web app for reporting stray/injured animals, coordinating volunteer rescues, accepting donations, and processing adoption applications.*

---

## Table of Contents
- [About the Project](#about-the-project)
- [Features List](#features-list)
- [Technologies & Ecosystem](#technologies--ecosystem)
- [Getting Started Locally](#getting-started-locally)
- [Team Members & Contribution Roster](#team-members--contribution-roster)

---

## About the Project

Animal Rescue Network is a MERN stack web app where anyone can report a stray or injured animal, volunteers can claim and treat them, donors can fund medical care through Razorpay, and families can apply to adopt once the animal is ready.

**Live Production URLs:**
- **[Live Web Application (Frontend)](https://animalresc.onrender.com)**
- **[Hosted API Server (Backend)](https://animalresc.onrender.com)**

**Project Duration:** Ongoing development.

---

## Features List

- Rescue Reporting — anyone (guest or logged-in user) can report an animal with a photo, description, and GPS location.
- Volunteer Claiming — volunteers can claim open rescues and move them through a status pipeline: `Pending → Rescued from Location → Rescued and Treated → Ready for Adoption → Rehomed`.
- JWT Authentication — email/password login with 5-day token expiry.
- Google OAuth 2.0 — sign in with Google, with role selection on first login.
- Role-Based Access Control — three roles: `user`, `volunteer`, `admin`.
- Razorpay Donations — donors can fund specific rescue cases; payments are verified server-side using HMAC-SHA256.
- Adoption Applications — users submit an application (Aadhar ID, house photos, safety checklist); volunteers approve or reject; approval auto-rejects all other pending applications and marks the animal as Rehomed.
- Profile — view/edit name, role, avatar, and track adoption application statuses.
- Campaigns & Blogs pages.

---

## Technologies & Ecosystem

| Category | Technology | Version | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + Vite | 19 / 8 | Client-side SPA rendering and hot-module-reload compilation. |
| **Styling** | Tailwind CSS | 4+ | Utility-first responsive styling across all components. |
| **HTTP Client** | Axios | 1.x | REST API communication with bearer token headers. |
| **Routing** | React Router DOM | 7+ | Client-side view navigation and route guards. |
| **Backend Runtime** | Node.js + Express | 18+ / 5.x | REST API server logic and request routing. |
| **Database** | MongoDB Atlas | 6+ | Cloud-hosted NoSQL document database. |
| **Data Modeling** | Mongoose | 9+ | Schema validation, population, and query abstraction. |
| **Authentication** | bcryptjs + JWT | Latest | Password hashing and stateless session tokens. |
| **Google Auth** | google-auth-library | 10+ | Server-side Google ID token verification for OAuth 2.0. |
| **Payment Gateway** | Razorpay SDK | 2.x | INR payment order creation and HMAC signature verification. |
| **File Uploads** | Multer | 2.x | Multipart form-data handling for photos and documents. |

---

## Getting Started Locally

**System Prerequisites:** Node.js v18+, Git, npm v9+, MongoDB Atlas URI, Razorpay account, Google Cloud OAuth credentials.

**Clone the repo:**
```bash
git clone https://github.com/Phanikarthik919/ANIMALRESC.git
cd Animal-Rescue
```

**Backend Startup Checklist:**
1. Navigate to backend: `cd BACKEND`
2. Install packages: `npm install`
3. Duplicate `.env.example` (or create `.env`) and add variables:
   ```env
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   FRONTEND_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   PORT=5001
   ```
4. Start server: `npm run dev`

**Frontend Startup Checklist:**
1. Navigate to frontend: `cd ../FRONTEND`
2. Install packages: `npm install`
3. Create `.env` and add:
   ```env
   VITE_API_URL=http://localhost:5001
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   ```
4. Start client: `npm run dev`

---

## Team

| Member | Role | Contributions | Links |
| :--- | :--- | :--- | :--- |
| **Kandukoori Phani Karthik** | Full Stack | React UI, Express API, Razorpay, MongoDB schemas, JWT Auth, Google OAuth | [GitHub](https://github.com/Phanikarthik919) |

---
*See `FRONTEND/README.md` and `BACKEND/README.md` for more details.*
