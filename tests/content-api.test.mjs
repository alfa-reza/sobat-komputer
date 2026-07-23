import test from "node:test";
import assert from "node:assert/strict";

import * as api from "../assets/js/core/content-api.mjs";
import { createMockContentAdapter } from "../assets/js/data/mock-content-adapter.mjs";

const image = (position = 1) => ({
  id: `image-${position}`,
  storage_path: `assets/images/product-${position}.webp`,
  alt_text: `Gambar produk posisi ${position}`,
  sort_order: position,
});

const product = (overrides = {}) => ({
  id: "product-1",
  status: "published",
  sort_order: 10,
  created_at: "2026-01-01T00:00:00.000Z",
  image: image(1),
  ...overrides,
});

const promotion = (overrides = {}) => ({
  id: "promotion-1",
  storage_path: "assets/images/promotion.webp",
  alt_text: "Poster promotion valid",
  status: "published",
  starts_at: null,
  ends_at: null,
  sort_order: 10,
  created_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const content = (overrides = {}) => ({
  hero: {
    desktop_path: "assets/images/hero-desktop.webp",
    mobile_path: "assets/images/hero-mobile.webp",
    alt_text: "Foto hero yang valid",
  },
  promotions: [],
  products: [],
  ...overrides,
});

test("facade exports exactly three asynchronous read functions", async () => {
  assert.deepEqual(Object.keys(api).sort(), [
    "getHero",
    "getProducts",
    "getPromotions",
  ]);
  for (const fn of Object.values(api))
    assert.equal(typeof fn().then, "function");
  await Promise.all([api.getHero(), api.getPromotions(), api.getProducts()]);
});

test("hero is normalized without raw fields", async () => {
  assert.deepEqual(await api.getHero(), {
    desktopSrc:
      "assets/images/hero/new-sobat-komputer-hero-desktop-1536x864.webp",
    mobileSrc:
      "assets/images/hero/new-sobat-komputer-hero-mobile-864x1080.webp",
    alt: "Foto depan toko New Sobat Komputer di Kejobong",
  });
});

test("fixture returns eight ordered active promotions and valid active products", async () => {
  const promotions = await api.getPromotions({
    now: "2026-07-19T00:00:00.000Z",
  });
  assert.deepEqual(
    promotions.map(({ id }) => id),
    ["promo-1", "promo-2", "promo-3", "promo-4", "promo-5", "promo-6", "promo-7", "promo-8"],
  );
  assert.ok(
    promotions.every(
      (item) => Object.keys(item).sort().join() === "alt,id,src",
    ),
  );

  const products = await api.getProducts();
  assert.deepEqual(
    products.map(({ id }) => id),
    ["product-valid"],
  );
  assert.ok(
    products.every((item) => Object.keys(item).sort().join() === "id,image"),
  );
});

test("promotion schedule uses inclusive start and exclusive end", async () => {
  const adapter = createMockContentAdapter(
    content({
      promotions: [
        promotion({
          starts_at: "2026-07-19T10:00:00.000Z",
          ends_at: "2026-07-19T11:00:00.000Z",
        }),
      ],
    }),
  );
  assert.equal(
    (await adapter.getPromotions({ now: "2026-07-19T09:59:59.999Z" })).length,
    0,
  );
  assert.equal(
    (await adapter.getPromotions({ now: "2026-07-19T10:00:00.000Z" })).length,
    1,
  );
  assert.equal(
    (await adapter.getPromotions({ now: "2026-07-19T11:00:00.000Z" })).length,
    0,
  );
});

test("status filtering and deterministic row ordering are enforced", async () => {
  const adapter = createMockContentAdapter(
    content({
      promotions: [
        promotion({ id: "z", sort_order: 2 }),
        promotion({
          id: "b",
          sort_order: 1,
          created_at: "2026-01-02T00:00:00.000Z",
        }),
        promotion({
          id: "a",
          sort_order: 1,
          created_at: "2026-01-02T00:00:00.000Z",
        }),
        promotion({
          id: "older",
          sort_order: 1,
          created_at: "2026-01-01T00:00:00.000Z",
        }),
        promotion({ id: "draft", status: "draft" }),
        promotion({ id: "archived", status: "archived" }),
      ],
    }),
  );
  assert.deepEqual(
    (await adapter.getPromotions()).map(({ id }) => id),
    ["older", "a", "b", "z"],
  );
});

test("products accept exactly one valid image only", async () => {
  const adapter = createMockContentAdapter(
    content({
      products: [
        product({ id: "one" }),
        product({ id: "no-image", image: null }),
        product({ id: "draft", status: "draft" }),
        product({
          id: "bad-path",
          image: { ...image(1), storage_path: "../secret.webp" },
        }),
        product({ id: "bad-alt", image: { ...image(1), alt_text: "" } }),
      ],
    }),
  );
  const products = await adapter.getProducts();
  assert.deepEqual(
    products.map(({ id }) => id),
    ["one"],
  );
  assert.deepEqual(products[0].image.src, "assets/images/product-1.webp");
  assert.deepEqual(Object.keys(products[0]).sort(), ["id", "image"]);
});

test("product limit is clamped and validated", async () => {
  const adapter = createMockContentAdapter(
    content({
      products: [product({ id: "a" }), product({ id: "b", sort_order: 20 })],
    }),
  );
  assert.equal((await adapter.getProducts({ limit: 0 })).length, 0);
  assert.equal((await adapter.getProducts({ limit: -2 })).length, 0);
  assert.equal((await adapter.getProducts({ limit: 1.9 })).length, 1);
  assert.equal((await adapter.getProducts({ limit: 99 })).length, 2);
  await assert.rejects(adapter.getProducts({ limit: "1" }), {
    name: "ContentApiError",
    code: "VALIDATION_ERROR",
    message: "Invalid content request.",
  });
});

test("invalid request and malformed source errors are safe", async () => {
  const adapter = createMockContentAdapter(null);
  await assert.rejects(api.getPromotions({ now: "not-a-date" }), {
    name: "ContentApiError",
    code: "VALIDATION_ERROR",
    message: "Invalid content request.",
  });
  await assert.rejects(adapter.getHero(), {
    name: "ContentApiError",
    code: "FETCH_FAILED",
    message: "Content is temporarily unavailable.",
  });
  await assert.rejects(
    adapter.getProducts(),
    (error) => !JSON.stringify(error).includes("null"),
  );
});

test("results are fresh and media paths remain safe and relative", async () => {
  const first = await api.getPromotions({ now: "2026-07-19T00:00:00.000Z" });
  first[0].src = "/mutated";
  first.push({ id: "bad", src: "../bad", alt: "Bad path" });
  const second = await api.getPromotions({ now: "2026-07-19T00:00:00.000Z" });
  assert.equal(second.length, 8);
  assert.ok(
    second.every(
      ({ src }) =>
        !src.startsWith("/") &&
        !src.includes("..") &&
        !src.includes("\\") &&
        !src.includes("://"),
    ),
  );
});
