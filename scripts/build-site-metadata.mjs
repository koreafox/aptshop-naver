import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'parse5';

// Dates are editorial inputs, never reset just because CSS or a build changed.
const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse(readFileSync(path.join(root, 'data/site-metadata.json'), 'utf8'));
const origin = 'https://aptshop.kr';
assert.equal(config.origin, origin);
const check = process.argv.includes('--check');
const xml = value => String(value).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const nodes = (node, predicate) => [ ...(predicate(node) ? [node] : []), ...(node.childNodes || []).flatMap(child => nodes(child, predicate)) ];
const attr = (node, name) => node?.attrs?.find(a => a.name === name)?.value;
const text = node => node?.nodeName === '#text' ? node.value : (node?.childNodes || []).map(text).join('');
const tag = (node, name) => nodes(node, n => n.tagName === name);
const read = filename => readFileSync(path.join(root, filename), 'utf8');
const now = new Date();
const rfcDate = value => new Date(value).toUTCString();
const dateOnly = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const urls = new Set();
const sourcePages = new Set(['index.html', 'sitemap.html', ...readdirSync(path.join(root, 'menu')).filter(f => f.endsWith('.html')).map(f => `menu/${f}`)]);

const pages = config.pages.map(entry => {
    const url = new URL(entry.path, origin);
    assert(url.origin === origin && url.pathname === entry.path && !url.search && !url.hash, `Invalid canonical path: ${entry.path}`);
    assert(!urls.has(url.href), `Duplicate URL: ${url.href}`);
    urls.add(url.href);
    assert(dateOnly(entry.lastmod) && entry.lastmod <= now.toISOString().slice(0, 10), `Invalid/future lastmod: ${entry.path}`);
    const filename = entry.path === '/' ? 'index.html' : entry.path.slice(1);
    assert(sourcePages.delete(filename), `Unknown/duplicate source: ${filename}`);
    const document = parse(read(filename));
    const links = tag(document, 'link');
    assert.deepEqual(links.filter(n => attr(n, 'rel')?.split(/\s+/).includes('canonical')).map(n => attr(n, 'href')), [url.href], `Canonical mismatch: ${filename}`);
    assert(!tag(document, 'meta').some(n => ['robots','googlebot'].includes(attr(n, 'name')?.toLowerCase()) && /(?:^|[\s,])(noindex|none)(?:$|[\s,])/.test(attr(n, 'content') || '')), `Noindex source: ${filename}`);
    const title = text(tag(document, 'title')[0]).trim();
    const description = attr(tag(document, 'meta').find(n => attr(n, 'name') === 'description'), 'content');
    assert(title && description, `Missing title/description: ${filename}`);
    const main = tag(document, 'main');
    assert.equal(main.length, 1, `Expected one main: ${filename}`);
    const images = [...new Set(tag(main[0], 'img').map(n => attr(n, 'src')).filter(Boolean).map(src => new URL(src, url).href))].filter(src => new URL(src).origin === origin);
    for (const src of images) {
        const image = new URL(src);
        assert(!image.search && !image.hash && existsSync(path.join(root, decodeURIComponent(image.pathname))), `Missing image: ${src}`);
    }
    assert(images.length <= 1000, `Too many image entries: ${filename}`);
    const schemas = tag(document, 'script').filter(n => attr(n, 'type') === 'application/ld+json').map(n => JSON.parse(text(n)));
    const videos = [];
    const visit = value => {
        if (!value || typeof value !== 'object') return;
        if ([value['@type']].flat().includes('VideoObject')) videos.push(value);
        Object.values(value).forEach(visit);
    };
    schemas.forEach(visit);
    for (const video of videos) {
        assert(video.name && video.description && video.thumbnailUrl?.length && video.embedUrl, `Incomplete video: ${filename}`);
    }
    if (entry.rss !== false) {
        assert(entry.publishedAt && /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(entry.publishedAt) && !Number.isNaN(Date.parse(entry.publishedAt)) && new Date(entry.publishedAt) <= now, `Invalid publication date: ${filename}`);
    }
    return { ...entry, url: url.href, title, description, images, videos };
});
assert.equal(sourcePages.size, 0, `Pages missing explicit dates in metadata registry: ${[...sourcePages].join(', ')}`);

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';
for (const page of pages) {
    sitemap += `    <url>\n        <loc>${xml(page.url)}</loc>\n        <lastmod>${page.lastmod}</lastmod>\n`;
    for (const image of page.images) sitemap += `        <image:image>\n            <image:loc>${xml(image)}</image:loc>\n        </image:image>\n`;
    for (const video of page.videos) {
        const thumbnail = Array.isArray(video.thumbnailUrl) ? video.thumbnailUrl[0] : video.thumbnailUrl;
        sitemap += `        <video:video>\n            <video:thumbnail_loc>${xml(thumbnail)}</video:thumbnail_loc>\n            <video:title>${xml(video.name)}</video:title>\n            <video:description>${xml(video.description)}</video:description>\n            <video:player_loc>${xml(video.embedUrl)}</video:player_loc>\n`;
        const duration = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(video.duration || '');
        if (duration) sitemap += `            <video:duration>${Number(duration[1] || 0) * 3600 + Number(duration[2] || 0) * 60 + Number(duration[3] || 0)}</video:duration>\n`;
        if (video.uploadDate) sitemap += `            <video:publication_date>${xml(video.uploadDate)}</video:publication_date>\n`;
        sitemap += '        </video:video>\n';
    }
    sitemap += '    </url>\n';
}
sitemap += '</urlset>\n';

// Keep GUIDs and first-publication instants stable. Newest items come first.
const feedPages = pages.filter(p => p.rss !== false).sort((a,b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.url.localeCompare(b.url));
const oldRss = existsSync(path.join(root,'rss.xml')) ? read('rss.xml') : '';
const previousDate = /<lastBuildDate>([^<]+)<\/lastBuildDate>/.exec(oldRss)?.[1];
const feed = lastBuildDate => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>아파트샵 | 황소밴드 제품·자료 안내</title>
    <link>${origin}/</link>
    <description>황소밴드 제품 규격·구매 가이드, 사용방법과 공개 특허·시험자료를 안내합니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml" />
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>60</ttl>
${feedPages.map(p => `    <item>
      <title>${xml(p.title)}</title>
      <link>${xml(p.url)}</link>
      <description>${xml(p.description)}</description>
      <pubDate>${rfcDate(p.publishedAt)}</pubDate>
      <guid isPermaLink="true">${xml(p.url)}</guid>
      <dc:creator>아파트샵</dc:creator>
    </item>`).join('\n')}
  </channel>
</rss>
`;
const contentChanged = !previousDate || feed(previousDate) !== oldRss;
const rss = feed(contentChanged && !check ? rfcDate(now) : (previousDate || rfcDate(now)));
for (const [name, value] of [['sitemap.xml', sitemap], ['rss.xml', rss]]) {
    if (check) assert.equal(read(name), value, `${name} is stale: run npm run build:metadata`);
    else if (read(name) !== value) writeFileSync(path.join(root, name), value);
}
console.log(`${check ? 'Checked' : 'Generated'} ${pages.length} sitemap URLs, ${pages.reduce((n,p) => n+p.images.length,0)} page-image references, ${feedPages.length} RSS items.`);
