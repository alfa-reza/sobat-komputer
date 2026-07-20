import { test, expect } from '@playwright/test';

const pages = [
  '/',
  '/layanan.html',
  '/produk.html',
  '/promo.html',
  '/kontak.html'
];

for (const p of pages) {
  test(`page ${p} loads successfully`, async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(p);
    expect(response.status()).toBe(200);

    await page.waitForLoadState('domcontentloaded');

    await expect(page).toHaveTitle(/Sobat Komputer/i);
    await expect(page.locator('main')).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });
}
