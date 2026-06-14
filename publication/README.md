# Managed publication

FMP-CENTRAL-REPO is the operational publication controller.

Terra Legal supplies the mandatory legal and publication-gate policy.

Managed repositories must not keep independent publishing logic. They use a thin caller workflow that invokes a reusable workflow stored here and pinned to a reviewed commit.

External platform records are handled separately from GitHub releases. DOI and external identifiers are written back only after the record exists and has been verified.

The initial managed portfolio is listed in `managed-repositories.yml`.
