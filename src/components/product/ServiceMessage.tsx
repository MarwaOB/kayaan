const POINTS = [
  { icon: "🚚", label: "توصيل لكل الولايات", desc: "58 ولاية، دفع عند الاستلام" },
  { icon: "🔄", label: "استبدال واسترجاع", desc: "خلال المدة المحددة في سياستنا" },
  { icon: "💬", label: "دعم عبر واتساب", desc: "نرد على استفساراتكم بسرعة" },
  { icon: "🤎", label: "جودة مضمونة", desc: "قماش مختار بعناية لراحة أطول" },
];

/** "Our service + message" reassurance/trust section (§7 item 13). */
export function ServiceMessage() {
  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-stone-200 bg-kayaan-bg/70 p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-center text-xl font-bold text-kayaan-ink">خدماتنا</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {POINTS.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-2 rounded-[1.25rem] bg-white p-4 text-center shadow-sm">
              <span className="text-2xl">{p.icon}</span>
              <p className="text-sm font-bold text-kayaan-ink">{p.label}</p>
              <p className="text-xs leading-6 text-neutral-500">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
