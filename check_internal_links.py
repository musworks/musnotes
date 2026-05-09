#!/usr/bin/env python3
"""Check broken internal links in Hugo content Markdown files.

Usage:
    python check_internal_links.py
    python check_internal_links.py --content-dir content --config hugo.toml
"""

from __future__ import annotations

import argparse
import posixpath
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple

try:
    import tomllib  # Python 3.11+
except ModuleNotFoundError:  # pragma: no cover
    tomllib = None


MARKDOWN_EXTENSIONS = (".md", ".markdown", ".mdown")
LINK_PATTERN = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
LANG_SUFFIX_PATTERN = re.compile(r"^(?P<name>.+)\.(?P<lang>[a-z]{2,3}(?:-[A-Za-z]{2})?)$")


@dataclass(frozen=True)
class SiteConfig:
    default_lang: str = "en"
    default_lang_in_subdir: bool = False
    disable_path_to_lower: bool = False


@dataclass(frozen=True)
class PageInfo:
    file_path: Path
    page_url: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Find broken internal links in Hugo content files.")
    parser.add_argument("--content-dir", default="content", help="Path to Hugo content directory.")
    parser.add_argument("--config", default="hugo.toml", help="Path to Hugo config TOML file.")
    parser.add_argument(
        "--show-valid-count",
        action="store_true",
        help="Show how many internal paths were recognized.",
    )
    return parser.parse_args()


def read_site_config(config_path: Path) -> SiteConfig:
    if not config_path.exists():
        return SiteConfig()

    text = config_path.read_text(encoding="utf-8", errors="replace")

    if tomllib is not None:
        try:
            data = tomllib.loads(text)
            return SiteConfig(
                default_lang=str(data.get("defaultContentLanguage", "en")),
                default_lang_in_subdir=bool(data.get("defaultContentLanguageInSubdir", False)),
                disable_path_to_lower=bool(data.get("disablePathToLower", False)),
            )
        except Exception:
            pass

    def find_bool(key: str, default: bool) -> bool:
        match = re.search(rf"^\s*{re.escape(key)}\s*=\s*(true|false)\s*$", text, flags=re.MULTILINE | re.IGNORECASE)
        return default if not match else match.group(1).lower() == "true"

    def find_string(key: str, default: str) -> str:
        match = re.search(rf'^\s*{re.escape(key)}\s*=\s*"([^"]+)"\s*$', text, flags=re.MULTILINE)
        return default if not match else match.group(1).strip()

    return SiteConfig(
        default_lang=find_string("defaultContentLanguage", "en"),
        default_lang_in_subdir=find_bool("defaultContentLanguageInSubdir", False),
        disable_path_to_lower=find_bool("disablePathToLower", False),
    )


def strip_lang_suffix(stem: str) -> Tuple[str, Optional[str]]:
    match = LANG_SUFFIX_PATTERN.match(stem)
    if not match:
        return stem, None
    return match.group("name"), match.group("lang")


def normalize_url_path(path: str, to_lower: bool) -> str:
    if not path.startswith("/"):
        path = "/" + path
    if to_lower:
        path = path.lower()
    if not path.endswith("/"):
        path = path + "/"
    path = re.sub(r"/{2,}", "/", path)
    return path


def page_url_from_file(content_dir: Path, file_path: Path, cfg: SiteConfig) -> str:
    rel = file_path.relative_to(content_dir).as_posix()
    rel_no_ext = rel
    for ext in MARKDOWN_EXTENSIONS:
        if rel_no_ext.endswith(ext):
            rel_no_ext = rel_no_ext[: -len(ext)]
            break

    parts = rel_no_ext.split("/")
    stem = parts[-1]
    base_stem, lang = strip_lang_suffix(stem)
    parts[-1] = base_stem

    if base_stem in {"_index", "index"}:
        parts = parts[:-1]

    url_path = "/".join(p for p in parts if p)
    if not cfg.disable_path_to_lower:
        url_path = url_path.lower()

    lang_prefix = ""
    if lang and (lang != cfg.default_lang or cfg.default_lang_in_subdir):
        lang_prefix = f"/{lang}"

    if not url_path:
        return normalize_url_path(lang_prefix or "/", to_lower=not cfg.disable_path_to_lower)
    return normalize_url_path(f"{lang_prefix}/{url_path}", to_lower=not cfg.disable_path_to_lower)


def build_pages(content_dir: Path, cfg: SiteConfig) -> List[PageInfo]:
    pages: List[PageInfo] = []
    for path in content_dir.rglob("*"):
        if not path.is_file():
            continue
        if path.suffix.lower() not in MARKDOWN_EXTENSIONS:
            continue
        pages.append(PageInfo(file_path=path, page_url=page_url_from_file(content_dir, path, cfg)))
    return pages


def build_valid_paths(pages: Iterable[PageInfo]) -> Set[str]:
    valid: Set[str] = set()
    valid.update({"/", "", "/index.html"})
    for p in pages:
        page = p.page_url
        valid.add(page)
        valid.add(page.rstrip("/"))
        valid.add(page.rstrip("/") + ".html")
        if page == "/":
            valid.add("")
    return valid


def is_external_link(target: str) -> bool:
    lowered = target.strip().lower()
    return (
        lowered.startswith("http://")
        or lowered.startswith("https://")
        or lowered.startswith("mailto:")
        or lowered.startswith("tel:")
        or lowered.startswith("javascript:")
        or lowered.startswith("//")
    )


def clean_link_target(raw_target: str) -> str:
    target = raw_target.strip().strip("<>").strip()
    if not target:
        return target
    target = target.split("#", 1)[0]
    target = target.split("?", 1)[0]
    return target.strip()


def resolve_internal_target(target: str, source_page_url: str, cfg: SiteConfig) -> str:
    if not target:
        return ""

    if target.startswith("/"):
        resolved = target
    else:
        # Resolve relative links against the current page URL path.
        base_dir = source_page_url
        if not base_dir.endswith("/"):
            base_dir = posixpath.dirname(base_dir) + "/"
        resolved = posixpath.normpath(posixpath.join(base_dir, target))
        if not resolved.startswith("/"):
            resolved = "/" + resolved

    if resolved.endswith(".md"):
        resolved = resolved[: -len(".md")]

    if not cfg.disable_path_to_lower:
        resolved = resolved.lower()

    if resolved != "/" and resolved.endswith("/index"):
        resolved = resolved[: -len("/index")]

    return resolved


def check_links(content_dir: Path, cfg: SiteConfig) -> Tuple[List[str], int]:
    pages = build_pages(content_dir, cfg)
    page_by_path: Dict[Path, PageInfo] = {p.file_path: p for p in pages}
    valid_paths = build_valid_paths(pages)
    errors: List[str] = []
    total_links = 0

    for file_path, page in page_by_path.items():
        rel_file = file_path.relative_to(content_dir).as_posix()
        lines = file_path.read_text(encoding="utf-8", errors="replace").splitlines()
        for line_no, line in enumerate(lines, start=1):
            for match in LINK_PATTERN.finditer(line):
                raw = match.group(1)
                target = clean_link_target(raw)
                if not target or target.startswith("#") or is_external_link(target):
                    continue
                total_links += 1
                resolved = resolve_internal_target(target, page.page_url, cfg)
                candidates = {resolved, resolved.rstrip("/"), resolved.rstrip("/") + "/", resolved.rstrip("/") + ".html"}
                if not any(c in valid_paths for c in candidates):
                    errors.append(f"{rel_file}:{line_no} -> {raw} (resolved: {resolved})")

    return errors, len(valid_paths)


def main() -> int:
    args = parse_args()
    content_dir = Path(args.content_dir).resolve()
    config_path = Path(args.config).resolve()

    if not content_dir.exists() or not content_dir.is_dir():
        print(f"ERROR: content directory not found: {content_dir}")
        return 2

    cfg = read_site_config(config_path)
    broken, valid_count = check_links(content_dir, cfg)

    print("Hugo internal link check")
    print(f"- content dir: {content_dir}")
    print(f"- default language: {cfg.default_lang}")
    print(f"- default language in subdir: {cfg.default_lang_in_subdir}")
    print(f"- disablePathToLower: {cfg.disable_path_to_lower}")
    if args.show_valid_count:
        print(f"- recognized internal paths: {valid_count}")

    if not broken:
        print("\nNo broken internal links found.")
        return 0

    print(f"\nBroken internal links found: {len(broken)}")
    for item in broken:
        print(f"- {item}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
