/* ============================================================
   main.js — shared utilities for cmdavis25.github.io
   ============================================================ */

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
  const toggle = e.target.closest('.accordion-toggle');
  if (!toggle) return;
  const body = toggle.closest('.card')?.querySelector('.accordion-body');
  if (!body) return;
  const isOpen = body.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(isOpen));
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
