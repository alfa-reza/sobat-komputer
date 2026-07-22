import fs from "fs";
import path from "path";
import sharp from "sharp";

const outputDir = path.join(process.cwd(), "assets", "images", "layanan");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Color palette
const BG_COLOR = "#faf7f2";
const CARD_BG = "#ffffff";
const AMBER = "#d97706";
const AMBER_LIGHT = "#fef3c7";
const CHARCOAL = "#2e2520";
const NAVY = "#1e3a8a";
const MUTED = "#7a6f67";
const BORDER = "#e8e5e1";

function createSvgWrapper(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
    <rect width="1200" height="1200" fill="${BG_COLOR}" />
    <!-- Background Card Frame -->
    <rect x="80" y="80" width="1040" height="1040" rx="40" fill="${CARD_BG}" stroke="${BORDER}" stroke-width="4" />
    <g transform="translate(100, 100)">
      ${content}
    </g>
  </svg>`;
}

// 1. Placeholder Servis Laptop & PC
const svgLaptopPc = createSvgWrapper(`
  <!-- Desk surface -->
  <rect x="100" y="780" width="800" height="16" rx="8" fill="${BORDER}" />
  
  <!-- Laptop -->
  <rect x="160" y="440" width="340" height="240" rx="16" fill="${CHARCOAL}" />
  <rect x="180" y="460" width="300" height="200" rx="8" fill="${AMBER_LIGHT}" />
  <!-- Laptop Screen Code/Diagnostic graphics -->
  <rect x="210" y="490" width="120" height="16" rx="4" fill="${AMBER}" />
  <rect x="210" y="520" width="220" height="12" rx="4" fill="${MUTED}" />
  <rect x="210" y="545" width="180" height="12" rx="4" fill="${MUTED}" />
  <path d="M 370 580 L 410 615 L 470 550" fill="none" stroke="${AMBER}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Laptop Base -->
  <path d="M 120 680 L 540 680 L 520 710 L 140 710 Z" fill="${NAVY}" />
  <rect x="280" y="690" width="100" height="12" rx="6" fill="${CARD_BG}" opacity="0.6" />

  <!-- Desktop PC Tower -->
  <rect x="580" y="320" width="240" height="440" rx="20" fill="${NAVY}" />
  <rect x="610" y="360" width="180" height="24" rx="6" fill="${AMBER}" />
  <circle cx="700" cy="440" r="28" fill="${AMBER_LIGHT}" />
  <circle cx="700" cy="440" r="14" fill="${AMBER}" />
  <!-- Ventilation Slots -->
  <line x1="620" y1="530" x2="780" y2="530" stroke="${CARD_BG}" stroke-width="8" stroke-linecap="round" opacity="0.4" />
  <line x1="620" y1="560" x2="780" y2="560" stroke="${CARD_BG}" stroke-width="8" stroke-linecap="round" opacity="0.4" />
  <line x1="620" y1="590" x2="780" y2="590" stroke="${CARD_BG}" stroke-width="8" stroke-linecap="round" opacity="0.4" />
  
  <!-- Screwdriver Tool -->
  <g transform="translate(480, 240) rotate(35)">
    <rect x="-16" y="0" width="32" height="140" rx="8" fill="${AMBER}" />
    <rect x="-6" y="140" width="12" height="100" rx="2" fill="${MUTED}" />
  </g>
`);

// 2. Placeholder Servis Printer
const svgPrinter = createSvgWrapper(`
  <!-- Desk surface -->
  <rect x="100" y="780" width="800" height="16" rx="8" fill="${BORDER}" />

  <!-- Paper Feed Top -->
  <rect x="360" y="240" width="280" height="220" rx="12" fill="${AMBER_LIGHT}" stroke="${BORDER}" stroke-width="4" />
  <line x1="400" y1="290" x2="600" y2="290" stroke="${AMBER}" stroke-width="8" stroke-linecap="round" />
  <line x1="400" y1="330" x2="560" y2="330" stroke="${MUTED}" stroke-width="6" stroke-linecap="round" />

  <!-- Main Printer Body -->
  <rect x="220" y="420" width="560" height="280" rx="24" fill="${CHARCOAL}" />
  <!-- Control Panel -->
  <rect x="620" y="460" width="120" height="60" rx="10" fill="${NAVY}" />
  <circle cx="650" cy="490" r="12" fill="${AMBER}" />
  <circle cx="690" cy="490" r="8" fill="${CARD_BG}" />

  <!-- Paper Output Tray -->
  <path d="M 300 640 L 700 640 L 680 760 L 320 760 Z" fill="${CARD_BG}" stroke="${BORDER}" stroke-width="4" />
  <!-- Printed Document -->
  <rect x="340" y="600" width="320" height="140" rx="8" fill="#ffffff" stroke="${BORDER}" stroke-width="2" />
  <line x1="380" y1="640" x2="620" y2="640" stroke="${NAVY}" stroke-width="8" stroke-linecap="round" />
  <line x1="380" y1="675" x2="580" y2="675" stroke="${MUTED}" stroke-width="6" stroke-linecap="round" />

  <!-- Ink Drops Accent (CMYK) -->
  <circle cx="280" cy="480" r="14" fill="#00ffff" />
  <circle cx="320" cy="480" r="14" fill="#ff00ff" />
  <circle cx="360" cy="480" r="14" fill="#ffff00" />
  <circle cx="400" cy="480" r="14" fill="${CHARCOAL}" stroke="#ffffff" stroke-width="2" />
`);

// 3. Placeholder Jual Beli Laptop & PC
const svgJualBeli = createSvgWrapper(`
  <!-- Showcase Stand -->
  <rect x="120" y="720" width="760" height="40" rx="12" fill="${BORDER}" />

  <!-- Laptop on Display -->
  <rect x="180" y="420" width="300" height="200" rx="14" fill="${NAVY}" />
  <rect x="200" y="440" width="260" height="160" rx="6" fill="${AMBER_LIGHT}" />
  <!-- Screen content icon -->
  <circle cx="330" cy="500" r="30" fill="${AMBER}" />
  <polygon points="325,485 345,500 325,515" fill="${CARD_BG}" />
  <path d="M 150 620 L 510 620 L 490 650 L 170 650 Z" fill="${CHARCOAL}" />

  <!-- Desktop Monitor on Display -->
  <rect x="530" y="320" width="320" height="220" rx="14" fill="${CHARCOAL}" />
  <rect x="550" y="340" width="280" height="180" rx="6" fill="${CARD_BG}" stroke="${BORDER}" stroke-width="2" />
  <path d="M 610 390 L 770 390 L 690 490 Z" fill="${AMBER_LIGHT}" opacity="0.7" />
  <rect x="675" y="540" width="30" height="80" fill="${NAVY}" />
  <rect x="630" y="615" width="120" height="15" rx="6" fill="${NAVY}" />

  <!-- Exchange Sync Badge -->
  <circle cx="500" cy="330" r="60" fill="${AMBER}" stroke="${CARD_BG}" stroke-width="8" />
  <path d="M 475 330 L 525 330 M 510 315 L 525 330 L 510 345 M 525 330 M 475 330 M 490 315 L 475 330 L 490 345" fill="none" stroke="${CARD_BG}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
`);

// 4. Placeholder Aksesori Komputer
const svgAksesori = createSvgWrapper(`
  <!-- Keyboard -->
  <rect x="140" y="460" width="460" height="200" rx="16" fill="${CHARCOAL}" />
  <rect x="170" y="490" width="50" height="40" rx="6" fill="${NAVY}" />
  <rect x="235" y="490" width="50" height="40" rx="6" fill="${NAVY}" />
  <rect x="300" y="490" width="50" height="40" rx="6" fill="${NAVY}" />
  <rect x="365" y="490" width="50" height="40" rx="6" fill="${NAVY}" />
  <rect x="430" y="490" width="50" height="40" rx="6" fill="${AMBER}" />
  <rect x="495" y="490" width="75" height="40" rx="6" fill="${NAVY}" />

  <rect x="170" y="545" width="60" height="40" rx="6" fill="${NAVY}" />
  <rect x="245" y="545" width="230" height="40" rx="6" fill="${CARD_BG}" />
  <rect x="490" y="545" width="80" height="40" rx="6" fill="${NAVY}" />

  <!-- Mouse -->
  <rect x="660" y="440" width="160" height="240" rx="80" fill="${NAVY}" />
  <line x1="740" y1="440" x2="740" y2="540" stroke="${CARD_BG}" stroke-width="4" />
  <rect x="730" y="470" width="20" height="40" rx="10" fill="${AMBER}" />

  <!-- Headset -->
  <path d="M 280 340 A 180 180 0 0 1 680 340" fill="none" stroke="${CHARCOAL}" stroke-width="28" stroke-linecap="round" />
  <rect x="240" y="300" width="60" height="100" rx="20" fill="${AMBER}" />
  <rect x="660" y="300" width="60" height="100" rx="20" fill="${AMBER}" />

  <!-- Flashdrive -->
  <rect x="360" y="710" width="140" height="70" rx="12" fill="${AMBER}" />
  <rect x="500" y="725" width="50" height="40" rx="4" fill="${MUTED}" />
`);

// 5. Placeholder Pemasangan CCTV
const svgCctv = createSvgWrapper(`
  <!-- House Outline -->
  <path d="M 200 600 L 500 320 L 800 600 L 800 820 L 200 820 Z" fill="none" stroke="${BORDER}" stroke-width="12" stroke-linejoin="round" />

  <!-- Bullet CCTV Camera -->
  <g transform="translate(320, 360)">
    <rect x="-20" y="-20" width="40" height="100" fill="${CHARCOAL}" />
    <path d="M 10 30 L 140 -10 L 160 70 L 10 60 Z" fill="${NAVY}" />
    <circle cx="150" cy="30" r="45" fill="${AMBER}" />
    <circle cx="150" cy="30" r="25" fill="${CHARCOAL}" />
    <circle cx="150" cy="30" r="10" fill="${CARD_BG}" />
  </g>

  <!-- Dome CCTV Camera -->
  <g transform="translate(680, 420)">
    <rect x="-80" y="-30" width="160" height="30" rx="6" fill="${CHARCOAL}" />
    <path d="M -70 0 A 70 70 0 0 0 70 0 Z" fill="${NAVY}" />
    <circle cx="0" cy="25" r="35" fill="${AMBER}" />
    <circle cx="0" cy="25" r="18" fill="${CHARCOAL}" />
  </g>

  <!-- Signal / Surveillance Waves -->
  <path d="M 480 440 A 80 80 0 0 1 560 520" fill="none" stroke="${AMBER}" stroke-width="8" stroke-linecap="round" stroke-dasharray="12 12" />
  <path d="M 460 410 A 120 120 0 0 1 580 530" fill="none" stroke="${AMBER}" stroke-width="8" stroke-linecap="round" stroke-dasharray="12 12" />
`);

// 6. Placeholder Internet Fiber Rumah (iPrime)
const svgInternet = createSvgWrapper(`
  <!-- House Silhouette -->
  <path d="M 450 780 L 450 620 L 600 500 L 750 620 L 750 780 Z" fill="${BORDER}" opacity="0.6" />

  <!-- Wi-Fi Router Base -->
  <rect x="220" y="580" width="440" height="140" rx="24" fill="${NAVY}" />
  <!-- Router LED Lights -->
  <circle cx="280" cy="650" r="10" fill="${AMBER}" />
  <circle cx="330" cy="650" r="10" fill="${AMBER}" />
  <circle cx="380" cy="650" r="10" fill="${AMBER}" />
  <circle cx="430" cy="650" r="10" fill="${CARD_BG}" />

  <!-- Dual Antennas -->
  <rect x="280" y="340" width="24" height="250" rx="12" fill="${CHARCOAL}" />
  <rect x="570" y="340" width="24" height="250" rx="12" fill="${CHARCOAL}" />

  <!-- Fiber Cable Connector -->
  <path d="M 120 740 Q 220 740 260 700" fill="none" stroke="${AMBER}" stroke-width="14" stroke-linecap="round" />

  <!-- Wi-Fi Signal Waves -->
  <path d="M 340 300 A 120 120 0 0 1 540 300" fill="none" stroke="${AMBER}" stroke-width="12" stroke-linecap="round" />
  <path d="M 370 340 A 80 80 0 0 1 510 340" fill="none" stroke="${AMBER}" stroke-width="10" stroke-linecap="round" />
  <circle cx="440" cy="380" r="12" fill="${AMBER}" />
`);

const categories = [
  { name: "placeholder-servis-laptop-pc.webp", svg: svgLaptopPc },
  { name: "placeholder-servis-printer.webp", svg: svgPrinter },
  { name: "placeholder-jual-beli-laptop-pc.webp", svg: svgJualBeli },
  { name: "placeholder-aksesori-komputer.webp", svg: svgAksesori },
  { name: "placeholder-pemasangan-cctv.webp", svg: svgCctv },
  { name: "placeholder-internet-fiber-rumah-iprime.webp", svg: svgInternet },
];

async function generate() {
  for (const cat of categories) {
    const filePath = path.join(outputDir, cat.name);
    const buffer = Buffer.from(cat.svg);
    await sharp(buffer)
      .resize(800, 800, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(filePath);

    const stats = fs.statSync(filePath);
    console.log(`Generated ${cat.name}: ${stats.size} bytes (800x800 WebP)`);
  }
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
