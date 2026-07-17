import { prisma } from "@/lib/db";

/**
 * ADMIN NEWSLETTER MANAGEMENT (§2 "Newsletter management").
 *
 * `subscribeFromStorefront()` in `src/lib/queries/publicNewsletter.ts` is
 * the real signup path now that the footer form exists; `addSubscriber`
 * (admin-side manual add) stays as-is for numbers/emails the store owner
 * collects by hand via WhatsApp/Instagram — the two are separate because a
 * manual re-add of an existing contact should behave like a normal admin
 * CRUD create (fail loudly on duplicate), while a visitor re-submitting the
 * storefront form should just quietly succeed / reactivate rather than show
 * an error.
 */

export async function listSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });
}

export async function addSubscriber(contact: string) {
  return prisma.newsletterSubscriber.create({
    data: { contact: contact.trim() },
  });
}

export async function setSubscriberActive(id: string, active: boolean) {
  return prisma.newsletterSubscriber.update({ where: { id }, data: { active } });
}

export async function deleteSubscriber(id: string) {
  return prisma.newsletterSubscriber.delete({ where: { id } });
}
