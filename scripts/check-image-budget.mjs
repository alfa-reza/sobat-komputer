import fs from 'fs';
import path from 'path';
import { imageProfiles } from './image-profiles.mjs';

const imagesDir = path.join(process.cwd(), 'assets', 'images');
let hasError = false;

function checkFile(filePath, profileKey) {
  if (!fs.existsSync(filePath)) return;
  const stats = fs.statSync(filePath);
  const profile = imageProfiles[profileKey];
  if (stats.size > profile.maxBytes) {
    console.error(`ERROR: Image ${path.basename(filePath)} exceeds budget! Allowed: ${profile.maxBytes}, Actual: ${stats.size}`);
    hasError = true;
  } else {
    console.log(`OK: ${path.basename(filePath)} (${stats.size} bytes)`);
  }
}

// Add a fast dynamic check if needed, or static list
const mappings = [
  { file: 'brand/logo.webp', profile: 'logo' },
  { file: 'brand/favicon.png', profile: 'favicon' },
  { file: 'hero/new-sobat-komputer-hero-desktop-1536x864.webp', profile: 'heroDesktop' },
  { file: 'hero/new-sobat-komputer-hero-mobile-864x1080.webp', profile: 'heroMobile' },
  { file: 'promotions/poster-1-kredit-laptop.webp', profile: 'promotion' },
  { file: 'promotions/poster-2-pemasangan-cctv.webp', profile: 'promotion' },
  { file: 'promotions/poster-3-jual-laptop.webp', profile: 'promotion' },
  { file: 'promotions/poster-4-set-pc.webp', profile: 'promotion' }
];

mappings.forEach(m => checkFile(path.join(imagesDir, m.file), m.profile));

if (hasError) {
  process.exit(1);
}
