/**
 * CENTRAL SYSTEM AUDIT (FMP-CENTRAL-REPO)
 * Output: output/system_audit.json
 * - counts
 * - publication split
 * - doi hits
 * - relative link warnings (Markdown)
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function walk(dir) {
  let out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === ".git") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function rel(p) { return path.relative(ROOT, p).replace(/\\/g, "/"); }

function isPublished(r) {
  if (r.startsWith("public/")) return true;
  if (!r.includes("/") && r.toLowerCase().endsWith(".html")) return true;
  return false;
}

const filesAbs = walk(ROOT);
const files = filesAbs.map(rel);

const published = [];
const internal = [];

const doiHits = [];
const linkWarnings = [];

// DOI-like urls
const DOI_RE = /(https?:\/\/(?:doi\.org\/[^\s)]+|zenodo\.org\/records?\/[^\s)]+|figshare\.com\/articles?\/[^\s)]+))/gi;
// markdown relative links: ](something) but not http(s), not mailto, not #anchor
const REL_LINK_RE = /\]\((?!https?:\/\/)(?!mailto:)([^)#\s]+)\)/gi;

const fileSet = new Set(files);

for (const r of files) {
  (isPublished(r) ? published : internal).push(r);

  if (!/\.(md|html|txt|cff|json|yml|yaml|js|ts|tsx|csv)$/i.test(r)) continue;

  let text = "";
  try { text = fs.readFileSync(path.join(ROOT, r), "utf8"); }
  catch { continue; }

  // DOI hits
  const m = text.match(DOI_RE);
  if (m) for (const u of m) doiHits.push({ file: r, url: u });

  // Link warnings (markdown only)
  if (/\.md$/i.test(r)) {
    let mm;
    while ((mm = REL_LINK_RE.exec(text)) !== null) {
      const target = (mm[1] || "").trim();
      if (!target || target.startsWith("#")) continue;
      const norm = target.replace(/^\.\//, "").replace(/^\//, "");
      const resolved = path.normalize(path.join(path.dirname(r), norm)).replace(/\\/g, "/");
      if (!fileSet.has(resolved)) {
        linkWarnings.push({ file: r, link: target, resolved });
      }
    }
  }
}

const result = {
  repo: "FMP-CENTRAL-REPO",
  generated_utc: new Date().toISOString(),
  publication_rule: { published: ["public/**", "root/*.html"] },
  counts: {
    total_files: files.length,
    published_files: published.length,
    internal_files: internal.length,
    doi_hits: doiHits.length,
    link_warnings: linkWarnings.length
  },
  published_files_sample: published.slice(0, 200),
  doi_hits: doiHits.slice(0, 500),
  link_warnings: linkWarnings.slice(0, 500)
};

fs.mkdirSync(path.join(ROOT, "output"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "output/system_audit.json"), JSON.stringify(result, null, 2), "utf8");
console.log("Wrote output/system_audit.json");
