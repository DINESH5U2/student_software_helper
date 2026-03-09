# ⚙ DevSetup Generator

> Automated Windows developer environment setup — select tools, configure versions, download a ready-to-run `.bat` script.

![Stack](https://img.shields.io/badge/Stack-MERN-blue) ![Platform](https://img.shields.io/badge/Platform-Windows%20Only-blueviolet) ![License](https://img.shields.io/badge/License-MIT-green)

---

## What It Does

DevSetup Generator lets you pick developer tools, choose exact versions, and download a Windows batch script that:
- Silently downloads and installs every tool
- Verifies PATH after each install (with retry loops)
- Sets environment variables (`JAVA_HOME`, `PYTHON_HOME`, etc.)
- Installs tools in dependency-correct order (e.g., JDK before Maven)
- Exits with error code on any failure

**No more**: manually hunting installers, forgetting `JAVA_HOME`, or re-doing this on every new PC.

---

## Included Tools (20+)

| Category | Tools |
|---|---|
| Language | Python 3.13, JDK 21/17/11 (Temurin) |
| Runtime | Node.js 22/20/18 LTS |
| IDE / Editor | VS Code, Eclipse, Turbo C++, IntelliJ IDEA, PyCharm |
| Database | MongoDB 8, MySQL 9, PostgreSQL 17, MongoDB Compass, MySQL Workbench |
| Version Control | Git 2.47 |
| Build Tools | Maven 3.9.9, Gradle 8.10 |
| Communication | Zoom, Slack, Discord |
| Utilities | Postman, Docker Desktop, GitHub Desktop, Notepad++, VLC, Chrome, 7-Zip, draw.io, WinRAR |

---

## Tech Stack

- **Frontend**: React 18 + Vite + React Bootstrap + React Router v6
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Script Generation**: Windows Batch (.bat) — 100% native

---

## Project Structure

```
devsetup/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # Navbar, ToolCard, ScriptPreview, ScreenGuard...
│       ├── pages/        # Landing, ToolSelection, ScriptOutput, Admin
│       ├── hooks/        # useTools, useScriptGenerator, useScreenGuard
│       ├── services/     # api.js (all fetch() calls centralized)
│       └── constants/    # toolDefaults.js, presets
│
└── server/          # Express API
    ├── controllers/  # toolController, scriptController, adminController
    ├── routes/       # /api/tools, /api/scripts, /api/admin
    ├── models/       # Tool.js, Script.js (Mongoose)
    ├── services/     # scriptGeneratorService.js, validationService.js
    ├── middleware/   # errorHandler.js, adminAuth.js
    └── config/      # db.js
```

---

## Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### 1. Clone & Install

```bash
git clone https://github.com/yourname/devsetup.git
cd devsetup

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devsetup
ADMIN_TOKEN=your_secret_token_here
CLIENT_URL=http://localhost:5173
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd server
node seed.js
# ✅ Seeded 24 tools successfully.
```

### 4. Run Development Servers

```bash
# Terminal 1 — Server
cd server && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Open: `http://localhost:5173`

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tools` | All active tools with versions |
| GET | `/api/tools/:slug/versions` | Versions for a specific tool |
| POST | `/api/scripts/generate` | Generate + save script, returns `shareId` |
| GET | `/api/scripts/:shareId` | Retrieve saved script |
| GET | `/api/scripts/:shareId/download` | Stream `.bat` file download |
| GET | `/api/admin/tools` | All tools (admin, requires token) |
| POST | `/api/admin/tools` | Add new tool |
| PUT | `/api/admin/tools/:id` | Update tool |
| DELETE | `/api/admin/tools/:id` | Soft-deactivate tool |

All responses: `{ success: true, data: {...} }` or `{ success: false, error: "..." }`

---

## Script Generation Logic

The generated `.bat` file:

1. **Dependency resolution** — installs prerequisites first (JDK before Maven, MongoDB before Compass)
2. **Silent install** — uses tool-specific silent flags (`/quiet`, `/qn`, `/VERYSILENT`)
3. **PATH verification** — retries up to 5 times with 3s delay
4. **Env vars** — sets `JAVA_HOME`, `PYTHON_HOME`, etc. via `setx /M`
5. **Error handling** — exits with code 1 on any failure
6. **Summary** — final block listing all installed tools

---

## Pages

| Route | Page |
|---|---|
| `/` | Landing — hero, problem statement, how it works, tools grid |
| `/select` | Tool selection — grid, version dropdowns, preset profiles, sidebar summary |
| `/output/:shareId` | Script output — syntax-highlighted preview, dry run, download, share |
| `/admin` | Admin — token-protected tool management table |

---

## Preset Profiles

- 🐍 **Python Dev** — Python + Git + VSCode + PyCharm
- 🟢 **MERN Stack** — Node.js + Git + MongoDB + Compass + VSCode + Postman
- ☕ **Java Backend** — JDK + Maven + Eclipse + Git
- 🎓 **College Starter** — JDK + Python + Turbo C++ + Git + VSCode
- 🚀 **Full Stack** — Node.js + Python + JDK + MongoDB + PostgreSQL + Docker + Git + VSCode
- 📊 **Data Science** — Python + Git + VSCode + PostgreSQL

---

## Notes

- Scripts expire after **7 days** (MongoDB TTL index)
- Desktop-only: screens below 1024px are blocked unconditionally
- Admin panel uses env-variable token auth
- All API calls go through `client/src/services/api.js` — never directly in components

