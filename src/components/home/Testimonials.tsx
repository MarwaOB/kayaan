import type { Testimonial } from "@/lib/queries/siteSettings";

/** Client feedback / testimonials (§6.10) */
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const safeTestimonials = testimonials.length > 0 ? testimonials : [
    { name: "سارة", quote: "الجودة ممتازة والتصميم مميز جداً.", rating: 5 },
    { name: "يوسف", quote: "التوصيل كان سريع والتعامل راقي.", rating: 5 },
  ];

  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-5 text-center text-xl font-bold text-kayaan-ink">آراء عملائنا</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {safeTestimonials.map((t, i) => (
            <div key={i} className="rounded-[1.5rem] border border-stone-200 bg-kayaan-bg p-5 shadow-sm">
              <p className="mb-3 text-sm">{"⭐".repeat(t.rating)}</p>
              <p className="mb-4 text-sm leading-7 text-neutral-700">“{t.quote}”</p>
              <p className="text-sm font-bold text-kayaan-brown">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
