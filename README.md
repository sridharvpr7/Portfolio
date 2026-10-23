# ECE × Dev Portfolio — Beyond the Circuit

A cinematic, JSON-driven personal portfolio for an Electronics and Communication Engineering student who also builds full-stack software. Built with **Vite + React + TypeScript + plain CSS**.

## ✨ Features

- 🌑 **Dark-first design** — cinematic `#080A0F` base, electric blue + violet accents
- 🎬 **Cinematic intro sequence** — skippable, session-aware, reduced-motion safe
- 📄 **100 % JSON-driven content** — edit data files without touching components
- 🔄 **Live theme toggle** — dark / light with localStorage persistence and zero flash
- 🖥️ **Fully responsive** — phone, tablet, laptop, large desktop
- ⚡ **Render-ready** — one-click deployment with a Node.js web service and Render Blueprint
- 📬 **EmailJS contact form** — with validation, honeypot, auto-reply, and mailto fallback
- 🔔 **Telegram bot** — sends a visitor alert per visit; reply `Views` for a full report
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

Optional: copy `.env.example` to `.env` for local backend features:
```bash
cp .env.example .env
# Then fill in DATABASE_URL, SESSION_SECRET, etc.
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
│   │   ├── notifications.json ← Analytics / integrations toggle
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
│   ├── components/            ← Navbar, Footer, GoogleSignIn, VisitorStats…
│   ├── sections/              ← Hero, About, Skills, Projects, Contact…
│   ├── hooks/                 ← useTheme, useReveal, useAnalytics
│   ├── services/              ← contentLoader.ts, analyticsService.ts
│   └── App.tsx                ← Root orchestrator
├── api/                       ← Server-side API handlers
│   ├── track.ts               ← POST /api/track — record a visit
│   ├── heartbeat.ts           ← POST /api/heartbeat — keep session alive
│   ├── stats.ts               ← GET /api/stats — aggregate counts
│   ├── auth/google.ts         ← POST /api/auth/google — verify Google token
│   ├── auth/logout.ts         ← POST /api/auth/logout
│   ├── admin/delete.ts        ← POST /api/admin/delete — GDPR soft-delete
│   ├── email/consent.ts       ← POST /api/email/consent (future: server email)
│   ├── telegram/webhook.ts    ← POST /api/telegram/webhook
│   ├── db/                    ← Neon client + migrations
│   ├── lib/                   ← config, session, telegram, ratelimit helpers
│   └── server-router.ts       ← Pure routing utils (testable)
├── server.mjs                 ← Render Web Service entry-point (serves dist/ + API)
├── render.yaml                ← Render Blueprint
├── vercel.json                ← Vercel config (still supported; not used on Render)
└── CONTENT-EDITING.md         ← Full content editing guide
```

---

## 🌐 Deploy to Render

### Service settings

| Setting | Value |
|---------|-------|
| **Type** | Web Service |
| **Runtime** | Node |
| **Build command** | `npm ci && npm run build` |
| **Start command** | `npm start` |
| **Health-check path** | `/api/health` |

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
3. Configure using the service settings table above.
4. Add environment variables (see §5 below).
5. Click **Create Web Service**.

> `server.mjs` handles SPA routing (fallback to `dist/index.html`), static-file serving with correct cache headers, and all API routes under `/api/*`. The `/api/health` endpoint lets Render confirm the service is up without needing a database.

### Deploying to Vercel (still supported)

The project remains Vercel-compatible. `vercel.json` is present and Vercel's serverless function convention (`api/*.ts`) still works unchanged.  
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
| `notifications.json` | Analytics / integrations master switch |

---

## 📊 Visitor Analytics & Notification System

A privacy-conscious analytics and notification engine running server-side — backed by Neon PostgreSQL. The public portfolio shows **only the total view count**. Detailed analytics (live visitors, unique counts, today's views, top pages) are available only to the owner via the Telegram bot.

### Architecture Overview

```
Visitor (Browser)
   │
   ├── (1) Page visit  ──────► POST /api/track ──────► Neon PostgreSQL (visit_events & active_sessions)
   │                                                         │
   │                                                         ▼
   │                                                    Telegram Alert (New/Returning visitor)
   │
   ├── (2) Heartbeat   ──────► POST /api/heartbeat ──► Neon PostgreSQL (active_sessions update)
   │       (every 30s)
   │
   ├── (3) Total Views ──────► GET /api/stats ─────── Total visit count (public)
   │
   ├── (4) Google Auth ──────► POST /api/auth/google ─► Verify token → issue HTTP-only JWT
   │       (optional)
   │
   └── (5) Contact Form ─────► EmailJS (browser-side) ─► Owner email + visitor auto-reply

Owner (Telegram)
   │
   └── Send "Views"   ──────► POST /api/telegram/webhook ─► Full report (total, today, unique, top pages)
```

### 1. Database Setup (Neon PostgreSQL)

1. Create a free serverless PostgreSQL database at [neon.tech](https://neon.tech).
2. Copy the connection string (`postgres://user:password@ep-...neon.tech/neondb?sslmode=require`).
3. Run the migration to create tables and indexes:
   ```bash
   # Using psql:
   psql "$DATABASE_URL" -f api/db/migrations/001_initial.sql

   # Or paste the contents into Neon's SQL Editor console.
   ```
4. Tables created:
   - `visitor_accounts`: Google-authenticated visitors, visit count, consent.
   - `visit_events`: Session visit events (page, referrer, device class, bot flag).
   - `active_sessions`: Heartbeat tracking for live visitor counter.

### 2. Google Sign-In Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and set up the **OAuth consent screen** (External).
3. Create an **OAuth 2.0 Client ID** (Web application).
4. Add **Authorized JavaScript origins**:
   - `http://localhost:5173` (local development)
   - `https://your-portfolio.onrender.com` (your Render service URL)
   - Any custom domain you configure on Render
5. Set both `VITE_GOOGLE_CLIENT_ID` (build-time, for One Tap / sign-in button) and `GOOGLE_CLIENT_ID` (runtime, for server-side token verification) to the **OAuth Client ID** — the value that ends in `.apps.googleusercontent.com`.
   > **This is the Client ID, not the Client Secret.** Both variables must hold the same value. The Client Secret is not used anywhere in this codebase.

Tokens are verified cryptographically server-side with `google-auth-library`. The frontend never trusts client-decoded profile data as authentication.

**Google One Tap**: The sign-in prompt appears automatically when the portfolio opens (if not dismissed in the current session). Visitors can dismiss it without losing access to the portfolio. After dismissal, the fallback "Sign in with Google" button remains visible.

### 3. Telegram Bot Setup

1. Open Telegram → [@BotFather](https://t.me/BotFather) → `/newbot`. Copy the **HTTP API token**.
2. Find your numeric Telegram user ID:
   - Message [@userinfobot](https://t.me/userinfobot), or
   - Open `https://api.telegram.org/bot<TOKEN>/getUpdates` after messaging your bot.
3. Generate a random webhook secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
4. **After deploying to Render**, register the webhook:
   ```bash
   curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "${APP_BASE_URL}/api/telegram/webhook", "secret_token": "${TELEGRAM_WEBHOOK_SECRET}"}'
   ```
   Replace `${APP_BASE_URL}` with your Render URL (e.g. `https://portfolio.onrender.com`).

5. **Available bot commands** (case-insensitive, leading `/` optional):

   | Command | What it returns |
   |---------|----------------|
   | `Views` | **Quick combined report** — total, today, unique sessions, top 5 pages |
   | `Unique Visitor` | Unique recognized visitors, anonymous IDs, returning |
   | `Live Visitors` | Active sessions (authenticated vs anonymous) |
   | `Total Visits` | All-time + today |
   | `Today` | Today's visits and unique recognized visitors |
   | `Top Pages` | Top 10 most visited pages (last 30 days) |
   | `Help` | Command list |

   Commands from any chat other than `TELEGRAM_CHAT_ID` are silently ignored.

### 4. EmailJS Contact Form

The contact form uses [@emailjs/browser](https://www.emailjs.com/docs/sdk/installation/) — a browser-only SDK. No server secret or API key is exposed.

**Dashboard setup:**

1. Sign up at [emailjs.com](https://www.emailjs.com/).
2. **Connect an email service**: Email Services → Add New Service (e.g. Gmail, Outlook).  
   Note the **Service ID** → `VITE_EMAILJS_SERVICE_ID`.
3. **Create the owner contact template**: Email Templates → Create New Template.  
   Template variables used by the form:
   ```
   From Name:    {{from_name}}
   From Email:   {{from_email}}  ← set as Reply-To in your template
   Subject:      {{subject}}
   Message:      {{message}}
   ```
   Note the **Template ID** → `VITE_EMAILJS_TEMPLATE_ID`.
4. **Enable Auto-Reply** on the same template (or create a separate auto-reply template):
   - Set recipient to `{{from_email}}` (visitor's submitted address).
   - Set the reply body to a polite thank-you message.
   - This sends the visitor a confirmation receipt automatically.
5. **Get your Public Key**: Account → API Keys → Public Key → `VITE_EMAILJS_PUBLIC_KEY`.
6. Set all three `VITE_EMAILJS_*` variables in the Render Dashboard **before** the build runs.

> **Note**: These are browser-safe public integration values, not secrets. Do not add a private key or email-provider password to the frontend.

**Spam protection**: The form includes a honeypot hidden field. Bots that fill it in are silently rejected before any EmailJS call is made. Double-submission is prevented by a `useRef` guard.

When EmailJS variables are not configured, the form gracefully falls back to a direct `mailto:` button — no error, no broken UI.

### 5. Environment Variables

Set these in the Render Dashboard → your service → **Environment**:

| Variable | Required? | Notes |
|---|---|---|
| `VITE_GOOGLE_CLIENT_ID` | If Google Sign-In enabled | **Build-time** — set before build |
| `VITE_EMAILJS_SERVICE_ID` | If contact form enabled | **Build-time** — from EmailJS dashboard |
| `VITE_EMAILJS_TEMPLATE_ID` | If contact form enabled | **Build-time** — from EmailJS dashboard |
| `VITE_EMAILJS_PUBLIC_KEY` | If contact form enabled | **Build-time** — from EmailJS Account page |
| `APP_BASE_URL` | For Telegram webhook | Your Render URL, e.g. `https://portfolio.onrender.com` |
| `DATABASE_URL` | If analytics enabled | Neon PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | If Google Sign-In enabled | Same value as `VITE_GOOGLE_CLIENT_ID` (OAuth Client ID, not secret) |
| `SESSION_SECRET` | If Google Sign-In enabled | Random ≥ 32-char string |
| `TELEGRAM_BOT_TOKEN` | Optional | From @BotFather |
| `TELEGRAM_CHAT_ID` | Optional | Your numeric Telegram user ID |
| `TELEGRAM_WEBHOOK_SECRET` | Optional | Random string matching your `setWebhook` call |

> **VITE_ variables are embedded into the frontend bundle at build time.** Add them before the first deploy. All other variables are server-only and never sent to the browser.

Generate `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### On Vercel (unchanged)

Add the same variables in Vercel Project → **Settings** → **Environment Variables**.

### 6. Enabling / Disabling Features

Edit `public/data/notifications.json`:

- Set `"enabled": true` **only after** configuring `DATABASE_URL` and other required env vars. The master switch fails closed — missing vars disable the whole system automatically.
- Selectively disable features: `googleSignIn.enabled`, `telegram.enabled`, `emailGreeting.enabled`.
- The `emailGreeting` section controls the server-sent welcome email for signed-in visitors (currently disabled, no server-side provider). The EmailJS contact form is independent and always available when `VITE_EMAILJS_*` vars are set.

### 7. Testing Locally

```bash
# Run unit tests (58 tests across 2 suites)
npm test

# TypeScript check for API routes
npm run test:api

# Run linting (oxlint)
npm run lint

# Build production bundle
npm run build
```

### 8. Data Deletion & Privacy Rights

- Signed-in visitors can click **"Delete my data"** in the footer sign-in panel.
- This calls `POST /api/admin/delete`, which clears personal details (`display_name = '[deleted]'`, `email = NULL`), removes active sessions, and clears the session cookie.
- Visitors can also send a deletion request to the contact email in `public/data/contact.json`.

---

## 🎨 Theme Customization

All colors are CSS variables in `src/index.css` under `:root` (dark) and `[data-theme="light"]` blocks. Change accent colors there — no hunting through component files.

---

## 📜 License

MIT — free to use as a personal portfolio template. Please replace all personal content (name, bio, projects) with your own.
