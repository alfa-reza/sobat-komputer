import test from 'node:test';
import assert from 'node:assert/strict';

import { buildWhatsAppUrl } from '../assets/js/core/whatsapp.mjs';

function parseResult(options) {
  const url = new URL(buildWhatsAppUrl(options));
  return { url, message: url.searchParams.get('text') };
}

test('builds WhatsApp URLs according to intent', () => {
  const general = parseResult({ intent: 'GENERAL' });
  assert.equal(general.url.origin, 'https://wa.me');
  assert.equal(general.url.pathname, '/6285742744594');
  assert.equal(general.message, 'Halo New Sobat Komputer, saya mendapatkan informasi dari website.');

  const product = parseResult({ intent: 'PRODUCT' });
  assert.equal(product.url.pathname, '/6288980042670');
  assert.equal(product.message, 'Halo New Sobat Komputer, saya ingin menanyakan produk yang tersedia.');

  const promo = parseResult({ intent: 'PROMO' });
  assert.equal(promo.url.pathname, '/6288980042670');
  assert.equal(promo.message, 'Halo New Sobat Komputer, saya mau tanya detail promo terbaru.');
  
  const service = parseResult({ intent: 'SERVICE' });
  assert.equal(service.url.pathname, '/6285742744594');
  assert.equal(service.message, 'Halo New Sobat Komputer, saya ingin menanyakan layanan servis.');
  
  const location = parseResult({ intent: 'LOCATION' });
  assert.equal(location.url.pathname, '/6285742744594');
  assert.equal(location.message, 'Halo New Sobat Komputer, saya ingin menanyakan lokasi toko.');
});

test('intent matching is case-insensitive', () => {
  const lower = parseResult({ intent: 'general' });
  const upper = parseResult({ intent: 'GENERAL' });
  assert.equal(lower.url.href, upper.url.href);
});

test('rejects missing and invalid intents with a safe error', () => {
  for (const intent of [undefined, null, '', 'UNKNOWN', 123, {}, []]) {
    assert.throws(() => buildWhatsAppUrl({ intent }), {
      name: 'WhatsAppUrlError',
      code: 'VALIDATION_ERROR',
      message: 'Invalid WhatsApp request.'
    });
  }
});
