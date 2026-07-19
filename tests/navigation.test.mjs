import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const pages = ['index.html', 'layanan.html', 'produk.html', 'promo.html', 'kontak.html'];
const expectedLinks = ['index.html', 'layanan.html', 'produk.html', 'promo.html', 'kontak.html'];

function hrefs(fragment) {
  return [...fragment.matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map((match) => match[1]);
}

for (const page of pages) {
  test(`${page} has ordered product navigation and one active header link`, async () => {
    const html = await readFile(new URL(`../${page}`, import.meta.url), 'utf8');
    const header = html.match(/<ul class="nav-list"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
    const footer = html.match(/<div class="footer-links-col">([\s\S]*?)<\/div>/)?.[1];
    assert.ok(header);
    assert.ok(footer);
    assert.deepEqual(hrefs(header), expectedLinks);
    assert.deepEqual(hrefs(footer), expectedLinks);

    const currentLinks = [...header.matchAll(/<a\s+([^>]*aria-current="page"[^>]*)>/g)];
    assert.equal(currentLinks.length, 1);
    assert.match(currentLinks[0][1], new RegExp(`href="${page}"`));
    assert.match(currentLinks[0][1], /class="active"/);
  });
}

test('all navigation destinations exist', async () => {
  await Promise.all(expectedLinks.map((path) => access(new URL(`../${path}`, import.meta.url))));
});

test('homepage teaser keeps a direct catalog link and bounded dynamic request', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /data-product-teaser/);
  assert.match(html, /href="produk\.html">Lihat Semua Produk<\/a>/);
  assert.match(html, /initProducts\([^;]*limit:\s*3/);
});
