import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

const pages = [
  '/',
  '/layanan.html',
  '/produk.html',
  '/promo.html',
  '/kontak.html'
];

for (const p of pages) {
  test(`page ${p} works without JS`, async ({ page }) => {
    const response = await page.goto(p);
    expect(response.status()).toBe(200);

    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.nav-list')).toBeVisible();
  });
}
