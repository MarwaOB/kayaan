import Link from "next/link";

/** Breadcrumb (§7 item 1): الرئيسية › [category] › [product name]. */
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
    <nav aria-label="breadcrumb" className="px-4 py-3 text-xs text-neutral-500">
      <ol className="flex items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-kayaan-brown">
            الرئيسية
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li>
          <Link href={`/categories/${categorySlug}`} className="hover:text-kayaan-brown">
            {categoryName}
          </Link>
        </li>
        <li aria-hidden>›</li>
        <li className="line-clamp-1 font-medium text-kayaan-ink">{productName}</li>
      </ol>
    </nav>
  );
}
