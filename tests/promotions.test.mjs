import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPromotionSlides,
  normalizePromotionCandidates,
  preloadPromotionCandidates
} from '../assets/js/public/promotions.mjs';

const promotion = (id) => ({ id, src: `assets/images/${id}.webp`, alt: `Poster ${id}` });

test('normalizes valid promotions without mutating order or input', () => {
  const input = [
    { id: ' promo-1 ', src: ' assets/images/promo-1.webp ', alt: ' Poster promo satu ' },
    promotion('promo-2')
  ];
  const before = structuredClone(input);
  assert.deepEqual(normalizePromotionCandidates(input), [
    { ...promotion('promo-1'), alt: 'Poster promo satu' },
    promotion('promo-2')
  ]);
  assert.deepEqual(input, before);
  assert.deepEqual(normalizePromotionCandidates([]), []);
});

test('rejects malformed promotion payloads completely', () => {
  for (const invalid of [
    null,
    {},
    [null],
    [{ id: '', src: 'assets/images/a.webp', alt: 'Poster valid' }],
    [{ id: 'a', src: '', alt: 'Poster valid' }],
    [{ id: 'a', src: 'assets/images/a.webp', alt: '' }]
  ]) assert.equal(normalizePromotionCandidates(invalid), null);
});

test('builds slide rules for 0, 1, 4, and N promotions', () => {
  assert.deepEqual(buildPromotionSlides([]), []);
  for (const count of [1, 4, 7]) {
    const views = buildPromotionSlides(Array.from({ length: count }, (_, index) => promotion(`promo-${index + 1}`)));
    assert.equal(views.length, count);
    assert.deepEqual(views.map(({ position }) => position), Array.from({ length: count }, (_, index) => index + 1));
    assert.ok(views.every(({ total }) => total === count));
    assert.equal(views[0].hidden, false);
    assert.equal(views[0].loading, 'eager');
    assert.ok(views.slice(1).every(({ hidden, loading }) => hidden && loading === 'lazy'));
  }
});

test('preloads every candidate and preserves API order', async () => {
  const input = [promotion('promo-2'), promotion('promo-1')];
  const loaded = [];
  const result = await preloadPromotionCandidates(input, async (src) => loaded.push(src));
  assert.deepEqual(loaded, input.map(({ src }) => src));
  assert.deepEqual(result, input);
  assert.deepEqual(await preloadPromotionCandidates([], async () => assert.fail('loader should not run')), []);
});

test('one broken image rejects the complete candidate', async () => {
  const input = [promotion('good'), promotion('broken'), promotion('later')];
  await assert.rejects(preloadPromotionCandidates(input, async (src) => {
    if (src.includes('broken')) throw new Error('broken image');
  }), /broken image/);
  await assert.rejects(preloadPromotionCandidates([promotion('good'), null], async () => {}), /Invalid promotion media/);
});
