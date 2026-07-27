import { getPublicCategories } from "@/lib/queries/publicCategory";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";

/**
 * Favourites rendered as a bare `<main>` — no logo, no navigation, no footer,
 * no way back into the shop. It is reached from the heart in the header, which
 * means the customer is mid-browse, so it gets the full chrome for the same
 * reason the cart does.
 */
export default async function FavoritesLayout({ children }: { children: React.ReactNode }) {
  const categories = await getPublicCategories();

  return (
    <>
      <Header categories={categories} />
      {children}
      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}
