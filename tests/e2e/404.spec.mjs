import { test, expect } from '@playwright/test';

test.describe('404 Error Page', () => {
  test('direct navigation to /404.html loads correctly', async ({ page }) => {
    const response = await page.goto('/404.html');
    expect(response.status()).toBe(200);

    await expect(page).toHaveTitle(/Tidak Ditemukan/i);
    await expect(page.locator('h1.error-title')).toContainText('404');
    
    // Check if recovery link is present
    const homeLink = page.locator('.error-actions a[href="index.html"]');
    await expect(homeLink).toBeVisible();
    
    // Check contact owner link
    const waLink = page.locator('.error-actions a[href*="wa.me"]');
    await expect(waLink).toBeVisible();
  });

  test('unknown path serves 404.html content', async ({ page }) => {
    const response = await page.goto('/unknown-nested-path/page.html');
    
    // `serve` returns 404 status but serves the 404.html file content
    expect(response.status()).toBe(404);
    
    await expect(page.locator('h1.error-title')).toContainText('404');
  });
});
