# Edith Pro — Enterprise Interview Intelligence Platform

Edith Pro is a comprehensive, client-side interview intelligence platform built with vanilla HTML, CSS, and JavaScript. It provides tailored dashboards and tools for **candidates**, **interviewers**, and **recruiters** — all in one unified application.

🔗 **Live Demo:** [https://ishanaggarwal.github.io/Edith-Pro/](https://ishanaggarwal.github.io/Edith-Pro/)

---

## Features

### 🎯 For Candidates
- **Practice Arena** — Timed coding challenges with a built-in code editor
- **Study Plans** — Structured learning paths for interview preparation
- **AI Mentor** — Intelligent guidance and feedback
- **Job Board** — Browse and apply to matched positions
- **Analytics** — Track practice performance and progress
- **Community** — Connect with other candidates

### 🎤 For Interviewers
- **Scheduling** — Manage upcoming interviews and calendar
- **Question Bank** — Curated question sets by topic and difficulty
- **Candidate Review** — Evaluate submissions and provide feedback
- **Templates** — Reusable interview templates
- **Top Talent** — Surface high-performing candidates

### 📋 For Recruiters
- **Pipeline Management** — Track candidates through hiring stages
- **Active Jobs** — Post and manage job listings
- **Talent Pool** — Search and filter candidates
- **Campaigns** — Outreach and engagement tools
- **Referrals** — Manage referral programs

### 🌐 General
- 🌙 Light / Dark theme toggle
- 🔔 Real-time notifications
- 🔍 Global search
- 📱 Responsive design
- ⚡ Zero dependencies — runs entirely in the browser

---

## Project Structure

```
Edith-Pro/
├── index.html          # Main HTML entry point
├── css/
│   └── style.css       # All styles (themes, layout, components)
├── js/
│   └── app.js          # Application logic (state, routing, rendering)
├── assets/             # Static assets (images, icons — if any)
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

No build tools or dependencies are required. You only need a web browser.

### Running Locally

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ishanaggarwal/Edith-Pro.git
   cd Edith-Pro
   ```

2. **Open in browser:**

   Simply open `index.html` in any modern web browser, or use a local server:

   ```bash
   # Using Python
   python3 -m http.server 8000

   # Using Node.js (npx)
   npx serve .
   ```

3. **Visit** `http://localhost:8000` in your browser.

---

## Deployment

This project is automatically deployed to **GitHub Pages** via a GitHub Actions workflow on every push to the `main` branch.

The live site is available at:
**[https://ishanaggarwal.github.io/Edith-Pro/](https://ishanaggarwal.github.io/Edith-Pro/)**

---

## Tech Stack

| Layer    | Technology                  |
| -------- | --------------------------- |
| Markup   | HTML5                       |
| Styling  | CSS3 (custom properties)    |
| Logic    | Vanilla JavaScript (ES6+)   |
| Fonts    | Google Fonts (Inter, JetBrains Mono) |
| Hosting  | GitHub Pages                |

---

## License

This project is open source. See the repository for license details.
