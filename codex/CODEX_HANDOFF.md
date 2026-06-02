# CODEX HANDOFF

**Repository:** `Secret-Uzbek/FMP-CENTRAL-REPO`  
**Layer:** Codex operational handoff  
**Author:** Abdurashid Abdukarimov  
**ORCID:** 0009-0000-6394-4912  
**Status:** Active handoff protocol  
**Version:** 1.0.0

---

## 1. Purpose

This document transfers the operational context for Codex work on the Fractal Metascience / Terra GitHub ecosystem.

Codex must not treat GitHub as the whole FMP system. GitHub is only one repository/source/archive layer inside the wider FMP ecosystem, which also includes ORCID, Zenodo, Google Scholar, ScienceOpen, SSRN, DataCite, Lens, local manuscripts, DOI packages, and unpublished working documents.

The task is not a generic cleanup. The task is ecosystem reconciliation and controlled repository stabilization.

---

## 2. Highest rule: Rule 0

Before any analysis, repair, refactor, file creation, deletion, or methodology design, Codex must search the FMP monograph and its eight-part theoretical base for existing solutions.

Rule 0 means:

1. Search the FMP monograph first.
2. Search the eight-part theoretical base.
3. Extract existing methodology before proposing new methodology.
4. Ask the operator only when the answer is not present in FMP.

Codex must not invent a new framework when the FMP corpus already contains one.

---

## 3. Method stack

All work must follow this stack:

1. **Rule 0** — FMP monograph first.
2. **NULLO** — freeze assumptions before action.
3. **PLT** — preserve traces and provenance.
4. **UCOMM** — keep human-readable and machine-readable communication aligned.
5. **EUO** — coordinate distributed repository repair without flattening layers.
6. **FMP** — treat the corpus as a recursive, multi-layer knowledge system.
7. **Terra Analysis Protocol** — analyze via inner analyst, external observer, and meta-archivist perspectives.
8. **AIUZ Documentation Standards** — all new documents must follow metadata, structure, versioning, validation and lifecycle requirements.
9. **Terra Validation / Audit documents** — existing audits must be reconciled, not blindly accepted.

---

## 4. Repository repair principle

Do not repair the entire GitHub corpus by blind replacement.

Every file must be assigned to a layer before action:

- public surface;
- publication layer;
- raw/archive/session layer;
- code layer;
- workflow layer;
- DOI/metadata layer;
- legal/license layer;
- evidence/claim layer;
- security/readiness layer.

Each finding must be classified as:

- safe fix;
- catalog only;
- review required;
- source/provenance preservation;
- DOI/license/evidence/security pass required.

---

## 5. Existing TraceLog tools

The current central repair layer includes:

- `tracelog/TRACELOG_SANITIZATION_REPORT.md`
- `tracelog/tracelog_rules.json`
- `tools/tracelog_sanitizer.py`
- `tools/aiuz-repo-inspector.html` if present or to be restored

These tools were created as a repair scaffold. Codex must update them to comply with Rule 0, Terra Analysis Protocol, AIUZ Documentation Standards, Terra Complete Check, Final Audit v3.0, and Security Implementation v4.0.

---

## 6. Current known failure classes

- `AUDIT-001` — broken Terra audit workflow.
- `DONOR-001` — donor-layer residue in repository-level files.
- `PATH-001` — broken reading path or missing file reference.
- `MOJI-001` — encoding damage / mojibake.
- `META-001` — DOI and citation drift.
- `LICENSE-001` — license conflict.
- `CLAIM-001` — evidence overclaim.
- `RAW-001` — raw archive presented as public surface.
- `PRIVACY-001` — sensitive identity surface.
- `BINARY-001` — unread binary publication surface.
- `AUDIT-CONFLICT-001` — conflict between audit verdicts or inside one audit.
- `SECURITY-001` — security readiness drift.

---

## 7. Codex operating mode

Codex must work in report-first mode.

The correct sequence is:

1. Read normative documents.
2. Build or update the publication/source map.
3. Run report-only scans.
4. Classify findings by layer and failure class.
5. Propose safe batches.
6. Apply only safe fixes after classification.
7. Leave DOI, license, scientific claims, security readiness and audit contradictions for explicit review.

---

## 8. Required deliverables

Codex should produce:

- updated TraceLog registry compliant with Rule 0 and documentation standards;
- publication/source map across Scholar, ORCID, Zenodo, ScienceOpen, SSRN and GitHub;
- repository scan reports;
- safe-fix patch set for public surfaces;
- separate review lists for DOI, license, claims, security, privacy and audit contradictions;
- no destructive changes to raw/archive provenance.

---

## 9. Non-negotiable boundaries

Codex must not:

- delete raw/session/archive files;
- globally rewrite all files;
- change DOI metadata automatically;
- change licenses automatically;
- rewrite scientific claims automatically;
- declare anything production-ready without evidence;
- treat GitHub as the entire FMP ecosystem;
- ignore Rule 0;
- ignore the operator's role as conceptual architect.

---

## 10. Handoff note

This handoff is an operational compression of the current ChatGPT session. It intentionally omits raw conversation noise and preserves only the actionable control context for Codex.