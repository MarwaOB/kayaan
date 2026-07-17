"use client";

import { useState } from "react";
import Link from "next/link";

type Category = { slug: string; nameAr: string };

/** Newsletter signup (§2 "Newsletter management" — this is the storefront write-side). */
function NewsletterSignup() {
  const [contact, setContact] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, left empty by real users
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, website }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "حدث خطأ، حاول مجدداً.");
        setStatus("error");
        return;
      }
      setStatus("done");
      setContact("");
    } catch {
      setError("حدث خطأ، حاول مجدداً.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="mb-6 text-center text-sm font-bold text-green-700">تم الاشتراك، شكراً لك! 🎉</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 text-center">
      <p className="mb-2 font-bold">اشترك في نشرتنا البريدية</p>
      <p className="mb-3 text-xs text-neutral-500">كن أول من يعلم بالتخفيضات والإصدارات الجديدة</p>
      <div className="mx-auto flex max-w-sm gap-2">
        <input
          required
          dir="ltr"
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="example@mail.com"
          className="flex-1 rounded-full border border-neutral-200 px-4 py-2 text-sm"
        />
        {/* Honeypot — hidden from real users via CSS, not `type="hidden"`, since some bots skip those */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="absolute h-0 w-0 opacity-0"
          aria-hidden="true"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-kayaan-brown px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {status === "loading" ? "..." : "اشترك"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </form>
  );
}

/** Footer (§9): categories grouped 4-per-row, brand blurb, main pages, social + copyright. */
export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-8 border-t border-neutral-200 bg-white px-4 py-10 text-sm">
      <div className="mx-auto max-w-6xl">
        <NewsletterSignup />

        <div className="mb-8 grid grid-cols-4 gap-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="rounded-lg border border-neutral-200 py-3 text-center font-medium"
            >
              {c.nameAr}
            </Link>
          ))}
        </div>

        <div className="mb-6 text-center">
          <p className="mb-1 text-lg font-bold">كيان</p>
          <p className="mx-auto max-w-md text-neutral-500">كيان… أكثر من ستايل. ملابس عصرية بطابع عربي وإسلامي.</p>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-4 text-neutral-600">
          <Link href="/pages/about">من نحن</Link>
          <Link href="/pages/refund-policy">سياسة الاستبدال والاسترجاع</Link>
          <Link href="/pages/privacy">سياسات الخصوصية</Link>
          <Link href="/pages/terms">شروط الاستخدام</Link>
          <Link href="/pages/shipping-policy">سياسة الطلب والشحن</Link>
          <Link href="/pages/size-guide">دليل المقاسات</Link>
        </div>

        <div className="mb-6 flex justify-center gap-4">
          <a href="https://instagram.com/kayaaan.clothing" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="https://wa.me/213562009989" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href="mailto:hello@kayaaanclothing.com">Email</a>
        </div>

        <p className="text-center text-xs text-neutral-400">© 2026 By Kayaan</p>
      </div>
    </footer>
  );
}
