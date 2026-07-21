import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const outputBase = path.join(process.cwd(), 'assets', 'images');
const laptopDir = path.join(outputBase, 'produk_laptop');
const aksesoriDir = path.join(outputBase, 'produk_aksesori');

fs.mkdirSync(laptopDir, { recursive: true });
fs.mkdirSync(aksesoriDir, { recursive: true });

function createSvg({ categoryTitle, iconSvg, subtitle, brandText }) {
  return `<svg width="960" height="1200" viewBox="0 0 960 1200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbf7"/>
      <stop offset="100%" stop-color="#f3ede4"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="960" height="1200" fill="url(#bgGrad)"/>
  
  <!-- Outer Card Frame -->
  <rect x="40" y="40" width="880" height="1120" rx="32" fill="#ffffff" stroke="#e8e5e1" stroke-width="4"/>
  
  <!-- Top Accent Bar -->
  <rect x="40" y="40" width="880" height="16" rx="8" fill="url(#accentGrad)"/>

  <!-- Icon Container Circle -->
  <circle cx="480" cy="460" r="140" fill="#fff7ed" stroke="#fde68a" stroke-width="6"/>
  
  <!-- Icon -->
  <g transform="translate(400, 380) scale(3.333)">
    ${iconSvg}
  </g>

  <!-- Title Text -->
  <text x="480" y="700" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="800" font-size="52" fill="#1c1917" letter-spacing="1">
    ${categoryTitle}
  </text>

  <!-- Subtitle Text -->
  <text x="480" y="770" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="500" font-size="32" fill="#7a6f67">
    ${subtitle}
  </text>

  <!-- Brand Badge Divider -->
  <line x1="280" y1="840" x2="680" y2="840" stroke="#e8e5e1" stroke-width="2" stroke-dasharray="8 8"/>

  <!-- Brand Text -->
  <text x="480" y="910" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="700" font-size="34" fill="#d97706">
    ${brandText}
  </text>

  <!-- Footer Tag -->
  <rect x="330" y="960" width="300" height="48" rx="24" fill="#fff7ed" stroke="#fde68a" stroke-width="2"/>
  <text x="480" y="992" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-weight="600" font-size="22" fill="#b45309">
    Kejobong, Purbalingga
  </text>
</svg>`;
}

const laptopIcon = `<path d="M20 16V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12m16 0H4m16 0a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

const aksesoriIcon = `<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="3" y1="6" x2="21" y2="6" stroke="#d97706" stroke-width="2"/><path d="M16 10a4 4 0 0 1-8 0" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;

async function generate() {
  const laptopSvg = createSvg({
    categoryTitle: 'PRODUK LAPTOP',
    subtitle: 'Gambar produk akan diperbarui',
    brandText: 'New Sobat Komputer',
    iconSvg: laptopIcon
  });

  const aksesoriSvg = createSvg({
    categoryTitle: 'AKSESORI KOMPUTER',
    subtitle: 'Gambar produk akan diperbarui',
    brandText: 'New Sobat Komputer',
    iconSvg: aksesoriIcon
  });

  const laptopBuffer = await sharp(Buffer.from(laptopSvg))
    .webp({ quality: 80 })
    .toBuffer();

  const aksesoriBuffer = await sharp(Buffer.from(aksesoriSvg))
    .webp({ quality: 80 })
    .toBuffer();

  console.log(`Generated laptop placeholder buffer: ${laptopBuffer.length} bytes`);
  console.log(`Generated aksesori placeholder buffer: ${aksesoriBuffer.length} bytes`);

  for (let i = 1; i <= 15; i++) {
    const laptopPath = path.join(laptopDir, `laptop_${i}.webp`);
    fs.writeFileSync(laptopPath, laptopBuffer);
    console.log(`Wrote ${laptopPath}`);

    const aksesoriPath = path.join(aksesoriDir, `aksesori_${i}.webp`);
    fs.writeFileSync(aksesoriPath, aksesoriBuffer);
    console.log(`Wrote ${aksesoriPath}`);
  }
}

generate().catch(console.error);
