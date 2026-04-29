# Publication Rule — FMP-CENTRAL-REPO

This repository is a public hub. Not every file in it should be treated as
equally public-facing.

## Public-facing by default

- root `*.html` pages that belong to the live repository/site surface
- `en/` and `uz/` page branches
- `css/`, `js/`, and related site assets
- `README.md` and other clearly human-facing public bridge files
- `CITATION.cff`
- `sitemap.xml`

## Not public-facing by default

These may exist in the repository but should not be treated as primary public
reading surfaces:

- `output/`
- `docs/`
- `data/`
- `demos/`
- `scripts/`
- `src/`
- `living-index/`
- `.automation/`
- `.publisher/`
- `AI_LAYER/`
- `control/`

## Human rule

If a file is mainly for operators, build logic, AI routing, regeneration, or
internal trace discipline, it should not pretend to be a first-entry public
document.
