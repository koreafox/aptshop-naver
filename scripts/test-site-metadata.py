#!/usr/bin/env python3
"""Regression checks for crawler blocking and broken metadata publication."""
import contextlib
import importlib.util
import io
import re
from pathlib import Path
import shutil
import tempfile
import unittest
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('metadata', ROOT / 'scripts/validate-site-metadata.py')
metadata = importlib.util.module_from_spec(spec)
spec.loader.exec_module(metadata)


class MetadataTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name).resolve()
        sources = ['sitemap.xml', 'rss.xml', 'robots.txt', 'data/site-metadata.json', 'index.html', 'sitemap.html']
        sources += [str(p.relative_to(ROOT)) for p in (ROOT / 'menu').glob('*.html')]
        sitemap = ET.parse(ROOT / 'sitemap.xml')
        sources += [urlsplit(e.text).path.lstrip('/') for e in sitemap.findall('.//image:loc', metadata.NS)]
        for source in set(sources):
            target = self.root / source
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / source, target)

    def result(self):
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            return metadata.validate(self.root)

    def test_current_site_passes(self):
        self.assertEqual(self.result(), 0)

    def test_googlebot_specific_block_is_rejected(self):
        with (self.root / 'robots.txt').open('a') as stream:
            stream.write('\nUser-agent: Googlebot\nDisallow: /menu/\n')
        self.assertEqual(self.result(), 1)

    def test_ai_image_block_is_rejected(self):
        with (self.root / 'robots.txt').open('a') as stream:
            stream.write('\nUser-agent: OAI-SearchBot\nDisallow: /img/\n')
        self.assertEqual(self.result(), 1)

    def test_future_lastmod_is_rejected(self):
        path = self.root / 'sitemap.xml'
        path.write_text(re.sub(r'<lastmod>[^<]+</lastmod>', '<lastmod>9999-12-31</lastmod>', path.read_text(), count=1))
        self.assertEqual(self.result(), 1)

    def test_missing_image_is_rejected(self):
        image = ET.parse(self.root / 'sitemap.xml').find('.//image:loc', metadata.NS).text
        (self.root / urlsplit(image).path.lstrip('/')).unlink()
        self.assertEqual(self.result(), 1)

    def test_duplicate_rss_item_is_rejected(self):
        path = self.root / 'rss.xml'
        rss = ET.parse(path)
        channel = rss.find('channel')
        channel.append(channel.find('item'))
        rss.write(path, encoding='utf-8')
        self.assertEqual(self.result(), 1)

    def test_oldest_first_feed_is_rejected(self):
        path = self.root / 'rss.xml'
        rss = ET.parse(path)
        channel = rss.find('channel')
        items = channel.findall('item')
        for item in items: channel.remove(item)
        for item in reversed(items): channel.append(item)
        rss.write(path, encoding='utf-8')
        self.assertEqual(self.result(), 1)


if __name__ == '__main__':
    unittest.main()
