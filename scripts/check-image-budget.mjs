import fs from "fs";
import path from "path";
import sharp from "sharp";
import { imageProfiles } from "./image-profiles.mjs";

const imagesDir = path.join(process.cwd(), "assets", "images");
let hasError = false;

async function checkFile(filePath, profileKey) {
  if (!fs.existsSync(filePath)) return;
  const stats = fs.statSync(filePath);
  const profile = imageProfiles[profileKey];

  if (stats.size > profile.maxBytes) {
    console.error(
      `ERROR: Image ${path.basename(filePath)} exceeds budget! Allowed: ${profile.maxBytes}, Actual: ${stats.size}`,
    );
    hasError = true;
  }

  try {
    const meta = await sharp(filePath).metadata();
    if (meta.width > profile.maxWidth || meta.height > profile.maxHeight) {
      console.error(
        `ERROR: Image ${path.basename(filePath)} exceeds allowed dimensions! Allowed: ${profile.maxWidth}x${profile.maxHeight}, Actual: ${meta.width}x${meta.height}`,
      );
      hasError = true;
    } else {
      console.log(
        `OK: ${path.basename(filePath)} (${stats.size} bytes, ${meta.width}x${meta.height})`,
      );
    }
  } catch (err) {
    console.error(
      `ERROR: Could not read metadata for ${path.basename(filePath)}: ${err.message}`,
    );
    hasError = true;
  }
}

const mappings = [
  { file: "brand/logo.webp", profile: "logo" },
  { file: "brand/favicon.png", profile: "favicon" },
  {
    file: "hero/new-sobat-komputer-hero-desktop-1536x864.webp",
    profile: "heroDesktop",
  },
  {
    file: "hero/new-sobat-komputer-hero-mobile-864x1080.webp",
    profile: "heroMobile",
  },
  { file: "promotions/poster-1-kredit-laptop.webp", profile: "promotion" },
  { file: "promotions/poster-2-pemasangan-cctv.webp", profile: "promotion" },
  { file: "promotions/poster-3-jual-laptop.webp", profile: "promotion" },
  { file: "promotions/poster-4-set-pc.webp", profile: "promotion" },
];

for (let i = 1; i <= 15; i++) {
  mappings.push({
    file: `produk_laptop/laptop_${i}.webp`,
    profile: "placeholder",
  });
  mappings.push({
    file: `produk_aksesori/aksesori_${i}.webp`,
    profile: "placeholder",
  });
}

for (const m of mappings) {
  await checkFile(path.join(imagesDir, m.file), m.profile);
}

if (hasError) {
  process.exit(1);
}
