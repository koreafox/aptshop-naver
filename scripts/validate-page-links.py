#!/usr/bin/env python3
"""Check discoverability, metadata uniqueness, and local page/anchor targets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import sys

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://aptshop.kr'

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids = set()
        self.references = []
        self.title = ''
        self.description = []
        self.in_title = False
        self.h1 = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.add(a['id'])
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.h1 += 1
        if tag == 'meta' and a.get('name') == 'description':
            self.description.append(a.get('content', ''))
        if tag in ('a', 'link') and a.get('href'):
            self.references.append(a['href'])
        if tag in ('img', 'script') and a.get('src'):
            self.references.append(a['src'])

    handle_startendtag = handle_starttag

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False

    def handle_data(self, data):
        if self.in_title: self.title += data

files = [ROOT / 'index.html', ROOT / 'sitemap.html', *sorted((ROOT / 'menu').glob('*.html'))]
pages = {p: Page(p.read_text(encoding='utf-8')) for p in files}
errors, titles, descriptions = [], set(), set()
for path, page in pages.items():
    label = str(path.relative_to(ROOT))
    if page.h1 != 1: errors.append(f'{label}: expected one H1, got {page.h1}')
    if not page.title.strip() or page.title in titles: errors.append(f'{label}: missing or duplicate title')
    titles.add(page.title)
    if len(page.description) != 1 or not page.description[0] or page.description[0] in descriptions:
        errors.append(f'{label}: missing or duplicate description')
    descriptions.update(page.description)
    url = ORIGIN + '/' + label
    for ref in page.references:
        target = urlsplit(urljoin(url, ref))
        if target.scheme not in ('http', 'https') or target.netloc != 'aptshop.kr': continue
        local = ROOT / unquote(target.path).lstrip('/')
        if local.is_dir(): local = local / 'index.html'
        if not local.is_file(): errors.append(f'{label}: missing local target {ref}'); continue
        if target.fragment and local in pages and unquote(target.fragment) not in pages[local].ids:
            errors.append(f'{label}: missing anchor {ref}')
if errors:
    print('\n'.join(sorted(set(errors))), file=sys.stderr)
    sys.exit(1)
print(f'Validated metadata uniqueness, H1, local links/assets, and anchors on {len(pages)} pages.')
