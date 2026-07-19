import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeHeroCandidate, preloadHeroPair } from '../assets/js/public/hero.mjs';

const hero = {
  desktopSrc: 'assets/images/desktop.webp',
  mobileSrc: 'assets/images/mobile.webp',
  alt: 'Foto hero valid'
};

test('normalizes only a complete trimmed hero pair', () => {
  assert.deepEqual(normalizeHeroCandidate(hero), hero);
  assert.deepEqual(normalizeHeroCandidate({
    desktopSrc: ' assets/images/desktop.webp ',
    mobileSrc: ' assets/images/mobile.webp ',
    alt: ' Foto hero valid '
  }), hero);

  for (const invalid of [
    null,
    [],
    {},
    { ...hero, desktopSrc: '' },
    { ...hero, mobileSrc: '' },
    { ...hero, alt: '' },
    { ...hero, alt: null }
  ]) assert.equal(normalizeHeroCandidate(invalid), null);
});

test('returns the pair only after both media preload', async () => {
  const loaded = [];
  const result = await preloadHeroPair(hero, async (src) => loaded.push(src));
  assert.deepEqual(loaded, [hero.desktopSrc, hero.mobileSrc]);
  assert.deepEqual(result, hero);
});

test('does not resolve while either media remains pending', async () => {
  let releaseMobile;
  const pending = preloadHeroPair(hero, (src) => src === hero.desktopSrc
    ? Promise.resolve()
    : new Promise((resolve) => { releaseMobile = resolve; }));

  const state = await Promise.race([
    pending.then(() => 'resolved'),
    new Promise((resolve) => setTimeout(() => resolve('pending'), 10))
  ]);
  assert.equal(state, 'pending');
  releaseMobile();
  assert.deepEqual(await pending, hero);
});

test('rejects the complete pair when either media fails', async () => {
  await assert.rejects(preloadHeroPair(hero, async (src) => {
    if (src === hero.mobileSrc) throw new Error('broken image');
  }), /broken image/);
  await assert.rejects(preloadHeroPair({ ...hero, desktopSrc: '' }, async () => {}), /Invalid hero media/);
});
