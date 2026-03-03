# ⬡ AURA-GRID / FLOW-AI

> **AI-powered intelligent traffic management system** — Real-time emergency vehicle preemption, dynamic signal control, and verified green corridor dispatch.

Built for the **Smart City Innovation Challenge 2026** · Prototype v1.0

---

## 🧠 What is AURA-GRID?

AURA-GRID is a full-stack prototype that demonstrates how AI can eliminate the deadly delays ambulances face at red lights, secure VVIP convoys without deploying hundreds of officers, and intelligently reduce city-wide congestion — all in real time.

### The Problem
- 🏥 Ambulances spend **10–15% of journey time** idling at red lights, cutting into the critical 60-minute "Golden Hour"
- 🛡️ VVIP convoys stopped at traffic lights become **static security targets**
- 🚗 Fixed-timer traffic signals waste millions of gallons of fuel annually on **empty lanes**

### The Solution — Three Pillars

| Pillar | What it does |
|---|---|
| **A — AI Vision** | YOLOv8 cameras count vehicles in real time and allocate green time proportionally |
| **B — Visual Failsafe** | Edge-AI detects ambulances from shape/color/strobe — no GPS or portal needed |
| **C — Green Corridor Portal** | Secure dispatcher portal initiates a zero-stop green wave, preempting signals 30s ahead |

---

## 🖥️ Pages

| Route | Description |
|---|---|
| `/` | Landing page — problem statement, pillars, user journeys, FAQ |
| `/dashboard` | Live traffic control center — 24 intersection nodes with real-time density |
| `/portal` | Secure Green Corridor dispatcher — login, route planner, live SVG city map |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **UI Library** | [React 18](https://react.dev/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + Custom CSS |
| **Fonts** | Google Fonts — Outfit, JetBrains Mono |
| **Language** | JavaScript (JSX) |
| **Runtime** | Node.js 18+ |

---

## 📁 Project Structure

```
prototype/
├── README.md
└── aura-grid/                  ← Next.js app root
    ├── app/
    │   ├── globals.css          ← Global styles, design tokens, animations
    │   ├── layout.jsx           ← Root layout (fonts, dark bg, grid overlay)
    │   ├── page.jsx             ← Landing page (/)
    │   ├── dashboard/
    │   │   └── page.jsx         ← Live Dashboard (/dashboard)
    │   └── portal/
    │       └── page.jsx         ← Green Corridor Portal (/portal)
    ├── components/
    │   ├── Navbar.jsx           ← Shared navigation bar
    │   ├── Badge.jsx            ← Reusable color badge/pill component
    │   └── StatusDot.jsx        ← Animated pulsing status dot
    ├── jsconfig.json            ← Path alias config (@/ = project root)
    ├── tailwind.config.js       ← Design tokens (colors, fonts, animations)
    ├── next.config.js
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites

You need **Node.js** installed on your machine.

1. Go to **[nodejs.org](https://nodejs.org)**
2. Download the **LTS** version for your OS
3. Run the installer — make sure **"Add to PATH"** is checked
4. Restart your terminal after installation

Verify it worked:
```bash
node --version   # should print something like v20.x.x
npm --version    # should print something like 10.x.x
```

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/prathamb9/India_Innovates_Merge_Conflicts.git
```

### Step 2 — Navigate into the Next.js app folder

```bash
cd India_Innovates_Merge_Conflicts/aura-grid
```

> ⚠️ **Important:** You must be inside the `aura-grid` folder, not the root `India_Innovates_Merge_Conflicts` folder.

### Step 3 — Install dependencies

```bash
npm install
```

This downloads all required packages into a local `node_modules/` folder. Takes 1–2 minutes on first run.

### Step 4 — Start the development server

```bash
npm run dev
```

### Step 5 — Open in your browser

Open **[http://localhost:3000](http://localhost:3000)**

You should see the AURA-GRID landing page. 🎉

---

## 🧭 Exploring the App

### Landing Page `/`
- Scroll down to see the **Problem Statement**, **Three Pillar Architecture**, and **User Flows**
- Use the tabs in "Four Mission-Critical Use Cases" to switch between: Commuter, Ambulance, Visual Override, VVIP Convoy
- The FAQ accordion answers common "What if?" edge cases

### Live Dashboard `/dashboard`
- Watch **24 intersection nodes** update their density in real time every 2 seconds
- Click any node card to open a detail panel with flow stats
- Click **"Simulate Emergency"** to trigger an emergency alert and node override
- The right sidebar shows the active ambulance corridor, lane densities, and city-wide stats

### Green Corridor Portal `/portal`
**Login Credentials (Demo):**
- Dispatcher ID: `DISP-AMB-0042`
- Role: `Hospital Dispatcher`
- OTP: `427819` (pre-filled)

After login:
1. Select corridor type (Ambulance / Fire Truck / VVIP)
2. Fill in origin & destination
3. Click **"Calculate Optimal Route"** — the AI route appears with time comparison
4. Click **"Initiate Green Wave Now"** — the corridor activates and the ambulance starts moving on the map

---

## 🤝 Contributing (For Team Members)

1. **Fork or clone** the repo
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes inside `aura-grid/`
4. Test locally with `npm run dev`
5. Commit: `git commit -m "Add: description of change"`
6. Push: `git push origin feature/your-feature-name`
7. Open a **Pull Request** on GitHub

---

## 📞 Emergency Contacts (India)
| Service | Number |
|---|---|
| 🚑 Ambulance (National) | 102 |
| 🚒 Fire Brigade | 101 |
| 👮 Police | 100 |
| 🏥 All-Emergencies (GVK EMRI) | 108 |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
  <strong>Built with ❤️ by <a href="https://github.com/prathamb9/India_Innovates_Merge_Conflicts">Merge_Conflicts</a></strong><br/>
  <em>AURA-GRID / FLOW-AI · Smart City Innovation Challenge 2026</em>
</div>