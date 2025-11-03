// tools/sync-galleries.mjs
import fs from "fs/promises";
import path from "path";
import url from "url";
import vm from "vm";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const DATA_TS = path.join(ROOT, "src", "data", "projects.ts");
const DATA_JSON = path.join(ROOT, "src", "data", "projects.json");
const EXTS = [".webp", ".jpg", ".jpeg", ".png"];

function stripBOM(s) { return s.replace(/^\uFEFF/, ""); }

// --- lightweight array extractor (same idea as validator) ---
function extractAssignedArray(tsText, varName = "projects") {
  const text = stripBOM(tsText);
  const declRe = new RegExp(String.raw`(?:const|let|var)\s+${varName}\b[^=]*=`, "m");
  const m = declRe.exec(text);
  if (!m) throw new Error(`Could not find a declaration assigning to '${varName}'.`);
  let i = m.index + m[0].length, n = text.length;

  // skip ws/comments
  while (i < n) {
    if (/\s/.test(text[i])) { i++; continue; }
    if (text[i] === "/" && text[i+1] === "/") { i+=2; while (i<n && text[i]!=="\n") i++; continue; }
    if (text[i] === "/" && text[i+1] === "*") { i+=2; while (i<n && !(text[i]==="*" && text[i+1]==="/")) i++; i+=2; continue; }
    break;
  }
  if (text[i] !== "[") throw new Error(`Expected '[' to start array.`);

  const start = i;
  let depth = 0, inStr=false, q="", esc=false, inTpl=false, te=false;
  function eatBlockComment() { i+=2; while (i<n && !(text[i]==="*" && text[i+1]==="/")) i++; i+=2; }
  function eatLineComment() { i+=2; while (i<n && text[i]!=="\n") i++; }

  for (; i<n; i++) {
    const ch = text[i];
    if (inStr) { if (esc){esc=false;} else if (ch==="\\"){esc=true;} else if (ch===q){inStr=false;q="";} continue; }
    if (inTpl) {
      if (te){te=false;} else if (ch==="\\"){te=true;} else if (ch==="`"){inTpl=false;}
      else if (ch==="$" && text[i+1]==="{"){ // skip ${...}
        i+=2; let b=1;
        while (i<n && b>0){ const c=text[i];
          if (c==="' "|| c==='\"'){ const qq=c; i++; while (i<n){ const c2=text[i]; if (c2==="\\"){i+=2;continue;} if (c2===qq){i++;break;} i++; } continue; }
          if (c==="`"){ i++; let ee=false; while (i<n){ const c2=text[i]; if (ee){ee=false;i++;continue;} if (c2==="\\"){ee=true;i++;continue;} if (c2==="`"){i++;break;} i++; } continue; }
          if (c==="{") b++; else if (c==="}") b--; i++;
        }
      }
      continue;
    }
    if (ch === "/" && text[i+1] === "*") { eatBlockComment(); i--; continue; }
    if (ch === "/" && text[i+1] === "/") { eatLineComment();  i--; continue; }
    if (ch === "'" || ch === '"') { inStr = true; q = ch; continue; }
    if (ch === "`") { inTpl = true; continue; }
    if (ch === "[") depth++;
    if (ch === "]") { depth--; if (depth===0) return text.slice(start, i+1); }
  }
  throw new Error("Unterminated array.");
}

function parseArrayLoose(text) {
  try {
    const noTrailing = text.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(noTrailing);
  } catch {
    const code = `"use strict";\n(() => (${text}))()`;
    const ctx = vm.createContext(Object.freeze({}), { codeGeneration: { strings: true, wasm: false } });
    const res = vm.runInContext(code, ctx, { timeout: 1000 });
    if (!Array.isArray(res)) throw new Error("Not an array");
    return res;
  }
}

async function readProjects() {
  // Prefer JSON if present
  try {
    const j = await fs.readFile(DATA_JSON, "utf8");
    const arr = JSON.parse(stripBOM(j));
    if (Array.isArray(arr)) return arr;
  } catch {}
  // Fallback to TS
  const t = await fs.readFile(DATA_TS, "utf8");
  const arrText = extractAssignedArray(t, "projects");
  return parseArrayLoose(arrText);
}

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function ensureDir(p) { await fs.mkdir(p, { recursive: true }); }

async function findHero(p) {
  const candidates = [];
  if (p.hero) candidates.push(path.join(PUBLIC, p.hero.replace(/^\//, "")));
  const byId = path.join(PUBLIC, "projects", p.id);
  const bySlug = p.slug ? path.join(PUBLIC, "projects", p.slug) : null;
  for (const base of [byId, bySlug].filter(Boolean)) {
    for (const e of EXTS) candidates.push(path.join(base, `hero${e}`));
  }
  for (const c of candidates) if (await exists(c)) return c;
  return null;
}

const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGP4zwAAAgMBgXo9E0kAAAAASUVORK5CYII=",
  "base64"
);

async function copyFileEnsuringDirs(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

async function writePlaceholder(dest) {
  await ensureDir(path.dirname(dest));
  await fs.writeFile(dest, TINY_PNG);
}

async function seedMissingGalleriesFromHero(projects) {
  let created = 0, placeholders = 0;
  for (const p of projects) {
    const bases = [path.join(PUBLIC, "projects", p.id)];
    if (p.slug) bases.push(path.join(PUBLIC, "projects", p.slug));
    let hasGallery = false;
    for (const base of bases) {
      for (let i = 1; i <= 25 && !hasGallery; i++) {
        for (const e of EXTS) {
          const rootFile = path.join(base, `g${i}${e}`);
          const galFile  = path.join(base, "gallery", `g${i}${e}`);
          if (await exists(rootFile) || await exists(galFile)) { hasGallery = true; break; }
        }
      }
      if (hasGallery) break;
    }
    if (hasGallery) continue;

    const hero = await findHero(p);
    const base = path.join(PUBLIC, "projects", p.id);
    if (hero) {
      const ext = path.extname(hero).toLowerCase() || ".jpg";
      await copyFileEnsuringDirs(hero, path.join(base, `g1${ext}`));
      await copyFileEnsuringDirs(hero, path.join(base, "gallery", `g1${ext}`));
      created += 2;
      console.log(`Seeded gallery for ${p.id} from hero -> g1${ext} (+ gallery copy)`);
    } else {
      await writePlaceholder(path.join(base, "g1.png"));
      await writePlaceholder(path.join(base, "gallery", "g1.png"));
      placeholders += 2;
      console.log(`Placed placeholder gallery for ${p.id} -> g1.png`);
    }
  }
  return { created, placeholders };
}

async function ensureListedGalleryFilesExist(projects) {
  // Create each *listed* gallery file if missing, by copying hero/placeholder
  let created = 0, placeholders = 0, totalListed = 0;

  for (const p of projects) {
    const listed = Array.isArray(p.gallery) ? p.gallery : [];
    if (!listed.length) continue;

    const hero = await findHero(p);
    for (const webPath of listed) {
      if (!webPath || typeof webPath !== "string") continue;
      if (!webPath.startsWith("/")) continue; // expecting /projects/...
      totalListed++;

      const abs = path.join(PUBLIC, webPath.replace(/^\//, ""));
      if (await exists(abs)) continue;

      if (hero) {
        await copyFileEnsuringDirs(hero, abs);
        created++;
        console.log(`Created listed gallery file for ${p.id}: ${webPath} (from hero)`);
      } else {
        await writePlaceholder(abs);
        placeholders++;
        console.log(`Created placeholder for listed gallery ${p.id}: ${webPath}`);
      }
    }
  }
  return { created, placeholders, totalListed };
}

async function main() {
  const projects = await readProjects();

  const pass1 = await seedMissingGalleriesFromHero(projects);
  const pass2 = await ensureListedGalleryFilesExist(projects);

  console.log(`\nPass1: created ${pass1.created}, placeholders ${pass1.placeholders}`);
  console.log(`Pass2: ensured ${pass2.totalListed} listed file(s); created ${pass2.created}, placeholders ${pass2.placeholders}`);
  console.log("\nDone.");
}

main().catch((e) => { console.error(e); process.exit(1); });
