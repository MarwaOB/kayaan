"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { IconWhatsApp } from "@/components/ui/Icon";

const WHATSAPP_NUMBER = "213562009989"; // spec §1 — same support number as the bubble

/**
 * Contact form (spec §7 item 11) — its own section, separate from both bundles
 * and the "our service" block.
 *
 * There are no customer accounts (§8), so a question about this specific
 * product is handed to WhatsApp with the product name pre-filled rather than
 * stored server-side. The button says so plainly — the previous version looked
 * like a form that would email someone.
 */
export function ProductContactForm({ productName }: { productName: string }) {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(
      `مرحباً، اسمي ${name}. لدي سؤال بخصوص المنتج "${productName}": ${question}`,
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  const field =
    "w-full rounded-sm border border-line-strong bg-surface px-4 text-[16px] text-ink placeholder:text-ink-subtle";

  return (
    <section className="section-k bg-surface">
      <div className="container-k-wide">
        <SectionHeader
          index={1}
          title="لديك سؤال عن هذه القطعة؟"
          subtitle="اكتب سؤالك وسنكمل الحديث معك مباشرة على واتساب."
        />

        <form onSubmit={handleSubmit} className="max-w-xl">
          <label htmlFor="contact-name" className="block text-caption text-ink-muted">
            الاسم
          </label>
          <input
            id="contact-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-2 h-11 ${field}`}
          />

          <label htmlFor="contact-question" className="mt-5 block text-caption text-ink-muted">
            سؤالك
          </label>
          <textarea
            id="contact-question"
            required
            rows={4}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={`mt-2 py-3 ${field}`}
          />

          <button
            type="submit"
            className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-sm bg-brand-700 px-7 text-body font-semibold text-white transition duration-fast ease-k hover:bg-brand-800"
          >
            <IconWhatsApp className="h-[18px] w-[18px]" />
            متابعة على واتساب
          </button>
        </form>
      </div>
    </section>
  );
}
