# Content Editing Guide

This file explains how to edit every piece of content on the portfolio without touching any React component code. All content lives in `public/data/` as JSON files. Edit → commit → redeploy and changes go live.

---

## Table of Contents

1. [How it works](#how-it-works)
2. [profile.json — Name, bio, headline](#profilejson)
3. [projects.json — Add, edit, hide projects](#projectsjson)
4. [skills.json — Skill groups and levels](#skillsjson)
5. [experience.json — Learning journey timeline](#experiencejson)
6. [education.json — Degree info](#educationjson)
7. [certifications.json — Certificates](#certificationsjson)
8. [achievements.json — Honors & Recognition](#achievementsjson)
9. [contact.json — Email and contact note](#contactjson)
10. [social-links.json — GitHub, LinkedIn](#social-linksjson)
11. [navigation.json — Nav menu](#navigationjson)
12. [site.json — Section visibility](#sitejson)
13. [seo.json — Meta and OG tags](#seojson)
14. [animations.json — Motion controls](#animationsjson)
15. [theme.json — Default theme](#themejson)
16. [notifications.json — Analytics, Telegram, Email, and Google Auth](#notificationsjson)
17. [Adding images and files](#adding-images-and-files)
18. [Deploying changes](#deploying-changes)

---

## How it works

The portfolio fetches each JSON file at runtime from `public/data/`. Because they live in `public/`, Vite copies them unchanged into `dist/` during the build, making them accessible as plain static files. No build step is needed to update content — but you do need to **redeploy** after editing JSON.

**Content changes never require editing `.tsx` or `.css` files.**

---

## profile.json

Controls the hero section name, headline, bio, CTAs, and availability badge.

```json
{
  "name": "Your Full Name",
  "firstName": "YourFirst",
  "lastName": "YourLast",
  "tagline": "ECE Student & Full-Stack Developer",
  "headline": "Bridging the World of Circuits and Code",
  "subHeadline": "Short paragraph shown in the hero section.",
  "bio": "First paragraph of your bio.\n\nSecond paragraph separated by two newlines.",
  "currentFocus": "What you're currently learning or building",
  "location": "City, Country",
  "resumeUrl": "/assets/resume/resume.pdf",
  "profileImage": "/assets/profile/profile.jpg",
  "ctaPrimary": { "label": "Explore Projects", "href": "#projects" },
  "ctaSecondary": { "label": "View Resume", "href": "/assets/resume/resume.pdf" },
  "availability": {
    "show": true,
    "status": "Open to Internships & Collaborations",
    "indicator": "active"
  }
}
```

**Tips:**
- Use `\n\n` inside the `bio` string to create paragraph breaks.
- Set `"availability": { "show": false }` to hide the availability badge entirely.
- `resumeUrl` must match the actual file in `public/assets/resume/`.

---

## projects.json

The most important data file. Controls everything in the Projects section.

### Full project schema

```json
{
  "id": "unique-kebab-id",
  "title": "Project Title",
  "shortSummary": "One or two sentence summary shown on cards.",
  "problem": "What problem does this solve?",
  "solution": "How did you solve it?",
  "features": [
    "Feature one",
    "Feature two"
  ],
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "full-stack",
  "status": "In Development",
  "featured": true,
  "visible": true,
  "order": 1,
  "coverImage": "/assets/projects/my-project.png",
  "gallery": [],
  "githubUrl": "https://github.com/yourusername/repo",
  "liveDemoUrl": "https://myproject.vercel.app",
  "startDate": "2024-01",
  "endDate": "2024-06",
  "tags": ["web", "react", "full-stack"]
}
```

### How to add a project

1. Copy the schema above into the `"projects"` array in `projects.json`.
2. Give it a unique `id` (lowercase, hyphens, no spaces).
3. Set `"visible": true` to show it, `false` to hide it.
4. Set `"featured": true` to show it in the large featured layout at the top.
5. Set `"order"` — lower numbers appear first.

### Valid categories

| Value | Display label |
|-------|--------------|
| `"full-stack"` | Full-Stack |
| `"frontend"` | Frontend |
| `"vlsi"` | VLSI / Verilog |
| `"embedded"` | Embedded |
| `"ece"` | ECE |
| `"tools"` | Tools |

### Hiding a project temporarily

Set `"visible": false`. The project will not appear on the site without deleting it.

### Removing a project

Delete the entire project object from the array.

### Optional fields

`coverImage`, `gallery`, `githubUrl`, `liveDemoUrl`, `endDate`, `tags`, `problem`, `solution`, `features` are all optional. The site handles missing values gracefully.

---

## skills.json

Controls the Skills section. Skills are grouped by category.

### Schema

```json
{
  "groups": [
    {
      "id": "web",
      "label": "Web Development",
      "domain": "software",
      "icon": "monitor",
      "skills": [
        {
          "id": "react",
          "name": "React",
          "level": "beginner"
        }
      ]
    }
  ],
  "levels": {
    "learning":    { "label": "Learning",    "description": "Currently exploring" },
    "beginner":    { "label": "Beginner",    "description": "Building with guidance" },
    "comfortable": { "label": "Comfortable", "description": "Build independently" }
  }
}
```

### Valid `domain` values

- `"hardware"` — shown in the ECE/Hardware panel
- `"software"` — shown in the Web/Software panel
- `"both"` — shown in the shared skills row

### Valid `level` values

`"learning"` | `"beginner"` | `"comfortable"`

Do not use percentages or invented mastery claims.

---

## experience.json

Controls the Learning Journey timeline.

```json
{
  "entries": [
    {
      "id": "milestone-1",
      "type": "milestone",
      "title": "Started ECE Degree",
      "organization": "College Name",
      "date": "2022-08",
      "description": "What happened at this milestone.",
      "tags": ["education", "ece"],
      "order": 1
    }
  ]
}
```

**`type` options:** `"milestone"` | `"education"` | `"job"`

**`date` format:** `"YYYY-MM"` or `"YYYY"`.

If you have no work experience, use `"type": "milestone"` for academic and project milestones — no need to invent employment history.

---

## education.json

Controls degree information shown in the About section.

```json
{
  "entries": [
    {
      "id": "edu-1",
      "institution": "Your College Name",
      "degree": "Bachelor of Engineering",
      "field": "Electronics and Communication Engineering",
      "startYear": 2022,
      "endYear": 2026,
      "status": "In Progress",
      "location": "City, India",
      "description": "Short description of your program.",
      "highlights": [
        "Digital Electronics & Logic Design",
        "Verilog HDL"
      ],
      "type": "education",
      "order": 1
    }
  ]
}
```

---

## certifications.json

Controls the certifications gallery. Leave the array empty if you have none — the section is hidden automatically.

```json
{
  "certifications": [
    {
      "id": "cert-1",
      "title": "Certificate Title",
      "issuer": "Issuing Organization",
      "date": "2024-06",
      "credentialUrl": "https://verify.example.com/abc123",
      "certificateFile": "/assets/certificates/cert-name.pdf",
      "visible": true
    }
  ]
}
```

`credentialUrl` and `certificateFile` are optional. Only add URLs you can actually verify.

---

## achievements.json

Controls honors, hackathons, academic awards, or special milestones. Leave the array empty if you have none — the section is hidden automatically.

```json
{
  "achievements": [
    {
      "id": "ach-1",
      "title": "Award or Milestone Title",
      "issuerOrEvent": "Event / Organization Name",
      "date": "2024-05",
      "description": "Short description of the milestone or award.",
      "url": "https://example.com/proof-link",
      "visible": true
    }
  ]
}
```

`url` and `description` are optional.

---

## contact.json

```json
{
  "email": "your.email@example.com",
  "displayEmail": "your.email@example.com",
  "contactNote": "Message shown above your contact details.",
  "formEnabled": false,
  "formProvider": null,
  "formEndpoint": null
}
```

Set `"formEnabled": false` to use the simple mailto link. If you add a form provider (e.g. Formspree), set `"formProvider": "formspree"` and `"formEndpoint": "your-endpoint-id"`.

**Never put API secrets or private keys in JSON files.** Formspree endpoint IDs are safe to commit.

---

## social-links.json

```json
{
  "links": [
    {
      "id": "github",
      "platform": "GitHub",
      "label": "GitHub",
      "url": "https://github.com/yourusername",
      "icon": "github",
      "visible": true,
      "showInHero": true,
      "showInContact": true,
      "showInFooter": true
    },
    {
      "id": "linkedin",
      "platform": "LinkedIn",
      "label": "LinkedIn",
      "url": "https://linkedin.com/in/yourusername",
      "icon": "linkedin",
      "visible": true,
      "showInHero": true,
      "showInContact": true,
      "showInFooter": true
    }
  ]
}
```

Set `"visible": false` on any link to hide it everywhere. Use the `showIn*` flags to control placement.

---

## navigation.json

```json
{
  "items": [
    { "id": "hero",       "label": "Home",     "href": "#hero",       "order": 1 },
    { "id": "about",      "label": "About",    "href": "#about",      "order": 2 },
    { "id": "skills",     "label": "Skills",   "href": "#skills",     "order": 3 },
    { "id": "projects",   "label": "Projects", "href": "#projects",   "order": 4 },
    { "id": "experience", "label": "Journey",  "href": "#experience", "order": 5 },
    { "id": "contact",    "label": "Contact",  "href": "#contact",    "order": 6 }
  ]
}
```

Change `label` to rename nav items. Change `order` to reorder them.

---

## site.json

Controls section-level visibility.

```json
{
  "sections": {
    "hero":         { "visible": true },
    "dualIdentity": { "visible": true },
    "about":        { "visible": true },
    "skills":       { "visible": true },
    "projects":     { "visible": true },
    "experience":   { "visible": true },
    "certifications":{ "visible": true },
    "contact":      { "visible": true }
  }
}
```

Set any section's `"visible": false` to hide it from the site without deleting its data.

---

## seo.json

Controls the `<title>`, `<meta description>`, and Open Graph tags.

```json
{
  "title": "Your Name | ECE & Full-Stack Developer",
  "description": "Short SEO description under 155 characters.",
  "keywords": ["ECE", "full-stack developer", "React"],
  "author": "Your Name",
  "ogTitle": "Your Name | ECE & Full-Stack Developer",
  "ogDescription": "OG description for social sharing.",
  "ogImage": "/assets/profile/og-image.jpg",
  "canonicalUrl": "https://your-domain.vercel.app"
}
```

> Note: Currently `seo.json` is used as documentation. The `index.html` meta tags are the live source. Update both to stay in sync, or wire `seo.json` into a Vite plugin for full automation.

---

## animations.json

```json
{
  "intro": {
    "enabled": true,
    "duration": 3500,
    "skipOnReturn": true
  },
  "reveals": {
    "enabled": true,
    "threshold": 0.15,
    "stagger": 0.08
  },
  "parallax": { "enabled": true, "intensity": 0.3 },
  "cursor":   { "enabled": true, "desktopOnly": true },
  "reducedMotion": {
    "disableIntro": true,
    "disableParallax": true,
    "simplifyTransitions": true
  },
  "intensity": "normal"
}
```

Set `"intro": { "enabled": false }` to skip the intro sequence entirely. The `prefers-reduced-motion` setting is always respected regardless of these values.

---

## theme.json

```json
{
  "defaultTheme": "dark",
  "allowSystemTheme": false
}
```

`"defaultTheme"` must be `"dark"` or `"light"`. This is used only on the very first visit when no preference has been saved.

---

## notifications.json

Controls visitor analytics, footer stats counter, optional Google Sign-In, Telegram bot notifications, and consent-based email greetings.

```json
{
  "enabled": false,
  "_comment": "Set enabled=true only after configuring required environment variables. Fails closed safely if credentials are not configured.",
  "visitorAnalytics": {
    "enabled": true,
    "liveCounterEnabled": true,
    "totalVisitsEnabled": true,
    "uniqueVisitorsEnabled": true,
    "todayVisitsEnabled": true,
    "activeTimeoutSeconds": 120,
    "heartbeatIntervalSeconds": 30,
    "pollIntervalMs": 30000,
    "anonymousTracking": true,
    "retentionDays": 365
  },
  "googleSignIn": {
    "enabled": true,
    "promptLocation": "footer"
  },
  "telegram": {
    "enabled": true,
    "anonymousNotificationsEnabled": true,
    "repeatVisitNotificationsEnabled": true,
    "deduplicationWindowSeconds": 3600
  },
  "emailGreeting": {
    "enabled": true,
    "requiresExplicitConsent": true,
    "sendOnlyOnce": true,
    "subject": "Welcome to my portfolio!"
  },
  "privacy": {
    "showPrivacyNotice": true,
    "deletionContactEmail": "your.email@example.com",
    "retentionPolicyDays": 365
  }
}
```

### Key Controls:
- **`enabled` (master switch):** When `false`, completely turns off all visitor tracking, database writes, Telegram alerts, and emails.
- **`visitorAnalytics.activeTimeoutSeconds`:** Time in seconds before an inactive session is excluded from the live counter (default `120`).
- **`visitorAnalytics.heartbeatIntervalSeconds`:** Interval between client presence heartbeats (default `30`).
- **`emailGreeting.requiresExplicitConsent`:** Enforces explicit user opt-in before sending any welcome email (never pre-checked).
- **`emailGreeting.sendOnlyOnce`:** Guarantees returning visitors never receive duplicate welcome messages.

---

## Adding images and files

### Resume

1. Name your file `resume.pdf`.
2. Place it in `public/assets/resume/`.
3. Verify `profile.json` has `"resumeUrl": "/assets/resume/resume.pdf"`.

### Profile photo

1. Name it `profile.jpg` (or `.png`, `.webp`).
2. Place in `public/assets/profile/`.
3. Update `"profileImage"` in `profile.json`.

### Open Graph image

1. Create a `1200×630` image named `og-image.jpg`.
2. Place in `public/assets/profile/`.

### Project cover images

1. Place images in `public/assets/projects/`.
2. Use descriptive names: `elders-veil.png`.
3. In `projects.json` set `"coverImage": "/assets/projects/elders-veil.png"`.
4. If `coverImage` is missing or the file doesn't load, the built-in SVG diagram is shown instead — the site does not crash.

### Certificates

1. Place PDFs or images in `public/assets/certificates/`.
2. In `certifications.json` set `"certificateFile": "/assets/certificates/your-cert.pdf"`.

---

## Deploying changes

### Quick update (Vercel + GitHub)

```bash
# 1. Edit the JSON file(s) in public/data/
# 2. Commit and push
git add public/data/
git commit -m "content: update projects list"
git push

# Vercel auto-deploys on push — changes live in ~30 seconds
```

### Manual deploy

```bash
npm run build
vercel --prod
```

### Checking your changes locally first

```bash
npm run dev
# → http://localhost:5173
# Edit JSON → browser hot-reloads automatically
```

---

## Frequently asked questions

**Q: Can I add a new section?**  
A: Yes — create the JSON schema, add a React component in `src/sections/`, import it in `App.tsx`, and add a visibility flag in `site.json`.

**Q: Why don't changes appear after editing JSON?**  
A: In development, the browser should hot-reload. In production, you must redeploy after committing changes.

**Q: Can I have more than one education entry?**  
A: Yes — add multiple objects to the `entries` array in `education.json`.

**Q: How do I reorder projects?**  
A: Change the `"order"` field. Lower numbers appear first.

**Q: How do I completely remove a section?**  
A: Set `"visible": false` in `site.json` for that section. Or delete its component import from `App.tsx` for a permanent removal.
