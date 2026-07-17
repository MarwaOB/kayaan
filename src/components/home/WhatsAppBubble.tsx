const WHATSAPP_NUMBER = "213562009989"; // §1 — client-provided, no leading zero for wa.me links

/** Fixed WhatsApp support bubble, bottom-right, as on the reference site (§2). */
export function WhatsAppBubble() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="fixed bottom-5 end-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-2xl text-white shadow-lg"
    >
      💬
    </a>
  );
}
