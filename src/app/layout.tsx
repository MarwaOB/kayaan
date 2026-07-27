import "./globals.css";
import { Almarai, IBM_Plex_Sans_Arabic } from "next/font/google";
import { StoreHydration } from "@/components/shared/StoreHydration";

// docs/DESIGN-SYSTEM.md §3.1. Self-hosted and preloaded by next/font — the
// Arabic face is the brand voice, and the previous Tahoma fallback shaped it
// badly and offered no weight range.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-arabic",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const metadata = {
  title: "Kayaaan Clothing | كيان",
  description: "كيان… أكثر من ستايل. ملابس عصرية بطابع عربي وإسلامي.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${plexArabic.variable} ${almarai.variable}`}>
      <head>
        {/* Marks the document as script-capable before first paint, which is
            what gates the scroll-reveal styles. Inline and synchronous on
            purpose: deferring it would flash the un-revealed state, and
            omitting it leaves the page fully visible — the safe direction. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="font-sans">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
