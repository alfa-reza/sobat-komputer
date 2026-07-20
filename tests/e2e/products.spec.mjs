import { test, expect } from '@playwright/test';

test.describe('Produk Carousel', () => {
  test('renders products as a carousel', async ({ page }) => {
    await page.goto('/produk.html');
    const carousel = page.locator('.carousel[data-carousel="product"]');
    await expect(carousel).toBeVisible();
    
    const slides = carousel.locator('.carousel-slide');
    const firstSlide = slides.nth(0);
    
    const image = firstSlide.locator('img');
    await expect(image).toBeVisible();
    
    const link = firstSlide.locator('a.product-photo-action');
    await expect(link).toHaveAttribute('href', /wa\.me\/6288980042670/);
  });

  test('provides no-JS fallback with a static item and catalog link', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/produk.html');
    
    const carousel = page.locator('.carousel[data-carousel="product"]');
    await expect(carousel).toBeVisible();
    
    const slides = carousel.locator('.carousel-slide');
    await expect(slides).toHaveCount(1);
    
    const catalogLink = page.locator('a.btn-catalog');
    await expect(catalogLink.first()).toBeVisible();
    
    await context.close();
  });
});
