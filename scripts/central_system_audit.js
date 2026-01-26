
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

function walk(dir) {
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(p));
    else out.push(p);
  }
  return out;
}

function isPublished(r) {
  return r.startsWith("public/") || (!r.includes("/") && r.endsWith(".html"));
}

const files = walk(ROOT).map(f => path.relative(ROOT, f).replace(/\\/g,"/"));
const result = { generated: new Date().toISOString(), files };

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/system_audit.json", JSON.stringify(result, null, 2));
