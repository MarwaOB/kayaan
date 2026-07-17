/**
 * Generic WhatsApp Cloud API template-message sender (§13).
 *
 * Extracted from the old OTP flow (src/lib/otp.ts, now removed) so the same
 * real, working Meta Graph API call can be reused for the order-confirmation
 * recap message. This is real code, not a stub — but it can't actually send
 * anything until you've (1) created and gotten Meta's approval for a message
 * template in WhatsApp Manager, and (2) set the env vars below.
 *
 * Required env vars:
 *   WHATSAPP_CLOUD_API_TOKEN — permanent access token for your WhatsApp Business app
 *   WHATSAPP_PHONE_NUMBER_ID — the "Phone number ID" from WhatsApp Manager (NOT the phone number itself)
 *
 * Optional:
 *   WHATSAPP_API_VERSION — Graph API version, defaults to "v21.0"
 */
const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";

/**
 * Converts the local Algerian format enforced by checkout.ts
 * (`/^0[5-7][0-9]{8}$/`, e.g. "0555123456") to the E.164-without-"+" format
 * the Cloud API expects (e.g. "213555123456").
 */
export function toWhatsAppE164(localPhone: string): string {
  return `213${localPhone.slice(1)}`;
}

export type WhatsAppTemplateComponent = Record<string, unknown>;

/**
 * Sends a single approved WhatsApp template message. Throws on any failure
 * (missing env vars, Meta rejecting the request, network error) — callers
 * must decide their own fallback (e.g. don't block order creation on this).
 */
export async function sendWhatsAppTemplate(
  phone: string,
  templateName: string,
  templateLang: string,
  components: WhatsAppTemplateComponent[]
): Promise<void> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    throw new Error(
      "WhatsApp Cloud API not configured — set WHATSAPP_CLOUD_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env."
    );
  }

  const res = await fetch(`https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: toWhatsAppE164(phone),
      type: "template",
      template: {
        name: templateName,
        language: { code: templateLang },
        components,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WhatsApp Cloud API error (HTTP ${res.status}): ${body}`);
  }
}
