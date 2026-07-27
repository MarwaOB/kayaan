// The six standing information pages (spec §1 "Site navigation", §9 footer).
//
// One registry, read by the footer link row, the page route, and the page's own
// sibling navigation — so a page can never appear in the footer and 404, and the
// nav rail can never drift out of order from the footer.
//
// Copy lives in the route (`src/app/pages/[slug]/page.tsx`); this file carries
// only what navigation needs.

export type InfoPageIcon = "about" | "ruler" | "truck" | "exchange" | "document" | "shield";

export type InfoPageMeta = {
  slug: string;
  /** Nav label. Kept short — it has to fit a rail and a chip strip. */
  label: string;
  /** Page title. May be longer and punctuated differently from the label. */
  title: string;
  /** Sits under the title, and becomes the meta description. */
  description: string;
  icon: InfoPageIcon;
};

/**
 * Order is deliberate: brand story first, then the sizing question that blocks a
 * purchase, then the three post-purchase policies, then the legal pair.
 */
export const INFO_PAGES: InfoPageMeta[] = [
  {
    slug: "about",
    label: "من نحن",
    title: "من نحن؟",
    description: "قصة كيان: الفكرة، الرؤية، والأثر الذي نصنعه في كل قطعة.",
    icon: "about",
  },
  {
    slug: "size-guide",
    label: "دليل المقاسات",
    title: "دليل المقاسات",
    description: "جداول القياسات وطريقة القياس، حتى تختار مقاسك من أول مرة.",
    icon: "ruler",
  },
  {
    slug: "shipping-policy",
    label: "سياسة الطلب والشحن",
    title: "سياسة الطلب والشحن",
    description: "من لحظة الطلب إلى باب بيتك: التأكيد، التجهيز، والتوصيل لكل الولايات.",
    icon: "truck",
  },
  {
    slug: "refund-policy",
    label: "سياسة الاستبدال والاسترجاع",
    title: "سياسة الاستبدال والاسترجاع",
    description: "المدة، الشروط، وتوزيع تكاليف الشحن في حالتي الاستبدال والاسترجاع.",
    icon: "exchange",
  },
  {
    slug: "terms",
    label: "شروط الاستخدام",
    title: "شروط الاستخدام",
    description: "الأحكام التي تنظّم استخدام المتجر وإتمام الطلبات.",
    icon: "document",
  },
  {
    slug: "privacy",
    label: "سياسات الخصوصية",
    title: "سياسة الخصوصية",
    description: "ما نجمعه من بيانات، ولماذا، وكيف نحميه.",
    icon: "shield",
  },
];

export function getInfoPage(slug: string): InfoPageMeta | undefined {
  return INFO_PAGES.find((p) => p.slug === slug);
}

/** Contact points, quoted from spec §1. Used by the help card and the footer. */
export const CONTACT = {
  whatsapp: "+213562009989",
  whatsappHref: "https://wa.me/213562009989",
  email: "hello@kayaaanclothing.com",
  instagram: "https://instagram.com/kayaaan.clothing",
} as const;
