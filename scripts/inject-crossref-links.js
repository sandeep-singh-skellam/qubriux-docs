#!/usr/bin/env node
/**
 * inject-crossref-links.js
 *
 * Scans a docs/ markdown file for plain-text mentions of other doc pages
 * and injects relative markdown links for the first occurrence per paragraph.
 *
 * Usage:
 *   node scripts/inject-crossref-links.js <path-to-md-file>
 *
 * Rules:
 *   - Skips frontmatter (--- block)
 *   - Skips fenced code blocks (``` ... ```)
 *   - Skips inline code (`...`)
 *   - Skips headings (# ## etc.)
 *   - Skips text already inside a markdown link [...](...)
 *   - Links only the first occurrence per paragraph
 *   - Never links a file to itself
 *   - Paths with spaces are URL-encoded (%20)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── CLI arg ──────────────────────────────────────────────────────────────────
const targetArg = process.argv[2];
if (!targetArg) {
  console.error('Usage: node scripts/inject-crossref-links.js <file-path>');
  process.exit(1);
}

const absoluteTarget = path.resolve(targetArg);

if (!fs.existsSync(absoluteTarget)) {
  // File may have been deleted; exit silently
  process.exit(0);
}

// Only handle .md / .mdx
if (!/\.mdx?$/.test(absoluteTarget)) {
  process.exit(0);
}

// ── Find project root ─────────────────────────────────────────────────────────
function findProjectRoot(startFile) {
  let dir = path.dirname(startFile);
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, 'docusaurus.config.ts')) ||
      fs.existsSync(path.join(dir, 'docusaurus.config.js')) ||
      fs.existsSync(path.join(dir, 'package.json'))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

const projectRoot = findProjectRoot(absoluteTarget);
if (!projectRoot) {
  console.error('[crossref] Could not find project root.');
  process.exit(1);
}

const docsRoot = path.join(projectRoot, 'docs');
if (!fs.existsSync(docsRoot)) {
  console.error(`[crossref] docs/ not found at ${docsRoot}`);
  process.exit(1);
}

// Only process files inside docs/
if (!absoluteTarget.startsWith(docsRoot + path.sep) && absoluteTarget !== docsRoot) {
  process.exit(0);
}

// ── Build file index ──────────────────────────────────────────────────────────
function collectDocFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectDocFiles(full));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

function getFrontmatterTitle(content) {
  const m = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const tm = m[1].match(/^title:\s*(.+)$/m);
  if (!tm) return null;
  return tm[1].trim().replace(/^['"]|['"]$/g, '');
}

function stemToTitle(filename) {
  return filename
    .replace(/\.mdx?$/, '')
    .replace(/^\d+-/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

const allDocFiles = collectDocFiles(docsRoot);

// Index: array of { displayName, filePath }
// Sort longer names first so "Analytics & Insights" matches before "Analytics"
const fileIndex = allDocFiles
  .map(fp => {
    const content = fs.readFileSync(fp, 'utf8');
    const displayName = getFrontmatterTitle(content) || stemToTitle(path.basename(fp));
    return { displayName, filePath: fp };
  })
  .sort((a, b) => b.displayName.length - a.displayName.length);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Relative path from `fromFile` to `toFile`, with spaces URL-encoded. */
function relPath(fromFile, toFile) {
  return path.relative(path.dirname(fromFile), toFile)
    .split(path.sep)
    .map(s => s.replace(/ /g, '%20'))
    .join('/');
}

/**
 * Return true if `para` already contains a markdown link whose href resolves
 * to `targetRel` (basename comparison is enough to avoid false negatives from
 * different relative prefixes).
 */
function alreadyLinked(para, targetRel) {
  const targetBase = path.basename(targetRel.replace(/%20/g, ' '));
  const linkRe = /\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = linkRe.exec(para)) !== null) {
    const href = m[1].split('#')[0];
    if (
      href === targetRel ||
      path.basename(href.replace(/%20/g, ' ')) === targetBase
    ) return true;
  }
  return false;
}

/**
 * Return true if `offset` inside `text` is within a markdown link label [...]
 * or URL (...), or within an inline code span `...`.
 */
function isInsideProtectedSpan(text, offset) {
  const before = text.slice(0, offset);

  // Inside inline code?
  const backticks = (before.match(/`/g) || []).length;
  if (backticks % 2 !== 0) return true;

  // Inside a link label [ ... ]?
  let depth = 0;
  for (const ch of before) {
    if (ch === '[') depth++;
    else if (ch === ']') depth = Math.max(0, depth - 1);
  }
  if (depth > 0) return true;

  // Inside a link URL ]( ... )?
  const recent = before.slice(Math.max(0, before.length - 300));
  const lastOpenUrl  = recent.lastIndexOf('](');
  const lastCloseUrl = recent.lastIndexOf(')');
  if (lastOpenUrl !== -1 && lastOpenUrl > lastCloseUrl) return true;

  return false;
}

/**
 * Process a single paragraph: inject links for the first plain-text mention
 * of each concept (skip headings, already-linked text, protected spans).
 * Returns { text, changes[] }.
 */
function processParagraph(para) {
  // Skip headings
  if (/^#{1,6}\s/.test(para.trimStart())) return { text: para, changes: [] };

  const changes = [];
  let result = para;
  const linkedTargets = new Set();

  for (const { displayName, filePath } of fileIndex) {
    if (filePath === absoluteTarget) continue;        // skip self
    if (linkedTargets.has(filePath)) continue;

    const tRel = relPath(absoluteTarget, filePath);

    if (alreadyLinked(result, tRel)) {
      linkedTargets.add(filePath);
      continue;
    }

    // Build a whole-word regex (ASCII \b is fine for our title-cased names)
    const escaped = displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');

    let injected = false;
    const newResult = result.replace(re, (match, offset) => {
      if (injected) return match;
      if (isInsideProtectedSpan(result, offset)) return match;
      injected = true;
      linkedTargets.add(filePath);
      changes.push({ mention: match, target: filePath });
      return `[${match}](${tRel})`;
    });

    if (injected) result = newResult;
  }

  return { text: result, changes };
}

// ── Parse file: strip frontmatter, split code blocks, process paragraphs ─────
const raw = fs.readFileSync(absoluteTarget, 'utf8');

// Separate frontmatter
const fmMatch = raw.match(/^(---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n)/);
const frontmatter = fmMatch ? fmMatch[1] : '';
let body = raw.slice(frontmatter.length);

/**
 * Split body into segments: { text, isCode }.
 * Handles both fenced (```) and indented (4-space) code blocks.
 */
function splitCodeBlocks(text) {
  const segments = [];
  // Match fenced code blocks (``` or ~~~)
  const fenceRe = /^(?:```|~~~)[^\n]*\n[\s\S]*?^(?:```|~~~)\s*$/gm;
  let last = 0;
  let m;
  while ((m = fenceRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), isCode: false });
    segments.push({ text: m[0], isCode: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), isCode: false });
  return segments;
}

const segments = splitCodeBlocks(body);
const allChanges = [];
let newBody = '';

for (const seg of segments) {
  if (seg.isCode) {
    newBody += seg.text;
    continue;
  }

  // Split into paragraphs on blank lines; preserve the separators
  const parts = seg.text.split(/(\n{2,})/);
  let processed = '';
  for (const part of parts) {
    if (/^\n+$/.test(part)) {
      processed += part;
      continue;
    }
    const { text, changes } = processParagraph(part);
    processed += text;
    allChanges.push(...changes);
  }
  newBody += processed;
}

const newContent = frontmatter + newBody;

// Write only if changed
if (newContent !== raw) {
  fs.writeFileSync(absoluteTarget, newContent, 'utf8');
}

// ── Summary ───────────────────────────────────────────────────────────────────
const relTarget = path.relative(projectRoot, absoluteTarget);
if (allChanges.length === 0) {
  console.log(`[crossref] ${relTarget} — no new links needed.`);
} else {
  console.log(`[crossref] ${relTarget} — injected ${allChanges.length} link(s):`);
  for (const { mention, target } of allChanges) {
    console.log(`  "${mention}" → ${path.relative(docsRoot, target)}`);
  }
}
