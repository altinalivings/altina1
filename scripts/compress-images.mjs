#!/usr/bin/env node
/**
 * =========================================================
 *  ALTINA LIVINGS — Image Compression & Optimization Script
 * =========================================================
 *
 *  Compresses all images in /public to stay under Vercel's
 *  250 MB deployment limit. Uses `sharp` (already in deps).
 *
 *  USAGE:
 *    node scripts/compress-images.mjs                  # default: quality 75, max 1920px
 *    node scripts/compress-images.mjs --quality 65     # more aggressive compression
 *    node scripts/compress-images.mjs --max-width 1600 # smaller max dimension
 *    node scripts/compress-images.mjs --webp           # also generate .webp copies
 *    node scripts/compress-images.mjs --dry-run        # preview savings without writing
 *
 *  Add to package.json scripts:
 *    "compress": "node scripts/compress-images.mjs",
 *    "prebuild": "node scripts/compress-images.mjs"
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");

// ── Parse CLI args ──────────────────────────────────────
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  if (typeof fallback === "boolean") return true;
  return args[idx + 1] ?? fallback;
}

const QUALITY = parseInt(getArg("quality", "75"), 10);
const MAX_WIDTH = parseInt(getArg("max-width", "1920"), 10);
const GENERATE_WEBP = getArg("webp", false);
const DRY_RUN = getArg("dry-run", false);
const HERO_MAX_WIDTH = parseInt(getArg("hero-max-width", "1600"), 10);
const THUMB_MAX_WIDTH = parseInt(getArg("thumb-max-width", "800"), 10);
const SKIP_IF_SMALLER = parseInt(getArg("skip-if-smaller", "50"), 10); // KB

// Dynamic import of sharp (ESM compatible)
let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("❌  sharp not found. Install it: npm install sharp");
  process.exit(1);
}

// ── Collect image files ─────────────────────────────────
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function walk(dir, collected = []) {
  if (!fs.existsSync(dir)) return collected;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, collected);
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      collected.push(full);
    }
  }
  return collected;
}

// ── Determine optimal max-width based on image path ─────
function maxWidthForFile(filePath) {
  const rel = path.relative(PUBLIC_DIR, filePath).toLowerCase();
  // Hero images: can be slightly smaller (they're full-bleed but CSS covers)
  if (rel.includes("hero")) return HERO_MAX_WIDTH;
  // Gallery thumbnails
  if (rel.includes("gallery") || rel.includes("/g")) return THUMB_MAX_WIDTH;
  // Logos / icons: never resize
  if (rel.includes("logo") || rel.includes("icon") || rel.includes("favicon")) return 9999;
  return MAX_WIDTH;
}

// ── Main ────────────────────────────────────────────────
async function run() {
  console.log("\n🖼️  ALTINA Image Compressor");
  console.log(`   Quality: ${QUALITY} | Max width: ${MAX_WIDTH}px | WebP: ${GENERATE_WEBP}`);
  if (DRY_RUN) console.log("   ⚡ DRY RUN — no files will be changed\n");
  else console.log("");

  const files = walk(PUBLIC_DIR);
  if (!files.length) {
    console.log("   No images found in /public");
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let skipped = 0;
  let processed = 0;
  let webpCreated = 0;

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);
    const ext = path.extname(filePath).toLowerCase();
    const sizeBefore = fs.statSync(filePath).size;
    totalBefore += sizeBefore;

    // Skip tiny files
    if (sizeBefore < SKIP_IF_SMALLER * 1024) {
      totalAfter += sizeBefore;
      skipped++;
      continue;
    }

    try {
      const img = sharp(filePath);
      const meta = await img.metadata();
      const mw = maxWidthForFile(filePath);

      let pipeline = sharp(filePath).rotate(); // auto-rotate from EXIF

      // Resize if wider than max
      if (meta.width && meta.width > mw) {
        pipeline = pipeline.resize({ width: mw, withoutEnlargement: true });
      }

      // Compress based on format
      if (ext === ".jpg" || ext === ".jpeg") {
        pipeline = pipeline.jpeg({
          quality: QUALITY,
          mozjpeg: true,         // better compression
          chromaSubsampling: "4:2:0",
        });
      } else if (ext === ".png") {
        // Convert large PNGs to JPEG (unless they have transparency)
        if (meta.channels === 4 && meta.hasAlpha) {
          pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9, effort: 10 });
        } else {
          // No alpha → convert to JPEG for massive savings
          pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
          // We'll write as .jpg and rename
        }
      } else if (ext === ".webp") {
        pipeline = pipeline.webp({ quality: QUALITY, effort: 6 });
      }

      const buffer = await pipeline.toBuffer();
      const sizeAfter = buffer.length;

      // Only write if we actually saved space
      if (sizeAfter < sizeBefore * 0.95) {
        if (!DRY_RUN) {
          fs.writeFileSync(filePath, buffer);
        }
        totalAfter += sizeAfter;
        const pct = ((1 - sizeAfter / sizeBefore) * 100).toFixed(1);
        console.log(`   ✅ ${rel}  ${fmtSize(sizeBefore)} → ${fmtSize(sizeAfter)}  (−${pct}%)`);
        processed++;
      } else {
        totalAfter += sizeBefore;
        skipped++;
      }

      // Optional: generate .webp sidecar
      if (GENERATE_WEBP && ext !== ".webp") {
        const webpPath = filePath.replace(/\.[^.]+$/, ".webp");
        if (!fs.existsSync(webpPath)) {
          const webpBuf = await sharp(filePath)
            .resize({ width: mw, withoutEnlargement: true })
            .webp({ quality: QUALITY, effort: 6 })
            .toBuffer();
          if (!DRY_RUN) fs.writeFileSync(webpPath, webpBuf);
          webpCreated++;
        }
      }
    } catch (err) {
      console.log(`   ⚠️  Skip ${rel}: ${err.message}`);
      totalAfter += sizeBefore;
      skipped++;
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log(`   📊 Summary`);
  console.log(`   Files scanned:    ${files.length}`);
  console.log(`   Compressed:       ${processed}`);
  console.log(`   Skipped:          ${skipped}`);
  if (GENERATE_WEBP) console.log(`   WebP created:     ${webpCreated}`);
  console.log(`   Before:           ${fmtSize(totalBefore)}`);
  console.log(`   After:            ${fmtSize(totalAfter)}`);
  console.log(`   Saved:            ${fmtSize(totalBefore - totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
  console.log("─".repeat(60) + "\n");
}

function fmtSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

run().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
