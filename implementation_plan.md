# Implementation Plan: cmdavis25.github.io

## Context

Personal portfolio site for C. Morgan Davis, hosted on GitHub Pages, targeting Data Analyst/Scientist/Engineer recruiters. The repo contains placeholder Markdown content files and a resume PDF but no HTML/CSS/JS yet. This plan establishes the architecture and implementation sequence.

---

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Plain HTML/CSS/JS | No build step; commit to `main` and GitHub Pages serves directly |
| Markdown rendering | `marked.js` via CDN | Client-side fetch + parse; no tooling required |
| Styling | Hand-written CSS | Full control; sepia palette is simpler to hand-craft than to configure in a framework |
| Content indexing | Manual `posts.json` / `projects.json` | No server-side enumeration possible in a static site |
| GitHub activity | `ghchart.rshah.org` `<img>` embed | Zero-JS, shows actual contribution grid |

---

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
| Headers | Raleway (sans-serif) | Page titles, section headings |
| Body | Lora (serif) | Paragraphs, card text |
| Code / labels | JetBrains Mono (monospace) | Skill tags, tool badges, inline code |

### Layout

- Max content width: **860 px**, centered
- Sticky top nav: avatar + name (left), nav links + icons (right); hamburger on mobile
- CSS custom properties for all tokens; no preprocessor needed

---

## Target File Structure

```
cmdavis25.github.io/
├── index.html
├── projects.html
├── bio.html
├── blog.html
├── posts.json              ← manual index, newest-first
├── projects.json           ← manual index
├── assets/
│   ├── style.css
│   ├── main.js
│   ├── avatar.jpg          ← user provides
│   └── images/
│       ├── viz/            ← visualization screenshots
│       └── projects/       ← project thumbnails
├── blog_posts/             ← existing .md files
├── projects/               ← existing .md files
├── resume/                 ← existing PDF
├── value_proposition.md
├── tech_stack.md
├── skills.md
└── bio.md
```

---

## Implementation Phases

### Phase 1 — Shared Skeleton

1. **`assets/style.css`** — CSS reset, custom properties, typography imports, nav styles, card styles, accordion styles, mobile breakpoints
2. **`assets/main.js`** — shared utilities:
   - `renderMarkdown(url, el)` — fetch a `.md` file, parse with `marked.parse()`, inject HTML
   - `parseFrontMatter(text)` — lightweight regex to extract `---` YAML front matter into an object
   - `loadIndex(jsonUrl)` — fetch a `.json` index file, return filename array
3. **`index.html`** — full sticky nav bar (avatar, name, contact, nav links, GitHub/LinkedIn icons); empty section placeholders

### Phase 2 — Homepage (`index.html`)

Sections rendered in order:

| Section | Source | Method |
|---|---|---|
| Value Proposition | `value_proposition.md` | `renderMarkdown()` |
| Tech Stack | `tech_stack.md` | `renderMarkdown()` |
| Skills | `skills.md` | `renderMarkdown()` |
| GitHub Contributions | `ghchart.rshah.org/cmdavis25` | Static `<img>` |
| Latest Blog Post | `posts.json` → first entry | Fetch, parse, render preview card |
| Visualization Gallery | `assets/images/viz/` | Static `<img>` tags |

### Phase 3 — Projects Page (`projects.html`)

- Fetch `projects.json` → load each `.md` → parse front matter + body
- Render summary cards: thumbnail, title, one-line summary, tool badges
- Click to expand (CSS accordion) → full detail: problem, approach, tools, outcome, optional GitHub link

**Front matter convention for project files:**
```
---
title: Project Title
summary: One-line description for the card
thumbnail: assets/images/projects/my-project.jpg
tools: Python, SQL, dbt
github: https://github.com/cmdavis25/repo
date: 2026-02-23
---
```

### Phase 4 — Bio Page (`bio.html`)

- Single `renderMarkdown('bio.md', el)` call into a centered content area
- Same nav and styles; no additional logic needed

### Phase 5 — Blog Page (`blog.html`)

- Fetch `posts.json` (maintain newest-first order)
- For each entry: fetch `.md`, parse front matter, render preview card (title, date, first paragraph)
- Click to expand full post inline (same CSS accordion pattern)

**Front matter convention for blog posts:**
```
---
title: Post Title
date: 2026-02-23
summary: Optional one-line teaser
---
```

### Phase 6 — Polish & Deploy

- Mobile QA: nav hamburger, card stacking, font sizes
- Error handling: graceful fallback if a `fetch()` 404s
- Validate all links: resume PDF download, mailto, GitHub, LinkedIn
- Update `CLAUDE.md` with final decisions
- Push to `main` — site goes live immediately at `https://cmdavis25.github.io`

---

## Index File Format

**`posts.json`** (newest first):
```json
["blog_2026-02-23.md"]
```

**`projects.json`**:
```json
["project_test_2026-02-23.md"]
```

To add new content: add the filename to the relevant JSON and commit the `.md` file.

---

## Verification Checklist

- [ ] `index.html` opens via Live Server / `python -m http.server` — nav and all sections load
- [ ] All nav links route to correct pages
- [ ] Resume link triggers PDF download
- [ ] GitHub contributions chart image loads
- [ ] Projects: cards appear, expand on click, all fields visible
- [ ] Blog: posts listed newest-first, expand on click
- [ ] Bio: content renders correctly
- [ ] Mobile: nav collapses to hamburger, sections readable, cards stack vertically
- [ ] Push to `main`, verify live at `https://cmdavis25.github.io`
