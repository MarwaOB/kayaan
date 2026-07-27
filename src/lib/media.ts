// Typed access to the asset manifests produced by `npm run assets:prepare`.
//
// The app reads images through here, never from /images (camera masters,
// gitignored) and never by hand-writing a /public path — a typo there fails
// silently in production, a miss here fails at build.
//
// Two manifests, imported separately on purpose: `brand-manifest.json` is ~4 KB
// and safe to pull into a component that renders on every page;
// `media-manifest.json` is ~64 KB of blur placeholders and must stay on the
// server side of the boundary.

import brandManifest from "@/data/brand-manifest.json";
import mediaManifest from "@/data/media-manifest.json";

export type LogoMark =
  | "wordmark"
  | "lockup-horizontal"
  | "lockup-stacked"
  | "badge-framed"
  | "tile-solid";

export type LogoColorway = "espresso" | "sand" | "taupe" | "rosewood";

export type LogoAsset = {
  mark: string;
  colorway: string;
  hex: string;
  png: string;
  webp: string;
  width: number;
  height: number;
};

export type ProductImage = {
  id: string;
  src: string;
  srcset: Record<string, string>;
  width: number;
  height: number;
  aspect: number;
  orientation: "landscape" | "portrait";
  blurDataURL: string;
  master: string;
};

export type Article = {
  season: string;
  slug: string;
  source: string;
  images: ProductImage[];
};

const LOGOS = brandManifest.logos as LogoAsset[];
const ARTICLES = mediaManifest.articles as Article[];

/**
 * Resolve a logo asset. `rosewood` was not produced for `wordmark` or
 * `lockup-horizontal`; those fall back to `espresso` rather than 404.
 */
export function getLogo(mark: LogoMark, colorway: LogoColorway): LogoAsset {
  const exact = LOGOS.find((l) => l.mark === mark && l.colorway === colorway);
  if (exact) return exact;

  const fallback = LOGOS.find((l) => l.mark === mark && l.colorway === "espresso");
  if (fallback) return fallback;

  throw new Error(
    `No logo asset for mark "${mark}". Run \`npm run assets:prepare\` — /public/brand may be stale.`,
  );
}

/** All photography for one article, e.g. `getArticle("winter", "sinwar")`. */
export function getArticle(season: string, slug: string): Article | undefined {
  return ARTICLES.find((a) => a.season === season && a.slug === slug);
}

/** Every article, for admin pickers and seed scripts. */
export function listArticles(): Article[] {
  return ARTICLES;
}

/**
 * `srcSet` string for a plain <img>. Prefer next/image where possible; this is
 * for the cases where you need raw control (the full-bleed hero, mainly).
 */
export function toSrcSet(image: ProductImage): string {
  return Object.entries(image.srcset)
    .map(([width, url]) => `${url} ${width}w`)
    .join(", ");
}
