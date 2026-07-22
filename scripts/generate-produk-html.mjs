import fs from "fs";
import path from "path";

function renderSlides(type, nounLower, labelPrefix, pathPrefix, filePrefix) {
  let html = "";
  for (let i = 1; i <= 15; i++) {
    const isFirst = i === 1;
    const hiddenAttr = isFirst
      ? 'aria-hidden="false"'
      : 'aria-hidden="true" inert';
    const loadingAttr =
      isFirst && type === "laptop" ? 'loading="eager"' : 'loading="lazy"';
    const waLabel =
      type === "laptop"
        ? "Buka katalog WhatsApp resmi untuk melihat produk laptop"
        : "Buka katalog WhatsApp resmi untuk melihat aksesori komputer";
    const altText =
      type === "laptop"
        ? `Poster produk laptop ${i} New Sobat Komputer`
        : `Poster aksesori komputer ${i} New Sobat Komputer`;

    html += `                <div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="${labelPrefix} ${i} dari 15" ${hiddenAttr}>
                  <div class="product-photo-wrapper">
                    <a class="product-photo-action" href="https://wa.me/c/6288980042670" target="_blank" rel="noopener noreferrer" aria-label="${waLabel}">
                      <img src="assets/images/${pathPrefix}/${filePrefix}_${i}.webp" alt="${altText}" width="960" height="1200" ${loadingAttr} decoding="async" class="product-photo">
                    </a>
                  </div>
                </div>\n`;
  }
  return html.trimEnd();
}

const laptopSlides = renderSlides(
  "laptop",
  "produk laptop",
  "Produk laptop",
  "produk_laptop",
  "laptop",
);
const aksesoriSlides = renderSlides(
  "aksesori",
  "aksesori komputer",
  "Aksesori komputer",
  "produk_aksesori",
  "aksesori",
);

const fullHtml = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Produk | New Sobat Komputer</title>
  <meta name="description" content="Lihat pilihan produk laptop dan aksesori komputer dari New Sobat Komputer. Tanya ketersediaan produk lewat WhatsApp atau buka katalog resmi.">
  <link rel="icon" type="image/x-icon" href="assets/images/brand/favicon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/style.css">
  <script defer src="assets/js/main.js"></script>
</head>
<body class="product-page">
  <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

  <!-- Header -->
  <header class="header">
    <div class="wrap">
      <a href="index.html" class="header-brand" aria-label="Kembali ke beranda">
        <img src="assets/images/brand/logo.webp" alt="Logo New Sobat Komputer" width="36" height="36">
        New Sobat Komputer
      </a>
      <button type="button" class="menu-btn" id="menuBtn" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="navList">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-list" id="navList">
        <li><a href="index.html">Beranda</a></li>
        <li><a href="layanan.html">Layanan</a></li>
        <li><a href="produk.html" aria-current="page" class="active">Produk</a></li>
        <li><a href="promo.html">Promo</a></li>
        <li><a href="kontak.html">Kontak</a></li>
      </ul>
      <a href="https://wa.me/6285742744594?text=Halo%20New%20Sobat%20Komputer%2C%20saya%20mendapatkan%20informasi%20dari%20website." class="btn btn-wa btn-header-wa" target="_blank" rel="noopener noreferrer">
        Chat WhatsApp
      </a>
    </div>
  </header>

  <!-- Page Hero -->
  <section class="page-hero">
    <div class="wrap">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="index.html">Beranda</a> &middot; <span>Produk</span>
      </nav>
      <h1>Produk</h1>
      <p>Lihat pilihan produk laptop dan aksesori komputer. Untuk stok dan informasi lebih lanjut, hubungi kami melalui WhatsApp atau buka katalog resmi.</p>
    </div>
  </section>

  <!-- Navigasi Kategori Produk -->
  <nav class="product-category-nav wrap" aria-label="Navigasi Kategori Produk">
    <a href="#produk-laptop" class="category-pill">Produk Laptop</a>
    <a href="#produk-aksesori" class="category-pill">Aksesori Komputer</a>
  </nav>

  <main id="main-content">
    <!-- Produk Laptop -->
    <section id="produk-laptop" class="section section-alt product-category-section">
      <div class="wrap">
        <h2 class="section-title product-category-title">Produk Laptop</h2>
        
        <div class="product-carousel-container">
          <div class="carousel product-carousel" data-carousel="product-laptop" data-product-carousel data-carousel-noun="Produk laptop" data-carousel-autoplay="false" role="group" aria-roledescription="carousel" aria-label="Produk Laptop">
            <div class="carousel-viewport">
              <button type="button" class="carousel-btn prev" aria-label="Produk laptop sebelumnya">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button type="button" class="carousel-btn next" aria-label="Produk laptop berikutnya">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div class="carousel-track">
${laptopSlides}
              </div>
            </div>

            <div class="carousel-footer">
              <button type="button" class="carousel-icon-btn play-pause" aria-label="Jeda carousel" aria-pressed="false">
                <svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="4" x2="18" y2="20"/><line x1="6" y1="4" x2="6" y2="20"/></svg>
                <svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <div class="carousel-indicators"></div>
              <div class="carousel-status" aria-live="off" aria-atomic="true">1 / 15</div>
            </div>
          </div>
        </div>

        <div class="product-actions product-category-action">
          <a class="btn btn-wa btn-block" href="https://wa.me/6288980042670?text=Halo%20New%20Sobat%20Komputer%2C%20saya%20ingin%20menanyakan%20produk%20laptop." target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Tanya Produk Laptop
          </a>
        </div>
      </div>
    </section>

    <!-- Aksesori Komputer -->
    <section id="produk-aksesori" class="section product-category-section">
      <div class="wrap">
        <h2 class="section-title product-category-title">Aksesori Komputer</h2>

        <div class="product-carousel-container">
          <div class="carousel product-carousel" data-carousel="product-aksesori" data-product-carousel data-carousel-noun="Aksesori komputer" data-carousel-autoplay="false" role="group" aria-roledescription="carousel" aria-label="Aksesori Komputer">
            <div class="carousel-viewport">
              <button type="button" class="carousel-btn prev" aria-label="Aksesori komputer sebelumnya">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button type="button" class="carousel-btn next" aria-label="Aksesori komputer berikutnya">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div class="carousel-track">
${aksesoriSlides}
              </div>
            </div>

            <div class="carousel-footer">
              <button type="button" class="carousel-icon-btn play-pause" aria-label="Jeda carousel" aria-pressed="false">
                <svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="4" x2="18" y2="20"/><line x1="6" y1="4" x2="6" y2="20"/></svg>
                <svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <div class="carousel-indicators"></div>
              <div class="carousel-status" aria-live="off" aria-atomic="true">1 / 15</div>
            </div>
          </div>
        </div>

        <div class="product-actions product-category-action">
          <a class="btn btn-wa btn-block" href="https://wa.me/6288980042670?text=Halo%20New%20Sobat%20Komputer%2C%20saya%20ingin%20menanyakan%20aksesori%20komputer." target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Tanya Produk Aksesori
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Umum -->
    <section class="section section-alt">
      <div class="wrap">
        <div class="cta-box product-final-cta-card">
          <h2>Butuh Informasi Produk?</h2>
          <p>Tanyakan stok, kondisi, dan informasi produk melalui WhatsApp atau buka katalog resmi kami.</p>
          <div class="product-final-cta-actions">
            <a class="btn btn-wa product-final-cta-button" href="https://wa.me/6288980042670?text=Halo%20New%20Sobat%20Komputer%2C%20saya%20ingin%20menanyakan%20produk%20yang%20tersedia." target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Tanya melalui WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <p><strong>New Sobat Komputer</strong></p>
          <p class="mt-1">Jalan Raya Kejobong, sebelah barat Puskesmas Kejobong, Purbalingga</p>
          <p class="mt-1">Senin &ndash; Sabtu | 08.00 &ndash; 16.00 WIB</p>
        </div>
        <div class="footer-links-col">
          <p><strong>Menu</strong></p>
          <ul class="mt-2">
            <li><a href="index.html">Beranda</a></li>
            <li><a href="layanan.html">Layanan</a></li>
            <li><a href="produk.html">Produk</a></li>
            <li><a href="promo.html">Promo</a></li>
            <li><a href="kontak.html">Kontak</a></li>
          </ul>
        </div>
      </div>
      <p class="footer-copy">&copy; 2026 New Sobat Komputer</p>
    </div>
  </footer>

  <a href="https://wa.me/6285742744594?text=Halo%20New%20Sobat%20Komputer%2C%20saya%20mendapatkan%20informasi%20dari%20website." class="floating-wa" aria-label="Chat WhatsApp">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  </a>

  <button type="button" class="back-top" id="backTop" aria-label="Kembali ke atas">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
  </button>

  <script type="module">
    import { initCarousel } from './assets/js/public/carousel.mjs';

    document.querySelectorAll('[data-product-carousel]').forEach((carousel) => {
      initCarousel(carousel);
    });
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(process.cwd(), "produk.html"), fullHtml);
console.log("Successfully generated produk.html");
