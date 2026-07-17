import "./globals.css";
import { StoreHydration } from "@/components/shared/StoreHydration";

export const metadata = {
  title: "Kayaaan Clothing | كيان",
  description: "كيان… أكثر من ستايل. ملابس عصرية بطابع عربي وإسلامي.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-arabic">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
