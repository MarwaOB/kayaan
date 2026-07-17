import Link from "next/link";

type Category = { slug: string; name: string; nameAr: string };

/** "Shop by category" tiles (§6.6) — only unmasked categories ever reach this component (§4). */
export function CategoryTiles({ categories }: { categories: Category[] }) {
  const safeCategories = categories.length > 0 ? categories : [
    { slug: "t-shirts", name: "T-shirts", nameAr: "أقمصة" },
    { slug: "hoodies", name: "Hoodies", nameAr: "هووديز" },
    { slug: "totebags", name: "Totebags", nameAr: "توت باغز" },
  ];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kayaan-brown">Shop by Category</p>
          <h2 className="text-xl font-bold text-kayaan-ink">تسوق حسب القسم</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {safeCategories.map((c) => (
          <Link
            key={c.slug}
            href={`/categories/${c.slug}`}
            className="group flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl border border-stone-200 bg-white text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="text-3xl transition group-hover:scale-110">👕</span>
            <span className="text-sm font-semibold text-kayaan-ink">{c.nameAr}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
