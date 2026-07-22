import { test, expect } from "@playwright/test";

const pages = [
  "/",
  "/layanan.html",
  "/produk.html",
  "/promo.html",
  "/kontak.html",
  "/404.html",
];

for (const p of pages) {
  test(`page ${p} loads successfully`, async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("favicon")) {
        // Ignore 404 errors on 404.html locally because the base tag points to GH Pages path
        if (p === "/404.html" && msg.text().includes("404 (Not Found)")) return;
        consoleErrors.push(msg.text());
      }
    });

    const response = await page.goto(p);
    expect(response.status()).toBe(200);

    await page.waitForLoadState("domcontentloaded");

    if (p === "/404.html") {
      await expect(page).toHaveTitle(/Tidak Ditemukan/i);
    } else {
      await expect(page).toHaveTitle(/Sobat Komputer/i);
    }
    await expect(page.locator("main")).toBeVisible();

    expect(consoleErrors).toEqual([]);
  });
}
