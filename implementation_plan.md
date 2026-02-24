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
├── projects.html           ✅ complete (3 real projects loading from MD)
├── bio.html                ✅ complete
├── blog.html               ⬜ not started
├── posts.json              ✅ ["blog_2026-02-23.md"]
├── projects.json           ✅ 3 real projects indexed (newest first)
├── assets/
│   ├── style.css           ✅ complete
│   ├── main.js             ✅ complete
│   ├── avatar.jpg          ← user provides
│   └── images/
│       ├── viz/            ✅ 5 images present
│       └── projects/       ✅ thumbnails present for all 3 projects
├── blog_posts/
│   └── blog_2026-02-23.md  ✅ one post with front matter
├── projects/
│   ├── project_instacart_2026-01-15.md      ✅ with front matter + body
│   ├── project_ganttoro_2026-01-03.md       ✅ with front matter + body
│   └── project_onetaskatatime_2025-12-10.md ✅ with front matter + body
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

**Homepage section order:** Value Proposition → GitHub Activity → Latest Post → Tech Stack → Skills → Visualizations Gallery
**Viz gallery:** 5 images embedded with `<figure>` / `<figcaption>`; lightbox (click to enlarge, Escape/backdrop to close) implemented.

### ✅ Phase 2 — Homepage Content (complete)

All `.md` source files (`value_proposition.md`, `tech_stack.md`, `skills.md`, `bio.md`) contain real content. One blog post exists (`blog_2026-02-23.md`). Visualization images are in `assets/images/viz/`.

### ✅ Phase 3 — Projects Page (`projects.html`) (complete)

- `projects.html` built and fully functional
- Fetches `projects.json` → loads each `.md` → parses front matter + body
- Summary cards: thumbnail, title, date, summary, tool badges; "Details ▾" accordion expands full markdown body
- Wide-thumbnail detection (aspect ratio > 2:1 stacks image above text)
- GitHub link rendered if present in front matter
- 3 real projects indexed and rendering:
  - `project_instacart_2026-01-15.md`
  - `project_ganttoro_2026-01-03.md`
  - `project_onetaskatatime_2025-12-10.md`
- Project thumbnails present in `assets/images/projects/`

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

### ✅ Phase 4 — Bio Page (`bio.html`) (complete)

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
**`projects.json`** (newest first): `["project_instacart_2026-01-15.md", "project_ganttoro_2026-01-03.md", "project_onetaskatatime_2025-12-10.md"]`

## Verification Checklist

- [ ] `index.html` loads via `python -m http.server` — nav and all sections render
- [ ] All nav links route to correct pages; resume triggers PDF download
- [ ] GitHub contributions chart loads and links to profile
- [x] Projects: cards appear, expand on click, all fields visible
- [ ] Blog: posts listed newest-first, expand on click
- [x] Bio: content renders correctly
- [ ] Mobile: nav collapses to hamburger, sections readable, cards stack vertically
- [ ] Push to `main`, verify live at `https://cmdavis25.github.io`
