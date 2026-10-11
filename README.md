# Tushar Nakaskar &mdash; Software Developer Portfolio

> **Published URL:** [https://tusharnakaskar.github.io/](https://tusharnakaskar.github.io/)  
> **GitHub Repository:** [https://github.com/tusharnakaskar/tusharnakaskar.github.io](https://github.com/tusharnakaskar/tusharnakaskar.github.io)  
> **Role:** Aspiring Software Developer | Java Backend Developer  
> **Education:** Prof. Ram Meghe Institute of Technology & Research (B.E. CSE, Class of 2026)

---

## 📌 Overview

This repository contains the personal developer portfolio website for **Tushar Nakaskar**, built with a clean, sophisticated, and lightweight multi-page architecture designed for zero-dependency hosting on **GitHub Pages**.

### Key Design & Architectural Highlights
- **Simple & Sophisticated Multi-Page Layout:** Logical, uncluttered page structure:
  - `index.html` &mdash; Clean introduction, core pillars, and featured work teaser.
  - `about.html` &mdash; Engineering story, formal education at PRMITR, and technical competencies.
  - `projects.html` &mdash; Curated practical software projects (Java AI API integration, Spring Boot REST service, OOP applications).
  - `contact.html` &mdash; Frictionless contact channels (Email, LinkedIn, GitHub) and Resume download.
- **Refined Aesthetic:** Premium dark navy theme (`#0a0e17`), electric sapphire (`#3b82f6`) and subtle cyan (`#06b6d4`) accents, crisp typography (`Plus Jakarta Sans` & `JetBrains Mono`), and subtle glassmorphic navigation.
- **Zero Dependencies:** Pure HTML5, modern vanilla CSS3, and lightweight JavaScript with no bloated external frameworks or libraries.
- **Full Responsiveness & Accessibility:** Optimized across mobile, tablet, and desktop viewports with WCAG AA contrast standards and keyboard accessibility.

---

## 📂 File & Folder Structure

```text
tusharnakaskar.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages deployment action
├── .nojekyll                   # Bypasses Jekyll for fast static file serving
├── assets/
│   ├── favicon.svg             # Monogram "TN" brand vector icon
│   ├── README-RESUME.txt       # Instructions for resume.pdf
│   └── resume.pdf              # [Place your actual resume PDF here]
├── css/
│   └── styles.css              # Clean, modular design system & responsive styling
├── js/
│   └── main.js                 # Mobile drawer, copy email, mailto composer, toast alerts
├── index.html                  # Home page
├── about.html                  # About & Education page
├── projects.html               # Projects showcase page
├── contact.html                # Contact channels & resume download page
└── README.md                   # Documentation
```

---

## 💻 Local Preview

You can preview the website locally using any standard local development server:

### Option 1: VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click `index.html` and choose **"Open with Live Server"**.

### Option 2: Python HTTP Server (Zero Setup)
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option 3: Node.js (npx serve)
```bash
npx -y serve .
```

---

## 🛠️ Adding Your Resume PDF

1. Export your resume as a PDF file named **`resume.pdf`**.
2. Place it in the `assets/` directory (`assets/resume.pdf`).
3. Commit and push:
   ```bash
   git add assets/resume.pdf
   git commit -m "feat: add resume pdf"
   git push origin main
   ```
The "Resume" buttons across the site will automatically download your document.

---

## 🚀 Deployment to GitHub Pages

The repository is configured for automated deployment via GitHub Pages and GitHub Actions (`.github/workflows/deploy.yml`):

1. Stage all changes:
   ```powershell
   git add .
   ```
2. Commit:
   ```powershell
   git commit -m "feat: simple and sophisticated multi-page portfolio"
   ```
3. Push to GitHub:
   ```powershell
   git push origin main
   ```
Your site will be live at **[https://tusharnakaskar.github.io/](https://tusharnakaskar.github.io/)**.

---

&copy; 2026 Tushar Nakaskar. Hosted on GitHub Pages.