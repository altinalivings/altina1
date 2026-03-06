// next-sitemap.config.js
// Requires: npm i next-sitemap
const fs = require("fs");
const path = require("path");

function readJSON(p) {
  const raw = fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""); // strip BOM if any
  return JSON.parse(raw);
}

/**
 * Extract project IDs from projects.ts using regex.
 * This avoids the need for a separate .json file.
 */
function readProjectIdsFromTS(tsPath) {
  try {
    const raw = fs.readFileSync(tsPath, "utf8");
    const ids = [];
    // Match id: "some-slug" patterns
    const idRegex = /\bid\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = idRegex.exec(raw)) !== null) {
      ids.push(m[1]);
    }
    return ids;
  } catch (e) {
    return [];
  }
}

const projectsTsPath = path.join(__dirname, "src/data/projects.ts");
const postsPath = path.join(__dirname, "src/data/posts.json");

// Try .ts first (primary source), fallback to .json
let projectIds = readProjectIdsFromTS(projectsTsPath);
if (!projectIds.length) {
  try {
    const projectsJsonPath = path.join(__dirname, "src/data/projects.json");
    const projects = readJSON(projectsJsonPath);
    projectIds = projects.map((p) => p.id || p.slug).filter(Boolean);
  } catch (e) {
    console.warn("No project data found for sitemap generation");
  }
}

let posts = [];
try {
  posts = readJSON(postsPath);
} catch (e) {
  console.warn("posts.json not found or invalid; skipping blog paths");
}

module.exports = {
  siteUrl: "https://www.altinalivings.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*", "/debug-analytics"],

  // Dynamically add /projects/* and /blog/* entries
  additionalPaths: async (config) => {
    const paths = [];

    // Projects (from .ts IDs)
    for (const id of projectIds) {
      paths.push({
        loc: `/projects/${id}`,
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      });
    }

    // Blog posts
    for (const b of Array.isArray(posts) ? posts : []) {
      if (b?.slug) {
        paths.push({
          loc: `/blog/${b.slug}`,
          lastmod: b.lastmod || b.date || new Date().toISOString(),
          changefreq: "monthly",
          priority: 0.6,
        });
      }
    }

    return paths;
  },

  robotsTxtOptions: {
    additionalSitemaps: [
      "https://www.altinalivings.com/sitemap.xml",
    ],
  },
};
