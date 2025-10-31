// scripts/fetch_unsplash_assets_resilient.cjs
// Usage: node scripts/fetch_unsplash_assets_resilient.cjs
// No deps. Tries Unsplash keyword queries; on error falls back to Picsum.

const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const OUT = path.resolve("public/projects");

const projects = {
  "dlf-privana-south": { heroQ: "luxury residential india gurgaon", galleryQ: ["apartment interior modern","clubhouse pool luxury","residential aerial india"] },
  "dlf-privana-north": { heroQ: "gurgaon cityscape night architecture", galleryQ: ["luxury facade evening","parks greenery community","clubhouse lounge"] },
  "dlf-the-arbour": { heroQ: "highrise glass architecture evening", galleryQ: ["lobby interior luxury","living room apartment interior","residential pool night"] },
  "sobha-city": { heroQ: "township aerial greenery india", galleryQ: ["tennis court community","jogging park greenery","resort pool daylight"] },
  "sobha-international-city": { heroQ: "villa luxury modern india", galleryQ: ["rowhouse architecture","landscape garden luxury","clubhouse modern architecture"] },
  "m3m-crown": { heroQ: "highrise glass city india", galleryQ: ["amenities club interior","pool deck evening","apartment interior modern"] },
  "m3m-capital": { heroQ: "golf residential greenery india", galleryQ: ["golf course aerial","gurgaon skyline cityscape","clubhouse premium"] },
  "m3m-golfestate": { heroQ: "golf estate luxury architecture", galleryQ: ["apartment balcony view","luxury living interior","resort pool"] },
  "godrej-aria": { heroQ: "residential architecture india", galleryQ: ["minimal apartment interior","community park greenery","amenities clubhouse"] },
  "godrej-meridien": { heroQ: "premium facade night residential", galleryQ: ["luxury lobby interior","evening city architecture","modern pool"] },
  "godrej-habitat": { heroQ: "family residential community india", galleryQ: ["kids play amenities","gated community security","landscape garden"] },
  "dlf-the-camellias": { heroQ: "ultra luxury highrise golf india", galleryQ: ["golf greens estate","marble interior luxury","spa wellness"] },
};

const unsplash = (q, w, h) => `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(q)}`;
const picsum = (seed, w, h) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

function ensureDir(d){ fs.mkdirSync(d, { recursive: true }); }

function download(url, out){
  return new Promise((resolve, reject) => {
    ensureDir(path.dirname(out));
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, out).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const file = fs.createWriteStream(out);
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

async function tryUnsplashThenPicsum(q, seed, w, h, out){
  try { await download(unsplash(q, w, h), out); return true; }
  catch(e){ console.warn("Unsplash failed:", e.message, "→ Picsum"); }
  try { await download(picsum(seed, w, h), out); return true; }
  catch(e){ console.warn("Picsum failed:", e.message); return false; }
}

(async () => {
  for (const [slug, cfg] of Object.entries(projects)) {
    const base = path.join(OUT, slug);
    const galleryDir = path.join(base, "gallery");
    ensureDir(galleryDir);
    const heroOk = await tryUnsplashThenPicsum(cfg.heroQ, `${slug}-hero`, 2200, 1200, path.join(base, "hero.jpg"));
    console.log(heroOk ? "✓" : "!", slug, "hero.jpg");
    for (let i=0;i<cfg.galleryQ.length;i++){
      const ok = await tryUnsplashThenPicsum(cfg.galleryQ[i], `${slug}-gallery-${i+1}`, 1600, 1200, path.join(galleryDir, `${i+1}.jpg`));
      console.log(ok ? "✓" : "!", slug, `gallery/${i+1}.jpg`);
    }
  }
  console.log("Done.");
})();
