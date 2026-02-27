/* ============================================================
   main.js — shared utilities for cmdavis25.github.io
   ============================================================ */

/* ============================================================
   Math-safe marked renderer
   Extracts $$...$$ and $...$ blocks before marked.parse() so
   that marked cannot escape their contents, then restores them
   in the output HTML before MathJax runs.
   ============================================================ */
function parseMarkdownWithMath(text) {
  const stash = [];
  const placeholder = (i) => `\x02MATH${i}\x03`;

  // Stash display math first ($$...$$), then inline ($...$)
  let out = text
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, inner) => {
      stash.push(`$$${inner}$$`);
      return placeholder(stash.length - 1);
    })
    .replace(/\$([^\n$]+?)\$/g, (_, inner) => {
      stash.push(`$${inner}$`);
      return placeholder(stash.length - 1);
    });

  // Parse the math-free text with marked
  let html = marked.parse(out);

  // Restore math blocks verbatim
  html = html.replace(/\x02MATH(\d+)\x03/g, (_, i) => stash[+i]);

  return html;
}

/**
 * Fetch a Markdown file, parse it with marked.js, and inject the
 * resulting HTML into `el`.  Displays loading/error states inline.
 *
 * @param {string}      url  - Relative or absolute URL to a .md file
 * @param {HTMLElement} el   - Target container element
 * @returns {Promise<string>} The raw markdown text (for further processing)
 */
async function renderMarkdown(url, el) {
  el.innerHTML = '<p class="loading-msg">Loading…</p>';
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    el.classList.add('md-content');
    el.innerHTML = marked.parse(text);
    return text;
  } catch (err) {
    el.innerHTML = `<p class="error-msg">Could not load content (${err.message}).</p>`;
    return '';
  }
}

/**
 * Parse YAML-style front matter from a Markdown string.
 * Supports string, number, and simple array values.
 *
 * @param {string} text - Raw markdown text, possibly with --- delimiters
 * @returns {{ data: Object, content: string }}
 *   data    - key/value pairs from the front matter block
 *   content - the markdown body after the closing ---
 */
function parseFrontMatter(text) {
  const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
  const match = text.match(FM_RE);
  if (!match) return { data: {}, content: text };

  const raw = match[1];
  const content = match[2] || '';
  const data = {};

  for (const line of raw.split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim();

    // Simple array: value starts with [ ... ]
    if (val.startsWith('[') && val.endsWith(']')) {
      data[key] = val
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    } else {
      // Strip optional quotes
      data[key] = val.replace(/^['"]|['"]$/g, '');
    }
  }

  return { data, content };
}

/**
 * Fetch a JSON index file and return the parsed array.
 * Returns an empty array on network or parse errors.
 *
 * @param {string} jsonUrl - URL of a JSON file containing a filename array
 * @returns {Promise<string[]>}
 */
async function loadIndex(jsonUrl) {
  try {
    const res = await fetch(jsonUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`loadIndex: could not fetch ${jsonUrl}:`, err.message);
    return [];
  }
}

/* ============================================================
   Hamburger nav toggle
   ============================================================ */
(function initNav() {
  const btn = document.getElementById('nav-hamburger');
  const menu = document.getElementById('nav-links');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('is-open', !expanded);
  });

  // Close menu when a nav link is clicked (single-page transitions)
  menu.addEventListener('click', e => {
    if (e.target.closest('a')) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  });
})();

/* ============================================================
   Accordion expand / collapse
   ============================================================ */
document.addEventListener('click', e => {
  // Skip cards that manage their own accordion (e.g. blog posts)
  const card = e.target.closest('.card');
  if (card && card.dataset.accordion === 'manual') return;

  // Collapse when clicking anywhere on an open card (but not the toggle itself)
  if (card && !e.target.closest('.accordion-toggle')) {
    const body = card.querySelector('.accordion-body.is-open');
    if (body) {
      body.classList.remove('is-open');
      const toggle = card.querySelector('.accordion-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-hidden');
      }
      return;
    }
  }

  // Expand when clicking the toggle
  const toggle = e.target.closest('.accordion-toggle');
  if (!toggle) return;
  const body = toggle.closest('.card')?.querySelector('.accordion-body');
  if (!body) return;
  const isOpen = body.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.classList.toggle('is-hidden', isOpen);
});

/* ============================================================
   Mark current page nav link
   ============================================================ */
(function markCurrentPage() {
  const path = location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/index.html';
    if (path.endsWith(href) || (href === 'index.html' && (path === '' || path.endsWith('/')))) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
