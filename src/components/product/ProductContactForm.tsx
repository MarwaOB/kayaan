"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "213562009989"; // §1 — same support number as the fixed WhatsApp bubble

/**
 * Contact form (§7 item 11) — confirmed as its own section, separate from
 * both bundles and the "our service" reassurance block. No customer
 * accounts (§8), so a question about this exact product is handed off to
 * WhatsApp support with the product name pre-filled, rather than stored
 * server-side.
 */
export function ProductContactForm({ productName }: { productName: string }) {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = encodeURIComponent(
      `مرحباً، اسمي ${name}. لدي سؤال بخصوص المنتج "${productName}": ${question}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="bg-white px-4 py-8">
      <h2 className="mb-1 text-lg font-bold">لديك سؤال حول هذا المنتج؟</h2>
      <p className="mb-4 text-sm text-neutral-500">راسلنا وسنرد عليك عبر واتساب في أقرب وقت.</p>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الاسم"
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <textarea
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="سؤالك"
          rows={3}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-full bg-kayaan-brown py-2.5 text-sm font-bold text-white">
          إرسال عبر واتساب
        </button>
      </form>
    </section>
  );
}
