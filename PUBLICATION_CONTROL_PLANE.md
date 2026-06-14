# FMP Central Publication Control Plane

**Operational controller:** `Secret-Uzbek/FMP-CENTRAL-REPO`  
**Normative policy source:** `AIUZ-Terra-Codex-EcoSystem/terra-legal`

## Role

FMP-CENTRAL-REPO is the operational manager for publication pipelines across the managed FMP and Terra repository portfolio.

Terra Legal does not replace the Central Repository. Terra Legal defines the mandatory legal, evidence, validation, audit, Detox, TraceLog, risk, and release-gate rules that the Central Repository must enforce.

## Control model

Managed repositories must use thin caller workflows or approved manifests. Independent publication logic is deprecated unless the Central Repository explicitly records an exception.

The Central Repository controls:

- publication preflight;
- release packaging;
- release identity and version checks;
- required legal and audit records;
- external-record verification;
- DOI and citation synchronization after verification;
- portfolio publication registry;
- publication TraceLog.

## Required sequence

1. classify the repository role and release scope;
2. verify the pinned Terra Legal policy reference;
3. verify license, citation, authorship, contributor, third-party, and exclusion records;
4. verify validation, audit, Detox, risk, and TraceLog records;
5. require an operator publication gate;
6. create the GitHub release package;
7. create or update external platform records only through separately approved platform steps;
8. write DOI or external identifiers back only after the record is verified;
9. record the event in the Central Repository publication registry and the managed repository trace.

## Gate states

- `GO`
- `GO_WITH_EXCLUSIONS`
- `HOLD`
- `BLOCK`

Only `GO` and `GO_WITH_EXCLUSIONS` may proceed to a GitHub release.

## Current Terra Legal policy reference

`4a2a95300e2eb752a72fc86fa9b37483aa7f819d`

## Current modernization boundary

The initial modernization covers:

- FMP-CENTRAL-REPO;
- AIUZ-terra-codex-FMP;
- AIUZ-Terra-codex;
- terra-fmp-research-pipeline;
- Nullo-PLT-UCOMM-FMP-Academic-Research;
- terra-legal.

Additional repositories must be added through the managed-repository registry before publication automation is enabled.
