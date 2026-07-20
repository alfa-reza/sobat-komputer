import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { imageProfiles } from './image-profiles.mjs';

const inputDir = path.join(process.cwd(), '.image-input');
const outputDir = path.join(process.cwd(), 'assets', 'images');

const jobs = [
  { in: 'logo.png', out: 'brand/logo.webp', profile: 'logo' },
  { in: 'logo.png', out: 'brand/favicon.png', profile: 'favicon' },
  { in: 'new-sobat-komputer-hero-desktop-1536x864.webp', out: 'hero/new-sobat-komputer-hero-desktop-1536x864.webp', profile: 'heroDesktop' },
  { in: 'new-sobat-komputer-hero-mobile-864x1080.webp', out: 'hero/new-sobat-komputer-hero-mobile-864x1080.webp', profile: 'heroMobile' },
  { in: 'poster-1-kredit-laptop.png', out: 'promotions/poster-1-kredit-laptop.webp', profile: 'promotion' },
  { in: 'poster-2-pemasangan-cctv.png', out: 'promotions/poster-2-pemasangan-cctv.webp', profile: 'promotion' },
  { in: 'poster-3-jual-laptop.png', out: 'promotions/poster-3-jual-laptop.webp', profile: 'promotion' },
  { in: 'poster-4-set-pc.png', out: 'promotions/poster-4-set-pc.webp', profile: 'promotion' }
];

async function run() {
  for (const job of jobs) {
    const inputPath = path.join(inputDir, job.in);
    if (!fs.existsSync(inputPath)) continue;
    const outputPath = path.join(outputDir, job.out);
    const profile = imageProfiles[job.profile];
    
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    
    let pipeline = sharp(inputPath, { failOn: 'none' })
      .rotate()
      .withMetadata(false); // remove metadata
      
    // sharp automatically converts to sRGB by default
    
    pipeline = pipeline.resize({
      width: profile.maxWidth,
      height: profile.maxHeight,
      fit: profile.fit,
      withoutEnlargement: true
    });
    
    if (profile.format === 'webp') {
      pipeline = pipeline.webp({ quality: profile.quality || 80 });
    } else if (profile.format === 'png') {
      pipeline = pipeline.png({ compressionLevel: 9 });
    }
    
    try {
      await pipeline.toFile(outputPath);
      console.log(`Optimized ${job.in} -> ${job.out}`);
    } catch(err) {
      console.error(`Failed to optimize ${job.in}`, err);
    }
  }
}

run().catch(console.error);
