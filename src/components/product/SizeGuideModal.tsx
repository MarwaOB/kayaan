"use client";

import { useState } from "react";

const SIZE_TABLE = [
  { size: "S", chest: "50", length: "68" },
  { size: "M", chest: "54", length: "70" },
  { size: "L", chest: "58", length: "72" },
  { size: "XL", chest: "62", length: "74" },
  { size: "XXL", chest: "66", length: "76" },
];

/**
 * Size guide (§7 item 6) — opens as a popup/modal on the product page itself,
 * confirmed via client screenshot, NOT a separate page navigation.
 */
export function SizeGuideModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-kayaan-brown underline">
        دليل المقاسات
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold">دليل المقاسات</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label="إغلاق" className="text-xl">
                ✕
              </button>
            </div>
            <table className="w-full text-center text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500">
                  <th className="py-2">المقاس</th>
                  <th className="py-2">الصدر (سم)</th>
                  <th className="py-2">الطول (سم)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_TABLE.map((row) => (
                  <tr key={row.size} className="border-b border-neutral-100">
                    <td className="py-2 font-medium">{row.size}</td>
                    <td className="py-2">{row.chest}</td>
                    <td className="py-2">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-neutral-400">
              القياسات تقريبية وقد تختلف بمقدار 1-2 سم حسب القطعة.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
