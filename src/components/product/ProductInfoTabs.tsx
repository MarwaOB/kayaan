"use client";

import { useState } from "react";

/**
 * Product detail sections (spec §7 item 10): description / care instructions.
 *
 * An accordion rather than tabs, following the Kith PDP reference in the brief.
 * Tabs hide the fact that a second panel exists and give a 44px tap target on
 * mobile for something that should be a full-width row; accordions show every
 * heading at once and let a customer open both.
 *
 * Description opens by default — it is the one section everyone reads.
 */
type Section = { id: string; title: string; body: string };

export function ProductInfoTabs({
  description,
  careInstructions,
}: {
  description: string;
  careInstructions: string | null;
}) {
  const sections: Section[] = [
    { id: "description", title: "الوصف", body: description },
    ...(careInstructions
      ? [{ id: "care", title: "تعليمات العناية", body: careInstructions }]
      : []),
    {
      id: "shipping",
      title: "الشحن والاسترجاع",
      body: "التوصيل إلى 58 ولاية مع الدفع عند الاستلام. مدة التوصيل التقريبية من 2 إلى 5 أيام عمل حسب الولاية.\nالاستبدال والاسترجاع ممكن ضمن المدة المحددة في سياستنا، بشرط أن تكون القطعة بحالتها الأصلية.",
    },
  ];

  const [openIds, setOpenIds] = useState<string[]>(["description"]);

  function toggle(id: string) {
    setOpenIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <div className="mt-10 border-t border-line">
      {sections.map((section) => {
        const isOpen = openIds.includes(section.id);
        return (
          <div key={section.id} className="border-b border-line">
            <h2>
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${section.id}`}
                className="flex w-full items-center justify-between gap-4 py-5 text-start text-body font-semibold text-ink transition-colors duration-fast ease-k hover:text-brand-700"
              >
                {section.title}
                {/* A rotating plus: unambiguous in both directions, unlike a
                    chevron, and it reads as open/closed rather than next/back. */}
                <span
                  aria-hidden="true"
                  className={`relative grid h-5 w-5 shrink-0 place-items-center transition-transform duration-base ease-k ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <span className="absolute h-px w-4 bg-current" />
                  <span className="absolute h-4 w-px bg-current" />
                </span>
              </button>
            </h2>

            {isOpen && (
              <div id={`panel-${section.id}`} className="pb-6">
                <p className="max-w-[56ch] whitespace-pre-line text-body text-ink-muted">
                  {section.body}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
