import type { RunningBarItem } from "@/lib/queries/siteSettings";
import { IconHeadset, IconSparkle, IconTruck, IconWallet } from "@/components/ui/Icon";

/**
 * Spec §6.5: BOTH an embedded video AND a running bar, stacked — not either/or.
 * The video is admin-swappable (brief R2); an empty URL renders a placeholder
 * rather than a broken player.
 *
 * The video is full-bleed and square-cornered so it reads as a cinematic break
 * in the page, matching the hero treatment. The old version floated it in a
 * `rounded-[2rem]` card with a drop shadow.
 *
 * Running bar follows the jana-store reference (brief §1.3): blush band, four
 * icon + label items evenly spaced. Static row from `md` up; below that the
 * four items cannot fit, so it marquees — and the marquee stops under reduced
 * motion via the global rule in globals.css.
 */

/** Fallbacks match the four items named in the spec. */
const FALLBACK_ITEMS: RunningBarItem[] = [
  { icon: "wallet", label: "الدفع عند الاستلام" },
  { icon: "truck", label: "توصيل 58 ولاية" },
  { icon: "headset", label: "خدمة العملاء" },
  { icon: "sparkle", label: "إمكانية التخصيص" },
];

/**
 * Admin-authored icons are emoji strings; our own defaults are icon keys. Emoji
 * stay as content (brief R10) and get the Apple-first font stack, but a named
 * key resolves to a real SVG so the default bar looks identical everywhere.
 */
function ItemIcon({ icon }: { icon: string }) {
  const className = "h-[18px] w-[18px] text-brand-600";
  switch (icon) {
    case "wallet":
      return <IconWallet className={className} />;
    case "truck":
      return <IconTruck className={className} />;
    case "headset":
      return <IconHeadset className={className} />;
    case "sparkle":
      return <IconSparkle className={className} />;
    default:
      return (
        <span className="emoji text-base" aria-hidden="true">
          {icon}
        </span>
      );
  }
}

function BarItem({ item }: { item: RunningBarItem }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 px-6 text-body-sm text-ink md:px-0">
      <ItemIcon icon={item.icon} />
      {item.label}
    </span>
  );
}

export function VideoAndRunningBar({ videoUrl, items }: { videoUrl: string; items: RunningBarItem[] }) {
  const safeItems = items.length > 0 ? items : FALLBACK_ITEMS;

  return (
    <section>
      {/* Both bands here are already document-width — the chain up to <main>
          carries no container — so neither needs `bleed-k`. See globals.css. */}
      <div className="bg-brand-900">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            className="aspect-product w-full bg-black object-cover md:aspect-hero"
          />
        ) : (
          // Deliberately short. A full 16:9 empty state is a 810px-tall slab of
          // brown in the middle of the page; an unset video should be a quiet
          // gap, not the largest element on the homepage.
          <div className="grid min-h-[9rem] w-full place-items-center py-12">
            <p className="px-6 text-center text-body-sm text-brand-200/60">
              سيتم إضافة فيديو جديد من لوحة الإدارة قريباً
            </p>
          </div>
        )}
      </div>

      <div className="overflow-hidden bg-blush py-4">
        {/* Static, evenly distributed row — desktop. */}
        <div className="container-k-wide hidden items-center justify-between md:flex">
          {safeItems.map((item, i) => (
            <BarItem key={i} item={item} />
          ))}
        </div>

        {/* Marquee — mobile. The track is duplicated for a seamless loop, and
            the copy is aria-hidden so the list is announced once (§6.3). */}
        <div className="flex md:hidden">
          <div className="animate-marquee flex w-max shrink-0">
            {safeItems.map((item, i) => (
              <BarItem key={i} item={item} />
            ))}
          </div>
          <div className="animate-marquee flex w-max shrink-0" aria-hidden="true">
            {safeItems.map((item, i) => (
              <BarItem key={`dup-${i}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
