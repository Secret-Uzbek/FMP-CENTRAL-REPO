# PUBLICATION RULE — FMP-CENTRAL-REPO

This file defines the public publication boundary for the central repository.

It answers one narrow question:

> which surfaces are meant to act as public-facing publication output by default?

It is not:

- a repository map;
- a legal license file;
- a claim that every file in the repository is equally public-facing.

## Published by default

- `/public/**`
- root `*.html`

These are the main surfaces that may act as live public output, GitHub Pages
content, or bridge pages for human readers.

## Not published by default

- `output/`
- `docs/`
- `data/`
- `demos/`
- `scripts/`
- `src/`
- `living-index/`
- `.automation/`
- `.publisher/`

These layers may still contain useful material, but they are not the default
public publication perimeter.

## Reading rule

If a file lives outside the published-by-default perimeter, it should not be
treated automatically as a first-entry public artifact.
