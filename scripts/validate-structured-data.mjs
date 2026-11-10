import { readFileSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const pages = ['index.html', 'sitemap.html', ...readdirSync('menu').filter(p => p.endsWith('.html')).map(p => `menu/${p}`)];
let blocks = 0;
for (const page of pages) {
    const html = readFileSync(page, 'utf8');
    const catalog = ['index.html', 'menu/products.html'].includes(page);
    const visit = value => {
        if (!value || typeof value !== 'object') return;
        const types = [value['@type']].flat();
        // Category/home pages must not reuse variant offers or off-site review aggregates.
        if (catalog) for (const type of ['Product', 'AggregateOffer', 'AggregateRating', 'Review']) {
            assert(!types.includes(type), `${page}: inappropriate catalog markup ${type}`);
        }
        if (types.includes('AggregateOffer')) {
            assert(value.lowPrice != null && value.highPrice != null, `${page}: missing offer price range`);
            assert(Number.isFinite(Number(value.lowPrice)) && Number(value.lowPrice) >= 0 && Number(value.highPrice) >= Number(value.lowPrice), `${page}: invalid price range`);
        }
        for (const child of Object.values(value)) visit(child);
    };
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        visit(JSON.parse(match[1])); blocks++;
    }
    if (page === 'sitemap.html') continue;
    for (const name of ['header', 'footer']) {
        const component = readFileSync(`components/${name}.html`, 'utf8').trim();
        assert(html.includes(`data-prerendered="true"><!-- component:start -->\n${component}\n<!-- component:end -->`), `${page}: rebuild stale ${name}`);
    }
}
const products = readFileSync('menu/products.html','utf8');
for (const id of ['single','double','industrial']) assert(products.includes(`id="${id}"`), `Missing catalog target: ${id}`);
console.log(`Validated ${blocks} JSON-LD blocks and static navigation across ${pages.length} pages.`);
