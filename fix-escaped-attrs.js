// fix-escaped-attrs.js
import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "src");

function fixFile(file) {
  const src = fs.readFileSync(file, "utf8");

  // Only unescape quotes that immediately follow an equals sign in JSX attrs: =\"
  // This avoids touching normal JS strings like "He said \"hi\"".
  const out = src.replace(/=\\"/g, '="');

  if (out !== src) {
    fs.writeFileSync(file, out, "utf8");
    console.log("✅ Fixed:", file);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(tsx|jsx)$/.test(entry.name)) fixFile(p);
  }
}

console.log("🔍 Fixing escaped JSX attributes in src/ ...");
walk(ROOT);
console.log("✨ Done");
