# Active Workflow Set

This repository intentionally keeps only a small readable workflow core.

## Kept

- `codeql.yml`
  - security and code-quality scan
- `deploy-worker.yml`
  - Cloudflare Worker deploy for `worker.js` and `wrangler.toml`
- `figshare-osf-sync.yml`
  - release-time publication sync
- `zenodo-release.yml`
  - release-time DOI follow-up

## Removed

The repository previously contained multiple overlapping or chaotic workflows
for:

- duplicate audits
- self-mutating sync loops
- placeholder guards
- dangerous archive overwrite deploys
- oversized partially-wired unified deploy logic
- stale LaTeX and encoding side loops

Those were removed to restore readability and reduce accidental complexity.
