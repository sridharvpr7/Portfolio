# ECE × Dev Portfolio — Beyond the Circuit

A cinematic, JSON-driven personal portfolio for an Electronics and Communication Engineering student who also builds full-stack software. Built with **Vite + React + TypeScript + plain CSS**.

## ✨ Features

- 🌑 **Dark-first design** — cinematic `#080A0F` base, electric blue + violet accents
- 🎬 **Cinematic intro sequence** — skippable, session-aware, reduced-motion safe
- 📄 **100 % JSON-driven content** — edit data files without touching components
- 🔄 **Live theme toggle** — dark / light with localStorage persistence and zero flash
- 🖥️ **Fully responsive** — phone, tablet, laptop, large desktop
- ⚡ **Render-ready** — one-click deployment with a Node.js web service and Render Blueprint
- ♿ **Accessible** — semantic HTML, ARIA labels, focus styles, reduced-motion support
- 🔍 **SEO-ready** — meta tags, Open Graph, robots.txt from JSON config

---

## 🚀 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
# → http://localhost:5173
```

## 🏗️ Production Build

```bash
npm run build
# Output goes to dist/
```

Preview the production build locally:

```bash
npm run preview
# → http://localhost:4173
```

---

## 📁 Project Structure

```
portfolio/
├── public/
│   ├── data/                  ← All editable content (JSON)
│   │   ├── site.json          ← Site name, sections visibility
│   │   ├── profile.json       ← Name, bio, headline, CTAs
│   │   ├── navigation.json    ← Nav items
│   │   ├── education.json     ← Degree, college, highlights
│   │   ├── skills.json        ← Skill groups with levels
│   │   ├── projects.json      ← Projects + categories
│   │   ├── experience.json    ← Timeline milestones
│   │   ├── certifications.json← Certifications list
│   │   ├── contact.json       ← Email, form config
│   │   ├── social-links.json  ← GitHub, LinkedIn, etc.
│   │   ├── seo.json           ← Meta / OG tags
│   │   ├── animations.json    ← Animation toggles
│   │   └── theme.json         ← Default theme
│   ├── assets/
│   │   ├── profile/           ← Profile photo, og-image
│   │   ├── resume/            ← resume.pdf
│   │   ├── projects/          ← Project cover images
│   │   └── certificates/      ← Certificate PDF/images
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/            ← Navbar, Footer, CircuitBg, Intro...
│   ├── sections/              ← Hero, About, Skills, Projects...
│   ├── hooks/                 ← useTheme, useReveal
│   ├── services/              ← contentLoader.ts (typed JSON fetcher)
│   └── App.tsx                ← Root orchestrator
├── server.mjs                 ← Render Web Service entry-point (serves dist/ + API routes)
├── render.yaml                ← Render Blueprint (service definition)
├── vercel.json                ← Vercel config (kept for Vercel deploys; not used on Render)
└── CONTENT-EDITING.md         ← Full content editing guide
```

---

## 🌐 Deploy to Render

### Option A — Render Blueprint (recommended)

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Blueprint**.
3. Connect your GitHub repo — Render reads `render.yaml` automatically.
4. Set all required environment variables in the Render Dashboard **before** the first deploy (see §5 below).
5. Click **Apply** — Render will run `npm ci && npm run build` then `npm start`.

Every `git push` to `main` triggers an automatic redeploy.

### Option B — Manual Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**.
2. Connect your GitHub repo.
3. Configure:
   - **Runtime**: Node
   - **Build command**: `npm ci && npm run build`
   - **Start command**: `npm start`
4. Add environment variables (see §5 below).
5. Click **Create Web Service**.

> The included `server.mjs` handles SPA routing (SPA fallback to `index.html`),  
> static-file serving with correct cache headers, and all API routes.

### Deploying to Vercel (still supported)

The project remains Vercel-compatible. The `vercel.json` is still present and  
Vercel's serverless function convention (`api/*.ts`) still works unchanged.  
Do **not** deploy `server.mjs` on Vercel — it is only used on Render.

---

## ✏️ Updating Content

All content lives in `public/data/`. Edit the relevant JSON file and redeploy. See **[CONTENT-EDITING.md](./CONTENT-EDITING.md)** for a full guide.

**Quick reference:**

| File | What it controls |
|------|-----------------|
| `profile.json` | Name, bio, headline, resume URL |
| `projects.json` | All projects, categories, visibility |
| `skills.json` | Skill groups, levels, domains |
| `experience.json` | Learning journey timeline |
| `contact.json` | Email, contact note |
| `social-links.json` | GitHub, LinkedIn URLs |

---

## 📊 Visitor Analytics & Notification System

A privacy-conscious, real-time analytics and notification engine running entirely server-side — on Render as a persistent Node.js process, or on Vercel as serverless functions — backed by Neon PostgreSQL.

### Architecture Overview

```
Visitor (Browser)
   │
   ├── (1) Page visit  ──────► POST /api/track ──────► Neon PostgreSQL (visit_events & active_sessions)
   │                                                         │
   │                                                         ▼
   │                                                    Telegram Bot Alert (New/Returning)
   │
   ├── (2) Heartbeat   ──────► POST /api/heartbeat ──► Neon PostgreSQL (active_sessions update)
   │       (every 30s)
   │
   ├── (3) Live Stats  ──────► GET /api/stats ◄────── Aggregated counts (Cached 15s)
   │
   ├── (4) Google Auth ──────► POST /api/auth/google ─► Verify Google token & issue HTTP-only JWT
   │       (optional)
   │
   └── (5) Email Opt-in ─────► POST /api/email/consent ─► Send welcome greeting via Resend
```

### 1. Database Setup (Neon PostgreSQL)

1. Create a free serverless PostgreSQL database at [neon.tech](https://neon.tech).
2. Copy the connection string (`postgres://user:password@ep-...neon.tech/neondb?sslmode=require`).
3. Run the migration to create tables and indexes:
   ```bash
   # Using psql:
   psql "$DATABASE_URL" -f api/db/migrations/001_initial.sql
   
   # Or paste the contents of api/db/migrations/001_initial.sql into Neon's SQL Editor console.
   ```
4. Tables created:
   - `visitor_accounts`: Google-authenticated visitors, visit count, consent status.
   - `visit_events`: Session visit events (page, referrer, device class, bot flag).
   - `active_sessions`: Heartbeat tracking for live visitor counter.

### 2. Google Sign-In Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and set up the **OAuth consent screen** (External).
3. Create an **OAuth 2.0 Client ID** (Web application).
4. Add Authorized JavaScript origins:
   - `http://localhost:5173` (local development)
   - `https://portfolio-xxxx.onrender.com` (your Render service URL)
   - Any custom domain you configure on Render
5. Set `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID` to your Client ID.
   *(Tokens are verified cryptographically server-side with `google-auth-library`).*


### 3. Telegram Bot Setup (@BotFather)

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` and follow the prompts to create your bot. Copy the **HTTP API token**.
3. Find your numeric Telegram Chat ID:
   - Message [@userinfobot](https://t.me/userinfobot) on Telegram to get your user `Id`, or
   - Send any message to your new bot, then open `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` and look for `"chat":{"id":123456789}`.
4. Set webhook for real-time bot command replies (replace `<YOUR_RENDER_URL>` with your Render service URL):
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://portfolio-xxxx.onrender.com/api/telegram/webhook", "secret_token": "<YOUR_TELEGRAM_WEBHOOK_SECRET>"}'
   ```
5. Available bot commands (case-insensitive, slashes optional):
   - `Unique Visitor` — Breakdown of unique recognized visitors, anonymous browser identifiers, and returning visitors.
   - `Live Visitors` — Active visitors within timeout window (authenticated vs anonymous).
   - `Total Visits` — All-time visits and today's visits.
   - `Today` — Today's visits, unique recognized, and returning visitors.
   - `Top Pages` — Top 10 most visited pages over the last 30 days.
   - `Help` — Display command list.

### 4. Transactional Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com) and create an API key.
2. Verify your sending domain, or use your verified sender address for `EMAIL_FROM_ADDRESS`.
3. Set `RESEND_API_KEY` and `EMAIL_FROM_ADDRESS` in environment variables.
4. **Strict explicit consent**: Visitors must sign in and explicitly click "Yes, send it" before any email is delivered.
5. Deduplication (`sendOnlyOnce: true`) ensures visitors never receive duplicate welcome greetings.

### 5. Configuring Environment Variables

#### On Render

In the Render Dashboard → your service → **Environment**, add:

| Variable | Required? | Notes |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | If Google Sign-In enabled | **Build-time** — must be set before build |
| `DATABASE_URL` | If analytics enabled | Neon PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | If Google Sign-In enabled | Server-side token verification |
| `SESSION_SECRET` | If Google Sign-In enabled | Random ≥ 32-char string |
| `TELEGRAM_BOT_TOKEN` | Optional | From @BotFather |
| `TELEGRAM_CHAT_ID` | Optional | Your numeric Telegram user ID |
| `TELEGRAM_WEBHOOK_SECRET` | Optional | Must match your `setWebhook` call |
| `RESEND_API_KEY` | Optional | From resend.com |
| `EMAIL_FROM_ADDRESS` | Optional | Verified sender address (e.g. `Sridhar <hello@yourdomain.com>`) |

> **Important**: `VITE_GOOGLE_CLIENT_ID` is embedded into the frontend bundle at build time.
> Add it to Render's environment variables **before** the build runs.

#### On Vercel (unchanged)

In your Vercel Project Dashboard → **Settings** → **Environment Variables**, add the same set of variables.

Generate `SESSION_SECRET` in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 6. Disabling Features via JSON

Edit `public/data/notifications.json`:
- Set `"enabled": false` to instantly disable all analytics, tracking, Telegram alerts, and emails (fails closed).
- Or selectively disable features (`googleSignIn.enabled: false`, `telegram.enabled: false`, `emailGreeting.enabled: false`).

### 7. Testing Locally

```bash
# Run unit tests across all 22 test suites
npm test

# Typecheck serverless API routes
npm run test:api

# Run linting
npm run lint

# Build production bundle
npm run build
```

### 8. Data Deletion & Privacy Rights

- Signed-in visitors can click **"Delete my data"** directly in the footer sign-in panel.
- This invokes `POST /api/admin/delete`, which clears all personal details (`display_name = '[deleted]'`, `email = NULL`), removes active sessions, and wipes the session cookie.
- Visitors can also send a data deletion request to the contact email listed in `public/data/contact.json`.

---

## 🎨 Theme Customization

All colors are CSS variables in `src/index.css` under the `:root` (dark) and `[data-theme="light"]` blocks. Change accent colors there — no hunting through component files.

---

## 📜 License

MIT — free to use as a personal portfolio template. Please replace all personal content (name, bio, projects) with your own.
