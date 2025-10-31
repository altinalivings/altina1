// scripts/apply-projects-seo-patch.mjs
import fs from "node:fs";

const PROJECTS_PATH = "src/data/projects.json";
const PATCH_PATH = "patches/projects.seo.json";
const BACKUP_PATH = "src/data/projects.json.bak";

function deepMerge(target, source) {
  for (const k of Object.keys(source)) {
    const sv = source[k];
    if (sv && typeof sv === "object" && !Array.isArray(sv)) {
      if (!target[k] || typeof target[k] !== "object") target[k] = {};
      deepMerge(target[k], sv);
    } else {
      target[k] = sv;
    }
  }
}

function main() {
  if (!fs.existsSync(PROJECTS_PATH)) {
    console.error(`❌ Not found: ${PROJECTS_PATH}`);
    process.exit(1);
  }
  if (!fs.existsSync(PATCH_PATH)) {
    console.error(`❌ Not found: ${PATCH_PATH}`);
    process.exit(1);
  }

  const projects = JSON.parse(fs.readFileSync(PROJECTS_PATH, "utf8"));
  const patches = JSON.parse(fs.readFileSync(PATCH_PATH, "utf8"));

  if (!Array.isArray(projects) || !Array.isArray(patches)) {
    console.error("❌ Expecting arrays in both files.");
    process.exit(1);
  }

  fs.copyFileSync(PROJECTS_PATH, BACKUP_PATH);

  let updated = 0, skipped = 0;
  for (const patch of patches) {
    const matchId = patch?.match?.id;
    const set = patch?.set;
    if (!matchId || !set) { skipped++; continue; }

    const idx = projects.findIndex(p => p.id === matchId);
    if (idx === -1) {
      console.warn(`↪︎ Skipped: no project with id="${matchId}"`);
      skipped++;
      continue;
    }

    deepMerge(projects[idx], set);
    updated++;
    console.log(`✓ Updated project "${matchId}"`);
  }

  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(projects, null, 2));
  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  console.log(`Backup saved at: ${BACKUP_PATH}`);
}

main();
