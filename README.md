# Tushar Nakaskar &mdash; Professional Developer Portfolio

> **Published URL:** [https://tusharnakaskar.github.io/](https://tusharnakaskar.github.io/)  
> **GitHub Repository:** [https://github.com/tusharnakaskar/tusharnakaskar.github.io](https://github.com/tusharnakaskar/tusharnakaskar.github.io)  
> **Role:** Aspiring Software Developer | Java Backend Developer  
> **Education:** Prof. Ram Meghe Institute of Technology & Research (B.E. CSE, Class of 2026)

---

## 📌 Project Overview

This repository hosts the official personal developer portfolio website for **Tushar Nakaskar**, tailored specifically for software engineering roles, backend development internships, and academic applications.

The portfolio is built with modern, lightweight web technologies (**HTML5, Vanilla CSS3, and Vanilla JavaScript**) designed for zero-dependency hosting on **GitHub Pages**.

### Key Visual & Technical Highlights
- **Curated Theme:** Premium dark navy background (`#080d1a`), electric blue (`#3b82f6`) and subtle cyan (`#06b6d4`) accents, crisp white headings, and soft slate reading text.
- **Glassmorphism & Micro-Interactions:** Frosted navigation bar, card lift on hover, glowing borders, and smooth transitions.
- **Interactive Code Window:** Terminal-styled Java profile card (`Developer.java`) with syntax highlighting.
- **Dynamic Skills Filter:** Categorized tabs for Programming, Backend Development, Databases, Core Computer Science, and Tools.
- **Resume Verification Fallback:** Safe check for `assets/resume.pdf` with an intuitive guidance modal if the PDF has not yet been added.
- **Pre-filled Contact Generator:** Direct `mailto:` action preparing email communications to `tusharnakaskarp@gmail.com`.
- **Full Responsiveness & Accessibility:** Optimized across mobile, tablet, and desktop screens with WCAG AA contrast standards, keyboard focus indicators, and `prefers-reduced-motion` compliance.

---

## 📂 File & Folder Structure

```text
tusharnakaskar.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow for Pages
├── .nojekyll                   # Bypasses Jekyll processing for pure static delivery
├── assets/
│   ├── favicon.svg             # Monogram "TN" brand vector icon
│   ├── README-RESUME.txt       # Instructions for adding resume.pdf
│   └── resume.pdf              # [Place your actual resume PDF here]
├── css/
│   └── styles.css              # Custom CSS design system & responsive styling
├── js/
│   └── main.js                 # Smooth scroll, mobile menu, filter, and modal logic
├── index.html                  # Main portfolio website file
└── README.md                   # Setup, customization, and deployment documentation
```

---

## 💻 How to Run Locally

You can preview the website locally using any standard local development server:

### Option 1: VS Code Live Server Extension (Recommended)
1. Open the `tusharnakaskar.github.io` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click on `index.html` and select **"Open with Live Server"**.
4. The site will open at `http://127.0.0.1:5500/`.

### Option 2: Python HTTP Server (Zero Setup)
Open your terminal in this repository folder and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit: `http://localhost:8000` in your web browser.

### Option 3: Node.js (npx serve)
```bash
npx -y serve .
```

---

## 🛠️ Customization Guide

### 1. Adding Your Official Resume
1. Export or save your resume as a PDF file.
2. Name the file **`resume.pdf`**.
3. Place it inside the `assets/` directory (`assets/resume.pdf`).
4. Commit and push the file to GitHub. The download buttons on the site will automatically detect and serve it!

### 2. Updating or Adding Projects
Open `index.html` and locate the `<section id="projects">` block:
- **Featured Project:** Edit the Java AI / API integration project title, description, or GitHub repository URL.
- **New Projects:** Copy any `<article class="project-card">` block and fill in your new project's title, technologies, features, and repository link.

### 3. Adding Your CGPA or Academic Scores
Open `index.html` and find `<div class="edu-optional-note">` in the Education section. Uncomment and update:
```html
<p class="note-cgpa"><strong>CGPA:</strong> 8.XX / 10</p>
```

### 4. Adding Coding Profiles (LeetCode / HackerRank)
Open `index.html` and locate `<div class="achieve-links-placeholder">` in the Achievements section. Replace the note with links to your coding platform profiles:
```html
<a href="https://leetcode.com/your-username" target="_blank" class="tag">LeetCode</a>
<a href="https://hackerrank.com/your-username" target="_blank" class="tag">HackerRank</a>
```

---

## 🚀 How to Deploy to GitHub Pages

Since this local folder is connected to your remote repository `https://github.com/tusharnakaskar/tusharnakaskar.github.io.git`, deploying is as simple as committing and pushing your files:

### Step 1: Review Git Status
Open terminal inside the `tusharnakaskar.github.io` folder:
```powershell
git status
```

### Step 2: Stage and Commit the Files
```powershell
git add .
git commit -m "feat: complete professional portfolio for Tushar Nakaskar"
```

### Step 3: Push to GitHub
```powershell
git push origin main
```

### Step 4: Verify GitHub Pages Settings
1. Go to your repository on GitHub:  
   `https://github.com/tusharnakaskar/tusharnakaskar.github.io`
2. Click **Settings** &rarr; **Pages** (in the left sidebar).
3. Under **Build and deployment**:
   - **Source:** Choose either **"Deploy from a branch"** (Branch: `main`, Folder: `/ (root)`) **OR** **"GitHub Actions"** (which automatically uses the included `.github/workflows/deploy.yml` workflow).
4. Click **Save**.
5. Within 1 to 2 minutes, your website will be live at:  
   👉 **[https://tusharnakaskar.github.io/](https://tusharnakaskar.github.io/)**

---

## ✅ Quality & Verification Checklist

- [x] **Dark Navy Aesthetic:** Matches requested color palette with electric blue and cyan accents.
- [x] **Accurate Profile:** Features Tushar Nakaskar, PRMITR CSE (Class of 2026), Java Backend Developer.
- [x] **No Fabricated Information:** Zero fake work experiences, fake ratings, or fake numbers.
- [x] **Working Navigation:** Smooth scrolling across all 8 primary sections.
- [x] **Mobile Drawer Navigation:** Accessible hamburger menu toggle with keyboard focus handling.
- [x] **Skills Category Filter:** Filter between All, Backend, Databases, Core CS, and Tools.
- [x] **Resume Fallback Handling:** Detects missing PDF and displays an informative modal guide.
- [x] **Contact Generator:** One-click copy email button + mail composer.
- [x] **Valid HTML5 & CSS3:** Semantic elements, CSS variables, and clean vanilla JavaScript.
- [x] **GitHub Pages Ready:** Includes `.nojekyll`, clean relative paths, and automated deployment action.

---

&copy; 2026 Tushar Nakaskar. Hosted on GitHub Pages.