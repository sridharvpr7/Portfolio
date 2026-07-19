# Premium Personal Portfolio

A fully responsive, dark/light, JSON-driven portfolio site built with HTML5, CSS3, vanilla JavaScript (ES6), Bootstrap 5, AOS, GSAP, Typed.js, and particles.js.

## Quick start

Because the site loads content via `fetch()` from the `/data/*.json` files, it needs to run over `http://` — opening `index.html` directly with `file://` will fail to load the JSON (browser security restriction). Two easy options:

**Option A — VS Code:** install the "Live Server" extension, right-click `index.html` → "Open with Live Server".

**Option B — Python:**
```bash
cd portfolio
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

## Folder structure

```
portfolio/
├── index.html          Main page — sections only, no hardcoded content
├── 404.html             Custom error page
├── css/
│   ├── style.css        Design tokens (colors/fonts/radii) + all component styles
│   ├── responsive.css   Breakpoints for tablet/mobile
│   └── animations.css   Extra keyframes (page transition, skeleton, etc.)
├── js/
│   ├── app.js            Loads all JSON, renders every section, wires up interactivity
│   ├── theme.js          Dark/light mode logic
│   ├── particles.js      Hero background particle config
│   └── github.js          Live GitHub API dashboard
├── data/                 <-- EDIT THESE to update site content, no code changes needed
│   ├── config.json        Name, title, bio, contact info, socials, services, EmailJS keys
│   ├── skills.json         Skill categories + percentages
│   ├── projects.json       Project cards (filterable)
│   ├── certificates.json   Certificate gallery
│   ├── experience.json      Work timeline
│   ├── education.json       Education timeline
│   ├── testimonials.json    Testimonial slider
│   ├── gallery.json          Photo gallery (filterable)
│   ├── blog.json              Blog cards
│   └── achievements.json      Awards/hackathons
├── assets/images/        Replace the placeholder SVGs with your real photos
├── resume/Resume.pdf     Replace with your actual resume
└── assets/audio/         Optional background-music track
```

## Customization checklist

1. **`data/config.json`** — the most important file. Set your name, title, bio, email, phone, location, social links, GitHub username, and services.
2. **Profile photo** — replace `assets/images/profile-placeholder.svg` with a real photo (any format), then update `site.profileImage` in `config.json`.
3. **Resume** — drop your PDF into `resume/Resume.pdf` (already linked).
4. **Projects / Certificates / Gallery** — add, remove, or edit entries directly in their JSON files; the site re-renders automatically, no HTML editing required.
5. **EmailJS contact form** — sign up at emailjs.com, create a service + template, then paste your `serviceId`, `templateId`, and `publicKey` into `config.json → site.emailjs`. Until you do, the form shows a friendly "not configured yet" message instead of failing silently.
6. **GitHub dashboard** — set `site.githubUsername` in `config.json`. It uses the public GitHub REST API (no token needed for reasonable traffic).
7. **Theme colors** — all colors are CSS variables at the top of `css/style.css` (`:root` and `[data-theme="dark"]`). Change them once, and every section updates.
8. **Coding profiles / achievements** — edit `config.json` (`codingProfiles`) and `data/achievements.json`.
9. **Background music** — optional. Add an mp3 at `assets/audio/ambient.mp3` to enable the music toggle.
10. **Language switch** — a small EN/TA dictionary lives at the top of `js/app.js` (`I18N` object). Extend it to translate more UI strings.

## Notes on things that need your own keys/accounts

- **EmailJS** — required for the contact form to actually send email.
- **GitHub API** — works out of the box with any public username, but is rate-limited to 60 requests/hour per IP without a token.
- **Resume, photos, certificates** — all placeholders; swap in your real files.

## Browser storage

This build intentionally avoids `localStorage`/`sessionStorage` for the theme toggle and visitor counter so it works safely in any sandboxed preview. If you deploy this as a real static site, `js/theme.js` has commented-out lines showing exactly where to add `localStorage` persistence for the dark/light mode choice.
