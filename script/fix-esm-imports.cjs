/**
 * Adds .js extensions to relative imports in compiled ESM output.
 * Node.js ESM requires explicit file extensions, but tsc doesn't add them.
 *
 * Handles:
 *   from "./foo"       → from "./foo.js"
 *   from "./foo/bar"   → from "./foo/bar.js"  (if bar.js exists)
 *   from "./foo/bar"   → from "./foo/bar/index.js"  (if bar/index.js exists)
 */

const fs   = require("fs");
const path = require("path");

const DIST = path.resolve(__dirname, "..", "dist");

const IMPORT_RE = /((?:from|import)\s+["'])(\.[^"']+)(["'])/gu;

function walk (dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith(".js")) {
      fixFile(full);
    }
  }
}

function fixFile (filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const dir      = path.dirname(filePath);

  const fixed = original.replace(IMPORT_RE, (_match, prefix, specifier, suffix) => {
    // Already has an extension
    if (/\.\w+$/u.test(specifier)) {
      return `${prefix}${specifier}${suffix}`;
    }

    // Try direct .js file
    const asFile = path.resolve(dir, specifier + ".js");

    if (fs.existsSync(asFile)) {
      return `${prefix}${specifier}.js${suffix}`;
    }

    // Try directory with index.js
    const asIndex = path.resolve(dir, specifier, "index.js");

    if (fs.existsSync(asIndex)) {
      return `${prefix}${specifier}/index.js${suffix}`;
    }

    // Leave unchanged if we can't resolve
    return `${prefix}${specifier}${suffix}`;
  });

  if (fixed !== original) {
    fs.writeFileSync(filePath, fixed);
  }
}

walk(DIST);
console.log("[fix-esm-imports] Added .js extensions to relative imports in dist/");
