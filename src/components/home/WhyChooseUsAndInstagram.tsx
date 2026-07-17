/** Why choose us (§6.11) — pulled from the client's own "لماذا كيان؟" copy (§1). */
export function WhyChooseUs() {
  const points = [
    { icon: "✨", title: "تصاميم أصيلة", text: "تصاميم مستوحاة من الثقافة العربية والإسلامية." },
    { icon: "🧵", title: "جودة عالية", text: "اهتمام بأدق التفاصيل في كل قطعة." },
    { icon: "📦", title: "تجربة مختلفة", text: "كل قطعة لها قصة، وكل عميل جزء من الأثر." },
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-center text-xl font-bold text-kayaan-ink">لماذا كيان؟</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-[1.25rem] border border-stone-200 bg-kayaan-bg p-5 text-center">
              <div className="mb-3 text-3xl">{p.icon}</div>
              <p className="mb-2 font-bold text-kayaan-ink">{p.title}</p>
              <p className="text-sm leading-7 text-neutral-600">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Follow us on Instagram / coupon callout (§6.12) */
export function InstagramCallout() {
  return (
    <section className="bg-kayaan-brownDark px-4 py-10 text-center text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-8 backdrop-blur">
        <p className="mb-2 text-lg font-bold">تابعونا على إنستغرام</p>
        <p className="mb-4 text-sm text-stone-200">شاركوا أحدث الإصدارات والخصومات الخاصة مع مجتمع كيان.</p>
        <a
          href="https://instagram.com/kayaaan.clothing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-kayaan-brownDark transition hover:bg-kayaan-accent"
        >
          @kayaaan.clothing
        </a>
      </div>
    </section>
  );
}
