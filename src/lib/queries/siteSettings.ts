import { prisma } from "@/lib/db";

/**
 * Admin-editable homepage content (§14.11) — swappable video, banner
 * messages, running-bar items, hero slides, testimonials. All live in the
 * SiteSetting table so the client can change them from the dashboard
 * without a developer touching code.
 *
 * `getHomepageContent()` (read side, used by the public homepage) already
 * existed; `setHomepageContent()` (write side, used by the new
 * `/admin/store-design` page) is new this session.
 */
export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    // Plain string values (e.g. homepage_video_url) aren't JSON-encoded.
    return row.value as unknown as T;
  }
}

/** Upserts one SiteSetting row. Objects/arrays are JSON-encoded; plain strings are stored as-is. */
export async function setSiteSetting(key: string, value: unknown) {
  const stored = typeof value === "string" ? value : JSON.stringify(value);
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: stored },
    update: { value: stored },
  });
}

export type HeroSlide = { imageUrl: string; headline: string; ctaLabel?: string; ctaHref?: string };
export type RunningBarItem = { icon: string; label: string };
export type Testimonial = { name: string; quote: string; rating: number };

export type HomepageContent = {
  bannerMessages: string[];
  runningBarItems: RunningBarItem[];
  videoUrl: string;
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    imageUrl: "/images/seed/hero-1.svg",
    headline: "كيان… أكثر من ستايل",
    ctaLabel: "تسوق الآن",
    ctaHref: "/collections/drop-ramadan-2026",
  },
  {
    imageUrl: "/images/seed/hero-2.svg",
    headline: "إصدارات رمضان الجديدة",
    ctaLabel: "استكشف التشكيلة",
    ctaHref: "/collections/drop-ramadan-2026",
  },
];

const DEFAULT_RUNNING_BAR_ITEMS: RunningBarItem[] = [
  { icon: "💵", label: "الدفع عند الاستلام" },
  { icon: "🚚", label: "توصيل 58 ولاية" },
  { icon: "🎧", label: "خدمة العملاء" },
  { icon: "🎨", label: "إمكانية التخصيص" },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { name: "سارة", quote: "الجودة ممتازة والتصميم مميز جداً.", rating: 5 },
  { name: "يوسف", quote: "التوصيل كان سريع والتعامل راقي.", rating: 5 },
];

export async function getHomepageContent(): Promise<HomepageContent> {
  const [bannerMessages, runningBarItems, videoUrl, heroSlides, testimonials] = await Promise.all([
    getSiteSetting<string[]>("top_banner_messages", ["🚀 التوصيل السريع: يومين إلى ثلاثة أيام بعد التأكيد", "الدفع عند الاستلام متوفر لجميع الولايات"]),
    getSiteSetting<RunningBarItem[]>("running_bar_items", DEFAULT_RUNNING_BAR_ITEMS),
    getSiteSetting<string>("homepage_video_url", ""),
    getSiteSetting<HeroSlide[]>("hero_slides", DEFAULT_HERO_SLIDES),
    getSiteSetting<Testimonial[]>("testimonials", DEFAULT_TESTIMONIALS),
  ]);

  return { bannerMessages, runningBarItems, videoUrl, heroSlides, testimonials };
}

/** Writes all five homepage-content settings at once — the admin page saves them together as one "homepage content" unit. */
export async function setHomepageContent(content: HomepageContent) {
  await Promise.all([
    setSiteSetting("top_banner_messages", content.bannerMessages),
    setSiteSetting("running_bar_items", content.runningBarItems),
    setSiteSetting("homepage_video_url", content.videoUrl),
    setSiteSetting("hero_slides", content.heroSlides),
    setSiteSetting("testimonials", content.testimonials),
  ]);
}
