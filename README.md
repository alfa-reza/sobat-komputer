# New Sobat Komputer — Source Code Documentation

Sobat Komputer V2 is a lightweight, high-performance, responsive multi-page static website for **New Sobat Komputer** located in Kejobong, Purbalingga. Built with zero-build requirements using semantic HTML5, clean CSS3 styling, and modern ES6 vanilla JavaScript.

---

## 🛠️ Technology Stack & Architecture

To maintain high load speeds and full compatibility with GitHub Pages (which hosts the production deployment), the project relies on a zero-build pipeline:

*   **Core Structure**: HTML5 Semantic markup (using schema JSON-LD, modern standard viewports).
*   **Styling (CSS)**: Vanilla CSS3 utilizing CSS custom properties (design tokens), layout models (Grid, Flexbox, Clamp), and fluid typography.
*   **Behavior (JavaScript)**: Vanilla ES6 JavaScript for UI components (no jQuery or framework dependencies).
*   **Assets**: Optimized `.webp` and `.ico` image formats to minimize page size and asset requests.

---

## 📁 Repository Structure & Directory Map

```
/
├── index.html                    # Homepage (Beranda)
├── layanan.html                  # Services & SOP detailing (Layanan)
├── promo.html                    # Autoplay Carousel & Promotions (Promo)
├── kontak.html                   # Contact, Hours, Map & Multi-WhatsApp CTA (Kontak)
├── LICENSE                       # Project LICENSE (GPL or MIT style)
├── .gitignore                    # Git ignore configurations (ignoring developer scripts/heavy binaries)
├── assets/
│   ├── css/
│   │   └── style.css             # Unified global stylesheet
│   ├── js/
│   │   └── main.js               # Core interactivity script (Menu, BackToTop, Carousel)
│   └── images/                   # Optimized images and brand assets (.webp, .png)
├── scratch/                      # Utility scripts for local checks and visual regression QA (ignored)
└── .opencode/                    # Planning artifacts, design documents, and mockup layouts (ignored)
```

---

## 💻 Source Code Components & Implementation Details

### 1. Static Pages (`.html` files)

All pages are optimized for SEO and accessibility (A11y) using unique heading structures, `alt` tags, local business structural JSON-LD metadata, and relative links (allowing them to load correctly on GitHub subdirectories).

*   **[index.html](file:///home/alfareza/Project/sobat-komputer/index.html)**:
    *   **Hero Section**: Employs `<picture>` element with responsive layouts. Mobile uses `new-sobat-komputer-hero-mobile-864x1080.webp`, desktop displays `new-sobat-komputer-hero-desktop-1536x864.webp`.
    *   **Local Business Metadata**: Embedded in the `<head>` using `<script type="application/ld+json">` outlining business coordinates, hours, and contact details.
    *   **A11y Skip-Link**: Anchored at the top of the body `.skip-link` pointing to `#main-content`.
*   **[layanan.html](file:///home/alfareza/Project/sobat-komputer/layanan.html)**:
    *   **Service Card Grid**: Displays categories (Laptop, PC, Printer, CCTV, iPrime Internet, etc.) styled as responsive cards.
    *   **SOP & Guarantee Flow**: Lists precise diagnostic workflows and clear repair guidelines.
*   **[promo.html](file:///home/alfareza/Project/sobat-komputer/promo.html)**:
    *   **Promotional Carousel Container**: Built utilizing a responsive track containing sliding items, interactive indicator dots, and manual control overrides.
*   **[kontak.html](file:///home/alfareza/Project/sobat-komputer/kontak.html)**:
    *   **Interactive Embed**: Incorporates Google Maps iframe using lazy loading (`loading="lazy"`).
    *   **Triple Contact Points**: Custom grids pointing to three distinct official support representatives.

---

### 2. Styling System (`assets/css/style.css`)

The CSS codebase is organized into modular layout files and components following a clear semantic sequence:

1.  **Reset & Base**: Modern box-sizing models, smooth scrolling defaults (`scroll-behavior: smooth`), typography parameters, and outline behaviors.
2.  **Design Tokens (`:root`)**:
    *   `--bg`: `#fffbf7` (warm cream background)
    *   `--surface`: `#ffffff`
    *   `--ink`: `#2e2520` (charcoal theme text)
    *   `--muted`: `#7a6f67` (soft description text)
    *   `--accent` & `--accent-hover`: `#d97706` / `#b45309` (signature brand amber colors)
    *   `--wa-green`: `#25d366`
    *   `--border`: `#e8e5e1`
    *   `--radius`: `16px`
3.  **Typography**: Utilizes responsive system fonts (`system-ui`) and limits line lengths to optimal reading widths (`max-width: 70ch`).
4.  **Layout Systems**: Implements fluid styling variables such as `width: min(100% - 2rem, var(--max-w))` to construct self-adjusting grid container blocks.
5.  **Components**: Houses visual declarations for Headers, Navigation lists, responsive Hamburger toggle button, Footers, and CTA Buttons.

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

### 🚀 Running the site locally
Start a simple Python local server inside the repository root directory:
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### 🧪 QA & Verification Automation
Inside the `/scratch/` directory, utility scripts help to validate the codebase before committing.

#### 1. Link Check & Integrity Validator
Scans all `.html` pages to detect missing local assets, broken paths, or invalid target page IDs.
```bash
node scratch/validate_links.js
```

#### 2. Formatting Check (Whitespace validator)
Scans files for trailing whitespace:
```bash
git diff --check
```
To strip trailing whitespaces programmatically:
```bash
node scratch/cleanup_whitespaces.js
```

#### 3. Capture screenshots locally
Launches a server and takes high-resolution viewports screenshots:
```bash
# Install Puppeteer and local dependencies
cd scratch && npm install && cd ..

# Capture responsive layout screenshots
node scratch/take_after_screenshots.js
```

---

## 🔒 Project Rules & Scope boundaries

1.  **Zero-Build Framework Rule**: Do not introduce bundlers (Vite, Webpack), frameworks (React, Astro), or CSS utility engines (TailwindCSS).
2.  **No Unverified Data**: Do not hardcode reviews, Google ratings, or visitor counters unless officially supplied.
3.  **No Direct Pricing**: Service pricing or product details should not be displayed in the markup.
4.  **No-JS Baseline**: Ensure primary navigation links and key service layouts remain fully functional when JavaScript is disabled in client browsers.
5.  **Official WhatsApp Numbers**:
    *   Primary CTA: `6285742744594`
    *   Contact Hub 1: `6285742744594`
    *   Contact Hub 2: `6285185062811`
    *   Contact Hub 3: `6288980042670`
    *   Official Catalog: `https://wa.me/c/6288980042670`
