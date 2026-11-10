import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Deploy actual navigation and contact information, even without JavaScript.
const root = fileURLToPath(new URL('../', import.meta.url));
const pages = ['index.html', ...readdirSync(path.join(root, 'menu')).filter(p => p.endsWith('.html')).map(p => `menu/${p}`)];
for (const page of pages) {
    const filename = path.join(root, page);
    let html = readFileSync(filename, 'utf8');
    for (const name of ['header', 'footer']) {
        const component = readFileSync(path.join(root, 'components', `${name}.html`), 'utf8').trim();
        const pattern = new RegExp(`<div id="${name}-container"(?: data-prerendered="true")?>(?:\\s*<!-- component:start -->[\\s\\S]*?<!-- component:end -->)?\\s*</div>`, 'g');
        if ([...html.matchAll(pattern)].length !== 1) throw new Error(`${page}: expected one ${name} container`);
        html = html.replace(pattern, () => `<div id="${name}-container" data-prerendered="true"><!-- component:start -->\n${component}\n<!-- component:end --></div>`);
    }
    writeFileSync(filename, html);
}
console.log(`Rendered header/footer into ${pages.length} pages.`);
