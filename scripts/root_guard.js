/**
 * ROOT GUARD (FMP-CENTRAL-REPO)
 * Rule: repository root is frozen. No new root files.
 * Allowlist is stored in control/root_allowlist.json
 */
const fs = require("fs");
const path = require("path");

const allow = JSON.parse(fs.readFileSync("control/root_allowlist.json", "utf8"));
const allowed = new Set(allow.allowed_root_files);

const entries = fs.readdirSync(".", { withFileTypes: true });
const rootFiles = entries.filter(e => e.isFile()).map(e => e.name).sort();

const extra = rootFiles.filter(n => !allowed.has(n));

const report = {
  generated_utc: new Date().toISOString(),
  allowed_count: allowed.size,
  root_count: rootFiles.length,
  extra_files: extra
};

fs.mkdirSync("output", { recursive: true });
fs.writeFileSync("output/root_guard_report.json", JSON.stringify(report, null, 2));

if (extra.length) {
  console.error("ROOT GUARD FAIL. Extra root files:", extra);
  process.exit(1);
} else {
  console.log("ROOT GUARD OK");
}
