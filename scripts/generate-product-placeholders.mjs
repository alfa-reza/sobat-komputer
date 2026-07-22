import fs from "fs";
import path from "path";
import sharp from "sharp";

const laptopSvg = `
<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="screenGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>
    <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1080" height="1350" fill="#f8fafc"/>
  <circle cx="540" cy="540" r="420" fill="url(#bgGlow)"/>

  <!-- Border Frame -->
  <rect x="24" y="24" width="1032" height="1302" rx="24" fill="none" stroke="#e2e8f0" stroke-width="4"/>

  <!-- Top Brand Tag -->
  <g transform="translate(0, 110)">
    <rect x="360" y="0" width="360" height="48" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadow)"/>
    <text x="540" y="31" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#d97706" text-anchor="middle" letter-spacing="2">NEW SOBAT KOMPUTER</text>
  </g>

  <!-- Laptop Illustration -->
  <g filter="url(#softShadow)">
    <!-- Screen Lid Outer -->
    <rect x="260" y="280" width="560" height="370" rx="20" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <!-- Screen Bezel -->
    <rect x="278" y="298" width="524" height="334" rx="12" fill="#0f172a"/>
    <!-- Display Area -->
    <rect x="290" y="310" width="500" height="310" rx="8" fill="url(#screenGlow)"/>
    
    <!-- Screen Content: Code / Tech Lines -->
    <rect x="330" y="350" width="220" height="14" rx="7" fill="#3b82f6" opacity="0.8"/>
    <rect x="330" y="380" width="160" height="10" rx="5" fill="#60a5fa" opacity="0.6"/>
    <rect x="330" y="405" width="280" height="10" rx="5" fill="#93c5fd" opacity="0.5"/>
    <rect x="330" y="430" width="120" height="10" rx="5" fill="#3b82f6" opacity="0.7"/>

    <!-- Screen Accent Circle & Graphic -->
    <circle cx="680" cy="450" r="65" fill="#2563eb" opacity="0.25"/>
    <circle cx="680" cy="450" r="45" fill="#3b82f6" opacity="0.35"/>
    <path d="M 660 450 L 675 465 L 705 435" fill="none" stroke="#60a5fa" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- Camera & Indicator -->
    <circle cx="540" cy="289" r="4" fill="#64748b"/>
    <circle cx="554" cy="289" r="2" fill="#22c55e"/>

    <!-- Laptop Hinge & Base -->
    <path d="M 210 655 L 870 655 L 890 690 C 890 700 880 708 865 708 L 215 708 C 200 708 190 700 190 690 Z" fill="#94a3b8"/>
    <path d="M 190 655 L 890 655 L 900 682 C 900 690 890 694 875 694 L 205 694 C 190 694 180 690 180 682 Z" fill="#cbd5e1"/>

    <!-- Keyboard Surface & Trackpad Notch -->
    <rect x="470" y="658" width="140" height="8" rx="4" fill="#64748b"/>
    <rect x="480" y="694" width="120" height="4" rx="2" fill="#94a3b8"/>
  </g>

  <!-- Laptop Base Floor Shadow -->
  <ellipse cx="540" cy="725" rx="380" ry="20" fill="#0f172a" opacity="0.1"/>

  <!-- Text & Info Section -->
  <g transform="translate(0, 830)">
    <!-- Title -->
    <text x="540" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="2">PRODUK LAPTOP</text>
    <!-- Amber Divider Line -->
    <rect x="470" y="65" width="140" height="6" rx="3" fill="#d97706"/>
    <!-- Subtitle -->
    <text x="540" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="#64748b" text-anchor="middle">Foto produk akan segera diperbarui</text>
    
    <!-- WhatsApp Catalog Callout Badge -->
    <g transform="translate(320, 175)">
      <rect x="0" y="0" width="440" height="56" rx="28" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
      <text x="220" y="35" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#c2410c" text-anchor="middle">⚡ Tekan Poster untuk Katalog WA</text>
    </g>
  </g>
</svg>
`;

const accessoriesSvg = `
<svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlowAcc" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#f8fafc" stop-opacity="0"/>
    </radialGradient>
    <filter id="softShadowAcc" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0f172a" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Canvas Background -->
  <rect width="1080" height="1350" fill="#f8fafc"/>
  <circle cx="540" cy="540" r="420" fill="url(#bgGlowAcc)"/>

  <!-- Border Frame -->
  <rect x="24" y="24" width="1032" height="1302" rx="24" fill="none" stroke="#e2e8f0" stroke-width="4"/>

  <!-- Top Brand Tag -->
  <g transform="translate(0, 110)">
    <rect x="360" y="0" width="360" height="48" rx="24" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" filter="url(#softShadowAcc)"/>
    <text x="540" y="31" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="#d97706" text-anchor="middle" letter-spacing="2">NEW SOBAT KOMPUTER</text>
  </g>

  <!-- Accessories Group Illustration -->
  <g filter="url(#softShadowAcc)">
    <!-- 1. Headset Arc (Top Center) -->
    <path d="M 380 430 A 160 160 0 0 1 700 430" fill="none" stroke="#1e293b" stroke-width="22" stroke-linecap="round"/>
    <path d="M 430 330 A 120 120 0 0 1 650 330" fill="none" stroke="#d97706" stroke-width="8" stroke-linecap="round"/>
    <!-- Headset Earcups -->
    <rect x="345" y="390" width="55" height="95" rx="22" fill="#d97706"/>
    <rect x="355" y="402" width="35" height="71" rx="14" fill="#1e293b"/>
    <rect x="680" y="390" width="55" height="95" rx="22" fill="#d97706"/>
    <rect x="690" y="402" width="35" height="71" rx="14" fill="#1e293b"/>

    <!-- 2. Mechanical Keyboard (Center) -->
    <rect x="220" y="520" width="640" height="160" rx="16" fill="#1e293b" stroke="#334155" stroke-width="4"/>
    <!-- Keycaps grid samples -->
    <!-- Row 1 -->
    <rect x="245" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="293" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="341" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="389" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="437" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="485" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="533" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="581" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="629" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="677" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="725" y="540" width="40" height="30" rx="6" fill="#475569"/>
    <rect x="773" y="540" width="62" height="30" rx="6" fill="#d97706"/> <!-- Enter key -->

    <!-- Row 2 -->
    <rect x="245" y="578" width="55" height="30" rx="6" fill="#d97706"/>
    <rect x="308" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="356" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="404" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="452" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="500" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="548" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="596" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="644" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="692" y="578" width="40" height="30" rx="6" fill="#64748b"/>
    <rect x="740" y="578" width="95" height="30" rx="6" fill="#475569"/>

    <!-- Row 3 Spacebar -->
    <rect x="245" y="616" width="65" height="32" rx="6" fill="#475569"/>
    <rect x="318" y="616" width="44" height="32" rx="6" fill="#475569"/>
    <rect x="370" y="616" width="340" height="32" rx="6" fill="#cbd5e1"/> <!-- Spacebar -->
    <rect x="718" y="616" width="54" height="32" rx="6" fill="#475569"/>
    <rect x="780" y="616" width="55" height="32" rx="6" fill="#d97706"/>

    <!-- 3. Ergonomic Mouse (Right) -->
    <g transform="translate(740, 370)">
      <rect x="0" y="0" width="110" height="160" rx="50" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      <!-- Mouse scroll & button split -->
      <line x1="55" y1="0" x2="55" y2="60" stroke="#334155" stroke-width="3"/>
      <rect x="47" y="20" width="16" height="32" rx="8" fill="#d97706"/>
      <path d="M 20 120 Q 55 140 90 120" fill="none" stroke="#f59e0b" stroke-width="4" opacity="0.8"/>
    </g>

    <!-- 4. USB Flashdisk & Cable (Left) -->
    <g transform="translate(230, 380)">
      <!-- USB Body -->
      <rect x="0" y="30" width="70" height="110" rx="12" fill="#475569" stroke="#334155" stroke-width="3"/>
      <rect x="15" y="45" width="40" height="45" rx="6" fill="#d97706"/>
      <!-- USB Plug Metal -->
      <rect x="14" y="-5" width="42" height="38" rx="4" fill="#cbd5e1"/>
      <rect x="24" y="8" width="8" height="10" rx="2" fill="#475569"/>
      <rect x="38" y="8" width="8" height="10" rx="2" fill="#475569"/>
    </g>
  </g>

  <!-- Base Floor Shadow -->
  <ellipse cx="540" cy="725" rx="390" ry="22" fill="#0f172a" opacity="0.1"/>

  <!-- Text & Info Section -->
  <g transform="translate(0, 830)">
    <!-- Title -->
    <text x="540" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="800" fill="#0f172a" text-anchor="middle" letter-spacing="2">AKSESORI KOMPUTER</text>
    <!-- Amber Divider Line -->
    <rect x="470" y="65" width="140" height="6" rx="3" fill="#d97706"/>
    <!-- Subtitle -->
    <text x="540" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="#64748b" text-anchor="middle">Foto produk akan segera diperbarui</text>
    
    <!-- WhatsApp Catalog Callout Badge -->
    <g transform="translate(320, 175)">
      <rect x="0" y="0" width="440" height="56" rx="28" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
      <text x="220" y="35" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="600" fill="#c2410c" text-anchor="middle">⚡ Tekan Poster untuk Katalog WA</text>
    </g>
  </g>
</svg>
`;

async function main() {
  const laptopBuf = await sharp(Buffer.from(laptopSvg))
    .resize(960, 1200)
    .webp({ quality: 85 })
    .toBuffer();

  const accBuf = await sharp(Buffer.from(accessoriesSvg))
    .resize(960, 1200)
    .webp({ quality: 85 })
    .toBuffer();

  const laptopDir = path.join(
    process.cwd(),
    "assets",
    "images",
    "produk_laptop",
  );
  const accDir = path.join(
    process.cwd(),
    "assets",
    "images",
    "produk_aksesori",
  );

  fs.mkdirSync(laptopDir, { recursive: true });
  fs.mkdirSync(accDir, { recursive: true });

  for (let i = 1; i <= 15; i++) {
    fs.writeFileSync(path.join(laptopDir, `laptop_${i}.webp`), laptopBuf);
    fs.writeFileSync(path.join(accDir, `aksesori_${i}.webp`), accBuf);
  }

  console.log(
    "Successfully generated 15 laptop and 15 accessory placeholders (960x1200 WebP)",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
