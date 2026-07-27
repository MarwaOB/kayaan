"use client";

import { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { IconArrowEnd, IconRuler } from "@/components/ui/Icon";
import {
  MEASURE_STEPS,
  SIZE_FIT_NOTE,
  SIZE_TOLERANCE_NOTE,
  SIZE_TOPS,
} from "@/data/size-guide";

// Tops only — the modal answers "which size is this garment?" for the product
// in view. Trousers, and the how-we-measure detail behind them, live on
// /pages/size-guide, linked at the foot of the modal.
const MEASURE_TOPS = MEASURE_STEPS.filter((s) => s.label !== "الخصر");

/**
 * Size guide (spec §7 item 6, brief R8) — a modal on the product page, never a
 * route change.
 *
 * Now goes through the shared Modal, which brings the Esc key, a focus trap,
 * focus restoration and a body-scroll lock that the hand-rolled overlay had
 * none of. Also adds the shoulder measurement and a how-to-measure note: "which
 * size am I?" is the question this modal exists to answer, and a bare
 * chest/length table only half-answered it.
 */
export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-caption font-semibold text-brand-700 underline underline-offset-4 transition-colors duration-fast ease-k hover:text-brand-800"
      >
        <IconRuler className="h-4 w-4" />
        دليل المقاسات
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="دليل المقاسات"
        footnote={SIZE_TOLERANCE_NOTE}
      >
        {/* Wide content scrolls inside its own container — the page never
            scrolls sideways (DESIGN-SYSTEM.md §4.4). */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-body-sm">
            <caption className="sr-only">جدول المقاسات بالسنتيمتر</caption>
            <thead>
              <tr className="border-b border-line-strong text-caption text-ink-muted">
                {SIZE_TOPS.columns.map((col) => (
                  <th key={col} scope="col" className="py-3 text-start font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_TOPS.rows.map((row) => (
                <tr key={row.size} className="border-b border-line last:border-0">
                  <th scope="row" className="py-3 text-start font-semibold text-ink">
                    {row.size}
                  </th>
                  {row.values.map((value, i) => (
                    <td key={SIZE_TOPS.columns[i + 1]} className="py-3 text-ink-muted">
                      <span dir="ltr" className="tabular">
                        {value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <h3 className="text-body font-semibold text-ink">كيف تقيس؟</h3>
          <ul className="mt-3 space-y-2 text-body-sm text-ink-muted">
            {MEASURE_TOPS.map((step) => (
              <li key={step.label}>
                <span className="font-medium text-ink">{step.label}:</span> {step.text}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-body-sm text-ink-muted">{SIZE_FIT_NOTE}</p>

          <Link
            href="/pages/size-guide"
            className="group mt-5 inline-flex items-center gap-2 text-body-sm font-semibold text-brand-700 transition-colors duration-fast ease-k hover:text-brand-800"
          >
            دليل المقاسات الكامل، بما فيه الجوغرز والسراويل
            {/* RTL: "forward" is leftward, so the nudge is negative. */}
            <IconArrowEnd className="h-4 w-4 transition-transform duration-base ease-k group-hover:-translate-x-1" />
          </Link>
        </div>
      </Modal>
    </>
  );
}
