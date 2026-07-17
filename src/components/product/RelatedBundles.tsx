import Link from "next/link";
import type { BundleCardData } from "@/components/home/BundlesSection";

/** Related bundles (§7 item 12) — confirmed as its own section, separate from the contact form. */
export function RelatedBundles({ bundles }: { bundles: BundleCardData[] }) {
  if (bundles.length === 0) return null;

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-5 text-xl font-bold text-kayaan-ink">تحصل عليه ضمن هذه الحزم</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {bundles.map((b) => (
            <Link key={b.id} href={`/bundles/${b.slug}`} className="group flex flex-col gap-3 rounded-[1.5rem] border border-stone-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-kayaan-bg">
                {b.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.coverImage} alt={b.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-neutral-400">
                    {b.name}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-kayaan-ink">{b.name}</p>
                <p className="text-sm font-bold text-kayaan-brownDark">
                  {b.bundlePrice.toLocaleString("ar-DZ")} د.ج
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
