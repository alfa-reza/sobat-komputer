import { test, expect } from "@playwright/test";

test.describe("Produk Carousels", () => {
  test("renders laptop and accessory products as non-autoplay carousels with catalog image links", async ({
    page,
  }) => {
    await page.goto("/produk.html");

    // Check Laptop carousel
    const laptopCarousel = page.locator(
      '.carousel[data-carousel="product-laptop"]',
    );
    await expect(laptopCarousel).toBeVisible();
    await expect(laptopCarousel).toHaveAttribute(
      "data-carousel-autoplay",
      "false",
    );
    const laptopSlides = laptopCarousel.locator(".carousel-slide");
    await expect(laptopSlides).toHaveCount(15);

    const firstLaptopImg = laptopSlides.nth(0).locator("img");
    await expect(firstLaptopImg).toBeVisible();
    await expect(firstLaptopImg).toHaveAttribute(
      "src",
      /produk_laptop\/laptop_1\.webp/,
    );

    // Clicking poster link must route to official catalog
    const laptopLink = laptopSlides.nth(0).locator("a.product-photo-action");
    await expect(laptopLink).toHaveAttribute(
      "href",
      "https://wa.me/c/6288980042670",
    );

    // Check Accessory carousel
    const aksesoriCarousel = page.locator(
      '.carousel[data-carousel="product-aksesori"]',
    );
    await expect(aksesoriCarousel).toBeVisible();
    await expect(aksesoriCarousel).toHaveAttribute(
      "data-carousel-autoplay",
      "false",
    );
    const aksesoriSlides = aksesoriCarousel.locator(".carousel-slide");
    await expect(aksesoriSlides).toHaveCount(15);

    const firstAksesoriImg = aksesoriSlides.nth(0).locator("img");
    await expect(firstAksesoriImg).toBeVisible();
    await expect(firstAksesoriImg).toHaveAttribute(
      "src",
      /produk_aksesori\/aksesori_1\.webp/,
    );

    const aksesoriLink = aksesoriSlides
      .nth(0)
      .locator("a.product-photo-action");
    await expect(aksesoriLink).toHaveAttribute(
      "href",
      "https://wa.me/c/6288980042670",
    );

    // Single chat buttons under carousels
    const laptopChatBtn = page.locator("#produk-laptop .product-actions a");
    await expect(laptopChatBtn).toHaveCount(1);
    await expect(laptopChatBtn).toContainText("Tanya Produk Laptop");
    await expect(laptopChatBtn).toHaveAttribute(
      "href",
      /wa\.me\/6288980042670/,
    );

    const aksesoriChatBtn = page.locator("#produk-aksesori .product-actions a");
    await expect(aksesoriChatBtn).toHaveCount(1);
    await expect(aksesoriChatBtn).toContainText("Tanya Produk Aksesori");
    await expect(aksesoriChatBtn).toHaveAttribute(
      "href",
      /wa\.me\/6288980042670/,
    );
  });

  test("hides floating WhatsApp button on mobile product page", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/produk.html");

    const floatingWa = page.locator(".floating-wa");
    await expect(floatingWa).toBeHidden();
  });

  test("provides no-JS fallback with static items and category anchors", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/produk.html");

    const laptopCarousel = page.locator(
      '.carousel[data-carousel="product-laptop"]',
    );
    await expect(laptopCarousel).toBeVisible();

    const aksesoriCarousel = page.locator(
      '.carousel[data-carousel="product-aksesori"]',
    );
    await expect(aksesoriCarousel).toBeVisible();

    await context.close();
  });
});
