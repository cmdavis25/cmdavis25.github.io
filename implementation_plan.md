# Implementation Plan: cmdavis25.github.io

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Plain HTML/CSS/JS | No build step; commit to `main`, GitHub Pages serves directly |
| Markdown rendering | `marked.js` via CDN | Client-side fetch + parse; no tooling required |
| Styling | Hand-written CSS | Full control; sepia palette is simpler to hand-craft |
| Content indexing | Manual `posts.json` / `projects.json` | No server-side enumeration on static sites |
| GitHub activity | `ghchart.rshah.org` `<img>` embed | Zero-JS contribution grid |

## Design System

**Palette (warm parchment / sepia)**

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5efe6` | page background |
| `--bg-card` | `#ede3d6` | card / section background |
| `--text` | `#3b2a1a` | primary text |
| `--text-muted` | `#7a6250` | secondary / caption text |
| `--accent` | `#a0522d` | sienna — buttons, active states |
| `--border` | `#d4c4b0` | dividers, card borders |
| `--link` | `#7b4a2a` | inline links |

**Typography:** Raleway (headers) · Lora (body) · JetBrains Mono (code/tags) — all via Google Fonts.
**Layout:** 860 px max-width, centered. Sticky nav: brand left, phone + links + icons right; hamburger on mobile.

## File Structure

```
cmdavis25.github.io/
├── index.html              ✅ complete (all sections wired and rendering)
├── projects.html           ⬜ not started
├── bio.html                ⬜ not started
├── blog.html               ⬜ not started
├── posts.json              ✅ created  ["blog_2026-02-23.md"]
├── projects.json           ✅ created  (placeholder)
├── assets/
│   ├── style.css           ✅ complete
│   ├── main.js             ✅ complete
│   ├── avatar.jpg          ← user provides
│   └── images/
│       ├── viz/            ✅ 5 images present
│       └── projects/       ⬜ empty
├── blog_posts/
│   └── blog_2026-02-23.md  ✅ one post with front matter
├── projects/               ⬜ placeholder file only
├── resume/                 ✅ PDF present
├── value_proposition.md    ✅ content added
├── tech_stack.md           ✅ content added
├── skills.md               ✅ content added
└── bio.md                  ✅ content added
```

## Implementation Phases

### ✅ Phase 1 — Shared Skeleton (complete)

- `assets/style.css` — CSS reset, custom properties, typography, nav, cards, accordion, mobile breakpoints
- `assets/main.js` — `renderMarkdown()`, `parseFrontMatter()`, `loadIndex()`, nav hamburger, accordion handler, active-page marker
- `index.html` — sticky nav fully wired; all 6 homepage sections rendering from Markdown + live data

**Homepage section order:** Value Proposition → Latest Post → GitHub Activity → Tech Stack → Skills → Visualizations Gallery
**Viz gallery:** 5 images embedded with `<figure>` / `<figcaption>`; lightbox (click to enlarge, Escape/backdrop to close) implemented.

### ✅ Phase 2 — Homepage Content (complete)

All `.md` source files (`value_proposition.md`, `tech_stack.md`, `skills.md`, `bio.md`) contain real content. One blog post exists (`blog_2026-02-23.md`). Visualization images are in `assets/images/viz/`.

### Phase 3 — Projects Page (`projects.html`)

- Fetch `projects.json` → load each `.md` → parse front matter + body
- Summary cards: thumbnail, title, summary, tool badges; click to expand full detail

**Front matter convention:**
```
---
title: Project Title
summary: One-line description
thumbnail: assets/images/projects/my-project.jpg
tools: Python, SQL, dbt
github: https://github.com/cmdavis25/repo
date: 2026-02-23
---
```

### Phase 4 — Bio Page (`bio.html`)

Single `renderMarkdown('bio.md', el)` call into a centered content area.

### Phase 5 — Blog Page (`blog.html`)

- Fetch `posts.json` (newest-first); render preview card per post (title, date, summary)
- Click to expand full post inline (CSS accordion)

**Front matter convention:**
```
---
title: Post Title
date: 2026-02-23
summary: Optional one-line teaser
---
```

### Phase 6 — Polish & Deploy

- Mobile QA: hamburger, card stacking, font sizes
- Validate all links: resume PDF, mailto, GitHub, LinkedIn
- Push to `main` → live at `https://cmdavis25.github.io`

## Index File Format

Add new content by prepending the filename to the relevant JSON array.

**`posts.json`** (newest first): `["blog_2026-02-23.md"]`
**`projects.json`**: `["project_<slug>_<YYYY-MM-DD>.md"]`

## Verification Checklist

- [ ] `index.html` loads via `python -m http.server` — nav and all sections render
- [ ] All nav links route to correct pages; resume triggers PDF download
- [ ] GitHub contributions chart loads and links to profile
- [ ] Projects: cards appear, expand on click, all fields visible
- [ ] Blog: posts listed newest-first, expand on click
- [ ] Bio: content renders correctly
- [ ] Mobile: nav collapses to hamburger, sections readable, cards stack vertically
- [ ] Push to `main`, verify live at `https://cmdavis25.github.io`
