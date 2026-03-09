# DevSetup Generator

A full-stack MERN web application that lets you select developer tools, choose versions, and download a single Windows Batch `.bat` script that silently installs, configures, and verifies every tool automatically — no manual clicking required.

Built for Windows users who are tired of spending hours setting up a fresh machine.

---

## Table of Contents

- [What It Does](#what-it-does)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [First-Time Setup](#first-time-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Seed the Database](#4-seed-the-database)
- [Running the Application](#running-the-application)
  - [Backend (Express API)](#backend-express-api)
  - [Frontend (React + Vite)](#frontend-react--vite)
- [Available Scripts](#available-scripts)
- [API Reference](#api-reference)
- [Pages and Features](#pages-and-features)
- [How the Generated Script Works](#how-the-generated-script-works)
- [Supported Tools](#supported-tools)
- [Common Errors and Fixes](#common-errors-and-fixes)
- [Environment Variables Reference](#environment-variables-reference)

---

## What It Does

1. You open the app and select any combination of developer tools (Python, Node.js, JDK, VS Code, MySQL, Zoom, Docker, etc.)
2. You pick a version for each tool
3. You click **Generate Script**
4. You download a `.bat` file
5. You run that `.bat` file as Administrator on any Windows 10/11 machine
6. Every tool installs silently in the background — no popups, no clicking through wizards

The script also sets environment variables (`JAVA_HOME`, `PYTHON_HOME`, etc.), adds tools to the system `PATH`, and verifies each install after it completes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6, React Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Script Generation | Windows Batch (.bat) — 100% Windows native |
| HTTP Client (frontend) | Native `fetch()` API only |
| Download method in scripts | `curl.exe` (built into Windows 10/11 v1803+) |

---

## Project Structure

```
devsetup/
│
├── client/                          ← React frontend (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx                 ← Entry point
│       ├── App.jsx                  ← Root component
│       ├── index.css                ← Global styles / CSS variables
│       │
│       ├── components/
│       │   ├── Navbar/              ← Sticky top navigation
│       │   ├── ToolCard/            ← Individual tool selection card
│       │   ├── ScriptPreview/       ← Syntax-highlighted .bat preview
│       │   ├── ScreenGuard/         ← Blocks screens below 1024px
│       │   └── LoadingSpinner/      ← Async loading indicator
│       │
│       ├── pages/
│       │   ├── LandingPage/         ← Hero, features, tools overview
│       │   ├── ToolSelectionPage/   ← Main tool picker with sidebar
│       │   ├── ScriptOutputPage/    ← Script preview, download, share
│       │   └── AdminPage/           ← Token-protected tool management
│       │
│       ├── hooks/
│       │   ├── useTools.js          ← Fetches all tools from API
│       │   ├── useScriptGenerator.js← Calls generate endpoint
│       │   └── useScreenGuard.js    ← Watches window width
│       │
│       ├── services/
│       │   └── api.js               ← All fetch() calls live here only
│       │
│       ├── router/
│       │   └── AppRouter.jsx        ← All route definitions
│       │
│       └── constants/
│           └── toolDefaults.js      ← Preset profiles, category labels
│
└── server/                          ← Express API
    ├── index.js                     ← Server entry point
    ├── package.json
    ├── seed.js                      ← One-time database seeder
    ├── .env.example
    │
    ├── config/
    │   └── db.js                    ← MongoDB connection
    │
    ├── controllers/
    │   ├── toolController.js        ← GET tools, GET versions
    │   ├── scriptController.js      ← POST generate, GET script, GET download
    │   └── adminController.js       ← CRUD for tool management
    │
    ├── routes/
    │   ├── toolRoutes.js            ← /api/tools
    │   ├── scriptRoutes.js          ← /api/scripts
    │   └── adminRoutes.js           ← /api/admin (token protected)
    │
    ├── models/
    │   ├── Tool.js                  ← Tool schema (name, slug, versions[])
    │   └── Script.js                ← Script schema (shareId, 7-day TTL)
    │
    ├── services/
    │   ├── scriptGeneratorService.js← Core .bat file builder
    │   └── validationService.js     ← Request payload validation
    │
    └── middleware/
        ├── errorHandler.js          ← Global error handler + asyncHandler
        └── adminAuth.js             ← x-admin-token header check
```

---

## Prerequisites

Before you start, make sure you have the following installed on your machine:

| Requirement | Version | How to Check |
|---|---|---|
| Node.js | 18.x or higher | `node --version` |
| npm | 9.x or higher | `npm --version` |
| MongoDB | 6.x or higher | `mongod --version` |

**MongoDB must be running** before you start the backend. If you installed MongoDB Community locally, it runs as a Windows service automatically after install. You can verify it is running by opening MongoDB Compass and connecting to `mongodb://localhost:27017`.

If you do not have MongoDB locally, you can use a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster and paste the connection string into your `.env` file.

---

## First-Time Setup

Follow these steps exactly, in order, the first time you set up the project.

### 1. Clone the Repository

```bash
git clone https://github.com/yourname/devsetup-generator.git
cd devsetup-generator
```

Or if you downloaded the zip, extract it and `cd` into the `devsetup` folder:

```bash
cd devsetup
```

---

### 2. Configure Environment Variables

The project uses `.env` files for configuration. Each side (server and client) has its own.

#### Backend `.env`

Navigate into the server folder and create a `.env` file:

```bash
cd server
copy .env.example .env
```

Open `server/.env` and fill in the values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devsetup
ADMIN_TOKEN=pick_any_secret_string_here
CLIENT_URL=http://localhost:5173
```

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/devsetup` |
| `ADMIN_TOKEN` | Secret token to access the `/admin` page | Any string you choose |
| `CLIENT_URL` | URL of the React frontend — used for CORS | `http://localhost:5173` |

#### Frontend `.env`

Navigate into the client folder and create a `.env` file:

```bash
cd ../client
copy .env.example .env
```

Open `client/.env` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the Express API. The Vite dev server also proxies `/api` to port 5000, so this mainly matters for production builds. |

---

### 3. Install Dependencies

You need to install npm packages separately for the server and the client. They are two independent Node.js projects.

**Install server dependencies:**

```bash
cd server
npm install
```

This installs: `express`, `mongoose`, `cors`, `dotenv`, `nanoid`, `nodemon`

**Install client dependencies:**

```bash
cd ../client
npm install
```

This installs: `react`, `react-dom`, `react-router-dom`, `bootstrap`, `react-bootstrap`, `react-syntax-highlighter`, `vite`, `@vitejs/plugin-react`

---

### 4. Seed the Database

The seed script connects to MongoDB and inserts all 24 developer tools with their versions, installer URLs, silent flags, and environment variable configurations.

**This only needs to be run once.** Do not run it again unless you want to wipe and re-insert all tools.

```bash
cd server
node seed.js
```

Expected output:

```
✅ Seeded 24 tools successfully.
```

If you see an error here, the most likely causes are:
- MongoDB is not running — start it first
- `MONGODB_URI` in your `.env` is wrong — double-check it
- A validation error in the seed data — check the error message

---

## Running the Application

You need **two terminal windows open at the same time** — one for the backend and one for the frontend. They run as two separate processes.

### Backend (Express API)

Open a terminal, navigate to the server folder, and run:

```bash
cd server
npm run dev
```

Expected output:

```
✅ MongoDB connected: localhost
🚀 Server running on port 5000
```

The backend is now running at: **`http://localhost:5000`**

You can verify it is working by opening this URL in your browser:

```
http://localhost:5000/api/health
```

You should see:

```json
{ "success": true, "data": { "status": "ok", "timestamp": "..." } }
```

**What `npm run dev` does:** Starts the server using `nodemon`, which automatically restarts whenever you save a file. This is the correct command for development. For production, use `npm start` instead, which runs `node index.js` directly without the file watcher.

---

### Frontend (React + Vite)

Open a **second** terminal (keep the first one running), navigate to the client folder, and run:

```bash
cd client
npm run dev
```

Expected output:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

The frontend is now running at: **`http://localhost:5173`**

Open that URL in your browser. You should see the DevSetup Generator landing page.

**What `npm run dev` does:** Starts the Vite development server with hot module replacement (HMR) — the browser auto-refreshes when you edit React components. The Vite config also proxies all `/api` requests to `http://localhost:5000`, so you do not need to worry about CORS during development.

---

## Available Scripts

### Server (`server/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start server with nodemon (auto-restart on file save) — use this for development |
| `npm start` | Start server with node directly — use this for production |
| `node seed.js` | Wipe the tools collection and re-insert all 24 tools — run once on first setup |

### Client (`client/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at `http://localhost:5173` — use this for development |
| `npm run build` | Compile and bundle the React app into `client/dist/` for production |
| `npm run preview` | Serve the production build locally to test it before deploying |

---

## API Reference

All responses follow this envelope format:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "Human-readable message" }
```

### Tools

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/tools` | Returns all active tools with their full version list | None |
| `GET` | `/api/tools/:slug/versions` | Returns just the versions array for one tool by slug | None |

### Scripts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/scripts/generate` | Generates a `.bat` script, saves it, returns `shareId` + script content | None |
| `GET` | `/api/scripts/:shareId` | Retrieves a saved script by its share ID | None |
| `GET` | `/api/scripts/:shareId/download` | Streams the `.bat` file as a download | None |

**POST `/api/scripts/generate` — request body:**

```json
{
  "selectedTools": [
    { "toolId": "64abc123...", "version": "3.13.0" },
    { "toolId": "64def456...", "version": "22.11.0 LTS" }
  ]
}
```

### Admin (requires `x-admin-token` header)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/tools` | All tools including inactive ones |
| `POST` | `/api/admin/tools` | Add a new tool |
| `PUT` | `/api/admin/tools/:id` | Update an existing tool |
| `DELETE` | `/api/admin/tools/:id` | Soft-deactivate a tool (sets `isActive: false`) |

To call admin endpoints, include the header:

```
x-admin-token: your_ADMIN_TOKEN_value_from_env
```

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ status: "ok" }` — use to confirm server is running |

---

## Pages and Features

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Hero section, how it works, supported tools grid, CTAs |
| `/select` | Tool Selection | Tool cards grid, version dropdowns, preset profiles, sidebar summary, generate button |
| `/output/:shareId` | Script Output | Syntax-highlighted script preview, dry run simulation, download button, copy button, shareable URL |
| `/admin` | Admin Panel | Token-protected tool management table — add, edit, deactivate tools |

### Preset Profiles (on `/select`)

Click any preset to instantly select a curated set of tools:

| Preset | Tools Included |
|---|---|
| 🐍 Python Dev | Python, Git, VS Code, PyCharm |
| 🟢 MERN Stack | Node.js, Git, MongoDB, MongoDB Compass, VS Code, Postman |
| ☕ Java Backend | JDK, Maven, Eclipse, Git |
| 🎓 College Starter | JDK, Python, Turbo C++, Git, VS Code |
| 🚀 Full Stack | Node.js, Python, JDK, MongoDB, PostgreSQL, Docker, Git, VS Code |
| 📊 Data Science | Python, Git, VS Code, PostgreSQL |

### Admin Panel

Navigate to `/admin` in the browser. You will be prompted for a token — enter the value you set as `ADMIN_TOKEN` in `server/.env`. Once authenticated, you can see all tools, their versions, and deactivate any tool so it stops appearing in the tool selection UI.

---

## How the Generated Script Works

When you click **Generate Script**, the server builds a `.bat` file with this structure:

```
1. Admin rights check        → exits immediately if not elevated
2. curl.exe availability      → exits if Windows is too old
3. For each selected tool (in dependency-correct order):
   a. Download installer via curl.exe with --retry 3
   b. Run installer silently  → .exe uses start /wait, .msi uses msiexec /i
   c. Verify PATH (up to 5 retries with 3s delay between each)
   d. Set environment variables via setx /M
   e. Add to system PATH via registry (safe — never truncates existing PATH)
4. Summary block listing all installed tools
5. Reminder to restart the terminal
```

**Dependency ordering** is resolved automatically. If you select Maven, it will always install JDK first, even if you added Maven to the list before JDK.

**Running the generated script:**
1. Download the `.bat` file
2. Right-click it → **Run as Administrator**
3. A terminal window opens and runs each install sequentially
4. Do not close the window while it runs
5. When it says `ALL DONE`, restart your PC or open a new terminal

---

## Supported Tools

| Tool | Category | Installer Source |
|---|---|---|
| Python 3.13 / 3.12 / 3.11 | Language | python.org FTP |
| Node.js 22 / 20 / 18 LTS | Runtime | nodejs.org/dist |
| JDK 21 / 17 / 11 (Temurin) | Language | api.adoptium.net |
| Git 2.47 / 2.45 | Version Control | github.com/git-for-windows |
| Visual Studio Code | IDE | code.visualstudio.com |
| Eclipse IDE 2024-09 | IDE | download.eclipse.org |
| Turbo C++ (via DOSBox) | IDE | dosbox.com official |
| IntelliJ IDEA Community | IDE | download.jetbrains.com |
| PyCharm Community | IDE | download.jetbrains.com |
| MongoDB 8.0 / 7.0 | Database | fastdl.mongodb.org |
| MongoDB Compass | Database | downloads.mongodb.com |
| MySQL 8.4 / 8.0 | Database | cdn.mysql.com |
| MySQL Workbench | Database | cdn.mysql.com |
| PostgreSQL 17 / 16 | Database | get.enterprisedb.com |
| Apache Maven 3.9.9 | Build Tool | dlcdn.apache.org |
| Gradle 8.10.2 | Build Tool | services.gradle.org |
| Zoom | Communication | zoom.us/client/latest |
| Slack | Communication | slack.com/ssb |
| Discord | Communication | discord.com/api |
| Postman | Utility | dl.pstmn.io |
| Docker Desktop | Utility | desktop.docker.com |
| GitHub Desktop | Utility | central.github.com |
| WinRAR 7.10 | Utility | rarlab.com |
| Notepad++ 8.7.1 | Utility | github.com/notepad-plus-plus |
| VLC 3.0.21 | Utility | get.videolan.org |
| Google Chrome | Utility | dl.google.com/chrome |
| 7-Zip 24.08 | Utility | 7-zip.org |
| draw.io Desktop | Utility | github.com/jgraph |

---

## Common Errors and Fixes

**`❌ Seed failed: Tool validation failed: versions.0.silentFlags: Path silentFlags is required`**

Your `Tool.js` model has `silentFlags` marked as required. Replace `server/models/Tool.js` with the latest version where `silentFlags` has `default: ''` instead of `required: true`.

---

**`❌ Seed failed: connect ECONNREFUSED 127.0.0.1:27017`**

MongoDB is not running. Start it:
- Windows: Press `Win + R`, type `services.msc`, find **MongoDB Server**, right-click → Start
- Or run: `net start MongoDB` in an Administrator terminal

---

**`Failed to fetch tools` on the frontend**

The backend server is not running, or it is running on a different port. Make sure:
1. You ran `npm run dev` inside the `server/` folder
2. You can open `http://localhost:5000/api/health` in your browser and see `{ "success": true }`
3. Your `client/.env` has `VITE_API_URL=http://localhost:5000/api`

---

**`[ERROR] curl.exe not found` in generated script**

Your Windows version is older than 1803 (released April 2018). Either update Windows, or install `curl` manually from [curl.se/windows](https://curl.se/windows/) and add it to your PATH.

---

**`[WARN] Not running as Administrator!` in generated script**

Right-click the `.bat` file and choose **Run as Administrator**. Running it by double-clicking or from a non-elevated terminal will cause most installs to fail silently.

---

**Script downloads fine but some tools do not install**

Some installers return exit code `3010` (reboot required) which is not actually a failure. The script treats non-zero exit codes from installers as warnings and continues. All tools should still be installed — restart your PC after the script finishes and check with `where <toolname>` in a new terminal.

---

## Environment Variables Reference

### `server/.env`

```env
# Port for the Express server
PORT=5000

# MongoDB connection string
# Local:  mongodb://localhost:27017/devsetup
# Atlas:  mongodb+srv://user:pass@cluster.mongodb.net/devsetup
MONGODB_URI=mongodb://localhost:27017/devsetup

# Secret token for the /admin API endpoints and admin UI
# Choose any string — treat it like a password
ADMIN_TOKEN=your_secret_token_here

# Frontend URL — used to configure CORS on the Express server
# Must match exactly where your React app runs
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
# Base URL of the Express API
# During development this is used as a fallback;
# Vite's proxy config in vite.config.js handles /api routes automatically
VITE_API_URL=http://localhost:5000/api
```

---

## Quick Start Checklist

For someone setting this up fresh, do these steps in order:

```
[ ] 1. Install Node.js 18+
[ ] 2. Install MongoDB Community and make sure it is running
[ ] 3. cd server && copy .env.example .env  → fill in values
[ ] 4. cd client && copy .env.example .env  → fill in VITE_API_URL
[ ] 5. cd server && npm install
[ ] 6. cd client && npm install
[ ] 7. cd server && node seed.js            → should print "Seeded 24 tools"
[ ] 8. Terminal 1: cd server && npm run dev → should print port 5000
[ ] 9. Terminal 2: cd client && npm run dev → should print port 5173
[ ] 10. Open http://localhost:5173 in browser
```
