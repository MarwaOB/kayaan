import type { RunningBarItem } from "@/lib/queries/siteSettings";

/**
 * §6.5: BOTH an embedded video AND a running bar appear, stacked — not
 * either/or. Video is admin-swappable (empty string = not set yet, so we
 * render nothing rather than a broken player). Running bar mirrors the
 * jana-store reference: light pink background, evenly spaced icon+label
 * items (§12: static row, not necessarily auto-scrolling text).
 */
export function VideoAndRunningBar({ videoUrl, items }: { videoUrl: string; items: RunningBarItem[] }) {
  const safeItems = items.length > 0 ? items : [
    { icon: "💵", label: "الدفع عند الاستلام" },
    { icon: "🚚", label: "توصيل 58 ولاية" },
    { icon: "🎧", label: "خدمة العملاء" },
    { icon: "🎨", label: "إمكانية التخصيص" },
  ];

  return (
    <section className="bg-white">
      {videoUrl ? (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <video src={videoUrl} controls playsInline className="aspect-video w-full rounded-[2rem] bg-black object-cover shadow-lg" />
        </div>
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex aspect-video items-center justify-center rounded-[2rem] border border-dashed border-stone-300 bg-kayaan-bg text-center text-sm text-neutral-500">
            سيتم إضافة فيديو جديد من لوحة الإدارة قريباً
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 bg-kayaan-pink px-4 py-4 text-kayaan-ink sm:px-6 lg:px-8">
        {safeItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-sm font-medium shadow-sm">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
