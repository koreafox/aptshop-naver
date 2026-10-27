#!/usr/bin/env python3
"""Validate local sitemap/RSS metadata without modifying content or dates."""

import argparse
from datetime import date, datetime
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET


ORIGIN = "https://aptshop.kr"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class PageMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.noindex = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta" and attrs.get("name", "").lower() in ("robots", "googlebot"):
            directives = re.split(r"[\s,]+", attrs.get("content", "").lower())
            self.noindex = self.noindex or bool({"noindex", "none"}.intersection(directives))

    handle_startendtag = handle_starttag


def validate(root):
    errors = []
    sitemap = ET.parse(root / "sitemap.xml").getroot()
    if sitemap.tag != "{%s}urlset" % NS["sm"]:
        errors.append("sitemap.xml must use the sitemap urlset namespace")
    entries = sitemap.findall("sm:url", NS)
    if not entries:
        errors.append("sitemap.xml must contain at least one URL")

    seen = set()
    for entry in entries:
        locations = entry.findall("sm:loc", NS)
        if len(locations) != 1 or not (locations[0].text or "").strip():
            errors.append("Each sitemap URL must have exactly one nonempty loc")
            continue
        url = locations[0].text.strip()
        if url in seen:
            errors.append("Duplicate sitemap URL: " + url)
        seen.add(url)

        try:
            parsed = urlsplit(url)
        except ValueError:
            errors.append("Invalid sitemap URL: " + url)
            continue
        if (parsed.scheme != "https" or parsed.netloc != "aptshop.kr"
                or parsed.query or parsed.fragment or not parsed.path.startswith("/")):
            errors.append("Sitemap loc must be a clean HTTPS aptshop.kr URL: " + url)
            continue
        page = (root / unquote(parsed.path).lstrip("/")).resolve()
        if not page.is_relative_to(root):
            errors.append("Sitemap URL resolves outside the site: " + url)
            continue
        if page.is_dir():
            page = page / "index.html"
        if not page.is_file() or page.suffix != ".html":
            errors.append("Sitemap URL has no local HTML page: " + url)
            continue
        metadata = PageMetadata()
        metadata.feed(page.read_text(encoding="utf-8"))
        if metadata.canonicals != [url]:
            errors.append("Canonical must match sitemap loc exactly: " + url)
        if metadata.noindex:
            errors.append("Noindex page must be excluded from sitemap: " + url)

        for lastmod in entry.findall("sm:lastmod", NS):
            value = (lastmod.text or "").strip()
            try:
                if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
                    date.fromisoformat(value)
                else:
                    parsed_date = datetime.fromisoformat(value.replace("Z", "+00:00"))
                    if "T" not in value or parsed_date.tzinfo is None:
                        raise ValueError
            except ValueError:
                errors.append("Invalid sitemap lastmod for %s: %s" % (url, value))

    robots = (root / "robots.txt").read_text(encoding="utf-8")
    declarations = []
    for line in robots.splitlines():
        name, separator, value = line.partition(":")
        if separator and name.strip().lower() == "sitemap":
            declarations.append(value.strip())
    if ORIGIN + "/sitemap.xml" not in declarations:
        errors.append("robots.txt must declare Sitemap: " + ORIGIN + "/sitemap.xml")

    rss = ET.parse(root / "rss.xml").getroot()
    if rss.tag != "rss" or rss.get("version") != "2.0":
        errors.append("rss.xml must be an RSS 2.0 feed")
    dates = rss.findall("channel/lastBuildDate")
    try:
        if len(dates) != 1:
            raise ValueError
        rss_date = parsedate_to_datetime((dates[0].text or "").strip())
        if rss_date.tzinfo is None:
            raise ValueError
    except (TypeError, ValueError, OverflowError):
        errors.append("RSS channel must have one RFC 822 lastBuildDate with a timezone")

    if errors:
        for error in errors:
            print("ERROR: " + error, file=sys.stderr)
        return 1
    print("Validated %d canonical sitemap URLs, robots declaration, and RSS metadata." % len(entries))
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        return validate(args.root.resolve())
    except (OSError, ET.ParseError) as error:
        print("ERROR: " + str(error), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
