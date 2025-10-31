// scripts/fetch_unsplash_assets.cjs
// Usage: node scripts/fetch_unsplash_assets.cjs
// Downloads curated Unsplash JPGs (no API key) into /public/projects/<id>/hero.jpg and /gallery/*.jpg

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const OUT = path.resolve("public/projects");

// Curated Unsplash photo IDs per project (hero + 3 gallery)
const projects = {
  // DLF
  "dlf-privana-south": {
    hero: "iFVBg3bdQbY",
    gallery: ["OWjSfCZ7ih0", "98El7rldD4M", "210qs6a3HTU"],
  },
  "dlf-privana-north": {
    hero: "SCnQIUbtFIk",
    gallery: ["Qd6qkZqkrkY", "He9rzzdkOK4", "iFVBg3bdQbY"],
  },
  "dlf-the-arbour": {
    hero: "3q3GMuON1gk",
    gallery: ["CfhrTJ97RUI", "LmWHFoC-4e8", "3q3GMuON1gk"],
  },

  // SOBHA
  "sobha-city": {
    hero: "NHTVlPcMkeM",
    gallery: ["cG7_oka4rpk", "XLLIYCMVN5I", "HzXQldeOSfo"],
  },
  "sobha-international-city": {
    hero: "cG7_oka4rpk",
    gallery: ["NHTVlPcMkeM", "XLLIYCMVN5I", "CfhrTJ97RUI"],
  },

  // M3M
  "m3m-crown": {
    hero: "3q3GMuON1gk",
    gallery: ["CfhrTJ97RUI", "XLLIYCMVN5I", "iFVBg3bdQbY"],
  },
  "m3m-capital": {
    hero: "LmWHFoC-4e8",
    gallery: ["OWjSfCZ7ih0", "98El7rldD4M", "SCnQIUbtFIk"],
  },
  "m3m-golfestate": {
    hero: "XLLIYCMVN5I",
    gallery: ["NHTVlPcMkeM", "cG7_oka4rpk", "LmWHFoC-4e8"],
  },

  // GODREJ
  "godrej-aria": {
    hero: "OWjSfCZ7ih0",
    gallery: ["iFVBg3bdQbY", "98El7rldD4M", "Qd6qkZqkrkY"],
  },
  "godrej-meridien": {
    hero: "98El7rldD4M",
    gallery: ["SCnQIUbtFIk", "OWjSfCZ7ih0", "iFVBg3bdQbY"],
  },
  "godrej-habitat": {
    hero: "Qd6qkZqkrkY",
    gallery: ["OWjSfCZ7ih0", "iFVBg3bdQbY", "He9rzzdkOK4"],
  },

  // Extra
  "dlf-the-camellias": {
    hero: "CfhrTJ97RUI",
    gallery: ["3q3GMuON1gk", "LmWHFoC-4e8", "XLLIYCMVN5I"],
  },
};

// Unsplash "source" endpoint for a fixed photo ID and size
const urlFor = (id, w = 2000, h = 1200) =>
  `https://source.unsplash.com/${id}/${w}x${h}`;

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function download(url, out) {
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(out));
    https
      .get(url, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location, out).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const file = fs.createWriteStream(out);
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", reject);
  });
}

(async () => {
  for (const [slug, set] of Object.entries(projects)) {
    const base = path.join(OUT, slug);
    const galleryDir = path.join(base, "gallery");

    // HERO
    try {
      const u = urlFor(set.hero, 2200, 1200);
      const out = path.join(base, "hero.jpg");
      await download(u, out);
      console.log("✓", slug, "hero.jpg");
    } catch (e) {
      console.warn("!", slug, "hero failed:", e.message);
    }

    // GALLERY
    for (let idx = 0; idx < set.gallery.length; idx++) {
      try {
        const u = urlFor(set.gallery[idx], 1600, 1200);
        const out = path.join(galleryDir, `${idx + 1}.jpg`);
        await download(u, out);
        console.log("✓", slug, `gallery/${idx + 1}.jpg`);
      } catch (e) {
        console.warn("!", slug, `gallery ${idx + 1} failed:`, e.message);
      }
    }
  }
  console.log("Done.");
})();
