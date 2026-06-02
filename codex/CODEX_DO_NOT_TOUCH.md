# CODEX DO NOT TOUCH

**Status:** Active boundary document  
**Version:** 1.0.0  
**Author:** Abdurashid Abdukarimov  
**ORCID:** 0009-0000-6394-4912

---

## 1. Purpose

This document defines what Codex must not modify automatically while stabilizing the FMP / Terra GitHub ecosystem.

The goal is to prevent destructive cleanup, accidental loss of provenance, metadata corruption, and premature claims of readiness.

---

## 2. Absolute boundaries

Codex must not automatically:

1. Delete raw chat logs, session dumps, archives, HTML mirrors or old exports.
2. Rewrite large raw/archive files for style or encoding only.
3. Change DOI metadata.
4. Change license metadata.
5. Change author identity or ORCID metadata unless explicitly confirmed by a trusted source in the corpus.
6. Rewrite scientific claims.
7. Downgrade or upgrade publication status without evidence.
8. Declare production readiness.
9. Remove contradictions between audits by choosing one side silently.
10. Flatten GitHub into the whole FMP ecosystem.

---

## 3. Raw/archive layer

Raw and archival files may contain noise, duplication, mojibake, broken formatting and contradictions.

That does not make them disposable.

They may be:

- source traces;
- provenance records;
- session memory;
- reconstruction material;
- proof of development history;
- raw evidence of conceptual emergence.

Default action: classify, do not rewrite.

---

## 4. DOI and publication metadata

DOI, ORCID, Zenodo, Google Scholar, ScienceOpen, SSRN, DataCite, Lens, Figshare and OSF metadata must be reconciled before any GitHub metadata edits.

Default action: catalog and mark as `META-001`.

---

## 5. License metadata

If `LICENSE`, `CITATION.cff`, README badges, Zenodo metadata or package manifests disagree, Codex must not choose a license automatically.

Default action: catalog and mark as `LICENSE-001`.

---

## 6. Scientific and operational claims

Claims such as production-ready, validated, verified, deployment-ready, compliant, tested, secure, or exact numerical performance must not be rewritten automatically.

Default action: catalog and mark as one of:

- `CLAIM-001`
- `AUDIT-CONFLICT-001`
- `SECURITY-001`
- `EVIDENCE-001`

---

## 7. Security and child-safety claims

Security implementation files may contain code-like examples, architecture drafts, or implementation proposals.

Codex must not treat them as deployed systems unless there are tests, CI results, deployment scripts, audit reports and linked evidence.

Default action: classify readiness level.

---

## 8. Safe changes allowed only after classification

Safe changes may include:

- broken internal link repair;
- missing legacy reference classification;
- donor-layer wording correction in repository-level files;
- workflow syntax repair;
- obvious mojibake repair in public/publication surfaces;
- README or LIVING_INDEX clarification that preserves provenance.

Even safe changes must produce clear commits and update TraceLog when appropriate.

---

## 9. Operator boundary

The operator is the conceptual architect. Codex is the technical executor.

Codex must not redefine NULLO, PLT, UCOMM, EUO or FMP without explicit instruction.