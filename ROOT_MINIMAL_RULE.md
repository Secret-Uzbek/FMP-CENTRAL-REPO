# ROOT MINIMAL RULE — FMP-CENTRAL-REPO

The repository root is intentionally minimal.

Its purpose is to protect the first visible layer of the repository from
turning into a dump zone.

## Core rule

No new file should be added to repository root unless it has a strong canonical
reason to live there.

## Why this exists

The root is the first thing human readers see.

If root keeps absorbing:

- machine residue;
- operational clutter;
- archive spillover;
- one-off exports;

then the repository stops being readable.

## Practical rule

- published surface is defined in `/PUBLICATION_RULE.md`
- root allowlist is stored in `control/root_allowlist.json`
- files that are mainly operational, generated, mirrored, or experimental
  should live outside root unless a stronger rule overrides that default
