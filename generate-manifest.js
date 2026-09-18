// Run with: node generate-manifest.js
// Scans images/ and writes images/manifest.json listing all image files.
const fs = require("fs");
const path = require("path");

const IMAGES_DIR = path.join(__dirname, "images/Random_character_generator");
const MANIFEST_PATH = path.join(__dirname, "images/manifest.json");
const EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);

const files = fs
  .readdirSync(IMAGES_DIR)
  .filter((f) => EXTENSIONS.has(path.extname(f).toLowerCase()))
  .sort();

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(files, null, 2) + "\n");
console.log(`Wrote ${files.length} entries to ${MANIFEST_PATH}`);
