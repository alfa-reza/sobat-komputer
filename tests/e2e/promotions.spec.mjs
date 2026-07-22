import { test, expect } from "@playwright/test";

test.describe("Promo Carousel", () => {
  test("renders promotions as a carousel", async ({ page }) => {
    await page.goto("/promo.html");
    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    await expect(carousel).toBeVisible();

    const slides = carousel.locator(".carousel-slide");
    const firstSlide = slides.nth(0);

    const image = firstSlide.locator("img");
    await expect(image).toBeVisible();
  });

  test("provides no-JS fallback with a static item and catalog link", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/promo.html");

    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    await expect(carousel).toBeVisible();

    const slides = carousel.locator(".carousel-slide");
    await expect(slides).toHaveCount(4); // Since it's fallback html, all 4 slides are present

    const catalogLink = page.locator("a.btn-catalog");
    await expect(catalogLink.first()).toBeVisible();

    const waLink = page.locator(".promo-action-buttons a.btn-wa");
    await expect(waLink).toHaveAttribute("href", /wa\.me\/6288980042670/);

    await context.close();
  });
});
