const fs = require("fs");
const path = require("path");

async function generateSRS_PDF() {
  console.log("Starting PDF generation for SRS...");
  const puppeteerModule = await import("puppeteer-core");
  const puppeteer = puppeteerModule.default || puppeteerModule;

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  if (!fs.existsSync(chromePath)) {
    throw new Error(`Chrome not found at: ${chromePath}`);
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Software Requirements Specification (SRS) - ShareEventPhoto AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body);"></script>

  <style>
    @page {
      size: A4;
      margin: 18mm 14mm 20mm 14mm;
      @bottom-right {
        content: "Page " counter(page);
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #71717a;
      }
      @bottom-left {
        content: "Northern University Bangladesh • CSE Dept • ShareEventPhoto AI SRS";
        font-family: 'Inter', sans-serif;
        font-size: 8pt;
        color: #71717a;
      }
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 9.5pt;
      line-height: 1.55;
      color: #1e293b;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }

    /* Page Break Rules */
    .page-break {
      page-break-after: always;
      break-after: page;
    }

    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ==========================================================================
       COVER PAGE STYLES
       ========================================================================== */
    .cover-page {
      height: 100vh;
      min-height: 255mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 10mm 10mm;
      border: 3px double #d4af37;
      background: radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.04) 0%, transparent 70%), #ffffff;
      position: relative;
      page-break-after: always;
    }

    .cover-header {
      width: 100%;
    }

    .university-logo {
      width: 85px;
      height: 85px;
      margin: 0 auto 12px;
      border-radius: 50%;
      border: 2px solid #0f4c3a;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0fdf4;
      box-shadow: 0 4px 12px rgba(15, 76, 58, 0.12);
    }

    .university-logo svg {
      width: 50px;
      height: 50px;
      fill: #0f4c3a;
    }

    .university-title {
      font-family: 'Cinzel', serif;
      font-size: 21pt;
      font-weight: 800;
      color: #0f4c3a;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }

    .university-dept {
      font-size: 11pt;
      font-weight: 600;
      color: #334155;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin: 0 0 2px 0;
    }

    .university-faculty {
      font-size: 9.5pt;
      font-weight: 500;
      color: #64748b;
      margin: 0 0 15px 0;
    }

    .cover-divider {
      width: 120px;
      height: 3px;
      background: linear-gradient(90deg, transparent, #d4af37, transparent);
      margin: 10px auto;
    }

    .cover-body {
      width: 100%;
      margin: 15px 0;
    }

    .doc-badge {
      display: inline-block;
      padding: 4px 14px;
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 20px;
      font-size: 8.5pt;
      font-weight: 700;
      color: #92400e;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }

    .doc-title {
      font-family: 'Playfair Display', serif;
      font-size: 22pt;
      font-weight: 700;
      color: #09090b;
      line-height: 1.25;
      margin: 0 0 8px 0;
    }

    .doc-subtitle {
      font-family: 'Inter', sans-serif;
      font-size: 12pt;
      font-weight: 600;
      color: #b45309;
      margin: 0 0 6px 0;
    }

    .doc-tagline {
      font-size: 9pt;
      color: #64748b;
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.4;
    }

    .course-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 18px;
      margin: 15px auto;
      max-width: 500px;
    }

    .course-title {
      font-size: 9.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 3px;
    }

    .course-meta {
      font-size: 8.5pt;
      color: #64748b;
      display: flex;
      justify-content: center;
      gap: 15px;
    }

    .cover-footer {
      width: 100%;
    }

    .submission-table {
      width: 100%;
      max-width: 560px;
      margin: 0 auto 15px;
      border-collapse: collapse;
      font-size: 8.5pt;
      background: #ffffff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .submission-table th {
      background: #0f4c3a;
      color: #ffffff;
      padding: 6px 10px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 8pt;
      letter-spacing: 0.5px;
      border: 1px solid #0f4c3a;
    }

    .submission-table td {
      padding: 6px 10px;
      border: 1px solid #e2e8f0;
      color: #334155;
      text-align: left;
    }

    .submission-table tr:nth-child(even) td {
      background: #f8fafc;
    }

    .submission-meta {
      font-size: 8.5pt;
      font-weight: 600;
      color: #475569;
      margin-top: 5px;
    }

    /* ==========================================================================
       CONTENT STYLES
       ========================================================================== */
    h1 {
      font-family: 'Cinzel', serif;
      font-size: 14pt;
      font-weight: 800;
      color: #0f4c3a;
      border-bottom: 2px solid #0f4c3a;
      padding-bottom: 4px;
      margin-top: 22px;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    h2 {
      font-size: 11pt;
      font-weight: 700;
      color: #0f172a;
      margin-top: 14px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h2::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 13px;
      background: #d4af37;
      border-radius: 2px;
    }

    h3 {
      font-size: 10pt;
      font-weight: 600;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 4px;
    }

    p {
      margin: 0 0 8px 0;
      text-align: justify;
    }

    ul, ol {
      margin: 0 0 10px 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 3px;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    table th {
      background: #1e293b;
      color: #ffffff;
      font-weight: 600;
      padding: 6px 9px;
      border: 1px solid #1e293b;
      text-align: left;
      font-size: 8pt;
    }

    table td {
      padding: 5px 9px;
      border: 1px solid #cbd5e1;
      color: #334155;
    }

    table tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* Code Blocks */
    pre {
      background: #0f172a;
      color: #f8fafc;
      padding: 10px 12px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 7.5pt;
      line-height: 1.45;
      overflow-x: auto;
      margin: 8px 0 12px 0;
      border: 1px solid #334155;
      page-break-inside: avoid;
    }

    code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 8pt;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 3px;
      border: 1px solid #e2e8f0;
    }

    pre code {
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }

    /* Callouts & Alert Boxes */
    .alert-box {
      border-left: 3px solid #d4af37;
      background: #fffbeb;
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
      margin: 10px 0;
      font-size: 8.5pt;
      color: #78350f;
      page-break-inside: avoid;
    }

    .alert-title {
      font-weight: 700;
      margin-bottom: 2px;
      color: #92400e;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .math-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 10px 0;
      text-align: center;
      page-break-inside: avoid;
    }

    /* Badges */
    .badge-must {
      background: #fee2e2;
      color: #991b1b;
      font-weight: 700;
      font-size: 7pt;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #f87171;
    }

    .badge-should {
      background: #fef3c7;
      color: #92400e;
      font-weight: 700;
      font-size: 7pt;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #fbbf24;
    }

    .badge-pass {
      background: #dcfce7;
      color: #166534;
      font-weight: 700;
      font-size: 7pt;
      padding: 1px 5px;
      border-radius: 3px;
      border: 1px solid #4ade80;
    }

    /* TOC */
    .toc-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 18px;
      margin: 15px 0 25px 0;
    }

    .toc-title {
      font-family: 'Cinzel', serif;
      font-size: 11pt;
      font-weight: 800;
      color: #0f4c3a;
      text-transform: uppercase;
      border-bottom: 1.5px solid #0f4c3a;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }

    .toc-list {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 8.5pt;
    }

    .toc-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 2px;
    }

    .toc-item-title {
      font-weight: 600;
      color: #1e293b;
    }

    .diagram-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
      margin: 10px 0;
      text-align: center;
      page-break-inside: avoid;
    }
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- 1. OFFICIAL UNIVERSITY COVER PAGE                                         -->
  <!-- ========================================================================= -->
  <div class="cover-page">
    <div class="cover-header">
      <div class="university-logo">
        <svg viewBox="0 0 24 24">
          <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
        </svg>
      </div>
      <h1 class="university-title" style="border:none; margin:0 0 4px 0;">Northern University Bangladesh</h1>
      <div class="university-dept">Department of Computer Science and Engineering (CSE)</div>
      <div class="university-faculty">Faculty of Science and Engineering</div>
      <div class="cover-divider"></div>
    </div>

    <div class="cover-body">
      <div class="doc-badge">Software Engineering & AI Capstone Specification</div>
      <div class="doc-title">Software Requirements Specification (SRS)</div>
      <div class="doc-subtitle">ShareEventPhoto AI — Luxury AI Wedding Photo Finder & Face Recognition SaaS</div>
      <div class="doc-tagline">
        An end-to-end full-stack cloud platform featuring automated FaceNet deep learning facial embeddings, zero-login WebRTC guest camera scanning, and high-throughput multi-tier gallery management.
      </div>

      <div class="course-card">
        <div class="course-title">Course Title: System Analysis and Design / Software Capstone Project</div>
        <div class="course-meta">
          <span><strong>Course Code:</strong> CSE 4278</span>
          <span>•</span>
          <span><strong>Semester:</strong> 8th Semester (8B)</span>
          <span>•</span>
          <span><strong>Year:</strong> 2026</span>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <h3 style="font-size: 8.5pt; text-transform: uppercase; color: #0f4c3a; margin-bottom: 6px; letter-spacing: 0.5px;">
        Submitted By: Project Team 8B-04
      </h3>
      <table class="submission-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Assigned Role in Project</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tanvir Ahmed</strong></td>
            <td><strong>41420101277</strong></td>
            <td>Lead Full-Stack Architect & AI Engineer</td>
          </tr>
          <tr>
            <td><strong>Md. Mamun Islam</strong></td>
            <td><strong>41420101282</strong></td>
            <td>Frontend Engineer & UI/UX Specialist</td>
          </tr>
          <tr>
            <td><strong>Md. Abdul Kader</strong></td>
            <td><strong>41420101284</strong></td>
            <td>Backend API & Database Engineer</td>
          </tr>
          <tr>
            <td><strong>Md. Nahid Hasan</strong></td>
            <td><strong>41420101285</strong></td>
            <td>QA, Testing & Cloud Infrastructure</td>
          </tr>
        </tbody>
      </table>

      <div class="submission-meta">
        <strong>Submission Date:</strong> October 2026 &nbsp;|&nbsp; <strong>Document Version:</strong> 2.0 (Final Industrial Standard)
      </div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- 2. TABLE OF CONTENTS                                                      -->
  <!-- ========================================================================= -->
  <div class="toc-container">
    <div class="toc-title">Table of Contents</div>
    <div class="toc-list">
      <div class="toc-item"><span class="toc-item-title">1. Introduction</span><span>Section 1.0</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>1.1 Purpose, Conventions & Project Scope</span><span>1.1 - 1.4</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>1.2 Problem Statement & Motivation Matrix</span><span>1.5</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>1.3 Definitions, Acronyms & References</span><span>1.6 - 1.7</span></div>
      <div class="toc-item"><span class="toc-item-title">2. Overall System Description & Architecture</span><span>Section 2.0</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>2.1 3-Tier Hybrid Microservices Model</span><span>2.1 - 2.2</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>2.2 User Personas, Constraints & Operating Environment</span><span>2.3 - 2.6</span></div>
      <div class="toc-item"><span class="toc-item-title">3. System Architecture & Data Flow Sequence</span><span>Section 3.0</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>3.1 Host Event Ingestion & AI Embedding Workflow</span><span>3.1 - 3.2</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>3.2 Guest Selfie Scanner & Real-time Matching Sequence</span><span>3.3</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>3.3 Self-Healing & AI Outage Resiliency Protocol</span><span>3.4</span></div>
      <div class="toc-item"><span class="toc-item-title">4. Functional Requirements Specification</span><span>Section 4.0</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>4.1 Modules 1–3: Auth, RBAC, Storage Quota & Event Lifecycle</span><span>4.1 - 4.3</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>4.2 Modules 4–6: Bulk Upload, AI DeepFace Pipeline & Guest WebRTC Match</span><span>4.4 - 4.6</span></div>
      <div class="toc-item" style="padding-left:12px;"><span>4.3 Modules 7–9: HTML5 Canvas Flyer, Admin Hub & Review System</span><span>4.7 - 4.9</span></div>
      <div class="toc-item"><span class="toc-item-title">5. External Interface & RESTful API Specification</span><span>Section 5.0</span></div>
      <div class="toc-item"><span class="toc-item-title">6. Data Models & Database Schema (Prisma ORM)</span><span>Section 6.0</span></div>
      <div class="toc-item"><span class="toc-item-title">7. AI Computer Vision Mathematical Model (FaceNet & Cosine Metric)</span><span>Section 7.0</span></div>
      <div class="toc-item"><span class="toc-item-title">8. Non-Functional Requirements (Performance, Security, Reliability)</span><span>Section 8.0</span></div>
      <div class="toc-item"><span class="toc-item-title">9. Verification, Diagnostics & Test Cases Matrix</span><span>Section 9.0</span></div>
      <div class="toc-item"><span class="toc-item-title">10. Conclusion & Future Roadmap</span><span>Section 10.0</span></div>
    </div>
  </div>

  <!-- ========================================================================= -->
  <!-- SECTION 1: INTRODUCTION                                                   -->
  <!-- ========================================================================= -->
  <h1>1. Introduction</h1>

  <h2>1.1 Purpose of the Document</h2>
  <p>
    This Software Requirements Specification (SRS) establishes the definitive requirements baseline for the <strong>ShareEventPhoto AI</strong> SaaS platform. Designed according to <strong>IEEE Std 830-1998</strong> and <strong>ISO/IEC/IEEE 29148:2018</strong> standards, this document specifies all functional capabilities, external interfaces, database schemas, computer vision mathematical models, and non-functional guarantees required for full production deployment and academic capstone evaluation at Northern University Bangladesh.
  </p>

  <h2>1.2 Document Conventions & MoSCoW Prioritization</h2>
  <ul>
    <li><span class="badge-must">MUST HAVE</span>: Essential core requirements without which the system cannot function.</li>
    <li><span class="badge-should">SHOULD HAVE</span>: High-priority capabilities essential for optimal SaaS user experience.</li>
    <li><span class="badge-pass">VERIFIED</span>: Features currently implemented, verified, and running in production code.</li>
  </ul>

  <h2>1.3 Problem Statement & Motivation</h2>
  <p>
    In standard wedding ceremonies and social conventions, professional photographers capture 2,000 to 5,000 high-resolution photographs. These images are typically dumped into Google Drive or Dropbox folders. This outdated distribution method creates severe friction:
  </p>

  <table>
    <thead>
      <tr>
        <th style="width:50%;">Traditional Cloud Folder Distribution</th>
        <th style="width:50%;">ShareEventPhoto AI SaaS Solution</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Guests must manually browse 3,000+ photos to locate 5–10 pictures of themselves.</td>
        <td><strong>Instant 1-Second AI Retrieval:</strong> Guest takes a quick selfie to instantly fetch all matched photos.</td>
      </tr>
      <tr>
        <td>Massive mobile data wastage loading unneeded large files.</td>
        <td><strong>Targeted Ingestion:</strong> Downloads only high-res matches or streams a single consolidated ZIP archive.</td>
      </tr>
      <tr>
        <td>No monetization or branding capability for event organizers.</td>
        <td><strong>SaaS Tiering:</strong> Tiered subscription quotas (Free 50MB, Gold 2GB, Elite 20GB) and printable QR table flyers.</td>
      </tr>
      <tr>
        <td>Privacy risks with public folders and indefinite storage.</td>
        <td><strong>Zero-Storage Ephemeral Privacy:</strong> Guest selfies are destroyed immediately after facial vector extraction.</td>
      </tr>
    </tbody>
  </table>

  <h2>1.4 Definitions, Acronyms & Abbreviations</h2>
  <ul>
    <li><strong>FaceNet:</strong> 128-dimensional deep metric learning facial embedding architecture.</li>
    <li><strong>Cosine Similarity:</strong> Angular distance metric measuring alignment between normalized feature vectors in $\mathbb{R}^{128}$.</li>
    <li><strong>WebRTC:</strong> Web Real-Time Communication API providing real-time camera viewfinder streaming inside web browsers.</li>
    <li><strong>Prisma ORM:</strong> Next-generation TypeScript-first Object-Relational Mapper for PostgreSQL.</li>
  </ul>

  <!-- ========================================================================= -->
  <!-- SECTION 2: SYSTEM DESCRIPTION & ARCHITECTURE                              -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <h1>2. Overall System Description & Architecture</h1>

  <h2>2.1 3-Tier Hybrid Microservices Architecture</h2>
  <p>
    The platform employs a decoupled microservices architecture designed for high scalability, separation of concerns, and specialized hardware acceleration:
  </p>

  <div class="diagram-box">
    <pre>
+----------------------------------------------------------------------------------------------------+
|                                    PRESENTATION CLIENT TIER                                        |
|   Next.js 16 (React 19, TypeScript, Redux Toolkit, Framer Motion, HTML5 Canvas QR Flyer Designer)  |
+-------------------------------------------------+--------------------------------------------------+
                                                  |  HTTP REST (JWT Bearer Token)
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                   API GATEWAY & CONTROLLER TIER                                    |
|   Express.js + TypeScript (Auth, Event Hub, Photo Manager, Storage Quotas, AI Proxy Service)       |
+--------------------------+----------------------+--------------------------+-----------------------+
                           |                      |                          |
               Prisma ORM (TCP:5432)         Cloudinary API             HTTP POST (Port 5000)
                           |                      |                          |
                           v                      v                          v
+--------------------------------+ +------------------------------+ +--------------------------------+
|        DATABASE TIER           | |     CLOUD CDN STORAGE        | |        AI ENGINE TIER          |
|  PostgreSQL 14+                | |  Cloudinary Asset Engine     | |  Python Flask Microservice     |
|  - Users & Packages            | |  - High-res event photos     | |  - DeepFace (FaceNet 128D)     |
|  - Events & Photo Records      | |  - Ephemeral guest selfies   | |  - NumPy Vector Math           |
|  - 128D Face Embeddings (JSON) | |    (Auto-purged post-search) | |  - Self-Healing Gateway        |
+--------------------------------+ +------------------------------+ +--------------------------------+
    </pre>
  </div>

  <h2>2.2 User Classes & Personas</h2>
  <ol>
    <li><strong>Wedding Host / Organizer (<code>USER</code>):</strong> Creates events, subscribes to storage packages, bulk-uploads high-res event galleries, generates branded printable table flyers with QR codes, and downloads full-gallery ZIP archives.</li>
    <li><strong>Wedding Guest (<code>GUEST</code>):</strong> Unauthenticated end-user who scans a table flyer, accesses the live WebRTC camera scanner, snaps a selfie, and instantly receives their personal photo gallery.</li>
    <li><strong>Super Administrator (<code>SUPER_ADMIN</code>):</strong> Controls global users, activates/suspends subscription packages, sets storage quotas, and moderates testimonials.</li>
  </ol>

  <!-- ========================================================================= -->
  <!-- SECTION 3: SYSTEM WORKFLOWS & DATA FLOW                                  -->
  <!-- ========================================================================= -->
  <h1>3. System Workflows & Data Flow</h1>

  <h2>3.1 Host Event Creation & Photo Embedding Sequence</h2>
  <div class="diagram-box">
    <pre>
1. Host creates Event (Title, Cover Image) -> Express saves record in PostgreSQL.
2. Host bulk-uploads photos (Drag & Drop) -> Express checks: (usedStorageMB + newSizeMB <= limitMB).
3. Express streams photos to Cloudinary CDN -> receives secure_url and public_id.
4. Express saves Photo records in DB -> triggers POST /process-photo on Python AI Microservice.
5. Python DeepFace extracts 128D vectors for all detected faces -> returns JSON vectors.
6. Express saves FaceEmbedding records in DB -> updates User's usedStorageMB.
    </pre>
  </div>

  <h2>3.2 Guest Selfie Facial Matching Sequence</h2>
  <div class="diagram-box">
    <pre>
1. Guest scans QR code -> loads public route /guest/[eventId] via Next.js 16.
2. Guest captures selfie via WebRTC camera -> dispatches POST /api/v1/ai/search-face.
3. Express uploads ephemeral selfie to Cloudinary -> fetches candidate vectors from PostgreSQL.
4. Express dispatches POST /search-face to Flask AI -> DeepFace extracts 128D selfie vector.
5. Python NumPy computes Cosine Similarity against all event candidate vectors (Threshold: 0.45).
6. Flask AI returns matchedPhotoIds -> Express queries PostgreSQL for matched photo URLs.
7. Express deletes temporary selfie from Cloudinary (Privacy Compliance) -> returns matched gallery to Guest.
    </pre>
  </div>

  <h2>3.3 AI Microservice Self-Healing & Outage Resiliency</h2>
  <div class="alert-box">
    <div class="alert-title">🛡️ Built-in Resilience Protocol</div>
    If an event has photos with missing facial embeddings (due to transient AI service reboots during upload), the backend automatically triggers on-the-fly embedding extraction during the guest's search request before returning results, preventing broken user experiences.
  </div>

  <!-- ========================================================================= -->
  <!-- SECTION 4: FUNCTIONAL REQUIREMENTS                                        -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <h1>4. Functional Requirements Specification</h1>

  <h2>4.1 Module 1: Authentication & Role-Based Access Control (RBAC)</h2>
  <ul>
    <li><strong>FR-AUTH-01 <span class="badge-must">MUST</span>:</strong> Secure registration with unique email and phone validation. Default assignment to Free Trial (50MB).</li>
    <li><strong>FR-AUTH-02 <span class="badge-must">MUST</span>:</strong> Passwords must be cryptographically hashed using <code>bcrypt</code> (12 salt rounds).</li>
    <li><strong>FR-AUTH-03 <span class="badge-must">MUST</span>:</strong> Signed JSON Web Tokens (JWT) containing <code>id, email, name, phone, packageId, role</code> issued upon login.</li>
    <li><strong>FR-AUTH-04 <span class="badge-must">MUST</span>:</strong> Administrative routes restricted strictly to users with <code>Role = SUPER_ADMIN</code>.</li>
  </ul>

  <h2>4.2 Module 2: SaaS Package & Storage Quota Engine</h2>
  <ul>
    <li><strong>FR-PKG-01 <span class="badge-must">MUST</span>:</strong> Support tiered packages: <em>Free Trial (50MB)</em>, <em>Gold Event Plan (2GB)</em>, <em>Elite Lifetime Plan (20GB)</em>.</li>
    <li><strong>FR-PKG-02 <span class="badge-must">MUST</span>:</strong> Atomic pre-upload validation enforcing <code>usedStorageMB + uploadSizeMB &le; storageLimitMB</code>. Transactions abort and delete temporary assets if limit is exceeded.</li>
    <li><strong>FR-PKG-03 <span class="badge-should">SHOULD</span>:</strong> Deleting photos or events must automatically decrement <code>usedStorageMB</code> proportionally in an atomic database transaction.</li>
  </ul>

  <h2>4.3 Module 3: Event Lifecycle & Bulk Media Ingestion</h2>
  <ul>
    <li><strong>FR-EVT-01 <span class="badge-must">MUST</span>:</strong> Hosts can create, view, edit, and delete wedding event catalogs identified by UUIDs.</li>
    <li><strong>FR-EVT-02 <span class="badge-must">MUST</span>:</strong> Cascade deletion must remove Cloudinary assets, PostgreSQL face embeddings, photo records, and event records in a single transaction.</li>
    <li><strong>FR-MED-01 <span class="badge-must">MUST</span>:</strong> High-throughput drag-and-drop uploader streaming images directly to Cloudinary CDN.</li>
  </ul>

  <h2>4.4 Module 4: DeepFace AI Computer Vision & Vector Storage</h2>
  <ul>
    <li><strong>FR-AI-01 <span class="badge-must">MUST</span>:</strong> Python Flask microservice executing DeepFace (FaceNet model) to detect faces and extract 128D normalized vectors.</li>
    <li><strong>FR-AI-02 <span class="badge-must">MUST</span>:</strong> Support multiple faces per photograph; each detected face generates a separate vector record linked to the parent photo.</li>
    <li><strong>FR-AI-03 <span class="badge-should">SHOULD</span>:</strong> Provide on-demand batch embedding reprocessing for entire events.</li>
  </ul>

  <h2>4.5 Module 5: Guest WebRTC Selfie Scanner & Instant Retrieval</h2>
  <ul>
    <li><strong>FR-GST-01 <span class="badge-must">MUST</span>:</strong> Public zero-login guest access via route <code>/guest/[eventId]</code>.</li>
    <li><strong>FR-GST-02 <span class="badge-must">MUST</span>:</strong> Mirrored WebRTC live camera viewfinder with oval face alignment guide and file picker fallback.</li>
    <li><strong>FR-GST-03 <span class="badge-must">MUST</span>:</strong> Ephemeral selfie processing: Guest selfie is deleted from Cloudinary immediately after vector extraction.</li>
    <li><strong>FR-GST-04 <span class="badge-must">MUST</span>:</strong> Guests can download individual full-resolution photos or stream all matched photos as a ZIP archive.</li>
  </ul>

  <h2>4.6 Module 6: Bilingual Printable QR Flyer Designer</h2>
  <ul>
    <li><strong>FR-FLY-01 <span class="badge-must">MUST</span>:</strong> Client-side HTML5 Canvas generator rendering 800x1200 high-resolution printable table flyers.</li>
    <li><strong>FR-FLY-02 <span class="badge-must">MUST</span>:</strong> Features luxury gold gradient double borders, event name card, dynamic QR code, and bilingual (English + Bengali) user instructions.</li>
    <li><strong>FR-FLY-03 <span class="badge-must">MUST</span>:</strong> One-click export to PNG format for wedding reception table card stands.</li>
  </ul>

  <h2>4.7 Module 7: Super Admin Hub & Review Testimonials</h2>
  <ul>
    <li><strong>FR-ADM-01 <span class="badge-must">MUST</span>:</strong> User management table with storage telemetry, account activation toggles, and manual package reassignment.</li>
    <li><strong>FR-REV-01 <span class="badge-should">SHOULD</span>:</strong> Star rating and review feedback submission rendered in a dynamic landing page carousel.</li>
  </ul>

  <!-- ========================================================================= -->
  <!-- SECTION 5: RESTFUL API SPECIFICATION                                      -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <h1>5. External Interface & RESTful API Specification</h1>

  <table>
    <thead>
      <tr>
        <th>HTTP</th>
        <th>API Endpoint Route</th>
        <th>Access Level</th>
        <th>Functional Purpose</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/auth/register</code></td>
        <td>Public</td>
        <td>Register new host account with assigned package.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/auth/login</code></td>
        <td>Public</td>
        <td>Authenticate user and receive signed JWT.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/users/my-dashboard</code></td>
        <td>Host (JWT)</td>
        <td>Retrieve host profile, storage statistics, and event counts.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/packages</code></td>
        <td>Public</td>
        <td>Retrieve active subscription tiers and pricing plans.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/events</code></td>
        <td>Host (JWT)</td>
        <td>Create new wedding event catalog.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/events</code></td>
        <td>Host (JWT)</td>
        <td>List all wedding events created by the logged-in host.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/photos</code></td>
        <td>Host (JWT)</td>
        <td>Bulk upload photos, stream to Cloudinary, extract AI vectors.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/photos/event/:id</code></td>
        <td>Host (JWT)</td>
        <td>Retrieve all photos belonging to a specific event.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/photos/event/:id/download-zip</code></td>
        <td>Host (JWT)</td>
        <td>Stream high-compression ZIP archive of all event photos.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/ai/search-face</code></td>
        <td>Public (Guest)</td>
        <td>Upload selfie, match against event vectors, return photo URLs.</td>
      </tr>
      <tr>
        <td><code>POST</code></td>
        <td><code>/api/v1/ai/reprocess-event/:id</code></td>
        <td>Host (JWT)</td>
        <td>On-demand AI reprocessing for entire event photo catalog.</td>
      </tr>
      <tr>
        <td><code>GET</code></td>
        <td><code>/api/v1/users/admin/all-users</code></td>
        <td><code>SUPER_ADMIN</code></td>
        <td>List all system users, storage metrics, and package statuses.</td>
      </tr>
      <tr>
        <td><code>PATCH</code></td>
        <td><code>/api/v1/users/admin/toggle-active/:id</code></td>
        <td><code>SUPER_ADMIN</code></td>
        <td>Toggle user active/inactive account status.</td>
      </tr>
    </tbody>
  </table>

  <!-- ========================================================================= -->
  <!-- SECTION 6: DATA MODELS & DATABASE SCHEMA                                  -->
  <!-- ========================================================================= -->
  <div style="page-break-before: always;">
    <h1>6. Data Models & Database Schema (Prisma ORM)</h1>

    <pre style="font-size: 6.8pt; line-height: 1.22; margin: 4px 0 0 0; padding: 8px 10px;"><code>// PostgreSQL Relational Schema via Prisma ORM
model User {
  id                 String    @id @default(uuid())
  name               String
  phone              String    @unique
  email              String    @unique
  password           String
  role               Role      @default(USER)
  packageId          String?
  package            Package?  @relation(fields: [packageId], references: [id])
  usedStorageMB      Float     @default(0)
  packageActivatedAt DateTime?
  packageExpiredAt   DateTime?
  isActive           Boolean   @default(false)
  events             Event[]
  createdAt          DateTime  @default(now())

  @@map("users")
}

model Package {
  id             String        @id @default(uuid())
  name           String
  storageLimitMB Float
  description    String[]
  status         PackageStatus @default(ACTIVE)
  price          Float
  durationDays   Int           @default(30)
  users          User[]

  @@map("packages")
}

model Event {
  id         String   @id @default(uuid())
  title      String
  coverImage String?
  isActive   Boolean  @default(true)
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  photos     Photo[]
  createdAt  DateTime @default(now())

  @@map("events")
}

model Photo {
  id        String          @id @default(uuid())
  imageUrl  String
  publicId  String
  sizeMB    Float
  eventId   String
  event     Event           @relation(fields: [eventId], references: [id])
  faces     FaceEmbedding[]
  createdAt DateTime        @default(now())

  @@map("photos")
}

model FaceEmbedding {
  id      String @id @default(uuid())
  photoId String
  photo   Photo  @relation(fields: [photoId], references: [id])
  vector  Json   // 128-dimensional IEEE 754 float array

  @@map("face_embeddings")
}</code></pre>
  </div>

  <!-- ========================================================================= -->
  <!-- SECTION 7: AI COMPUTER VISION MATHEMATICAL MODEL                          -->
  <!-- ========================================================================= -->
  <div class="page-break"></div>
  <h1>7. AI & Computer Vision Mathematical Model</h1>

  <h2>7.1 DeepFace FaceNet Feature Extraction</h2>
  <p>
    The facial recognition subsystem uses <strong>FaceNet</strong>, a deep convolutional neural network trained via Triplet Loss. Given an aligned facial crop <em>x</em>, the network computes a 128-dimensional embedding <em>f(x) &isin; &Ropf;<sup>128</sup></em> such that Euclidean distance directly corresponds to facial similarity.
  </p>

  <h2>7.2 Cosine Similarity Metric & Formulation</h2>
  <p>
    For a guest query selfie embedding <strong>u</strong> = (<em>u</em><sub>1</sub>, <em>u</em><sub>2</sub>, ..., <em>u</em><sub>128</sub>) and a candidate database facial vector <strong>v</strong> = (<em>v</em><sub>1</sub>, <em>v</em><sub>2</sub>, ..., <em>v</em><sub>128</sub>), the Cosine Similarity <em>S<sub>C</sub></em>(<strong>u</strong>, <strong>v</strong>) is calculated as:
  </p>

  <div class="math-card" style="font-family: 'Times New Roman', serif; font-size: 11pt; padding: 12px 18px; background: #f8fafc; border: 1.5px solid #cbd5e1;">
    <div style="font-size: 13pt; margin-bottom: 6px;">
      <em>S<sub>C</sub></em>(<strong>u</strong>, <strong>v</strong>) = 
      <span style="display: inline-block; vertical-align: middle; text-align: center;">
        <span style="display: block; border-bottom: 1.5px solid #1e293b; padding-bottom: 2px;"><strong>u</strong> &sdot; <strong>v</strong></span>
        <span style="display: block; padding-top: 2px;">&parallel;<strong>u</strong>&parallel;<sub>2</sub> &parallel;<strong>v</strong>&parallel;<sub>2</sub></span>
      </span>
      = 
      <span style="display: inline-block; vertical-align: middle; text-align: center;">
        <span style="display: block; border-bottom: 1.5px solid #1e293b; padding-bottom: 2px;">&sum;<sub>i=1</sub><sup>128</sup> <em>u<sub>i</sub></em> <em>v<sub>i</sub></em></span>
        <span style="display: block; padding-top: 2px;">&radic;(&sum; <em>u<sub>i</sub></em><sup>2</sup>) &sdot; &radic;(&sum; <em>v<sub>i</sub></em><sup>2</sup>)</span>
      </span>
    </div>
  </div>

  <p>
    <strong>Decision Boundary Calibration:</strong> A stored photograph <em>P<sub>k</sub></em> is identified as containing the guest if at least one facial embedding vector <strong>v</strong><sub><em>j</em></sub> satisfies:
  </p>
  <div class="math-card" style="font-family: 'Times New Roman', serif; font-size: 11pt; padding: 8px; background: #fffdf5; border: 1.5px solid #d4af37;">
    <strong>max<sub><em>j</em></sub> <em>S<sub>C</sub></em>(<strong>u</strong>, <strong>v</strong><sub><em>j</em></sub>) &ge; 0.45</strong> &nbsp;&nbsp;
    <span style="font-size: 9pt; font-family: 'Inter', sans-serif; color: #78350f;">(Optimized for ambient wedding lighting, angles, and facial accessories)</span>
  </div>

  <!-- ========================================================================= -->
  <!-- SECTION 8: NON-FUNCTIONAL REQUIREMENTS                                    -->
  <!-- ========================================================================= -->
  <h1>8. Non-Functional Requirements (NFRs)</h1>
  <ul>
    <li><strong>Performance:</strong> Vector similarity search across 2,500 candidate faces executes in <strong>&le; 250 milliseconds</strong> using NumPy vectorized inner products.</li>
    <li><strong>Security:</strong> Passwords protected with 12 Bcrypt salt rounds; JWT tokens signed via HMAC-SHA256 with environment secrets.</li>
    <li><strong>Guest Privacy Mandate:</strong> Guest selfie images are ephemerally stored and destroyed via <code>cloudinary.uploader.destroy()</code> immediately post-inference.</li>
    <li><strong>Scalability:</strong> Cloud-offloaded storage via Cloudinary CDN minimizes API gateway bandwidth and CPU load.</li>
  </ul>

  <!-- ========================================================================= -->
  <!-- SECTION 9: VERIFICATION & TEST MATRIX                                     -->
  <!-- ========================================================================= -->
  <h1>9. Verification, Diagnostics & Test Matrix</h1>

  <table>
    <thead>
      <tr>
        <th>Test ID</th>
        <th>Scenario / Feature</th>
        <th>Input Conditions</th>
        <th>Expected Output</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>TC-AUTH-01</code></td>
        <td>User Registration</td>
        <td>Valid credentials & plan selection</td>
        <td>User created with 50MB quota; returns 201</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><code>TC-PKG-01</code></td>
        <td>Storage Quota Breached</td>
        <td>Upload batch &gt; available MB</td>
        <td>Upload rejected; Cloudinary assets rolled back</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><code>TC-EVT-01</code></td>
        <td>Cascade Event Deletion</td>
        <td>Delete event with 20 photos</td>
        <td>Purges Cloudinary assets, embeddings & photos</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><code>TC-AI-01</code></td>
        <td>FaceNet Vector Extraction</td>
        <td>Upload photo with 4 guest faces</td>
        <td>4 <code>FaceEmbedding</code> JSON records created</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><code>TC-AI-02</code></td>
        <td>Guest Selfie Face Match</td>
        <td>WebRTC live camera selfie capture</td>
        <td>Returns JSON list of matched photo records</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><code>TC-AI-03</code></td>
        <td>Ephemeral Privacy Purge</td>
        <td>Complete guest search request</td>
        <td>Temporary selfie destroyed from Cloudinary</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
      <tr>
        <td><code>TC-FLY-01</code></td>
        <td>Bilingual QR Flyer Canvas</td>
        <td>Click "Download Printable QR Card"</td>
        <td>Exports 800x1200 high-res PNG flyer</td>
        <td><span class="badge-pass">PASS</span></td>
      </tr>
    </tbody>
  </table>

  <!-- ========================================================================= -->
  <!-- SECTION 10: CONCLUSION                                                    -->
  <!-- ========================================================================= -->
  <h1>10. Conclusion & Future Roadmap</h1>
  <p>
    <strong>ShareEventPhoto AI</strong> delivers an innovative, production-grade cloud solution for intelligent event photograph distribution. Combining modern web frameworks (<strong>Next.js 16, React 19, Express, Prisma, PostgreSQL</strong>) with advanced deep learning computer vision (<strong>DeepFace, FaceNet</strong>), the platform achieves zero-friction guest photo discovery while preserving user privacy and providing flexible SaaS monetization for organizers.
  </p>

  <div style="text-align: center; margin-top: 30px; font-size: 8pt; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px;">
    <strong>Northern University Bangladesh</strong> • Department of Computer Science and Engineering (CSE) • Academic Year 2026
  </div>

</body>
</html>
`;

  const htmlPath = path.join(__dirname, "srs_printable.html");
  fs.writeFileSync(htmlPath, htmlContent);
  console.log("Printable HTML generated at:", htmlPath);

  console.log("Launching Headless Chrome...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 2 });
  await page.goto("file://" + htmlPath, { waitUntil: "networkidle0" });

  // Give KaTeX and web fonts a moment to render cleanly
  await new Promise((r) => setTimeout(r, 1500));

  const pdfPath1 = path.join(__dirname, "Software_Requirements_Specification_SRS.pdf");
  const pdfPath2 = path.join(__dirname, "Software Requirements Specification (SRS).pdf");

  console.log("Rendering PDF...");
  await page.pdf({
    path: pdfPath1,
    format: "A4",
    printBackground: true,
    margin: {
      top: "14mm",
      bottom: "16mm",
      left: "12mm",
      right: "12mm",
    },
    displayHeaderFooter: false,
  });

  // Also overwrite the original file so it immediately updates in the user's workspace
  fs.copyFileSync(pdfPath1, pdfPath2);

  await browser.close();
  console.log(`✅ SUCCESS: PDF generated successfully at:\n- ${pdfPath1}\n- ${pdfPath2}`);
}

generateSRS_PDF().catch((err) => {
  console.error("PDF Generation Error:", err);
  process.exit(1);
});
