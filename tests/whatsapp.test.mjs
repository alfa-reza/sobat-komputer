import test from 'node:test';
import assert from 'node:assert/strict';

import { buildWhatsAppUrl } from '../assets/js/core/whatsapp.mjs';

function parseResult(options) {
  const url = new URL(buildWhatsAppUrl(options));
  return { url, message: url.searchParams.get('text') };
}

test('builds a deterministic product inquiry URL', () => {
  const result = parseResult({
    contentType: 'Produk',
    reference: 'LAPTOP-001',
    pageUrl: 'https://example.com/produk.html'
  });

  assert.equal(result.url.origin, 'https://wa.me');
  assert.equal(result.url.pathname, '/6285742744594');
  assert.equal(result.url.searchParams.size, 1);
  assert.equal(result.message, 'Halo New Sobat Komputer, saya ingin menanyakan produk dengan referensi LAPTOP-001. Halaman: https://example.com/produk.html');
  assert.equal(buildWhatsAppUrl({ contentType: 'Produk', reference: 'LAPTOP-001', pageUrl: 'https://example.com/produk.html' }), buildWhatsAppUrl({ contentType: 'Produk', reference: 'LAPTOP-001', pageUrl: 'https://example.com/produk.html' }));
});

test('encodes Unicode page paths without losing safe query values', () => {
  const { message } = parseResult({
    contentType: 'produk',
    reference: 'PC-SET-2',
    pageUrl: 'https://example.com/katalog/komputer murah?warna=hitam putih'
  });

  assert.equal(message, 'Halo New Sobat Komputer, saya ingin menanyakan produk dengan referensi PC-SET-2. Halaman: https://example.com/katalog/komputer%20murah?warna=hitam%20putih');
});

test('removes embedded credentials, fragments, and sensitive query values', () => {
  const { message } = parseResult({
    contentType: 'Promo',
    reference: 'PROMO-2026',
    pageUrl: 'https://user:password@example.com/promo.html?campaign=ramadan&token=secret&access_token=secret&session=secret#private'
  });

  assert.equal(message, 'Halo New Sobat Komputer, saya ingin menanyakan promo dengan referensi PROMO-2026. Halaman: https://example.com/promo.html?campaign=ramadan');
  assert.ok(!message.includes('password'));
  assert.ok(!message.includes('secret'));
  assert.ok(!message.includes('#'));
});

test('removes every sensitive parameter occurrence case-insensitively', () => {
  const { message } = parseResult({
    contentType: 'produk',
    reference: 'UNIT-123',
    pageUrl: 'https://example.com/produk?Token=one&TOKEN=two&refresh-token=three&key=four&safe=yes'
  });

  assert.equal(message, 'Halo New Sobat Komputer, saya ingin menanyakan produk dengan referensi UNIT-123. Halaman: https://example.com/produk?safe=yes');
});

test('rejects empty and malformed references with a safe error', () => {
  const base = { contentType: 'produk', pageUrl: 'https://example.com/produk.html' };
  for (const reference of ['', 'AB', 'BAD REF', 'BAD_', '-BAD', 'A'.repeat(31), null]) {
    assert.throws(() => buildWhatsAppUrl({ ...base, reference }), {
      name: 'WhatsAppUrlError',
      code: 'VALIDATION_ERROR',
      message: 'Invalid WhatsApp request.'
    });
  }
});

test('rejects invalid content types and unsafe page URLs', () => {
  const base = { contentType: 'produk', reference: 'UNIT-123', pageUrl: 'https://example.com/produk.html' };
  for (const override of [
    { contentType: '' },
    { contentType: 'produk baru' },
    { pageUrl: 'javascript:alert(1)' },
    { pageUrl: '/produk.html' },
    { pageUrl: 'not a url' },
    { pageUrl: null }
  ]) {
    assert.throws(() => buildWhatsAppUrl({ ...base, ...override }), {
      name: 'WhatsAppUrlError',
      code: 'VALIDATION_ERROR',
      message: 'Invalid WhatsApp request.'
    });
  }
});
