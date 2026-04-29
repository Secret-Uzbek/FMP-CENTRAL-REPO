# Meta Index

This file is a quick human map of the repository root.

It does not replace the whole archive and it does not try to document every
internal implementation detail. Its job is to help readers understand what kind
of file they are looking at.

## 1. Public human entry layer

- `README.md` — main public entry
- `README_RU.md` — Russian entry
- `README_UZ.md` — Uzbek entry
- `about.html`, `foundation.html`, `publications.html`, `repository.html`,
  `index.html` — live page surfaces
- `en/`, `uz/` — language-specific public page branches

## 2. Public governance and bridge files

- `CITATION.cff`
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- `LICENSE`
- `LICENSE.md`
- `PUBLICATION_RULE.md`
- `ROOT_MINIMAL_RULE.md`

## 3. Human-facing theory and publication bridges

- `MASTER_MAP.md`
- `ROADMAP.md`
- `institutional_pitch.md`
- `fmp-awakening-evidence-v2.md`
- `fmp-math-formalization.md`
- `fmp-quickstart-guide.md`
- PDF publication files in root

## 4. Internal, technical, or machine-facing files

- `ECOSYSTEM_MAP.md`
- `LIVING_DNA.json`
- `index_data.json`
- `worker.js`
- `wrangler.toml`
- `start_terra.sh`
- `terra_local.py`
- `.automation/`
- `.publisher/`
- `AI_LAYER/`
- `control/`
- `scripts/`
- `src/`

These files may be useful, but they are not the first human reading path.

## 5. Archive, residue, and mixed layers

- `awakening-evidence-v2/`
- `living-index/`
- `output/`
- `data/`
- `demos/`
- some root md/json artifacts that still need further repo audit

## Reading rule

If you arrive here as a human reader, start with:

1. `README.md`
2. `README_RU.md` or `README_UZ.md`
3. `about.html` / `foundation.html`
4. `PUBLICATION_RULE.md`

If you arrive here as a maintainer or machine operator, continue into the
technical and internal layer only after the public human layer is clear.
