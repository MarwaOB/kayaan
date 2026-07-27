// Curated editorial imagery.
//
// The storefront's *product* images come from the database. These are the
// editorial slots — hero, category tiles, lookbook, dark-section backdrops —
// which have no DB-backed source and would otherwise fall back to the grey
// /images/seed/*.svg placeholders.
//
// Picks are hand-chosen from the shoot (see docs/DESIGN-SYSTEM.md §7): warm
// Algiers street and Moorish-arcade frames whose sandstone tones sit inside the
// brand palette rather than fighting it.
//
// Indexes are 1-based and match the manifest ordering. Every accessor degrades
// to a valid image instead of throwing, so a re-shoot that shortens an article
// cannot break the homepage.

import { getArticle, toSrcSet, type ProductImage } from "@/lib/media";

export type EditorialShot = {
  image: ProductImage;
  /** Arabic alt text — every editorial image is content, never decorative. */
  alt: string;
};

/** Nth image of an article, clamped into range. */
function pick(season: string, slug: string, n: number): ProductImage | null {
  const article = getArticle(season, slug);
  if (!article || article.images.length === 0) return null;
  return article.images[Math.min(Math.max(n, 1), article.images.length) - 1];
}

function shot(season: string, slug: string, n: number, alt: string): EditorialShot | null {
  const image = pick(season, slug, n);
  return image ? { image, alt } : null;
}

function compact(shots: Array<EditorialShot | null>): EditorialShot[] {
  return shots.filter((s): s is EditorialShot => s !== null);
}

/**
 * Hero frames — wide, architectural, model at distance so the headline has
 * somewhere quiet to sit.
 */
export const HERO_SHOTS: EditorialShot[] = compact([
  shot("winter", "gaza", 4, "هودي كيان الأبيض أمام أقواس العمارة الجزائرية"),
  shot("winter", "sinwar", 4, "هودي كيان الأسود تحت سماء الجزائر"),
  shot("winter", "dz", 4, "هودي «جزائري» بلون الرمل"),
]);

/**
 * Category tiles — one clear garment per frame, since the tile is small and the
 * label sits over the lower third.
 */
export const CATEGORY_SHOTS: Record<string, EditorialShot | null> = {
  "t-shirts": shot("summer", "hourria", 2, "تيشيرت «حرية»"),
  hoodies: shot("winter", "dz", 3, "هودي «جزائري»"),
  totebags: shot("summer", "dz", 3, "تيشيرت كيان الصيفي"),
  joggers: shot("winter", "hourria", 5, "هودي «حرية» الأبيض"),
  shorts: shot("summer", "gaza", 4, "تيشيرت كيان أمام باب المسجد"),
  backpacks: shot("winter", "sinwar", 5, "تفصيل طباعة هودي كيان"),
};

/** Falls back to a rotating pick so an unmapped category still gets a photo. */
export function categoryShot(slug: string, index: number): EditorialShot | null {
  return CATEGORY_SHOTS[slug] ?? LOOKBOOK[index % Math.max(LOOKBOOK.length, 1)] ?? null;
}

/**
 * Lookbook grid — the Instagram/community band. Mixed crops on purpose; the
 * grid reads better when the frames aren't all the same distance.
 */
export const LOOKBOOK: EditorialShot[] = compact([
  shot("summer", "hourria", 2, "تيشيرت «حرية» — تفاصيل الطباعة"),
  shot("summer", "dz", 5, "تيشيرتات كيان الصيفية"),
  shot("winter", "gaza", 1, "هودي كيان الأبيض"),
  shot("winter", "sinwar", 6, "هودي كيان الأسود"),
  shot("summer", "sinwar", 1, "تيشيرت كيان الأسود"),
  shot("winter", "dz", 6, "هودي «جزائري»"),
]);

/**
 * A shot flattened to plain strings, for handing across the server/client
 * boundary.
 *
 * The listing grid is a client component and must never import this module
 * directly: `media-manifest.json` is ~64 KB of blur placeholders, and importing
 * it from a `"use client"` file puts every byte in the browser bundle. The
 * server picks the frames and passes three fields.
 */
export type EditorialFrame = {
  src: string;
  /** Absent for admin-uploaded covers, which carry no generated width set. */
  srcSet?: string;
  alt: string;
  /** One line of Arabic set over the image. Optional — the photo can carry it alone. */
  caption?: string;
};

export function toEditorialFrame(shot: EditorialShot | null, caption?: string): EditorialFrame | null {
  if (!shot) return null;
  return { src: shot.image.src, srcSet: toSrcSet(shot.image), alt: shot.alt, caption };
}

/**
 * Full-bleed frames woven between the rows of a product grid — the editorial
 * break that stops a long list reading as a spreadsheet. Offset by page so two
 * category pages visited in a row don't show the same photograph.
 */
export function editorialFrames(count: number, offset = 0, captions: string[] = []): EditorialFrame[] {
  if (LOOKBOOK.length === 0) return [];

  return Array.from({ length: count }, (_, i) =>
    toEditorialFrame(LOOKBOOK[(offset + i * 2) % LOOKBOOK.length], captions[i]),
  ).filter((frame): frame is EditorialFrame => frame !== null);
}

/** Stable per-slug offset, so a given category always gets the same frames. */
export function frameOffset(slug: string): number {
  let hash = 0;
  for (const char of slug) hash = (hash + char.charCodeAt(0)) % 997;
  return hash;
}

/** Single frame for the menu preview panel and other one-off slots. */
export const MENU_SHOT = HERO_SHOTS[0] ?? null;

/** Wide frame behind the newsletter / brand statement band. */
export const STATEMENT_SHOT = shot("summer", "hourria", 5, "كيان — من الجزائر");
