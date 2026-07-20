import { test, expect } from '@playwright/test';

const viewports = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 1440, height: 900 }
];

const pages = ['/', '/layanan.html', '/produk.html', '/promo.html', '/kontak.html', '/404.html'];

test.describe('Responsive and Layout', () => {
  for (const viewport of viewports) {
    test.describe(`Viewport ${viewport.width}x${viewport.height}`, () => {
      test.use({ viewport });

      for (const p of pages) {
        test(`Page ${p} has no horizontal overflow`, async ({ page }) => {
          await page.goto(p);
          
          const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
          const windowWidth = await page.evaluate(() => window.innerWidth);
          
          expect(documentWidth).toBeLessThanOrEqual(windowWidth);
        });
      }

      test('Primary touch targets meet minimum dimensions', async ({ page }) => {
        await page.goto('/');
        
        // Exclude inline links or footer links, we check primary buttons
        const buttons = page.locator('.btn');
        const count = await buttons.count();
        
        for (let i = 0; i < count; i++) {
          const boundingBox = await buttons.nth(i).boundingBox();
          if (boundingBox && viewport.width < 1024) { // Only check touch targets on mobile
            // Minimum recommended touch target size is 44x44
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      });
    });
  }
});
