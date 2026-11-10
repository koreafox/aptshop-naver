#!/usr/bin/env python3
"""Validate local sitemap/RSS metadata without modifying content or dates."""

import argparse
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
from urllib.parse import unquote, urlsplit
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET


ORIGIN = "https://aptshop.kr"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9",
      "image": "http://www.google.com/schemas/sitemap-image/1.1",
      "video": "http://www.google.com/schemas/sitemap-video/1.1",
      "atom": "http://www.w3.org/2005/Atom"}


class PageMetadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.noindex = False
        self.title = ""
        self.description = ""
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content", "")
        if tag == "link" and "canonical" in attrs.get("rel", "").lower().split():
            self.canonicals.append(attrs.get("href", ""))
        if tag == "meta" and attrs.get("name", "").lower() in ("robots", "googlebot"):
            directives = re.split(r"[\s,]+", attrs.get("content", "").lower())
            self.noindex = self.noindex or bool({"noindex", "none"}.intersection(directives))

    handle_startendtag = handle_starttag

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


def validate(root):
    errors = []
    now = datetime.now(timezone.utc)
    metadata_by_url = {}
    image_count = 0
    all_image_urls = set()
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
        metadata_by_url[url] = metadata
        if metadata.canonicals != [url]:
            errors.append("Canonical must match sitemap loc exactly: " + url)
        if metadata.noindex:
            errors.append("Noindex page must be excluded from sitemap: " + url)

        for lastmod in entry.findall("sm:lastmod", NS):
            value = (lastmod.text or "").strip()
            try:
                if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
                    if date.fromisoformat(value) > now.date():
                        raise ValueError
                else:
                    parsed_date = datetime.fromisoformat(value.replace("Z", "+00:00"))
                    if "T" not in value or parsed_date.tzinfo is None:
                        raise ValueError
                    if parsed_date > now:
                        raise ValueError
            except ValueError:
                errors.append("Invalid sitemap lastmod for %s: %s" % (url, value))

        image_urls = []
        for image in entry.findall("image:image", NS):
            image_url = image.findtext("image:loc", default="", namespaces=NS)
            image_urls.append(image_url)
            parsed_image = urlsplit(image_url)
            local_image = (root / unquote(parsed_image.path).lstrip("/")).resolve()
            if (parsed_image.scheme != "https" or parsed_image.netloc != "aptshop.kr"
                    or parsed_image.query or parsed_image.fragment
                    or not local_image.is_relative_to(root) or not local_image.is_file()):
                errors.append("Invalid or missing sitemap image: " + image_url)
        image_count += len(image_urls)
        all_image_urls.update(image_urls)
        if len(image_urls) != len(set(image_urls)) or len(image_urls) > 1000:
            errors.append("Duplicate/excessive sitemap images: " + url)
        for video in entry.findall("video:video", NS):
            for field in ("thumbnail_loc", "title", "description", "player_loc"):
                if not video.findtext("video:" + field, default="", namespaces=NS).strip():
                    errors.append("Missing video sitemap field %s: %s" % (field, url))
            duration = video.findtext("video:duration", default="", namespaces=NS)
            if duration and (not duration.isdigit() or not 1 <= int(duration) <= 28800):
                errors.append("Invalid video duration: " + url)

    robots = (root / "robots.txt").read_text(encoding="utf-8")
    declarations = []
    for line in robots.splitlines():
        name, separator, value = line.partition(":")
        if separator and name.strip().lower() == "sitemap":
            declarations.append(value.strip())
    if ORIGIN + "/sitemap.xml" not in declarations:
        errors.append("robots.txt must declare Sitemap: " + ORIGIN + "/sitemap.xml")
    robot_parser = RobotFileParser()
    robot_parser.parse(robots.splitlines())
    crawl_targets = seen | all_image_urls | {ORIGIN + path for path in (
        "/sitemap.xml", "/rss.xml", "/css/tailwind-output.css", "/js/main.js",
        "/img/products/single_band.jpg")}
    for bot in ("Googlebot", "Googlebot-Image", "Googlebot-Video", "Yeti", "Bingbot",
                "OAI-SearchBot", "ChatGPT-User", "PerplexityBot"):
        blocked = [url for url in crawl_targets if not robot_parser.can_fetch(bot, url)]
        if blocked:
            errors.append("robots.txt blocks %s: %s" % (bot, ", ".join(sorted(blocked))))

    rss = ET.parse(root / "rss.xml").getroot()
    if rss.tag != "rss" or rss.get("version") != "2.0":
        errors.append("rss.xml must be an RSS 2.0 feed")
    channels = rss.findall("channel")
    if len(channels) != 1:
        errors.append("RSS must contain exactly one channel")
    for field in ("title", "link", "description"):
        if not rss.findtext("channel/" + field, default="").strip():
            errors.append("Missing RSS channel " + field)
    if rss.findtext("channel/link") != ORIGIN + "/":
        errors.append("RSS channel link must match the homepage")
    self_links = rss.findall("channel/atom:link", NS)
    if len(self_links) != 1 or self_links[0].attrib != {
            "href": ORIGIN + "/rss.xml", "rel": "self", "type": "application/rss+xml"}:
        errors.append("RSS must declare the correct Atom self link")
    dates = rss.findall("channel/lastBuildDate")
    rss_date = None
    try:
        if len(dates) != 1:
            raise ValueError
        rss_date = parsedate_to_datetime((dates[0].text or "").strip())
        if rss_date.tzinfo is None or rss_date > now:
            raise ValueError
    except (TypeError, ValueError, OverflowError):
        errors.append("RSS channel must have one RFC 822 lastBuildDate with a timezone")

    registry = json.loads((root / "data/site-metadata.json").read_text(encoding="utf-8"))
    expected_feed = {ORIGIN + p["path"]: p for p in registry["pages"] if p.get("rss") is not False}
    item_links, guids, publication_dates = [], [], []
    for item in rss.findall("channel/item"):
        link = item.findtext("link", default="")
        item_links.append(link)
        guid = item.find("guid")
        if guid is None or guid.text != link or guid.get("isPermaLink") != "true":
            errors.append("RSS item GUID must be its stable canonical permalink: " + link)
        guids.append(guid.text if guid is not None else "")
        metadata = metadata_by_url.get(link)
        if metadata is None or link not in expected_feed:
            errors.append("RSS item must reference an eligible canonical sitemap page: " + link)
        elif (item.findtext("title") != metadata.title.strip()
              or item.findtext("description") != metadata.description):
            errors.append("RSS title/description differs from its page: " + link)
        try:
            publication = parsedate_to_datetime(item.findtext("pubDate", default=""))
            if publication.tzinfo is None or publication > now:
                raise ValueError
            if link in expected_feed and publication != datetime.fromisoformat(expected_feed[link]["publishedAt"]):
                raise ValueError
            if rss_date and publication > rss_date:
                raise ValueError
            publication_dates.append(publication)
        except (TypeError, ValueError, OverflowError):
            errors.append("Invalid or changed RSS publication date: " + link)
    if len(item_links) != len(set(item_links)) or len(guids) != len(set(guids)):
        errors.append("RSS contains duplicate item links or GUIDs")
    if set(item_links) != set(expected_feed):
        errors.append("RSS item coverage differs from the metadata registry")
    if publication_dates != sorted(publication_dates, reverse=True):
        errors.append("RSS items must be newest first")

    if errors:
        for error in errors:
            print("ERROR: " + error, file=sys.stderr)
        return 1
    print("Validated %d canonical URLs, %d page-image references, %d RSS items, and 8 crawler policies."
          % (len(entries), image_count, len(item_links)))
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
