# 🌟 ShareEventPhoto AI — Luxury AI Wedding Photo Finder & Face Matcher

[![Next.js Version](https://img.shields.io/badge/Next.js-v16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-v19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![DeepFace](https://img.shields.io/badge/AI_Engine-DeepFace_/_FaceNet-e05c2b?style=for-the-badge&logo=python)](https://github.com/serengil/deepface)
[![Prisma ORM](https://img.shields.io/badge/Database-Prisma_/_PostgreSQL-0c344b?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

An elegant, premium SaaS platform designed for wedding hosts and events. Guests can instantly find all high-resolution professional wedding photos containing their faces. Instead of sorting manually through thousands of images in a shared drive, guests simply scan a personalized QR flyer, take/upload a quick selfie, and let our facial recognition AI deliver their personal gallery.

---

## 📌 Table of Contents
1. [Core Features](#-core-features)
2. [System Architecture](#-system-architecture)
3. [Tech Stack](#-tech-stack)
4. [Project Directory Layout](#-project-directory-layout)
5. [Setup & Installation](#-setup--installation)
   - [Prerequisites](#prerequisites)
   - [AI Microservice Setup](#1-ai-microservice-setup-pythonflask)
   - [Backend Gateway Setup](#2-backend-gateway-setup-expressprisma)
   - [Frontend Client Setup](#3-frontend-client-setup-nextjs-16)
6. [Testing Connection Utilities](#-testing-connection-utilities)
7. [Environment Configuration Reference](#-environment-configuration-reference)
8. [License & Credits](#-license--credits)

---

## ⚡ Core Features

### 💍 For Event & Wedding Hosts
- **Luxurious Dashboard:** Modern event metrics dashboard displaying storage metrics, image counts, active downloads, and guest scan analytics.
- **Bilingual QR Code Flyer Generator:** Built-in client-side canvas flyer designer that bundles event details, dynamic QR codes, and bilingual guest instructions (English/Bengali) into printable high-res PNG flyers.
- **Flexible Subscription Packages:** Dynamic tiering support (Free, Gold, Elite plans) with storage limit restrictions (50MB up to 20GB) and zipped bulk downloads.
- **Bulk Image Uploader:** Smooth dragging and drop uploads that batch stream high-quality photos straight to Cloudinary.

### 📸 For Wedding Guests
- **Selfie Scanner Screen:** Premium web camera scanner interface that captures/uploads a quick selfie.
- **Real-Time Facial Matching:** Instantly pulls only the photos containing their face from the database.
- **Instant Media Actions:** High-speed single photo download or one-click priority ZIP stream download of all matched photos.
- **Zero-Storage Privacy:** Built-in face matching executes on-the-fly; selfie images are not stored long-term, preserving guest privacy.

---

## 🏗️ System Architecture

Our platform utilizes a hybrid architecture featuring a high-performance **Next.js 16 App Router** frontend, a scalable **Express.js API gateway** serving as the database controller, and a specialized **Flask AI Microservice** running **DeepFace (FaceNet)** for facial embeddings extraction and matching.

```mermaid
graph TD
    %% User Roles
    Host[Event Host]
    Guest[Wedding Guest]

    %% Main Subsystems
    FE[Next.js 16 Frontend App]
    BE[Express.js API Gateway / Backend]
    AI[Flask AI Microservice]
    DB[(PostgreSQL / Prisma DB)]
    Cloudinary[(Cloudinary Cloud Storage)]

    %% Host Flow
    Host -->|1. Creates Event & Uploads Gallery| FE
    FE -->|2. Sends Photo Stream| BE
    BE -->|3. Uploads High-Res Photos| Cloudinary
    BE -->|4. Calls Process Endpoint with URL| AI
    AI -->|5. Runs DeepFace FaceNet Model| AI
    AI -->|6. Extracts 128D Face Embeddings| BE
    BE -->|7. Saves Embeddings & URLs| DB

    %% Guest Flow
    Guest -->|8. Scans QR / Visits Event Page| FE
    Guest -->|9. Uploads Selfie Search Image| FE
    FE -->|10. Uploads Selfie| Cloudinary
    FE -->|11. Sends Selfie URL| BE
    BE -->|12. Gets Selfie Vector & Matches Candidates| AI
    AI -->|13. Calculates Cosine Similarity >= Threshold| AI
    AI -->|14. Returns Matching Photo IDs| BE
    BE -->|15. Retrieves Photo URLs| DB
    BE -->|16. Sends Matched Gallery| FE
    FE -->|17. Displays Matched Photos & Downloads| Guest
```

---

## 🛠️ Tech Stack

### Frontend Client
- **Core Framework:** Next.js 16 (App Router), React 19, TypeScript
- **State Management:** Redux Toolkit & Redux Persist (for local persistence of authentication and event states)
- **Styling & Animations:** Tailwind CSS v4, Framer Motion (premium glassmorphic styling, custom grids, and interactive particles)
- **UI feedback:** SweetAlert2, React Hot Toast, Canvas Confetti

### Backend Gateway
- **Runtime & Web Framework:** Node.js, Express, TypeScript
- **Database ORM:** Prisma Client
- **Database Engine:** PostgreSQL
- **Media Uploads:** Multer & Multer-Storage-Cloudinary
- **Security:** JSON Web Tokens (JWT), Bcrypt hashing, CORS policies

### AI Engine (Microservice)
- **Framework:** Python, Flask
- **Facial Extraction:** DeepFace (Pre-trained `FaceNet` model, leveraging Cosine Similarity matches with configurable thresholds)
- **Vector Calculations:** NumPy (efficient array calculations and vector norms)

---

## 📁 Project Directory Layout

```
Wedding AI Photo Finder/
├── wedding_ai_photo_finder/              # NEXT.JS FRONTEND (Current Workspace)
│   ├── public/                           # Static assets, QR icons
│   ├── src/
│   │   ├── app/                          # Next.js App Router (Dashboard, Admin, Guest, Login)
│   │   ├── components/                   # UI components (FaceScanner, FileUpload, etc.)
│   │   │   ├── shared/                   # Common Navbars, Footers, background wrappers
│   │   │   └── ui/                       # Specific components (home sections, guides)
│   │   ├── redux/                        # Redux toolkit store, RTK Queries API endpoints
│   │   └── utils/                        # Style utilities, canvas configurations
│   ├── check-ai.js                       # Connection test utility for AI Service
│   └── check-db.js                       # Connection test utility for Prisma database
│
├── wedding_ai_photo_finder_backend/      # EXPRESS BACKEND GATEWAY
│   ├── prisma/                           # Prisma Schema definitions & migrations
│   ├── src/
│   │   ├── controllers/                  # Route handlers (auth, photo upload, event management)
│   │   ├── middlewares/                  # JWT verification & Multer config
│   │   ├── routes/                       # Express routes
│   │   └── server.ts                     # Express app initialization
│   └── ai-service/                       # PYTHON FLASK AI MICROSERVICE
│       ├── app.py                        # Flask server (DeepFace/FaceNet processing)
│       ├── Dockerfile                    # Containerization setup
│       └── requirements.txt              # Python packages (DeepFace, Flask, NumPy)
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Python (v3.9 or higher) with pip
- PostgreSQL Database
- Cloudinary Account (for hosting images)

---

### 1. AI Microservice Setup (Python/Flask)
Navigate to the AI service directory and set up the dependencies:

```bash
cd wedding_ai_photo_finder_backend/ai-service
```

Create a virtual environment:
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install packages:
```bash
pip install -r requirements.txt
```

Launch the AI server (runs on Port `5000` by default):
```bash
python app.py
```
> [!NOTE]
> On the first start, DeepFace will automatically download the pre-trained `FaceNet` weights to your local machine.

---

### 2. Backend Gateway Setup (Express/Prisma)
Navigate to the Express backend workspace:

```bash
cd wedding_ai_photo_finder_backend
```

Install Node packages:
```bash
npm install
```

Configure your environment variables (`.env`):
Create a `.env` file inside `wedding_ai_photo_finder_backend` following the variables schema below.

Deploy database schema & generate Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

Start the Express development server (runs on Port `5050` or `5000` depending on configuration):
```bash
npm run dev
```

---

### 3. Frontend Client Setup (Next.js 16)
Navigate to the main frontend directory:

```bash
cd wedding_ai_photo_finder
```

Install dependencies:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your premium web app.

---

## 🧪 Testing Connection Utilities

To ensure all pieces of this multi-service SaaS project are communicating properly, the root frontend directory includes two diagnostic scripts:

### Test AI Service Connectivity
Run this to verify the Flask server is online and reachable by Node:
```bash
node check-ai.js
```
*Expected Output:*
```
STATUS: 200
HEADERS: {...}
BODY: {"model":"Facenet","status":"AI Service Running"}
```

### Test Prisma Database Connectivity
Run this to check database connection metrics, event statuses, and embedding tallies:
```bash
node check-db.js
```

---

## 🔒 Environment Configuration Reference

### Backend Gateway Config (`wedding_ai_photo_finder_backend/.env`)
```ini
PORT=5050
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
JWT_ACCESS_SECRET="your_jwt_secret_key"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
AI_SERVICE_URL="http://127.0.0.1:5000"
```

### Frontend Client Config (`wedding_ai_photo_finder/.env`)
```ini
NEXT_PUBLIC_API_URL="http://localhost:5050/api/v1"
```

---

## 🧑‍💻 License & Credits

- Designed & Built by **[Tanvir Ahmed](https://tanvirahmed1.netlify.app/)** — Full-stack developer specializing in luxury React/Next.js SaaS solutions.
- Powered by [DeepFace](https://github.com/serengil/deepface) and Vercel Next.js.
