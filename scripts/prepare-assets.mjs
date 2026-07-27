// Asset pipeline: turns the raw master files in /images (gitignored, ~400 MB of
// camera originals) into web-ready derivatives under /public plus a manifest the
// app can import.
//
//   npm run assets:prepare
//
// Idempotent: re-running only rewrites files whose source is newer. Pass --force
// to rebuild everything.
//
// Inputs
//   images/logo/Artboard <n> copy <v>@<s>x.png   -> public/brand/*.png|webp
//   images/<SEASON>-articles/<SEASON>/<ARTICLE>/ -> public/images/products/**
//
// Output manifests (split deliberately: the logo data is imported by a
// component that renders on every page, and must not drag 85 blur placeholders
// into the bundle with it)
//   src/data/brand-manifest.json  — logo assets, ~2 KB
//   src/data/media-manifest.json  — product photography

import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "images");
const BRAND_OUT = path.join(ROOT, "public", "brand");
const PRODUCT_OUT = path.join(ROOT, "public", "images", "products");
const DATA_DIR = path.join(ROOT, "src", "data");
const BRAND_MANIFEST = path.join(DATA_DIR, "brand-manifest.json");
const MEDIA_MANIFEST = path.join(DATA_DIR, "media-manifest.json");

const FORCE = process.argv.includes("--force");

/** Artboard number -> the logo lockup it contains. See docs/DESIGN-SYSTEM.md §2. */
const MARKS = {
  2: "wordmark", // Arabic كيان alone
  4: "lockup-horizontal", // Arabic + "KAYAAAN CLOTHING" serif, side by side
  6: "badge-framed", // double-ruled frame, Arabic over KAYAAAN
  8: "tile-solid", // full-bleed knockout tile
  10: "lockup-stacked", // arched KAYAAAN over Arabic
};

/** "copy <v>" suffix -> colourway. Hexes verified by sampling the PNGs. */
const COLORWAYS = {
  "2": { name: "espresso", hex: "#654746" },
  "3": { name: "sand", hex: "#e5d2b8" },
  "6": { name: "taupe", hex: "#9e816d" },
  bare: { name: "rosewood", hex: "#865e5d" },
};

/** Raw folder names are inconsistent (HOURRIA vs HOURIA, "DZ HOODIE"). Normalise. */
const ARTICLE_SLUGS = {
  DZ: "dz",
  "DZ HOODIE": "dz",
  GAZA: "gaza",
  HOURRIA: "hourria",
  HOURIA: "hourria",
  SINWAR: "sinwar",
};

const PRODUCT_WIDTHS = [400, 800, 1600];
const LOGO_WIDTH = 1024;

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

/** True when `out` is missing or older than `src`. */
async function isStale(src, out) {
  if (FORCE || !existsSync(out)) return true;
  const [a, b] = await Promise.all([stat(src), stat(out)]);
  return a.mtimeMs > b.mtimeMs;
}

/** 12px WebP data URI used as a Next/Image blurDataURL. */
async function blurPlaceholder(pipeline) {
  const buf = await pipeline.clone().resize(12).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function buildLogos() {
  const dir = path.join(SRC, "logo");
  if (!existsSync(dir)) {
    console.warn(`! skipping logos, ${path.relative(ROOT, dir)} not found`);
    return [];
  }
  await ensureDir(BRAND_OUT);

  const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));
  const built = [];

  for (const file of files) {
    const match = /^Artboard (\d+) copy(?: (\d+))?@\d+x\.png$/.exec(file);
    if (!match) {
      console.warn(`! unrecognised logo filename, skipped: ${file}`);
      continue;
    }
    const mark = MARKS[Number(match[1])];
    const colorway = COLORWAYS[match[2] ?? "bare"];
    if (!mark || !colorway) {
      console.warn(`! unmapped logo variant, skipped: ${file}`);
      continue;
    }

    const base = `kayaan-${mark}-${colorway.name}`;
    const src = path.join(dir, file);
    const pngOut = path.join(BRAND_OUT, `${base}.png`);
    const webpOut = path.join(BRAND_OUT, `${base}.webp`);

    // The masters are 4501px squares with the mark floating in a large
    // transparent field — trim it so the asset can be laid out on its own bounds.
    const pipeline = sharp(src).trim({ threshold: 10 }).resize({
      width: LOGO_WIDTH,
      fit: "inside",
      withoutEnlargement: true,
    });

    if (await isStale(src, pngOut)) {
      await pipeline.clone().png({ compressionLevel: 9, palette: true }).toFile(pngOut);
      await pipeline.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(webpOut);
      console.log(`brand  ${base}`);
    }

    const meta = await sharp(pngOut).metadata();
    built.push({
      mark,
      colorway: colorway.name,
      hex: colorway.hex,
      png: `/brand/${base}.png`,
      webp: `/brand/${base}.webp`,
      width: meta.width,
      height: meta.height,
    });
  }

  return built.sort((a, b) => a.png.localeCompare(b.png));
}

async function buildProducts() {
  const seasonDirs = (await readdir(SRC, { withFileTypes: true })).filter(
    (d) => d.isDirectory() && d.name.endsWith("-articles"),
  );

  const articles = [];

  for (const seasonDir of seasonDirs) {
    const season = seasonDir.name.replace("-articles", "").toLowerCase();
    // The masters nest one redundant level: SUMMER-articles/SUMMER/<ARTICLE>.
    let base = path.join(SRC, seasonDir.name);
    const inner = await readdir(base, { withFileTypes: true });
    const passthrough = inner.find(
      (d) => d.isDirectory() && d.name.toLowerCase() === season,
    );
    if (passthrough) base = path.join(base, passthrough.name);

    const articleDirs = (await readdir(base, { withFileTypes: true })).filter((d) =>
      d.isDirectory(),
    );

    for (const articleDir of articleDirs) {
      const slug = ARTICLE_SLUGS[articleDir.name.toUpperCase()];
      if (!slug) {
        console.warn(`! unmapped article folder, skipped: ${articleDir.name}`);
        continue;
      }

      const from = path.join(base, articleDir.name);
      const to = path.join(PRODUCT_OUT, season, slug);
      await ensureDir(to);

      const sources = (await readdir(from))
        .filter((f) => /\.(jpe?g|png)$/i.test(f))
        .sort();

      const images = [];
      for (const [i, file] of sources.entries()) {
        const src = path.join(from, file);
        const stem = `${slug}-${String(i + 1).padStart(2, "0")}`;
        const pipeline = sharp(src).rotate(); // honour EXIF orientation
        const meta = await pipeline.metadata();

        const srcset = {};
        for (const width of PRODUCT_WIDTHS) {
          if (width > meta.width) continue;
          const out = path.join(to, `${stem}-${width}.webp`);
          if (await isStale(src, out)) {
            await pipeline
              .clone()
              .resize({ width, withoutEnlargement: true })
              .webp({ quality: 82 })
              .toFile(out);
          }
          srcset[width] = `/images/products/${season}/${slug}/${stem}-${width}.webp`;
        }

        images.push({
          id: createHash("sha1").update(`${season}/${slug}/${file}`).digest("hex").slice(0, 10),
          src: srcset[Math.max(...Object.keys(srcset).map(Number))],
          srcset,
          width: meta.width,
          height: meta.height,
          aspect: Number((meta.width / meta.height).toFixed(4)),
          orientation: meta.width > meta.height ? "landscape" : "portrait",
          blurDataURL: await blurPlaceholder(pipeline),
          master: path.relative(ROOT, src).replace(/\\/g, "/"),
        });
      }

      console.log(`photos ${season}/${slug} — ${images.length} images`);
      articles.push({ season, slug, source: articleDir.name, images });
    }
  }

  return articles;
}

async function main() {
  if (!existsSync(SRC)) {
    console.error(
      `Masters not found at ${path.relative(ROOT, SRC)}. This folder is gitignored — restore it from the brand drive before running.`,
    );
    process.exit(1);
  }

  const [logos, articles] = [await buildLogos(), await buildProducts()];

  await ensureDir(DATA_DIR);
  const stamp = {
    generatedAt: new Date().toISOString(),
    generatedBy: "scripts/prepare-assets.mjs",
  };

  await writeFile(
    BRAND_MANIFEST,
    `${JSON.stringify({ ...stamp, logos }, null, 2)}\n`,
    "utf8",
  );
  await writeFile(
    MEDIA_MANIFEST,
    `${JSON.stringify({ ...stamp, productWidths: PRODUCT_WIDTHS, articles }, null, 2)}\n`,
    "utf8",
  );

  const total = articles.reduce((n, a) => n + a.images.length, 0);
  console.log(
    `\n${logos.length} logo assets, ${total} product images across ${articles.length} articles.`,
  );
  console.log(`manifests -> ${path.relative(ROOT, BRAND_MANIFEST)}, ${path.relative(ROOT, MEDIA_MANIFEST)}`);
}

await main();
