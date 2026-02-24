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
**Layout:** 860 px max-width, centered. Sticky nav: brand left, phone + links + icons right; hamburger on mobile. Nav buttons share `--nav-btn-height: 2rem` for consistent height across text and icon links.

## File Structure

```
cmdavis25.github.io/
├── index.html              ✅ complete
├── projects.html           ✅ complete (3 real projects)
├── bio.html                ✅ complete
├── blog.html               ✅ complete
├── posts.json              ✅ ["blog_pattern_discovery_2026-02-23.md"]
├── projects.json           ✅ 3 projects indexed (newest first)
├── assets/
│   ├── style.css           ✅ complete
│   ├── main.js             ✅ complete
│   ├── avatar.jpg          ← user provides
│   └── images/
│       ├── viz/            ✅ 5 images present
│       └── projects/       ✅ thumbnails for all 3 projects
├── blog_posts/
│   └── blog_pattern_discovery_2026-02-23.md  ✅
├── projects/
│   ├── project_instacart_2026-01-15.md       ✅
│   ├── project_ganttoro_2026-01-03.md        ✅
│   └── project_onetaskatatime_2025-12-10.md  ✅
├── resume/                 ✅ PDF present
├── value_proposition.md    ✅
├── tech_stack.md           ✅
├── skills.md               ✅
└── bio.md                  ✅
```

## Pages — All Complete

**Homepage (`index.html`):** Sticky nav (avatar, name, email, phone, page links, GitHub/LinkedIn icons). Six sections in order: Value Proposition (accordion card) → GitHub Activity → Latest Post → Tech Stack → Skills → Visualizations Gallery (horizontal scroll + lightbox).

**Projects (`projects.html`):** Fetches `projects.json` → loads each `.md` → renders summary card (thumbnail, title, date, summary, tool badges) with expandable detail accordion. Wide-thumbnail detection. GitHub link if present in front matter.

**Bio (`bio.html`):** Single `renderMarkdown('bio.md', el)` into a centered content area.

**Blog (`blog.html`):** Fetches `posts.json` (newest-first); renders preview card per post (title, date, summary); click expands full post inline.

## Content Conventions

**Blog front matter** (`blog_posts/blog_<slug>_<YYYY-MM-DD>.md`):
```yaml
---
title: Post Title
date: 2026-02-23
summary: Optional one-line teaser
---
```

**Project front matter** (`projects/project_<slug>_<YYYY-MM-DD>.md`):
```yaml
---
title: Project Title
summary: One-line description
thumbnail: assets/images/projects/my-project.jpg
tools: Python, SQL, dbt
github: https://github.com/cmdavis25/repo
date: 2026-01-15
---
```

**Index files** (prepend new entries, newest first):
- `posts.json`: `["blog_pattern_discovery_2026-02-23.md"]`
- `projects.json`: `["project_instacart_2026-01-15.md", "project_ganttoro_2026-01-03.md", "project_onetaskatatime_2025-12-10.md"]`

## Remaining Work

### Phase 6 — Polish & Deploy

- [ ] Mobile QA: hamburger, card stacking, font sizes
- [ ] Validate all links: resume PDF, mailto, GitHub, LinkedIn
- [ ] Push to `main` → live at `https://cmdavis25.github.io`
