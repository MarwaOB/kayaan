"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { IconArrowEnd, IconInstagram, IconMail, IconWhatsApp } from "@/components/ui/Icon";
import { CONTACT, INFO_PAGES } from "@/data/site-pages";

type Category = { slug: string; nameAr: string };

/** Newsletter signup — the storefront write-side of admin "Newsletter management" (spec §2). */
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
    return (
      <p className="text-body font-semibold text-brand-200">
        تم الاشتراك، شكراً لك{" "}
        <span className="emoji" role="img" aria-label="قلب بني">
          🤎
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="newsletter-contact" className="block text-body font-semibold text-brand-50">
        اشترك في نشرتنا
      </label>
      <p className="mt-1.5 text-body-sm text-brand-200/70">
        كن أول من يعلم بالإصدارات الجديدة والتخفيضات.
      </p>

      <div className="mt-4 flex gap-2">
        <input
          id="newsletter-contact"
          required
          dir="ltr"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="example@mail.com"
          aria-invalid={status === "error"}
          aria-describedby={error ? "newsletter-error" : undefined}
          // 16px minimum — anything smaller makes iOS zoom on focus (§6.7).
          className="h-11 min-w-0 flex-1 rounded-sm border border-brand-200/25 bg-brand-800/60 px-4 text-[16px] text-brand-50 placeholder:text-brand-200/40 focus-visible:outline-brand-200"
        />
        {/* Honeypot — hidden with CSS rather than type="hidden", which some bots skip. */}
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-brand-200 text-brand-900 transition duration-fast ease-k hover:bg-white disabled:opacity-60"
          aria-label="اشترك في النشرة"
        >
          <IconArrowEnd className="h-5 w-5" />
        </button>
      </div>

      {error && (
        <p id="newsletter-error" className="mt-2 text-body-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}

/**
 * Footer (spec §9) — categories 4 per row, brand blurb + logo, main pages,
 * socials, "© 2026 By Kayaan".
 *
 * Espresso field rather than white: it closes the page and lets the sand logo
 * appear in its on-dark colourway, which is the pairing the brand assets were
 * actually drawn for.
 */
export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="bg-brand-900 text-brand-100">
      <div className="container-k-wide py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Logo mark="lockup-horizontal" colorway="sand" width={190} />
            <p className="mt-5 max-w-[42ch] text-body text-brand-200/75">
              كيان… أكثر من ستايل. ملابس عصرية بطابع عربي وإسلامي، مصنوعة في الجزائر.
            </p>

            <div className="mt-8 flex items-center gap-2">
              <SocialLink href={CONTACT.instagram} label="إنستغرام">
                <IconInstagram className="h-[18px] w-[18px]" />
              </SocialLink>
              <SocialLink href={CONTACT.whatsappHref} label="واتساب">
                <IconWhatsApp className="h-[18px] w-[18px]" />
              </SocialLink>
              <SocialLink href={`https://mail.google.com/mail/?view=cm&to=${CONTACT.email}`} label="البريد الإلكتروني">
                <IconMail className="h-[18px] w-[18px]" />
              </SocialLink>
            </div>
          </div>

          <div className="lg:justify-self-end lg:w-full lg:max-w-sm">
            <NewsletterSignup />
          </div>
        </div>

        {/* §9 — categories as boxes, 4 per row. */}
        {categories.length > 0 && (
          <nav aria-label="الأقسام" className="mt-14 border-t border-brand-200/15 pt-10">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className="rounded-sm border border-brand-200/15 px-4 py-4 text-center text-body-sm font-medium text-brand-50 transition duration-fast ease-k hover:border-brand-200/40 hover:bg-brand-800/50"
                >
                  {c.nameAr}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* Bottom bar. The policy links used to be a loose wrap of six items
            with the copyright orphaned twelve units below it; grouping them
            into one ruled bar gives the footer a foot instead of a trailing
            edge, and the underline-on-hover makes them read as links at a
            weight this low. */}
        <div className="mt-12 border-t border-brand-200/15 pt-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <nav aria-label="روابط الموقع">
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {INFO_PAGES.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/pages/${p.slug}`}
                      className="text-body-sm text-brand-200/70 underline decoration-transparent underline-offset-4 transition-colors duration-fast ease-k hover:text-brand-50 hover:decoration-brand-200/60"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="shrink-0 text-caption text-brand-200/50">
              {/* Client-mandated string, spec §9 — the only Latin in the footer,
                  so it is isolated or the bidi algorithm reorders it. */}
              <span dir="ltr">© 2026 By Kayaan</span>
              <span className="mx-2 text-brand-200/30" aria-hidden="true">
                ·
              </span>
              جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-pill border border-brand-200/20 text-brand-100 transition duration-fast ease-k hover:border-brand-200/50 hover:bg-brand-800/60 hover:text-white"
    >
      {children}
    </a>
  );
}
