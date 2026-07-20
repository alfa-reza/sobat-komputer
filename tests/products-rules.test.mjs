import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildProductViews,
  normalizeProductCandidates,
  preloadProductViews
} from '../assets/js/public/products.mjs';

const image = (src = 'assets/images/product-1.webp', alt = 'Gambar produk 1') => ({ src, alt });
const product = (overrides = {}) => ({
  id: 'product-1',
  image: image(),
  ...overrides
});

test('normalizes products without mutating input', () => {
  const input = [
    product(), 
    product({ id: 'product-2', image: image('assets/images/product-2.webp', 'Gambar produk 2') })
  ];
  const before = structuredClone(input);
  const normalized = normalizeProductCandidates(input);
  assert.deepEqual(normalized.map(p => p.image.src), ['assets/images/product-1.webp', 'assets/images/product-2.webp']);
  assert.equal(normalized[0].referenceCode, undefined);
  assert.deepEqual(input, before);
});

test('rejects malformed products completely', () => {
  for (const invalid of [
    null,
    {},
    [null],
    [product({ id: '' })],
    [product({ image: null })],
    [product({ image: [] })],
    [product({ image: image('', 'alt') })],
    [product({ image: image('src', '') })],
    [product({ id: 123 })]
  ]) {
    assert.equal(normalizeProductCandidates(invalid), null);
  }
  assert.deepEqual(normalizeProductCandidates([]), []);
});

test('builds restricted views and routes to Admin 2 without reference code', () => {
  const normalized = normalizeProductCandidates([
    product(),
    product({ id: 'product-2', image: image('assets/images/product-2.webp', 'Gambar 2') })
  ]);
  const views = buildProductViews(normalized, { pageUrl: 'https://example.com/produk.html?token=secret#private' });

  assert.deepEqual(Object.keys(views[0]).sort(), ['id', 'image', 'whatsappUrl']);
  assert.equal(views[0].image.loading, 'eager');
  assert.equal(views[1].image.loading, 'lazy');

  const url = new URL(views[0].whatsappUrl);
  const message = url.searchParams.get('text');
  
  // Routes to Admin 2
  assert.equal(url.pathname, '/6288980042670');
  
  // Exact generic product template without code/page reference
  assert.equal(message, 'Halo New Sobat Komputer, saya ingin menanyakan produk yang tersedia.');
  
  const serialized = JSON.stringify(views);
  for (const field of ['referenceCode', 'internal_label', 'price', 'description', 'stock', 'review', 'rating']) {
    assert.equal(serialized.includes(`"${field}"`), false);
  }
});

test('preserves product order in generated views', () => {
  const products = normalizeProductCandidates([
    product({ id: 'first' }),
    product({ id: 'second' })
  ]);
  const views = buildProductViews(products, { pageUrl: 'https://example.com/produk.html' });
  assert.deepEqual(views.map(({ id }) => id), ['first', 'second']);
});

test('preloads every image and rejects the complete candidate on failure', async () => {
  const views = buildProductViews(normalizeProductCandidates([
    product(),
    product({ id: 'second', image: image('assets/images/product-2.webp', '2') })
  ]), { pageUrl: 'https://example.com/produk.html' });
  
  const loaded = [];
  assert.equal(await preloadProductViews(views, async (src) => loaded.push(src)), views);
  assert.deepEqual(loaded, ['assets/images/product-1.webp', 'assets/images/product-2.webp']);
  
  await assert.rejects(preloadProductViews(views, async (src) => {
    if (src.endsWith('product-2.webp')) throw new Error('broken image');
  }), /broken image/);
  
  assert.deepEqual(await preloadProductViews([], async () => assert.fail('loader should not run')), []);
});
