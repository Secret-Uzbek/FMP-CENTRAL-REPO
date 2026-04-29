# Security Policy

This file is the repository-specific security note for
`FMP-CENTRAL-REPO`.

This repository is a public hub and live site surface. Its security scope is
therefore:

- narrower than the whole Terra ecosystem;
- broader than a plain static website;
- especially concerned with trust, publication integrity, and accidental public
  exposure.

## Supported security surface

| Surface | Status | Notes |
|---|---|---|
| `main` branch public content | Supported | Includes root docs, site pages, and bridge files |
| GitHub Pages output | Supported | Includes rendered public web surfaces |
| Cloudflare worker and deploy config in this repo | Supported | Only insofar as they are stored here |
| DOI-facing and citation-facing metadata | Supported | Trust and attribution matter here |
| Historical mirrors, residues, and archived experiments | Limited | Review for exposure risk, not full backward support |

## What belongs here

Report issues that affect:

- repository integrity;
- GitHub Pages and public site surfaces;
- publication metadata and DOI-facing files;
- site scripts, worker configuration, and deployment-related files;
- accidental exposure of sensitive or private information in the public repo;
- misleading automation artifacts that create false public trust signals.

## What does not belong here

This file is not the right place to treat every Terra-wide operational,
infrastructure, legal, or governance issue as if it were a bug in the central
public hub.

The broader donor layer belongs to:

- `AIUZ-Terra-Codex-EcoSystem/terra-legal`

## Reporting

Please report security concerns to:

- `a.abdukarimov@fractal-metascience.org`

When reporting, include:

- the affected file, path, page, or surface;
- steps to reproduce;
- whether the problem affects public readers, repository integrity, or deploy;
- whether any credential, contact, or private data was exposed.

## Disclosure rule

Do not publish exploit details publicly before the issue is reviewed and a fix
path exists.

## Human-first rule

This repository is public. Security fixes must not make the public surface less
truthful or less readable than the problem they solve.
