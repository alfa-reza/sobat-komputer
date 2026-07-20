import { test, expect } from '@playwright/test';

test.describe('Contact and Locations', () => {
  test('kontak.html presents contact cards and lazy map', async ({ page }) => {
    await page.goto('/kontak.html');

    // Owner card
    const ownerCard = page.locator('.wa-contact-row').nth(0);
    await expect(ownerCard).toContainText('Owner');
    await expect(ownerCard).toHaveAttribute('href', /wa\.me\/6285742744594/);

    // Admin 1 card
    const admin1Card = page.locator('.wa-contact-row').nth(1);
    await expect(admin1Card).toContainText('Admin 1');
    await expect(admin1Card).toHaveAttribute('href', /wa\.me\/6285185062811/);

    // Admin 2 card
    const admin2Card = page.locator('.wa-contact-row').nth(2);
    await expect(admin2Card).toContainText('Admin 2');
    await expect(admin2Card).toHaveAttribute('href', /wa\.me\/6288980042670/);

    // Catalog card
    const catalogCard = page.locator('.wa-contact-row').nth(3);
    await expect(catalogCard).toContainText('Katalog Resmi');
    await expect(catalogCard).toHaveAttribute('href', 'https://wa.me/c/6288980042670');

    // Map iframe
    const mapIframe = page.locator('.map-box iframe');
    await expect(mapIframe).toHaveAttribute('loading', 'lazy');
    await expect(mapIframe).toHaveAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    await expect(mapIframe).toHaveAttribute('title', /Lokasi/i);

    // External Maps Link
    const externalMap = page.locator('a[href*="maps.app.goo.gl"]');
    await expect(externalMap).toBeVisible();
    await expect(externalMap).toHaveAttribute('target', '_blank');
    await expect(externalMap).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
