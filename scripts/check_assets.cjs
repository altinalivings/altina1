// scripts/check_assets.cjs
// Usage: node scripts/check_assets.cjs
// Verifies that all images/PDFs referenced in src/data/projects.json exist in /public

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const DATA = path.join(ROOT, "src", "data", "projects.json");

function p(...parts) { return path.join(...parts); }

function existsPublic(relPath) {
  if (!relPath || typeof relPath !== "string") return false;
  const full = p(PUBLIC, relPath.replace(/^\//, "")); // strip leading slash
  return fs.existsSync(full);
}

function check() {
  const issues = [];
  if (!fs.existsSync(DATA)) {
    console.error("❌ Missing data file:", DATA);
    process.exit(1);
  }
  const projects = JSON.parse(fs.readFileSync(DATA, "utf8"));
  let okCount = 0, missCount = 0;

  for (const proj of projects) {
    const id = proj.id;
    const header = `\n=== ${id} (${proj.name}) ===`;
    let headerPrinted = false;

    function req(label, rel) {
      const ok = existsPublic(rel);
      if (!ok) {
        if (!headerPrinted) { console.log(header); headerPrinted = true; }
        console.log(`  ❌ Missing ${label}: ${rel}`);
        missCount++;
      } else {
        okCount++;
      }
    }

    // hero
    if (proj.hero) req("hero", proj.hero);

    // gallery
    if (Array.isArray(proj.gallery)) {
      proj.gallery.forEach((g, i) => req(`gallery[${i}]`, g));
    }

    // floor plans
    if (Array.isArray(proj.floor_plans)) {
      proj.floor_plans.forEach((fp, i) => {
        if (fp.image) req(`floor_plans[${i}].image`, fp.image);
        if (fp.pdf) req(`floor_plans[${i}].pdf`, fp.pdf);
      });
    }

    // master plan
    if (proj.master_plan) req("master_plan", proj.master_plan);

    // downloads (e.g., brochure)
    if (Array.isArray(proj.downloads)) {
      proj.downloads.forEach((d, i) => d.file && req(`downloads[${i}].file`, d.file));
    } else if (proj.brochure) {
      req("brochure", proj.brochure);
    }
  }

  if (missCount === 0) {
    console.log("\n✅ All referenced files exist in /public.");
  } else {
    console.log(`\n⚠️ Done. Missing files: ${missCount}, Found OK: ${okCount}`);
    console.log("Tip: ensure paths in projects.json begin with '/' and match files under /public exactly (case-sensitive).");
  }
}

check();
