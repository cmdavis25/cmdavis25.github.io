# Implementation Plan: cmdavis25.github.io

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Plain HTML/CSS/JS | No build step; commit to `main` and GitHub Pages serves directly |
| Markdown rendering | `marked.js` via CDN | Client-side fetch + parse; no tooling required |
| Styling | Hand-written CSS | Full control; sepia palette is simpler to hand-craft than to configure in a framework |
| Content indexing | Manual `posts.json` / `projects.json` | No server-side enumeration possible in a static site |
| GitHub activity | `ghchart.rshah.org` `<img>` embed | Zero-JS, shows actual contribution grid |

## Design System

### Palette (warm parchment / classic sepia)

```
--bg:        #f5efe6   /* page background */
--bg-card:   #ede3d6   /* card / section background */
--text:      #3b2a1a   /* primary text */
--text-muted:#7a6250   /* secondary / caption text */
--accent:    #a0522d   /* sienna — buttons, active states */
--border:    #d4c4b0   /* dividers, card borders */
--link:      #7b4a2a   /* inline links */
```

### Typography (Google Fonts)

| Role | Font | Use |
|---|---|---|
| Headers | Raleway (sans-serif) | Page titles, section headings, nav links |
| Body | Lora (serif) | Paragraphs, card text |
| Code / labels | JetBrains Mono (monospace) | Skill tags, tool badges, inline code |

### Layout

- Max content width: **860 px**, centered
- Sticky top nav: avatar + name/email (left), phone + nav links + icons (right); hamburger on mobile
- CSS custom properties for all tokens; no preprocessor needed

## File Structure

```
cmdavis25.github.io/
├── index.html              ✅ complete
├── projects.html
├── bio.html
├── blog.html
├── posts.json              ✅ created
├── projects.json           ✅ created
├── assets/
│   ├── style.css           ✅ complete
│   ├── main.js             ✅ complete
│   ├── avatar.jpg          ← user provides
│   └── images/
│       ├── viz/
│       └── projects/
├── blog_posts/
├── projects/
├── resume/                 ✅ PDF present
├── value_proposition.md
├── tech_stack.md
├── skills.md
└── bio.md
```

## Implementation Phases

### ✅ Phase 1 — Shared Skeleton (complete)

- `assets/style.css` — CSS reset, custom properties, typography, nav, cards, accordion, mobile breakpoints
- `assets/main.js` — `renderMarkdown()`, `parseFrontMatter()`, `loadIndex()`, nav hamburger toggle, accordion handler, active-page marker
- `index.html` — sticky nav (avatar, name, email left · phone, links, Resume, GitHub, LinkedIn right); all homepage sections wired up and rendering

**Nav details:** phone number sits between email and Projects, styled identically to nav links but non-interactive. GitHub Activity chart uses `ghchart.rshah.org/a0522d/cmdavis25` (sienna accent), displayed in a white card that links to the GitHub profile and highlights on hover. Section order: GitHub Activity → Value Proposition → Tech Stack → Skills → Latest Post → Visualizations.

### Phase 2 — Homepage content (`index.html`)

Replace placeholder `.md` files with real content; add visualization `<img>` tags to `#viz-gallery`.

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

- Fetch `posts.json` (newest-first); render preview card per post (title, date, first paragraph)
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
- Update `CLAUDE.md` with final decisions
- Push to `main` → live at `https://cmdavis25.github.io`

## Index File Format

Add new content by prepending the filename to the relevant JSON array and committing the `.md` file.

**`posts.json`** (newest first): `["blog_2026-02-23.md"]`

**`projects.json`**: `["project_test_2026-02-23.md"]`

## Verification Checklist

- [ ] `index.html` loads via `python -m http.server` — nav and all sections render
- [ ] All nav links route to correct pages; resume triggers PDF download
- [ ] GitHub contributions chart loads and links to profile
- [ ] Projects: cards appear, expand on click, all fields visible
- [ ] Blog: posts listed newest-first, expand on click
- [ ] Bio: content renders correctly
- [ ] Mobile: nav collapses to hamburger, sections readable, cards stack vertically
- [ ] Push to `main`, verify live at `https://cmdavis25.github.io`
