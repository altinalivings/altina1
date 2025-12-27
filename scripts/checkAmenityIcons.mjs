// scripts/checkAmenityIcons.mjs
// Scans src/data/projects.ts for amenities strings and reports which ones do not match any icon key.
// Run: node scripts/checkAmenityIcons.mjs

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PROJECTS_FILE = path.join(ROOT, "src", "data", "projects.ts");
const ICONS_FILE = path.join(ROOT, "src", "data", "amenityIcons.generated.ts");

function normalizeKey(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/24\s*x\s*7/g, "24x7")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return "";
  }
}

const projectsSrc = readFileSafe(PROJECTS_FILE);
if (!projectsSrc) {
  console.error(`❌ Could not read ${path.relative(ROOT, PROJECTS_FILE)}`);
  process.exit(1);
}

const iconsSrc = readFileSafe(ICONS_FILE);
if (!iconsSrc) {
  console.error(`❌ Could not read ${path.relative(ROOT, ICONS_FILE)} (run generate first)`);
  process.exit(1);
}

// Extract map from generated TS (simple parsing: find JSON in "={...};")
const m = iconsSrc.match(/=\s*(\{[\s\S]*\});\s*export\s+default/i);
if (!m) {
  console.error("❌ Could not parse amenityIcons.generated.ts");
  process.exit(1);
}
let iconMap = {};
try {
  iconMap = JSON.parse(m[1]);
} catch (e) {
  console.error("❌ Failed to JSON.parse icon map:", e);
  process.exit(1);
}
const iconKeys = new Set(Object.keys(iconMap).map(normalizeKey));

// Find amenities: amenities: [ "A", "B" ... ]
const amenities = [];
const amenityArrayRegex = /amenities\s*:\s*\[([\s\S]*?)\]/g;
let r;
while ((r = amenityArrayRegex.exec(projectsSrc))) {
  const block = r[1];
  // capture quoted strings
  const q = block.match(/["'`](.*?)["'`]/g) || [];
  for (const s of q) {
    const val = s.slice(1, -1).trim();
    if (val) amenities.push(val);
  }
}

// Unique
const uniq = Array.from(new Set(amenities.map((x) => x.trim())));

const missing = [];
for (const a of uniq) {
  const k = normalizeKey(a);
  if (!k) continue;
  if (!iconKeys.has(k)) missing.push(a);
}

console.log(`\nFound ${uniq.length} unique amenities in projects.ts`);
console.log(`Icons keys available: ${iconKeys.size}\n`);

if (!missing.length) {
  console.log("✅ All amenities have a matching icon key.");
  process.exit(0);
}

console.log(`❗ Missing icon keys for ${missing.length} amenities:\n`);
for (const a of missing.sort()) {
  const suggest = normalizeKey(a).replace(/\s+/g, "_");
  console.log(`- ${a}   (suggest icon file name: ${suggest}.png)`);
}

console.log("\nTip: Add files to /public/icons/ using the suggested snake_case names, then re-run generateAmenityIcons.mjs");
