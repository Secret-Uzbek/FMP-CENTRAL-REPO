# CODEX TASKS

**Status:** Active task list  
**Version:** 1.0.0  
**Author:** Abdurashid Abdukarimov  
**ORCID:** 0009-0000-6394-4912

---

## 1. Non-coding first tasks

Codex must begin with context restoration, not patching.

### Task 1 — Rule 0 extraction

Locate and read the real Rule 0 sources:

- `AIUZ-terra-codex-FMP/методология-правильного-применения-fmp-в-terra.md`
- `AIUZ-terra-codex-FMP/основа живых протоколов Терра.md`

Extract the exact operational implications into the TraceLog registry.

### Task 2 — Locate FMP monograph and eight-part theoretical base

Find the current FMP monograph and the eight-part theoretical base referenced by Rule 0.

Create an index:

- title;
- repository;
- path;
- version;
- DOI if available;
- role in Rule 0;
- whether full text is available in GitHub.

### Task 3 — Update TraceLog to comply with standards

Update:

- `tracelog/TRACELOG_SANITIZATION_REPORT.md`
- `tracelog/tracelog_rules.json`
- `tools/tracelog_sanitizer.py`

so that they comply with:

- Rule 0;
- Terra Analysis Protocol;
- AIUZ Documentation Standards;
- Terra Complete Check;
- Final Audit v3.0 reconciliation;
- Security Implementation v4.0 readiness logic.

Do not expand methodology by invention if FMP already contains the method.

---

## 2. Mapping tasks

### Task 4 — Publication/source map

Create:

`tracelog/PUBLICATION_SOURCE_MAP.md`

This must map external publications and indexes to GitHub source layers:

- Google Scholar title;
- ORCID work;
- DOI;
- platform: Zenodo, ScienceOpen, SSRN, Figshare, OSF, DataCite, Lens, Crossref, BASE;
- GitHub repository;
- source file path;
- local/off-GitHub file if known;
- status: canonical, duplicate, draft, archive, obsolete, needs sync, missing source.

### Task 5 — Audit reconciliation matrix

Create:

`tracelog/AUDIT_RECONCILIATION_MATRIX.md`

Compare at least:

- Terra Complete Check;
- Final Audit v3.0;
- Security Implementation v4.0;
- AIUZ Documentation Standards;
- Rule 0 sources.

Classify contradictions:

- audit verdict conflict;
- internal audit contradiction;
- security readiness drift;
- documentation standard mismatch;
- evidence gap.

---

## 3. Scanner tasks

### Task 6 — Report-only scans

Run scanner in report-only mode for priority repositories:

1. `FMP-CENTRAL-REPO`
2. `FMP-monograph`
3. `AIUZ`
4. `AIUZ-Terra-codex`
5. `AIUZ-terra-codex-FMP`
6. `Theory-of-fractal-metascience-paradigm`
7. `Nullo-PLT-UCOMM-FMP-Academic-Research`

Output reports should be stored under:

`tracelog/scans/`

Recommended names:

- `scan_FMP-CENTRAL-REPO.md`
- `scan_AIUZ-terra-codex-FMP.md`
- etc.

### Task 7 — Scanner expansion

Extend the scanner to detect:

- missing documentation headers;
- missing version;
- missing status;
- missing related documents;
- missing validation criteria;
- DOI placeholders;
- license conflicts;
- evidence claims without source path;
- security readiness drift;
- audit verdict contradictions;
- raw/archive files exposed as public surfaces.

Default mode must remain report-only.

---

## 4. Safe repair tasks

### Task 8 — Safe public-surface fixes

Only after report generation, apply safe fixes to public surfaces:

- broken internal links;
- missing `Missing legacy references` sections;
- obvious donor-layer residue;
- broken workflow writer;
- obvious mojibake in public/publication text surfaces.

### Task 9 — Do not auto-fix review classes

Do not automatically fix:

- DOI metadata;
- license metadata;
- scientific claims;
- production readiness claims;
- security readiness claims;
- audit conflicts;
- privacy or identity exposure;
- raw archive status.

Create review lists instead.

---

## 5. Review pass tasks

### Task 10 — DOI pass

Build DOI reconciliation list across:

- GitHub `CITATION.cff`;
- README metadata;
- ORCID works;
- Google Scholar;
- Zenodo;
- DataCite;
- Lens;
- ScienceOpen;
- SSRN;
- Figshare;
- OSF.

### Task 11 — License pass

Build license reconciliation list across:

- `LICENSE` / `LICENSE.md`;
- `CITATION.cff`;
- README badges;
- Zenodo metadata;
- publication package metadata.

### Task 12 — Evidence pass

Find all operational and scientific claims that need evidence:

- production-ready;
- validated;
- verified;
- deployment-ready;
- exact percentages;
- user numbers;
- market numbers;
- test scores;
- security claims;
- compliance claims.

Do not rewrite. Catalog and map to evidence sources or mark as evidence-required.

### Task 13 — Security readiness pass

Find all security and child-safety files and classify readiness:

- architecture only;
- implementation draft;
- tested code;
- deployed service;
- audited service;
- production-ready with evidence;
- claim requires validation.

---

## 6. Completion criteria

A Codex run is useful only if it produces:

- traceable files;
- clear commits;
- no destructive raw/archive changes;
- no automatic DOI/license/claim rewrites;
- a report that the operator can review without reading thousands of files manually.