import { test, expect } from '@playwright/test';

test.describe('Produk Carousels', () => {
  test('renders laptop and accessory products as carousels', async ({ page }) => {
    await page.goto('/produk.html');
    
    // Check Laptop carousel
    const laptopCarousel = page.locator('.carousel[data-carousel="product-laptop"]');
    await expect(laptopCarousel).toBeVisible();
    const laptopSlides = laptopCarousel.locator('.carousel-slide');
    await expect(laptopSlides).toHaveCount(15);
    const firstLaptopImg = laptopSlides.nth(0).locator('img');
    await expect(firstLaptopImg).toBeVisible();
    await expect(firstLaptopImg).toHaveAttribute('src', /produk_laptop\/laptop_1\.webp/);
    const laptopLink = laptopSlides.nth(0).locator('a.product-photo-action');
    await expect(laptopLink).toHaveAttribute('href', /wa\.me\/6288980042670/);

    // Check Accessory carousel
    const aksesoriCarousel = page.locator('.carousel[data-carousel="product-aksesori"]');
    await expect(aksesoriCarousel).toBeVisible();
    const aksesoriSlides = aksesoriCarousel.locator('.carousel-slide');
    await expect(aksesoriSlides).toHaveCount(15);
    const firstAksesoriImg = aksesoriSlides.nth(0).locator('img');
    await expect(firstAksesoriImg).toBeVisible();
    await expect(firstAksesoriImg).toHaveAttribute('src', /produk_aksesori\/aksesori_1\.webp/);
    const aksesoriLink = aksesoriSlides.nth(0).locator('a.product-photo-action');
    await expect(aksesoriLink).toHaveAttribute('href', /wa\.me\/6288980042670/);

    // Check catalog buttons
    const catalogButtons = page.locator('a.btn-catalog');
    await expect(catalogButtons.first()).toBeVisible();
  });

  test('provides no-JS fallback with static items and catalog links', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/produk.html');
    
    const laptopCarousel = page.locator('.carousel[data-carousel="product-laptop"]');
    await expect(laptopCarousel).toBeVisible();
    
    const aksesoriCarousel = page.locator('.carousel[data-carousel="product-aksesori"]');
    await expect(aksesoriCarousel).toBeVisible();

    const catalogLinks = page.locator('a.btn-catalog');
    await expect(catalogLinks.first()).toBeVisible();
    
    await context.close();
  });
});
