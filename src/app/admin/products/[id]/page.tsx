"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";
import ProductForm, { ProductFormValues } from "@/components/admin/ProductForm";

function toStr(n: number | null | undefined) {
  return n === null || n === undefined ? "" : String(n);
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [values, setValues] = useState<ProductFormValues | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    adminFetch(`/api/admin/products/${params.id}`)
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const { product } = await res.json();
        setValues({
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          careInstructions: product.careInstructions ?? "",
          salePrice: toStr(product.salePrice),
          discountPrice: toStr(product.discountPrice),
          costPrice: toStr(product.costPrice),
          rawPrice: toStr(product.rawPrice),
          sponsorSpend: toStr(product.sponsorSpend),
          profit: toStr(product.profit),
          trending: product.trending,
          metaDescription: product.metaDescription ?? "",
          categoryId: product.categoryId,
          images: product.images.map((image: any) => image.url),
          variants: product.variants.map((v: any) => ({
            id: v.id,
            color: v.color,
            size: v.size,
            sku: v.sku,
            stock: v.stock,
          })),
        });
      })
      .catch(() => setNotFound(true));
  }, [params.id]);

  if (notFound) return <p className="text-sm text-red-600">لم يتم العثور على المنتج.</p>;
  if (!values) return <p className="text-sm text-neutral-400">...جاري التحميل</p>;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">تعديل المنتج</h1>
      <ProductForm initial={values} />
    </div>
  );
}
