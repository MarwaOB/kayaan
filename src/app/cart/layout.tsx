import { getPublicCategories } from "@/lib/queries/publicCategory";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";

/**
 * The cart previously rendered a bare `<main>` — no logo, no navigation, no way
 * back to the shop except the browser button. It is still a browsing page (most
 * people who open the cart go back to add something else), so it gets the full
 * chrome. Checkout deliberately does not — see its own layout.
 */
export default async function CartLayout({ children }: { children: React.ReactNode }) {
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
