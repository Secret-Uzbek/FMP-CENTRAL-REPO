/**
 * PUBLIC GUARD (FMP-CENTRAL-REPO)
 * Rule: public/ is for publishable artifacts only.
 * Fails CI if internal/dev artifacts appear inside public/.
 * Also writes output/public_audit.json for visibility.
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PUB = path.join(ROOT, "public");

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function rel(p) { return path.relative(ROOT, p).replace(/\\/g, "/"); }

const forbiddenDirNames = new Set([
  "node_modules", ".git", ".github", "src", "scripts", ".automation", ".publisher",
  "living-index", "data", "docs", "output"
]);

const forbiddenExt = new Set([
  ".zip", ".7z", ".rar", ".tar", ".gz", ".exe", ".dmg", ".iso", ".msi"
]);

const allowedTextExt = new Set([
  ".html",".css",".js",".mjs",".json",".txt",".md",".xml",".svg"
]);

const allowedMediaExt = new Set([
  ".png",".jpg",".jpeg",".webp",".gif",".ico",".mp4",".webm",".pdf"
]);

let violations = [];
let files = [];

if (!fs.existsSync(PUB)) {
  violations.push({ type: "missing_public_dir", path: "public/" });
} else {
  // directory name checks along each path segment
  const all = walk(PUB);
  for (const abs of all) {
    const r = rel(abs);
    files.push(r);

    const parts = r.split("/");
    for (const part of parts) {
      if (forbiddenDirNames.has(part)) {
        violations.push({ type: "forbidden_dir_segment", path: r, segment: part });
        break;
      }
    }

    const ext = path.extname(r).toLowerCase();
    if (forbiddenExt.has(ext)) violations.push({ type: "forbidden_extension", path: r, ext });

    // keep it permissive but predictable: unknown extensions are warned (not failed)
    if (ext && !allowedTextExt.has(ext) && !allowedMediaExt.has(ext)) {
      // warning only
    }
  }
}

const audit = {
  generated_utc: new Date().toISOString(),
  public_rule: "public/ contains only publishable artifacts. No dev/internal dirs. No archives/executables.",
  counts: { public_files: files.length, violations: violations.length },
  violations: violations.slice(0, 500),
  public_files_sample: files.slice(0, 500)
};

fs.mkdirSync(path.join(ROOT, "output"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "output/public_audit.json"), JSON.stringify(audit, null, 2));

if (violations.length) {
  console.error("PUBLIC GUARD FAIL:", violations.slice(0, 20));
  process.exit(1);
} else {
  console.log("PUBLIC GUARD OK");
}
