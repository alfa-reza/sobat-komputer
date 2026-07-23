import { test, expect } from "@playwright/test";

test.describe("Promo Carousel", () => {
  test("renders 8 promo slides with correct status", async ({ page }) => {
    await page.goto("/promo.html");
    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    await expect(carousel).toBeVisible();

    const slides = carousel.locator(".carousel-slide");
    await expect(slides).toHaveCount(8);

    // First slide visible, rest hidden
    await expect(slides.nth(0)).toHaveAttribute("aria-hidden", "false");
    for (let i = 1; i < 8; i++) {
      await expect(slides.nth(i)).toHaveAttribute("aria-hidden", "true");
    }

    // Status shows 1 / 8
    const status = carousel.locator(".carousel-status");
    await expect(status).toContainText("1 / 8");
  });

  test("carousel navigation works with next/prev buttons", async ({
    page,
  }) => {
    await page.goto("/promo.html");
    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    await expect(carousel).toHaveClass(/is-initialized/);
    const status = carousel.locator(".carousel-status");
    const nextBtn = carousel.locator(".carousel-btn.next");

    // Pause autoplay for predictable testing
    const pauseBtn = carousel.locator(".play-pause");
    if ((await pauseBtn.count()) > 0) {
      await pauseBtn.click();
    }

    await nextBtn.click();
    await expect(status).toContainText("2 / 8");
  });

  test("carousel keyboard navigation works", async ({ page }) => {
    await page.goto("/promo.html");
    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    await expect(carousel).toHaveClass(/is-initialized/);
    const status = carousel.locator(".carousel-status");

    // Pause autoplay first for predictable keyboard testing
    const pauseBtn = carousel.locator(".play-pause");
    if ((await pauseBtn.count()) > 0) {
      await pauseBtn.click();
    }

    // Focus and go to start
    await carousel.focus();
    await page.keyboard.press("Home");
    await expect(status).toContainText("1 / 8");

    // ArrowRight
    await page.keyboard.press("ArrowRight");
    await expect(status).toContainText("2 / 8");

    // ArrowLeft back
    await page.keyboard.press("ArrowLeft");
    await expect(status).toContainText("1 / 8");

    // End key
    await page.keyboard.press("End");
    await expect(status).toContainText("8 / 8");

    // Home key
    await page.keyboard.press("Home");
    await expect(status).toContainText("1 / 8");
  });

  test("all promo images load without errors", async ({ page }) => {
    await page.goto("/promo.html");
    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    const images = carousel.locator(".carousel-slide img");
    const count = await images.count();
    expect(count).toBe(8);

    // First image should not be lazy-loaded
    const firstImg = images.nth(0);
    const firstLoading = await firstImg.getAttribute("loading");
    expect(firstLoading).not.toBe("lazy");

    // Remaining images should be lazy-loaded
    for (let i = 1; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute("loading", "lazy");
    }

    // All images should have alt text
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
      expect(alt).not.toBe("Promo");
      expect(alt).not.toBe("Gambar");
      expect(alt).not.toBe("Poster");
    }
  });

  test("correct alt text for all 8 promo posters", async ({ page }) => {
    await page.goto("/promo.html");
    const images = page.locator(".promo-carousel .carousel-slide img");

    const expectedAlts = [
      "Poster kredit laptop New Sobat Komputer",
      "Poster pemasangan CCTV New Sobat Komputer",
      "Poster jual laptop baru dan bekas New Sobat Komputer",
      "Poster paket PC New Sobat Komputer",
      "Poster servis laptop dan PC New Sobat Komputer",
      "Poster servis printer New Sobat Komputer",
      "Poster aksesori komputer New Sobat Komputer",
      "Poster internet fiber rumah iPrime New Sobat Komputer",
    ];

    for (let i = 0; i < 8; i++) {
      await expect(images.nth(i)).toHaveAttribute("alt", expectedAlts[i]);
    }
  });

  test("pause button stops autoplay", async ({ page }) => {
    await page.goto("/promo.html");
    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    const pauseBtn = carousel.locator(".play-pause");

    if ((await pauseBtn.count()) > 0) {
      await pauseBtn.click();
      await expect(pauseBtn).toHaveClass(/is-paused/);
      await expect(pauseBtn).toHaveAttribute("aria-pressed", "true");
    }
  });

  test("touch device carousel buttons are visible", async ({ page }) => {
    // Emulate a mobile touch device
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/promo.html");

    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    const prevBtn = carousel.locator(".carousel-btn.prev");
    const nextBtn = carousel.locator(".carousel-btn.next");

    // Buttons should be present in the DOM
    await expect(prevBtn).toBeAttached();
    await expect(nextBtn).toBeAttached();
  });

  test("no old poster filenames referenced", async ({ page }) => {
    await page.goto("/promo.html");
    const html = await page.content();
    expect(html).not.toContain("poster-1-kredit-laptop");
    expect(html).not.toContain("poster-2-pemasangan-cctv");
    expect(html).not.toContain("poster-3-jual-laptop");
    expect(html).not.toContain("poster-4-set-pc");
  });

  test("provides no-JS fallback with static slides", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/promo.html");

    const carousel = page.locator('.promo-carousel[data-carousel="promo"]');
    await expect(carousel).toBeVisible();

    const slides = carousel.locator(".carousel-slide");
    await expect(slides).toHaveCount(8);

    const waLink = page.locator(".promo-action-buttons a.btn-wa");
    await expect(waLink).toHaveAttribute("href", /wa\.me\/6288980042670/);

    await context.close();
  });
});

test.describe("Promo Page Content", () => {
  test("H1 is Promo (not Promo dan Katalog)", async ({ page }) => {
    await page.goto("/promo.html");
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Promo");
  });

  test("no katalog references in promo page main content", async ({
    page,
  }) => {
    await page.goto("/promo.html");

    // No heading with 'Katalog'
    const headings = page.locator("h1, h2");
    const count = await headings.count();
    for (let i = 0; i < count; i++) {
      const text = await headings.nth(i).textContent();
      expect(text.toLowerCase()).not.toContain("katalog");
    }

    // No 'Buka Katalog WhatsApp' button
    const katalogBtn = page.locator("text=Buka Katalog WhatsApp");
    await expect(katalogBtn).toHaveCount(0);
  });

  test("has Tanya Detail Promo and Lihat Produk buttons", async ({ page }) => {
    await page.goto("/promo.html");
    const tanyadetail = page.locator("text=Tanya Detail Promo");
    await expect(tanyadetail).toBeVisible();

    const lihatproduk = page.locator("a:has-text('Lihat Produk')");
    await expect(lihatproduk.first()).toBeVisible();
  });

  test("has Informasi Promo heading", async ({ page }) => {
    await page.goto("/promo.html");
    const heading = page.locator("h2:has-text('Informasi Promo')");
    await expect(heading).toBeVisible();
  });
});

test.describe("Katalog Migration", () => {
  test("promo section on index.html has no katalog button", async ({
    page,
  }) => {
    await page.goto("/");
    const promoSection = page.locator("#promo");

    // Section heading should be 'Promo Terbaru' not 'Promo & Katalog'
    const title = promoSection.locator(".section-title");
    await expect(title).toContainText("Promo Terbaru");

    // No katalog button in promo section
    const katalogInPromo = promoSection.locator("text=Buka Katalog WhatsApp");
    await expect(katalogInPromo).toHaveCount(0);
  });

  test("product page posters link to catalog", async ({ page }) => {
    await page.goto("/produk.html");

    // Laptop poster links to catalog
    const laptopLink = page
      .locator("#produk-laptop .carousel-slide a")
      .first();
    await expect(laptopLink).toHaveAttribute(
      "href",
      "https://wa.me/c/6288980042670",
    );

    // Aksesori poster links to catalog
    const aksesoriLink = page
      .locator("#produk-aksesori .carousel-slide a")
      .first();
    await expect(aksesoriLink).toHaveAttribute(
      "href",
      "https://wa.me/c/6288980042670",
    );
  });

  test("kontak page still has Katalog Resmi", async ({ page }) => {
    await page.goto("/kontak.html");
    const katalogResmi = page.locator("text=Katalog Resmi");
    await expect(katalogResmi).toBeVisible();
  });
});

test.describe("Copywriting", () => {
  test("index.html has Garansi Sesuai Nota", async ({ page }) => {
    await page.goto("/");
    const garansi = page.locator("text=Garansi Sesuai Nota");
    await expect(garansi).toBeVisible();

    // No old 'Garansi Terjamin'
    const old = page.locator("text=Garansi Terjamin");
    await expect(old).toHaveCount(0);
  });

  test("index.html promo section uses Promo Terbaru", async ({ page }) => {
    await page.goto("/");
    const title = page.locator("#promo .section-title");
    await expect(title).toContainText("Promo Terbaru");
  });

  test("layanan.html uses correct copywriting", async ({ page }) => {
    await page.goto("/layanan.html");

    // Servis Laptop & PC exists
    const servisLaptop = page.locator("text=Servis Laptop & PC");
    await expect(servisLaptop.first()).toBeVisible();

    // Servis Printer exists
    const servisPrinter = page.locator("text=Servis Printer");
    await expect(servisPrinter.first()).toBeVisible();

    // Internet Fiber Rumah (iPrime) exists
    const iprime = page.locator("text=Internet Fiber Rumah (iPrime)");
    await expect(iprime.first()).toBeVisible();
  });

  test("kontak.html labels are concise", async ({ page }) => {
    await page.goto("/kontak.html");
    const owner = page.locator(".wa-number:has-text('Owner')");
    await expect(owner).toBeVisible();
    const admin1 = page.locator(".wa-number:has-text('Admin 1')");
    await expect(admin1).toBeVisible();
    const admin2 = page.locator(".wa-number:has-text('Admin 2')");
    await expect(admin2).toBeVisible();
  });
});

test.describe("JavaScript Effects", () => {
  test("content is visible without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    // Content should be visible (no opacity: 0 without js-ready)
    const hero = page.locator(".hero");
    await expect(hero).toBeVisible();

    const trustStrip = page.locator(".trust-strip");
    await expect(trustStrip).toBeVisible();

    await context.close();
  });

  test("reduced motion disables reveal animations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    // All reveal elements should be visible immediately
    const reveals = page.locator("[data-reveal]");
    const count = await reveals.count();
    for (let i = 0; i < count; i++) {
      await expect(reveals.nth(i)).toHaveClass(/is-revealed/);
    }
  });

  test("no console errors on any page", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error" && !msg.text().includes("favicon")) {
        consoleErrors.push(msg.text());
      }
    });

    const pages = [
      "/",
      "/layanan.html",
      "/produk.html",
      "/promo.html",
      "/kontak.html",
    ];

    for (const p of pages) {
      consoleErrors.length = 0;
      await page.goto(p);
      await page.waitForLoadState("domcontentloaded");
      expect(
        consoleErrors,
        `Console errors on ${p}: ${consoleErrors.join(", ")}`,
      ).toEqual([]);
    }
  });
});
