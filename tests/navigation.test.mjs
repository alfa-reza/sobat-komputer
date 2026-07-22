import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const pages = [
  "index.html",
  "layanan.html",
  "produk.html",
  "promo.html",
  "kontak.html",
];
const expectedLinks = [
  "index.html",
  "layanan.html",
  "produk.html",
  "promo.html",
  "kontak.html",
];

function hrefs(fragment) {
  return [...fragment.matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map(
    (match) => match[1],
  );
}

for (const page of pages) {
  test(`${page} has ordered product navigation and one active header link`, async () => {
    const html = await readFile(new URL(`../${page}`, import.meta.url), "utf8");
    const header = html.match(
      /<ul class="nav-list"[^>]*>([\s\S]*?)<\/ul>/,
    )?.[1];
    const footer = html.match(
      /<div class="footer-links-col">([\s\S]*?)<\/div>/,
    )?.[1];
    assert.ok(header);
    assert.ok(footer);
    assert.deepEqual(hrefs(header), expectedLinks);
    assert.deepEqual(hrefs(footer), expectedLinks);

    const currentLinks = [
      ...header.matchAll(/<a\s+([^>]*aria-current="page"[^>]*)>/g),
    ];
    assert.equal(currentLinks.length, 1);
    assert.match(currentLinks[0][1], new RegExp(`href="${page}"`));
    assert.match(currentLinks[0][1], /class="active"/);
  });
}

test("all navigation destinations exist", async () => {
  await Promise.all(
    expectedLinks.map((path) => access(new URL(`../${path}`, import.meta.url))),
  );
});

test("homepage teaser keeps a direct catalog link and category anchors", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /id="produk"/);
  assert.match(html, /href="produk\.html#produk-laptop"/);
  assert.match(html, /href="produk\.html#produk-aksesori"/);
  assert.match(html, /href="https:\/\/wa\.me\/c\/6288980042670"/);
});

test("404.html uses root-relative paths for GitHub Pages and includes all main destinations", async () => {
  const html = await readFile(new URL("../404.html", import.meta.url), "utf8");

  // Extract all hrefs
  const allHrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

  for (const expected of expectedLinks) {
    assert.ok(
      allHrefs.includes(expected) ||
        allHrefs.includes("/sobat-komputer/" + expected) ||
        allHrefs.includes("/" + expected),
      `Missing link to ${expected}`,
    );
  }
});

test("layanan.html enforces updated copywriting, Layanan Servis H2, and service placeholders", async () => {
  const html = await readFile(
    new URL("../layanan.html", import.meta.url),
    "utf8",
  );
  assert.match(
    html,
    /<h2 class="section-title text-left">Layanan Servis<\/h2>/,
  );
  assert.match(html, /Servis Laptop &amp; PC/);
  assert.match(html, /Servis Printer/);
  assert.match(html, /Internet Fiber Rumah \(iPrime\)/);
  assert.match(html, /id="proses-servis"/);
  assert.match(
    html,
    /assets\/images\/layanan\/placeholder-servis-laptop-pc\.webp/,
  );
  assert.match(
    html,
    /assets\/images\/layanan\/placeholder-servis-printer\.webp/,
  );
  assert.match(
    html,
    /assets\/images\/layanan\/placeholder-jual-beli-laptop-pc\.webp/,
  );
  assert.match(
    html,
    /assets\/images\/layanan\/placeholder-aksesori-komputer\.webp/,
  );
  assert.match(
    html,
    /assets\/images\/layanan\/placeholder-pemasangan-cctv\.webp/,
  );
  assert.match(
    html,
    /assets\/images\/layanan\/placeholder-internet-fiber-rumah-iprime\.webp/,
  );
  assert.doesNotMatch(
    html,
    /class="alternating-image"[^>]*src="assets\/images\/brand\/logo\.webp"/,
  );
});

test("index.html features Toko Komputer hero with product and service CTAs", async () => {
  const html = await readFile(
    new URL("../index.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /TOKO KOMPUTER DI KEJOBONG/);
  assert.match(html, /Produk Komputer dan Layanan Teknis dalam Satu Tempat/);
  assert.match(html, /href="produk\.html">Lihat Produk<\/a>/);
  assert.match(html, /href="layanan\.html">Lihat Layanan<\/a>/);
});

test("kontak.html visual labels are concise without bracketed descriptions", async () => {
  const html = await readFile(
    new URL("../kontak.html", import.meta.url),
    "utf8",
  );
  assert.match(html, /<span class="wa-number">Owner<\/span>/);
  assert.match(html, /<span class="wa-number">Admin 1<\/span>/);
  assert.match(html, /<span class="wa-number">Admin 2<\/span>/);
  assert.doesNotMatch(html, /Owner \(Layanan &amp; Umum\)/);
  assert.doesNotMatch(html, /Admin 2 \(Produk &amp; Promo\)/);
});
