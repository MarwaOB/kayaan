import Link from "next/link";

/** Breadcrumb (spec §7 item 1): الرئيسية › [category] › [product]. */
export function Breadcrumb({
  categoryName,
  categorySlug,
  productName,
}: {
  categoryName: string;
  categorySlug: string;
  productName: string;
}) {
  return (
    <nav aria-label="مسار التصفح" className="text-caption text-ink-muted">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="transition-colors duration-fast ease-k hover:text-brand-700">
            الرئيسية
          </Link>
        </li>
        <Separator />
        <li>
          <Link
            href={`/categories/${categorySlug}`}
            className="transition-colors duration-fast ease-k hover:text-brand-700"
          >
            {categoryName}
          </Link>
        </li>
        <Separator />
        <li aria-current="page" className="line-clamp-1 text-ink">
          {productName}
        </li>
      </ol>
    </nav>
  );
}

function Separator() {
  // A thin rule rather than the "›" character — a chevron has to be mirrored in
  // RTL and adds nothing a separator doesn't.
  return <li aria-hidden="true" className="h-px w-3 shrink-0 bg-line-strong" />;
}
