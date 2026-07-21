# New Sobat Komputer — Source Code Documentation

Sobat Komputer V2 is a lightweight, high-performance, responsive multi-page static website for **New Sobat Komputer** located in Kejobong, Purbalingga. Built with zero-build requirements using semantic HTML5, clean CSS3 styling, and modern ES6 vanilla JavaScript.

---

## 🛠️ Technology Stack & Architecture

To maintain high load speeds and full compatibility with GitHub Pages (which hosts the production deployment), the project relies on a zero-build pipeline:

*   **Core Structure**: HTML5 Semantic markup (using schema JSON-LD, modern standard viewports).
*   **Typography**: Integrated Google Fonts (`Plus Jakarta Sans`) with `<link rel="preconnect">` for crisp, high-legibility Indonesian business typography with system font fallback.
*   **Styling (CSS)**: Vanilla CSS3 utilizing CSS custom properties (design tokens), layout models (Grid, Flexbox, Clamp), fluid typography, subtle drop shadows, and glassmorphic translucent headers.
*   **Behavior (JavaScript)**: Vanilla ES6 JavaScript for UI components (no jQuery or framework dependencies).
*   **Assets**: Optimized `.webp`, `.png`, and `.ico` image formats to minimize page size and asset requests.

---

## 📁 Repository Structure & Directory Map

```
/
├── index.html                    # Homepage (Beranda)
├── layanan.html                  # Services & SOP detailing (Layanan)
├── produk.html                   # Product catalog (Produk)
├── promo.html                    # Autoplay Carousel & Promotions (Promo)
├── kontak.html                   # Contact, Hours, Map & Multi-WhatsApp CTA (Kontak)
├── LICENSE                       # Project LICENSE
├── .gitignore                    # Git ignore configurations (ignoring developer scripts & heavy binaries)
├── package.json                  # Local package manifest for testing & Playwright QA
├── assets/
│   ├── css/
│   │   └── style.css             # Unified global stylesheet
│   ├── js/
│   │   ├── main.js               # Core interactivity script (Menu, BackToTop)
│   │   ├── core/                 # Core logic modules (WhatsApp URL builder, Normalizers)
│   │   └── public/               # Public page initialization scripts (Hero, Carousel, Products)
│   └── images/                   # Optimized images and brand assets (.webp, .png)
├── tests/                        # Automated unit tests run via Node.js native test runner
└── scratch/                      # Utility scripts for local checks, Playwright QA & screenshots
```

---

## 💻 Source Code Components & Implementation Details

### 1. Static Pages (`.html` files)

All pages are optimized for SEO and accessibility (A11y) using unique heading structures, `alt` tags, local business structural JSON-LD metadata, Google Fonts preconnect, and relative links (allowing them to load correctly on GitHub subdirectories).

*   **[index.html](index.html)**:
    *   **Hero Section**: Employs `<picture>` element with responsive layouts. Mobile uses `new-sobat-komputer-hero-mobile-864x1080.webp`, desktop displays `new-sobat-komputer-hero-desktop-1536x864.webp`.
    *   **Local Business Metadata**: Embedded in the `<head>` using `<script type="application/ld+json">` outlining business coordinates, hours, and contact details.
    *   **A11y Skip-Link**: Anchored at the top of the body `.skip-link` pointing to `#main-content`.
    *   **CTA Box**: Directs customers to official WhatsApp support (`+62 889-8004-2670`).
*   **[layanan.html](layanan.html)**:
    *   **Service Card Grid**: Displays categories (Laptop, PC, Printer, CCTV, iPrime Internet, etc.) styled as responsive cards.
    *   **SOP & Guarantee Flow**: Lists precise diagnostic workflows and clear repair guidelines.
*   **[produk.html](produk.html)**:
    *   **Product Catalog Region**: Dynamically populated product list with direct WhatsApp inquiry URL generation.
*   **[promo.html](promo.html)**:
    *   **Promotional Carousel Container**: Built utilizing a responsive track containing sliding items, interactive indicator dots, and manual control overrides.
*   **[kontak.html](kontak.html)**:
    *   **Interactive Info Cards**: Features SVG icon-enhanced cards for Operating Hours, Address, and Multi-WhatsApp Representatives.
    *   **Interactive Embed**: Incorporates Google Maps iframe using lazy loading (`loading="lazy"`).

---

### 2. Styling System (`assets/css/style.css`)

The CSS codebase is organized into modular layout files and components following a clear semantic sequence:

1.  **Reset & Base**: Modern box-sizing models, smooth scrolling defaults (`scroll-behavior: smooth`), typography parameters, normalize `<address>` italics, and outline behaviors.
2.  **Design Tokens (`:root`)**:
    *   `--bg`: `#fffbf7` (warm cream background)
    *   `--surface`: `#ffffff` (surface color)
    *   `--ink`: `#2e2520` (charcoal text with warm undertone)
    *   `--muted`: `#7a6f67` (soft description text)
    *   `--accent` & `--accent-hover`: `#d97706` / `#b45309` (signature brand amber colors)
    *   `--wa-green`: `#25d366`
    *   `--border`: `#e8e5e1`
    *   `--radius`: `16px`
    *   `--font`: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
    *   `--shadow-sm`, `--shadow-md`, `--shadow-lg`: Smooth drop shadow tokens
3.  **Typography**: Utilizes responsive system fonts (`Plus Jakarta Sans`) and limits line lengths to optimal reading widths (`max-width: 70ch`).
4.  **Layout Systems**: Implements fluid styling variables such as `width: min(100% - 2rem, var(--max-w))` to construct self-adjusting grid container blocks.
5.  **Components**: Houses visual declarations for Headers, Navigation lists, responsive Hamburger toggle button, Footers, Info Cards, and CTA Buttons.

---

### 3. Client-Side Behaviors (`assets/js/main.js`)

Provides client side optimizations. All scripts degrade gracefully in JS-disabled environments.

*   **Mobile Hamburger Menu**:
    *   Listens to clicks on `#menuBtn` to toggle navigation visibility.
    *   Implements accessibility management via `aria-expanded` and `aria-controls` updates.
    *   Closes automatically on hitting the `Escape` key or when clicking local anchor items.
*   **Back-to-Top Button**:
    *   Detects user scrolling height via scroll listener. Shows button when scroll position exceeds `400px`.
    *   Executes smooth vertical scrolling behavior back to `y=0` position.
*   **Accessible Autoplay Carousel**:
    *   Maintains auto-rotating slides with a 5-second interval time.
    *   Pauses on cursor hover, focus-in, and window visibility changes (to conserve browser performance).
    *   Includes manual Touch Swipe tracking (`touchstart` and `touchend`) for smooth mobile swiping.
    *   Detects browser `prefers-reduced-motion` settings to automatically disable auto-playing slide shifts.

---

## 🛠️ Local Development & Tools Execution

### 🚀 Required Tooling
The project requires Node LTS (verified with `v24`) to run tests and verification scripts. Ensure your dependencies are installed first:
```bash
npm ci
```

### 🚀 Running the site locally
Start a simple local development server. Note: GitHub Pages deployment uses `<base href="/sobat-komputer/">` on error pages which may cause 404s when previewing locally unless served from a parent directory.
```bash
npx serve -p 3000
```
Open `http://localhost:3000` in your web browser.

### 🧪 QA & Verification Automation

Run the full aggregate check (HTML validation, image budgets, unit tests, E2E tests, accessibility, responsiveness, visual snapshots):
```bash
npm run check
```

For individual checks:
- **Unit Tests**: `npm test`
- **E2E & Visual Tests**: `npm run test:e2e`
- **Update Visual Snapshots**: `npx playwright test tests/e2e/visual.spec.mjs --update-snapshots`
- **HTML Validation**: `npm run validate:html`
- **Image Budget Validation**: `npm run validate:images`

### 🖼️ Image Workflow (Input/Output & Profiles)

Place high-resolution unoptimized source images in `assets/images/` (e.g. `logo.png`). Then run the optimization script to generate WebP assets based on defined budgets (e.g. hero, promotion, logo):
```bash
node scripts/optimize-images.mjs
```
The optimized files will be generated in `assets/images/brand`, `assets/images/hero`, and `assets/images/promotions`.

#### Product Image Directories & Naming Rules
Product poster placeholders and images are stored in:
- `assets/images/produk_laptop/` (`laptop_1.webp` ... `laptop_15.webp`)
- `assets/images/produk_aksesori/` (`aksesori_1.webp` ... `aksesori_15.webp`)

To generate or update placeholder images, run:
```bash
node scripts/generate-product-placeholders.mjs
```

#### Procedure for Replacing Product Placeholders with Actual Photos
1. Prepare poster image with 4:5 aspect ratio (e.g. 960 × 1200 pixels).
2. Convert image to WebP format.
3. Use the exact same filename (e.g., `laptop_1.webp` or `aksesori_1.webp`).
4. Replace the file in `assets/images/produk_laptop/` or `assets/images/produk_aksesori/` without modifying HTML structure.
5. Update the `alt` text in `produk.html` if the poster content changes.
6. Run image budget validation (`npm run validate:images`).
7. Inspect and verify the page on both desktop and mobile viewports.

### 🌐 GitHub Pages Deployment
Deployment is fully automated. Pushing to `main` triggers the `Quality Gates` workflow (`.github/workflows/quality.yml`). If all tests pass, GitHub Pages automatically deploys the repository to `https://alfa-reza.github.io/sobat-komputer/`. The configuration uses the root directory without any build steps.

## 🔒 Project Rules & Scope boundaries

1.  **Zero-Build Framework Rule**: Do not introduce bundlers (Vite, Webpack), frameworks (React, Astro), or CSS utility engines (TailwindCSS).
2.  **No Unverified Data**: Do not hardcode reviews, Google ratings, or visitor counters unless officially supplied.
3.  **No Direct Pricing**: Service pricing or product details should not be displayed in the markup.
4.  **No-JS Baseline**: Ensure primary navigation links and key service layouts remain fully functional when JavaScript is disabled in client browsers.
5.  **Official WhatsApp Numbers**:
    *   Primary CTA / Hub 1: `6285742744594`
    *   Contact Hub 2: `6285185062811`
    *   Direct CTA / Support Hub 3: `6288980042670`
    *   Official Catalog: `https://wa.me/c/6288980042670`
