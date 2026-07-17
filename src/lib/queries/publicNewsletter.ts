import { prisma } from "@/lib/db";

/**
 * PUBLIC NEWSLETTER SIGNUP (§2 "Newsletter management" — this is the write
 * side; storefront footer form -> this -> shows up in `/admin/newsletter`).
 *
 * Loose email-or-phone check only, matching the model's own comment
 * (`contact: String @unique // email or phone`) — no strict format
 * validation beyond "non-empty, not absurdly long," since Algerian phone
 * numbers, WhatsApp numbers, and emails all need to work here and the spec
 * never pins down one format.
 */

export class NewsletterValidationError extends Error {}

const MAX_CONTACT_LENGTH = 120;

export async function subscribeFromStorefront(rawContact: string) {
  const contact = rawContact?.trim();
  if (!contact || contact.length > MAX_CONTACT_LENGTH) {
    throw new NewsletterValidationError("A valid email or phone number is required.");
  }

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { contact } });
  if (existing) {
    if (!existing.active) {
      return prisma.newsletterSubscriber.update({ where: { contact }, data: { active: true } });
    }
    return existing; // already subscribed — quietly succeed, no error shown to the visitor
  }

  return prisma.newsletterSubscriber.create({ data: { contact } });
}
