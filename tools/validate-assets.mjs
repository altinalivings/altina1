// tools/validate-assets.mjs
import fs from "fs/promises";
import path from "path";
import url from "url";
import vm from "vm";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const DATA_TS = path.join(__dirname, "..", "src", "data", "projects.ts");
const DATA_JSON = path.join(__dirname, "..", "src", "data", "projects.json");

function stripBOM(s) {
  return s.replace(/^\uFEFF/, "");
}

/**
 * Extracts the JS array assigned to `const projects = [...]`
 * Handles comments and strings while bracket-counting.
 */
function extractAssignedArray(tsText, varName = "projects") {
  const text = stripBOM(tsText);

  const declRe = new RegExp(String.raw`(?:const|let|var)\s+${varName}\b[^=]*=`, "m");
  const declMatch = declRe.exec(text);
  if (!declMatch) throw new Error(`Could not find a declaration assigning to '${varName}'.`);

  let i = declMatch.index + declMatch[0].length;
  const n = text.length;

  function skipWSAndComments() {
    while (i < n) {
      const ch = text[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === "/" && text[i + 1] === "/") { i += 2; while (i < n && text[i] !== "\n") i++; continue; }
      if (ch === "/" && text[i + 1] === "*") {
        i += 2;
        while (i < n && !(text[i] === "*" && text[i + 1] === "/")) i++;
        i += 2;
        continue;
      }
      break;
    }
  }

  skipWSAndComments();
  if (text[i] !== "[") throw new Error(`Expected '[' to start ${varName} array, found '${text[i] || "EOF"}'.`);

  const start = i;
  let depth = 0;
  let inStr = false, quote = "", esc = false;
  let inTpl = false, tplEsc = false;

  function maybeEatComment() {
    if (text[i] === "/" && text[i + 1] === "/") { i += 2; while (i < n && text[i] !== "\n") i++; return true; }
    if (text[i] === "/" && text[i + 1] === "*") {
      i += 2; while (i < n && !(text[i] === "*" && text[i + 1] === "/")) i++; i += 2; return true;
    }
    return false;
  }

  for (; i < n; i++) {
    const ch = text[i];

    if (inStr) {
      if (esc) { esc = false; continue; }
      if (ch === "\\") { esc = true; continue; }
      if (ch === quote) { inStr = false; quote = ""; }
      continue;
    }

    if (inTpl) {
      if (tplEsc) { tplEsc = false; continue; }
      if (ch === "\\") { tplEsc = true; continue; }
      if (ch === "`") { inTpl = false; continue; }
      if (ch === "$" && text[i + 1] === "{") {
        // skip ${ ... } with braces/strings
        i += 2;
        let b = 1;
        while (i < n && b > 0) {
          const c = text[i];
          if (c === "'" || c === '"') {
            const q = c; i++;
            while (i < n) {
              const cc = text[i];
              if (cc === "\\") { i += 2; continue; }
              if (cc === q) { i++; break; }
              i++;
            }
            continue;
          }
          if (c === "`") {
            i++;
            let e2 = false;
            while (i < n) {
              const c2 = text[i];
              if (e2) { e2 = false; i++; continue; }
              if (c2 === "\\") { e2 = true; i++; continue; }
              if (c2 === "`") { i++; break; }
              i++;
            }
            continue;
          }
          if (c === "{") b++;
          else if (c === "}") b--;
          i++;
        }
        i--;
        continue;
      }
      continue;
    }

    if (maybeEatComment()) { i--; continue; }

    if (ch === "'" || ch === '"') { inStr = true; quote = ch; continue; }
    if (ch === "`") { inTpl = true; continue; }

    if (ch === "[") depth++;
    if (ch === "]") { depth--; if (depth === 0) return text.slice(start, i + 1); }
  }

  throw new Error(`Unterminated array for '${varName}'.`);
}

/** Try strict JSON; if it fails, evaluate as JavaScript array inside a VM. */
function parseArrayLoose(arrayText) {
  // First attempt: strict JSON
  try {
    // Remove trailing commas for safer JSON parse
    const noTrailing = arrayText.replace(/,\s*([}\]])/g, "$1");
    return JSON.parse(noTrailing);
  } catch (jsonErr) {
    // Fallback: evaluate as JS (object-literal array) in a restricted VM
    try {
      const code = `"use strict";\n(() => (${arrayText}))()`;
      const sandbox = Object.freeze({});
      const ctx = vm.createContext(sandbox, { name: "projects-parse", codeGeneration: { strings: true, wasm: false } });
      const result = vm.runInContext(code, ctx, { timeout: 1000 });
      if (!Array.isArray(result)) throw new Error("Evaluated value is not an array");
      return result;
    } catch (vmErr) {
      // Surface the JSON error context (more familiar) with a tip
      throw new Error(
        `Failed to parse projects array from projects.ts. ${jsonErr.message}\n` +
        `Tip: trailing commas & comments must be removed for JSON parsing.\n` +
        (jsonErr.message.includes("position")
          ? `Context starts near char ${jsonErr.message.match(/position (\d+)/)?.[1]}.`
          : "")
      );
    }
  }
}

async function readProjects() {
  // Prefer projects.json if present
  try {
    const jraw = await fs.readFile(DATA_JSON, "utf8");
    const parsed = JSON.parse(stripBOM(jraw));
    if (!Array.isArray(parsed)) throw new Error("projects.json is not an array");
    return parsed;
  } catch {
    // continue to TS
  }

  const traw = await fs.readFile(DATA_TS, "utf8");
  const arrayText = extractAssignedArray(traw, "projects");
  const parsed = parseArrayLoose(arrayText);
  return parsed;
}

function rel(p) {
  return p
    .replace(path.resolve(__dirname, "..") + path.sep, "")
    .replaceAll("\\", "/");
}

async function main() {
  const projects = await readProjects();
  const publicDir = path.join(__dirname, "..", "public");

  const missing = [];
  const warn = [];

  for (const p of projects) {
    if (!p?.id || !p?.name) {
      warn.push(`Project missing id/name: ${JSON.stringify(p).slice(0, 120)}…`);
      continue;
    }

    const baseById = path.join(publicDir, "projects", p.id);
    const baseBySlug = p.slug ? path.join(publicDir, "projects", p.slug) : null;

    // --- hero candidates ---
    const heroCandidates = [];
    if (p.hero) heroCandidates.push(path.join(publicDir, p.hero.replace(/^\//, "")));
    heroCandidates.push(path.join(baseById, "hero.webp"));
    heroCandidates.push(path.join(baseById, "hero.jpg"));
    if (baseBySlug) {
      heroCandidates.push(path.join(baseBySlug, "hero.webp"));
      heroCandidates.push(path.join(baseBySlug, "hero.jpg"));
    }

    let heroFound = false;
    for (const h of heroCandidates) {
      try { await fs.access(h); heroFound = true; break; } catch {}
    }
    if (!heroFound) {
      missing.push(`Hero not found for ${p.id}. Tried:\n  - ${heroCandidates.map(rel).join("\n  - ")}`);
    }

    // --- gallery check ---
    const galleryData = Array.isArray(p.gallery) ? p.gallery : [];
    const galleryDirs = [path.join(baseById, "gallery"), baseById];
    if (baseBySlug) {
      galleryDirs.push(path.join(baseBySlug, "gallery"));
      galleryDirs.push(baseBySlug);
    }

    let anyGallery = false;
    if (galleryData.length) {
      for (const g of galleryData) {
        const gp = path.join(publicDir, g.replace(/^\//, ""));
        try { await fs.access(gp); anyGallery = true; break; } catch {}
      }
      if (!anyGallery) {
        warn.push(`Gallery listed for ${p.id} but none exist on disk: ${galleryData.slice(0, 5).join(", ")}…`);
      }
    } else {
      const exts = [".webp", ".jpg", ".jpeg", ".png"];
      for (const dir of galleryDirs) {
        for (let k = 1; k <= 25; k++) {
          for (const ext of exts) {
            try { await fs.access(path.join(dir, `g${k}${ext}`)); anyGallery = true; break; } catch {}
          }
          if (anyGallery) break;
        }
        if (anyGallery) break;
      }
      if (!anyGallery) warn.push(`No gallery found for ${p.id} under ${galleryDirs.map(rel).join(", ")}`);
    }
  }

  if (warn.length) {
    console.log("Warnings:");
    for (const w of warn) console.log("  - " + w);
    console.log("");
  }

  if (missing.length) {
    console.error("Missing assets:");
    for (const m of missing) console.error("  - " + m);
    process.exit(1);
  }

  console.log(`OK ✓  Validated ${projects.length} projects (heroes & galleries).`);
}

main().catch((e) => {
  console.error(e?.stack || e?.message || String(e));
  process.exit(1);
});
