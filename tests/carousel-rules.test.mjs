import test from 'node:test';
import assert from 'node:assert/strict';

import { getCarouselRules, normalizeCarouselIndex } from '../assets/js/public/carousel.mjs';

test('carousel rules support 0, 1, 3, 4, 7, and 15 slides', () => {
  assert.deepEqual(getCarouselRules(0), { count: 0, hasSlides: false, isInteractive: false });
  assert.deepEqual(getCarouselRules(1), { count: 1, hasSlides: true, isInteractive: false });

  for (const count of [3, 4, 7, 15]) {
    assert.deepEqual(getCarouselRules(count), { count, hasSlides: true, isInteractive: true });
  }

  assert.deepEqual(getCarouselRules(-1), { count: 0, hasSlides: false, isInteractive: false });
  assert.deepEqual(getCarouselRules(2.5), { count: 0, hasSlides: false, isInteractive: false });
});

test('carousel indices wrap for arbitrary counts including 15', () => {
  assert.equal(normalizeCarouselIndex(0, 4), 0);
  assert.equal(normalizeCarouselIndex(4, 4), 0);
  assert.equal(normalizeCarouselIndex(-1, 4), 3);
  assert.equal(normalizeCarouselIndex(8, 7), 1);
  assert.equal(normalizeCarouselIndex(-1, 7), 6);
  assert.equal(normalizeCarouselIndex(99, 1), 0);
  assert.equal(normalizeCarouselIndex(1, 0), 0);
  assert.equal(normalizeCarouselIndex(Number.NaN, 4), 0);
  assert.equal(normalizeCarouselIndex(2.9, 4), 2);

  assert.equal(normalizeCarouselIndex(0, 15), 0);
  assert.equal(normalizeCarouselIndex(15, 15), 0);
  assert.equal(normalizeCarouselIndex(-1, 15), 14);
  assert.equal(normalizeCarouselIndex(16, 15), 1);
});
