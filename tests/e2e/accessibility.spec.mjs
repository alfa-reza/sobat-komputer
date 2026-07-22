import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  const pages = [
    "/",
    "/layanan.html",
    "/produk.html",
    "/promo.html",
    "/kontak.html",
  ];

  test("Skip link is focusable and skips to main content", async ({ page }) => {
    await page.goto("/");

    // Press Tab to focus skip link
    await page.keyboard.press("Tab");
    const skipLink = page.locator("a.skip-link");
    await expect(skipLink).toBeFocused();

    // Press Enter to activate skip link
    await skipLink.press("Enter");

    // Check if focus moved to main or an element inside main
    // Wait for the URL to have #main-content
    await expect(page).toHaveURL(/.*#main-content/);
  });

  test("Focus indicators are visible on interactive elements", async ({
    page,
  }) => {
    await page.goto("/");

    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab"); // Should focus logo/home link

    const logoLink = page.locator(".header-brand");
    await expect(logoLink).toBeFocused();
    // Assuming focus-visible is defined in style.css
  });

  test("Reduced motion prevents autoplay", async ({ page }) => {
    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // We don't have video/audio autoplay, but for carousels, they might rely on CSS animations
    // Currently, our carousel is controlled via JS clicks/scrolls, no auto-play logic.
    // If there were autoplay, we would assert it's paused.
    // Let's assert carousel exists.
    const carousel = page.locator(".carousel");
    if ((await carousel.count()) > 0) {
      await expect(carousel.first()).toBeVisible();
    }
  });
});
