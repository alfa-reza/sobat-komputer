import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildProductViews,
  normalizeProductCandidates,
  preloadProductViews
} from '../assets/js/public/products.mjs';

const image = (position) => ({ src: `assets/images/product-${position}.webp`, alt: `Gambar produk ${position}`, position });
const product = (overrides = {}) => ({
  id: 'product-1',
  referenceCode: 'PRODUCT-001',
  images: [image(1)],
  ...overrides
});

test('normalizes one and five image products without mutating input', () => {
  const input = [product(), product({ id: 'product-5', referenceCode: 'PRODUCT-005', images: [image(5), image(3), image(1), image(4), image(2)] })];
  const before = structuredClone(input);
  const normalized = normalizeProductCandidates(input);
  assert.deepEqual(normalized.map(({ images }) => images.map(({ position }) => position)), [[1], [1, 2, 3, 4, 5]]);
  assert.deepEqual(input, before);
});

test('rejects malformed products and invalid image counts completely', () => {
  for (const invalid of [
    null,
    {},
    [null],
    [product({ id: '' })],
    [product({ referenceCode: '' })],
    [product({ images: [] })],
    [product({ images: Array.from({ length: 6 }, (_, index) => image(index + 1)) })],
    [product({ images: [image(1), image(1)] })],
    [product({ images: [{ ...image(1), position: 0 }] })],
    [product({ images: [{ ...image(1), src: '' }] })],
    [product({ images: [{ ...image(1), alt: '' }] })]
  ]) assert.equal(normalizeProductCandidates(invalid), null);
  assert.deepEqual(normalizeProductCandidates([]), []);
});

test('builds restricted views and keeps reference only inside WhatsApp payload', () => {
  const normalized = normalizeProductCandidates([
    product(),
    product({ id: 'product-2', referenceCode: 'PRODUCT-002', images: [image(1), image(2)] })
  ]);
  const views = buildProductViews(normalized, { pageUrl: 'https://example.com/produk.html?token=secret#private' });

  assert.deepEqual(Object.keys(views[0]).sort(), ['id', 'images', 'whatsappUrl']);
  assert.equal(views[0].images[0].loading, 'eager');
  assert.ok(views.slice(1).flatMap(({ images }) => images).every(({ loading }) => loading === 'lazy'));
  assert.equal(views[1].images[1].loading, 'lazy');

  const url = new URL(views[0].whatsappUrl);
  const message = url.searchParams.get('text');
  assert.equal(url.pathname, '/6285742744594');
  assert.ok(message.includes('PRODUCT-001'));
  assert.ok(message.includes('https://example.com/produk.html'));
  assert.ok(!message.includes('secret'));

  const serialized = JSON.stringify(views);
  for (const field of ['referenceCode', 'internal_label', 'price', 'description', 'stock', 'review', 'rating']) {
    assert.equal(serialized.includes(`"${field}"`), false);
  }
});

test('preserves product and image order in generated views', () => {
  const products = normalizeProductCandidates([
    product({ id: 'first', referenceCode: 'FIRST-001', images: [image(2), image(1)] }),
    product({ id: 'second', referenceCode: 'SECOND-001' })
  ]);
  const views = buildProductViews(products, { pageUrl: 'https://example.com/produk.html' });
  assert.deepEqual(views.map(({ id }) => id), ['first', 'second']);
  assert.deepEqual(views[0].images.map(({ position }) => position), [1, 2]);
});

test('preloads every image and rejects the complete candidate on failure', async () => {
  const views = buildProductViews(normalizeProductCandidates([
    product({ images: [image(1), image(2)] }),
    product({ id: 'second', referenceCode: 'SECOND-001' })
  ]), { pageUrl: 'https://example.com/produk.html' });
  const loaded = [];
  assert.equal(await preloadProductViews(views, async (src) => loaded.push(src)), views);
  assert.deepEqual(loaded, ['assets/images/product-1.webp', 'assets/images/product-2.webp', 'assets/images/product-1.webp']);
  await assert.rejects(preloadProductViews(views, async (src) => {
    if (src.endsWith('product-2.webp')) throw new Error('broken image');
  }), /broken image/);
  assert.deepEqual(await preloadProductViews([], async () => assert.fail('loader should not run')), []);
});
