// fix-jsx-comments.js
import fs from "fs";
import path from "path";

const SRC_DIR = path.join(process.cwd(), "src");

function fixCommentsInFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const fixed = content
    // Replace {{/* → {/*
    .replace(/\{\{\/\*/g, "{/*")
    // Replace */}} → */}
    .replace(/\*\/\}\}/g, "*/}");

  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".jsx"))
      fixCommentsInFile(fullPath);
  }
}

console.log("🔍 Scanning for JSX comment errors...");
walk(SRC_DIR);
console.log("✨ Done! All invalid {{/* */}} comments fixed.");
