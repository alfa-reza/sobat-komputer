import { test, expect } from '@playwright/test';

const pages = [
  { name: 'home', path: '/' },
  { name: 'layanan', path: '/layanan.html' },
  { name: 'produk', path: '/produk.html' },
  { name: 'promo', path: '/promo.html' },
  { name: 'kontak', path: '/kontak.html' },
  { name: '404', path: '/404.html' }
];

test.describe('Visual Snapshots', () => {
  for (const p of pages) {
    test(`Visual baseline for ${p.name}`, async ({ page, browserName }, testInfo) => {
      // Only run visual tests on Chromium to avoid engine noise
      test.skip(browserName !== 'chromium', 'Visual tests only run on Chromium');
      
      // We also want to skip if the project is not Mobile Chromium or Desktop Chromium
      const project = testInfo.project.name;
      test.skip(project !== 'Mobile Chromium' && project !== 'Desktop Chromium', 'Visual tests only run on specific viewports');

      await page.goto(p.path);

      // Wait for fonts and images to load
      await page.evaluate(() => document.fonts.ready);
      const images = page.locator('img');
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        await expect(images.nth(i)).toBeVisible();
      }

      // Hide map iframe in contact page for deterministic snapshots
      if (p.name === 'kontak') {
        await page.addStyleTag({ content: 'iframe { visibility: hidden !important; }' });
      }

      // Disable transitions and animations
      await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; animation: none !important; }' });
      
      // Make sure carousel is at first slide
      const carousels = page.locator('.carousel');
      if (await carousels.count() > 0) {
        await page.evaluate(() => {
          document.querySelectorAll('.carousel').forEach(c => {
            c.scrollLeft = 0;
          });
        });
      }

      await expect(page).toHaveScreenshot(`${p.name}-${project.toLowerCase().replace(' ', '-')}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05
      });
    });
  }
});
