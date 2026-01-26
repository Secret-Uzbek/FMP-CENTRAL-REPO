/**
 * ROOT GUARD (FMP-CENTRAL-REPO)
 * Rule: repository root is frozen. No new root files.
 * Allowlist: control/root_allowlist.json
 * Special-case: ROOT_MINIMAL_RULE.md is always allowed.
 */
const fs = require("fs");

let allow = { allowed_root_files: [] };
try {
  allow = JSON.parse(fs.readFileSync("control/root_allowlist.json", "utf8"));
} catch (e) {
  // if allowlist missing, fail hard
  console.error("Missing or invalid control/root_allowlist.json");
  process.exit(1);
}

const allowed = new Set(allow.allowed_root_files || []);
allowed.add("ROOT_MINIMAL_RULE.md"); // always allowed (system rule file)

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
