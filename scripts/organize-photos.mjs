import sharp from "sharp";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, existsSync, statSync } from "fs";
import { join, extname, parse } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_APPLE = join(ROOT, "public", "Apple cabin photos", "Apple cabin photos");
const SRC_EXPAND = join(ROOT, "public", "Expandable photos", "Expandable photos");
const DST_APPLE = join(ROOT, "public", "images", "apple-cabin");
const DST_EXPAND = join(ROOT, "public", "images", "expandable");
const WEBP_APPLE = join(DST_APPLE, "webp");
const WEBP_EXPAND = join(DST_EXPAND, "webp");

async function processDir(src, dst, webpDir, label) {
  if (!existsSync(src)) {
    console.log(`Source not found: ${src}`);
    return [];
  }
  const files = readdirSync(src).filter(f => /\.(png|jpg|jpeg)$/i.test(f)).sort((a, b) => {
    const na = parseInt(a.match(/\d+/)?.[0] || "0");
    const nb = parseInt(b.match(/\d+/)?.[0] || "0");
    return na - nb;
  });
  console.log(`Found ${files.length} files in ${label}`);

  const results = [];

  for (const file of files) {
    const srcPath = join(src, file);
    const name = parse(file).name;
    const ext = extname(file).toLowerCase();

    // Copy original
    const dstPath = join(dst, file);
    if (!existsSync(dstPath)) {
      copyFileSync(srcPath, dstPath);
      console.log(`  Copied: ${file}`);
    }

    // Convert to WebP (max 1920px wide, quality 80)
    const webpName = `${name}.webp`;
    const webpPath = join(webpDir, webpName);

    if (!existsSync(webpPath)) {
      try {
        const info = await sharp(srcPath)
          .resize(1920, 1080, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 80, effort: 4 })
          .toFile(webpPath);
        console.log(`  WebP: ${webpName} (${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)}KB)`);
      } catch (err) {
        console.error(`  FAILED: ${file} - ${err.message}`);
      }
    }

    results.push({ file, name, ext, srcPath, dstPath, webpName });
  }

  return results;
}

async function main() {
  mkdirSync(DST_APPLE, { recursive: true });
  mkdirSync(DST_EXPAND, { recursive: true });
  mkdirSync(WEBP_APPLE, { recursive: true });
  mkdirSync(WEBP_EXPAND, { recursive: true });

  const appleFiles = await processDir(SRC_APPLE, DST_APPLE, WEBP_APPLE, "Apple Cabin");
  const expandFiles = await processDir(SRC_EXPAND, DST_EXPAND, WEBP_EXPAND, "Expandable");

  // Generate a JSON index file for use by components
  const index = {
    appleCabin: appleFiles.map(f => ({
      id: f.name,
      original: `/images/apple-cabin/${f.file}`,
      webp: `/images/apple-cabin/webp/${f.webpName}`,
    })),
    expandable: expandFiles.map(f => ({
      id: f.name,
      original: `/images/expandable/${f.file}`,
      webp: `/images/expandable/webp/${f.webpName}`,
    })),
  };

  writeFileSync(join(ROOT, "public", "images", "index.json"), JSON.stringify(index, null, 2));
  console.log(`\nDone! ${appleFiles.length + expandFiles.length} files processed.`);
  console.log(`Index written to public/images/index.json`);
}

main().catch(console.error);
