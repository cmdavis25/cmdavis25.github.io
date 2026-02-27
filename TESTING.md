# Local Testing Guide

This site uses `fetch()` at runtime to load Markdown content, which means it **cannot be opened directly as a file** (`file://` URLs block fetch requests). You must serve it over HTTP before testing.

---

## Starting the Dev Server

From the project root:

```bash
python -m http.server 8000
```

Then open **http://localhost:8000** in your browser.

Leave the server running while you work. Stop it with `Ctrl+C`.

---

## After Making Changes

The browser aggressively caches static files. After editing any file, do a **hard refresh** to ensure you see the latest version:

- **Windows / Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

If a change still isn't showing up, open DevTools → Network tab → check "Disable cache", then refresh.

---

## Checklist Before Pushing

Work through each page and verify the following:

### All Pages
- [ ] Top nav renders correctly (avatar, name, links, icons)
- [ ] Nav collapses to hamburger menu on mobile (resize window or use DevTools device emulation)
- [ ] All nav links point to the correct pages
- [ ] No broken images or missing assets (check DevTools Console for 404 errors)

### Homepage (`index.html`)
- [ ] Value Proposition loads and accordion expands/collapses
- [ ] GitHub activity chart loads (may be slow — give it a moment)
- [ ] Latest Post section shows the correct most-recent post from `posts.json`
- [ ] Tech Stack and Skills sections render from their `.md` files
- [ ] Visualization gallery images load; clicking one opens the lightbox
- [ ] Lightbox closes on the × button, backdrop click, and Escape key

### Blog (`blog.html`)
- [ ] Posts appear in reverse-chronological order (newest first)
- [ ] Each post card shows title, date, and summary
- [ ] Clicking a post expands the full content
- [ ] Images embedded in posts render correctly

### Projects (`projects.html`)
- [ ] All project cards load with title, description, and tools
- [ ] Project thumbnail images render
- [ ] GitHub links (if present) open in a new tab

### Resume (`resume.html`)
- [ ] Resume content renders from `resume/resume.md`
- [ ] PDF download link works and points to the correct file in `resume/`

### Bio (`bio.html`)
- [ ] Content renders from `bio.md`

---

## Adding a New Blog Post

1. Create the file in `blog_posts/` following the naming convention:
   ```
   blog_<optional-slug>_<YYYY-MM-DD>.md
   ```
2. Add YAML front matter at the top:
   ```yaml
   ---
   title: Your Post Title
   date: YYYY-MM-DD
   summary: One-sentence description shown in the feed and on the homepage.
   ---
   ```
3. Prepend the filename to `posts.json` (newest first):
   ```json
   ["blog_new-post_2026-03-01.md", "blog_previous-post_2026-02-27.md"]
   ```
4. Hard refresh and verify the new post appears at the top of the blog feed and in the Latest Post section on the homepage.

---

## Common Issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Sections show "Could not load…" | Running from `file://` | Use the Python HTTP server |
| Stale content after an edit | Browser cache | Hard refresh (`Ctrl+Shift+R`) |
| New post not showing up | Missing from `posts.json` | Prepend filename to the array |
| Images not loading | Wrong path or missing file | Check path relative to the HTML file; verify file exists |
| Nav links broken | Wrong `href` | Confirm filenames match exactly (case-sensitive on Linux/GitHub Pages) |
