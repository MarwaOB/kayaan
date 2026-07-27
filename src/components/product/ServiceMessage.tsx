import { toArabicIndex } from "@/lib/format";
import { IconHeadset, IconSparkle, IconTruck, IconWallet } from "@/components/ui/Icon";

const POINTS = [
  { Icon: IconTruck, label: "توصيل لكل الولايات", desc: "58 ولاية، مع الدفع عند الاستلام." },
  { Icon: IconWallet, label: "استبدال واسترجاع", desc: "خلال المدة المحددة في سياستنا." },
  { Icon: IconHeadset, label: "دعم عبر واتساب", desc: "نرد على استفساراتكم بسرعة." },
  { Icon: IconSparkle, label: "جودة مضمونة", desc: "قماش مختار بعناية لراحة أطول." },
];

/**
 * "Our service" reassurance block (spec §7 item 13).
 *
 * Hairline columns on the open canvas, matching "لماذا كيان؟" on the home page,
 * rather than four white cards inside a fifth bordered card. Emoji become drawn
 * icons for the same reason as everywhere else (DESIGN-SYSTEM.md §3.5).
 */
export function ServiceMessage() {
  return (
    <section className="section-k bg-surface">
      <div className="container-k-wide">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ Icon, label, desc }, i) => (
            <div
              key={label}
              className="border-t border-line py-8 lg:px-8 lg:first:ps-0 lg:last:pe-0 lg:[&+&]:border-s lg:[&+&]:border-s-line"
            >
              <div className="flex items-center gap-3">
                <span className="tabular text-caption text-brand-600">{toArabicIndex(i + 1)}</span>
                <Icon className="h-[18px] w-[18px] text-brand-600" />
              </div>
              <h3 className="mt-3 text-body font-semibold text-ink">{label}</h3>
              <p className="mt-1.5 text-body-sm text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
