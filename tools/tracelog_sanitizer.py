#!/usr/bin/env python3
"""
TraceLog Sanitizer Scanner

Report-only scanner for the Fractal Metascience / Terra GitHub corpus.
It classifies recurring repository defects without rewriting files.

Method stack: NULLO / PLT / UCOMM / EUO / FMP
Default mode: report only.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable

TEXT_EXTENSIONS = {
    ".md", ".txt", ".tex", ".bib", ".cff", ".yml", ".yaml", ".json", ".html", ".htm", ".py", ".js", ".ts", ".css"
}

PUBLIC_SURFACE_NAMES = {
    "README.md",
    "LIVING_INDEX.md",
    "CITATION.cff",
    "LICENSE",
    "LICENSE.md",
    "SECURITY.md",
    "GOVERNANCE.md",
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "CONTRIBUTING.md",
}

RAW_MARKERS = [
    "fullchat",
    "full_chat",
    "chat",
    "archive",
    "session",
    "dump",
    "полный-архив",
    "полный архив",
]

MOJIBAKE_PATTERNS = [
    "вЂ", "в€", "в†", "в‚", "В«", "В»", "ГЎ", "Г­n", "Гё", "ОІ", "О±", "О¦", "Пѓ", "в‰"
]

CLAIM_PATTERNS = [
    "production ready",
    "ready for global deployment",
    "100% compliance",
    "100% verified",
    "verified",
    "validated",
    "industrial level",
    "промышленный уровень",
    "полнофункциональная система",
]

@dataclass
class Finding:
    failure_class: str
    path: str
    line: int
    snippet: str
    severity: str
    action: str


def is_text_file(path: Path) -> bool:
    if path.name in PUBLIC_SURFACE_NAMES:
        return True
    return path.suffix.lower() in TEXT_EXTENSIONS


def safe_read(path: Path) -> str | None:
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return None


def layer_for(path: Path) -> str:
    low = path.as_posix().lower()
    if path.name in PUBLIC_SURFACE_NAMES or path.parts[:1] == ("docs",):
        return "public_surface"
    if any(marker in low for marker in RAW_MARKERS):
        return "raw_archive"
    if path.suffix.lower() in {".md", ".tex", ".bib", ".cff"}:
        return "publication_layer"
    return "other_text"


def line_findings(path: Path, text: str) -> Iterable[Finding]:
    layer = layer_for(path)
    lines = text.splitlines()

    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        if not stripped:
            continue

        if any(pattern in line for pattern in MOJIBAKE_PATTERNS):
            action = "safe_fix_candidate" if layer in {"public_surface", "publication_layer"} else "catalog_only_raw_or_other"
            yield Finding("MOJI-001", path.as_posix(), idx, stripped[:240], "medium", action)

        if "All notable changes to .terra-legal" in line or "who maintains the .terra-legal framework" in line:
            yield Finding("DONOR-001", path.as_posix(), idx, stripped[:240], "medium", "safe_fix_candidate")

        if "doi: TODO" in line or "DOI: TODO" in line or "zenodo.XXXX" in line:
            yield Finding("META-001", path.as_posix(), idx, stripped[:240], "high", "metadata_review_required")

        low = line.lower()
        if any(pattern in low for pattern in CLAIM_PATTERNS):
            yield Finding("CLAIM-001", path.as_posix(), idx, stripped[:240], "high", "evidence_review_required")

        if "license:" in low and ("cc0" in low or "cc-by" in low or "cc by" in low):
            yield Finding("LICENSE-001", path.as_posix(), idx, stripped[:240], "medium", "license_review_candidate")


def file_level_findings(path: Path, text: str, root: Path) -> Iterable[Finding]:
    rel = path.relative_to(root)
    low = rel.as_posix().lower()

    if any(marker in low for marker in RAW_MARKERS) and rel.name in PUBLIC_SURFACE_NAMES:
        yield Finding("RAW-001", rel.as_posix(), 1, "raw marker in public surface filename", "high", "manual_review_required")

    if rel.name in {"README.md", "LIVING_INDEX.md"}:
        for match in re.finditer(r"\]\(([^)]+)\)", text):
            target = match.group(1).strip()
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            if target.startswith("./"):
                target_path = (path.parent / target[2:]).resolve()
            else:
                target_path = (path.parent / target).resolve()
            try:
                target_path.relative_to(root.resolve())
            except ValueError:
                continue
            if not target_path.exists():
                line_no = text[: match.start()].count("\n") + 1
                yield Finding("PATH-001", rel.as_posix(), line_no, f"missing target: {target}", "medium", "safe_fix_or_legacy_reference")


def scan(root: Path) -> list[Finding]:
    findings: list[Finding] = []
    for path in root.rglob("*"):
        if not path.is_file():
            continue
        if ".git" in path.parts:
            continue
        if not is_text_file(path):
            continue
        text = safe_read(path)
        if text is None:
            continue
        rel = path.relative_to(root)
        findings.extend(line_findings(rel, text))
        findings.extend(file_level_findings(path, text, root))
    return findings


def write_markdown(findings: list[Finding], out: Path, root: Path) -> None:
    by_class: dict[str, list[Finding]] = {}
    for finding in findings:
        by_class.setdefault(finding.failure_class, []).append(finding)

    lines: list[str] = []
    lines.append("# TraceLog Sanitizer Scan Report")
    lines.append("")
    lines.append(f"Root: `{root}`")
    lines.append(f"Total findings: **{len(findings)}**")
    lines.append("")
    for klass in sorted(by_class):
        items = by_class[klass]
        lines.append(f"## {klass} ({len(items)})")
        lines.append("")
        for item in items[:200]:
            lines.append(f"- `{item.path}:{item.line}` — **{item.severity}** — {item.action}")
            lines.append(f"  - {item.snippet}")
        if len(items) > 200:
            lines.append(f"- ... {len(items) - 200} more findings omitted in Markdown; see JSON report.")
        lines.append("")
    out.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="TraceLog report-only sanitizer scanner")
    parser.add_argument("root", nargs="?", default=".", help="repository or workspace root")
    parser.add_argument("--json", default="tracelog_scan_report.json", help="JSON output path")
    parser.add_argument("--md", default="tracelog_scan_report.md", help="Markdown output path")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    findings = scan(root)

    json_path = Path(args.json)
    md_path = Path(args.md)

    json_path.write_text(json.dumps([asdict(f) for f in findings], ensure_ascii=False, indent=2), encoding="utf-8")
    write_markdown(findings, md_path, root)

    print(f"TraceLog scan complete: {len(findings)} findings")
    print(f"JSON: {json_path}")
    print(f"Markdown: {md_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
