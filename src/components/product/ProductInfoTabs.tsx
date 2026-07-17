"use client";

import { useState } from "react";

/** Product detail sections (§7 item 10): Description / Care Instructions. */
export function ProductInfoTabs({
  description,
  careInstructions,
}: {
  description: string;
  careInstructions: string | null;
}) {
  const [tab, setTab] = useState<"description" | "care">("description");

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex gap-4 border-b border-neutral-200">
          <button
            type="button"
            onClick={() => setTab("description")}
            className={`border-b-2 px-1 py-2 text-sm font-bold ${
              tab === "description" ? "border-kayaan-brown text-kayaan-brown" : "border-transparent text-neutral-400"
            }`}
          >
            الوصف
          </button>
          {careInstructions && (
            <button
              type="button"
              onClick={() => setTab("care")}
              className={`border-b-2 px-1 py-2 text-sm font-bold ${
                tab === "care" ? "border-kayaan-brown text-kayaan-brown" : "border-transparent text-neutral-400"
              }`}
            >
              تعليمات العناية
            </button>
          )}
        </div>
        <p className="whitespace-pre-line text-sm leading-8 text-neutral-700">
          {tab === "description" ? description : careInstructions}
        </p>
      </div>
    </section>
  );
}
