import { IconWhatsApp } from "@/components/ui/Icon";

const WHATSAPP_NUMBER = "213562009989"; // spec §1 — no leading zero for wa.me links

/**
 * Floating WhatsApp support bubble (spec §2, brief §1.1 — "Based on Love"
 * places the same affordance in the same corner).
 *
 * `end-5` rather than `right-5`, so in RTL it sits bottom-left as it should
 * (DESIGN-SYSTEM.md §8). Real brand glyph instead of the 💬 emoji, which showed
 * a different picture on every platform and none of them was WhatsApp.
 */
export function WhatsAppBubble() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا عبر واتساب"
      className="whatsapp-bubble fixed bottom-5 end-5 z-30 grid h-14 w-14 place-items-center rounded-pill bg-[#25D366] text-white shadow-2 transition-all duration-base ease-k hover:scale-105 hover:bg-[#1EBE5A]"
    >
      <IconWhatsApp className="h-7 w-7" />
    </a>
  );
}
