/**
 * CENTRAL SYSTEM AUDIT
 * - Lists published vs internal paths
 * - Extracts DOI strings (doi.org / zenodo / figshare)
 * - Finds internal repo-relative links that likely break
 * Output: output/system_audit.json
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === ".git") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function isPublished(rel) {
  if (rel.startsWith("public/")) return true;
  if (!rel.includes("/") && rel.toLowerCase().endsWith(".html")) return true; // root *.html
  return false;
}

const files = walk(ROOT).map(p => path.relative(ROOT, p).replace(/\\/g, "/"));

const published = [];
const internal = [];
const doiHits = [];
const linkWarnings = [];

const DOI_RE = /(https?:\/\/(?:doi\.org\/[^\s)]+|zenodo\.org\/records?\/[^\s)]+|figshare\.com\/articles?\/[^\s)]+))/gi;
const REL_LINK_RE = /\]\((?!https?:\/\/)([^)#\s]+)\)/gi; // markdown relative links

for (const rel of files) {
  const bucket = isPublished(rel) ? published : internal;
  bucket.push(rel);

  // scan only text-like files
  if (!/\.(md|html|txt|cff|json|yml|yaml|js|ts|tsx|csv)$/i.test(rel)) continue;

  let text = "";
  try { text = fs.readFileSync(path.join(ROOT, rel), "utf8"); }
  catch { continue; }

  // DOI-like URLs
  const m = text.match(DOI_RE);
  if (m) {
    for (const u of m) doiHits.push({ file: rel, url: u });
  }

  // repo-relative link sanity (only for markdown)
  if (/\.md$/i.test(rel)) {
    let mm;
    while ((mm = REL_LINK_RE.exec(text)) !== null) {
      const target = mm[1].trim();
      // ignore anchors/mailto
      if (target.startsWith("#") || target.startsWith("mailto:")) continue;
      // normalize ./ and leading /
      const norm = target.replace(/^\.\//, "").replace(/^\//, "");
      const candidate = path.normalize(path.join(path.dirname(rel), norm)).replace(/\\/g, "/");
      // if points to a directory, check for index.md/html not attempted here; warn only if file missing
      if (!files.includes(candidate)) {
        linkWarnings.push({ file: rel, link: target, resolved: candidate });
      }
    }
  }
}

const result = {
  repo: "FMP-CENTRAL-REPO",
  generated_utc: new Date().toISOString(),
  publication_rule: {
    published: ["public/**", "root/*.html"],
    internal: ["output/**","docs/**","data/**","demos/**","scripts/**","src/**","living-index/**",".automation/**",".publisher/**"]
  },
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
