// next-sitemap.config.js
// Requires: npm i next-sitemap
const fs = require("fs");
const path = require("path");

function readJSON(p) {
  const raw = fs.readFileSync(p, "utf8").replace(/^\uFEFF/, ""); // strip BOM if any
  return JSON.parse(raw);
}

const projectsPath = path.join(__dirname, "src/data/projects.json");
const postsPath = path.join(__dirname, "src/data/posts.json");

let projects = [];
let posts = [];
try {
  projects = readJSON(projectsPath);
} catch (e) {
  console.warn("projects.json not found or invalid; skipping project paths");
}
try {
  posts = readJSON(postsPath);
} catch (e) {
  console.warn("posts.json not found or invalid; skipping blog paths");
}

module.exports = {
  siteUrl: "https://altinalivings.com",
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*"],

  // Dynamically add /projects/* and /blog/* entries
  additionalPaths: async (config) => {
    const paths = [];

    // Projects
    for (const p of Array.isArray(projects) ? projects : []) {
      if (p?.slug) {
        paths.push({
          loc: `/projects/${p.slug}`,
          lastmod: new Date().toISOString(),
          changefreq: "monthly",
          priority: 0.8,
        });
      }
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
      "https://altinalivings.com/sitemap.xml",
    ],
  },
};
