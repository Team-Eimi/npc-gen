// Run with: node generate-manifest.js
// Scans images/ and writes images/manifest.json listing all image files.
const fs = require("fs");
const path = require("path");

const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

const TARGETS = [
  ["images/Random_character_generator", "images/manifest.json"],
  ["images/textpost", "images/textpost-manifest.json"],
];

for (const [dir, manifest] of TARGETS) {
  const imagesDir = path.join(__dirname, dir);
  const manifestPath = path.join(__dirname, manifest);
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort();

  fs.writeFileSync(manifestPath, JSON.stringify(files, null, 2) + "\n");
  console.log(`Wrote ${files.length} entries to ${manifestPath}`);
}
