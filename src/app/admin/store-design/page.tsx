"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminClient";

type HeroSlide = { imageUrl: string; headline: string; ctaLabel: string; ctaHref: string };
type RunningBarItem = { icon: string; label: string };
type Testimonial = { name: string; quote: string; rating: number };

type HomepageContent = {
  bannerMessages: string[];
  runningBarItems: RunningBarItem[];
  videoUrl: string;
  heroSlides: HeroSlide[];
  testimonials: Testimonial[];
};

const EMPTY: HomepageContent = {
  bannerMessages: [],
  runningBarItems: [],
  videoUrl: "",
  heroSlides: [],
  testimonials: [],
};

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 rounded-xl border border-neutral-200 p-4">
      <h2 className="text-sm font-bold">{title}</h2>
      {hint && <p className="mb-3 mt-1 text-xs text-neutral-400">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await adminFetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "فشل رفع الصورة");
  return data.url as string;
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-xs font-bold text-red-600">
      حذف
    </button>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 rounded-full border border-dashed border-neutral-300 px-4 py-1.5 text-xs font-bold text-neutral-600"
    >
      + {label}
    </button>
  );
}

export default function StoreDesignPage() {
  const [content, setContent] = useState<HomepageContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await adminFetch("/api/admin/settings/homepage");
      const data = await res.json();
      setContent({
        bannerMessages: data.content?.bannerMessages ?? [],
        runningBarItems: data.content?.runningBarItems ?? [],
        videoUrl: data.content?.videoUrl ?? "",
        heroSlides:
          (data.content?.heroSlides ?? []).map((s: any) => ({
            imageUrl: s.imageUrl ?? "",
            headline: s.headline ?? "",
            ctaLabel: s.ctaLabel ?? "",
            ctaHref: s.ctaHref ?? "",
          })) ?? [],
        testimonials: data.content?.testimonials ?? [],
      });
      setLoading(false);
    })();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveMessage(null);
    setError(null);
    try {
      // Strip empty optional CTA fields back to undefined so the stored shape matches HeroSlide.
      const payload = {
        ...content,
        heroSlides: content.heroSlides.map((s) => ({
          imageUrl: s.imageUrl,
          headline: s.headline,
          ctaLabel: s.ctaLabel || undefined,
          ctaHref: s.ctaHref || undefined,
        })),
      };
      const res = await adminFetch("/api/admin/settings/homepage", { method: "PUT", body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "فشل الحفظ");
        return;
      }
      setSaveMessage("تم الحفظ بنجاح ✅");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">...جاري التحميل</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">تصميم المتجر — محتوى الصفحة الرئيسية</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-kayaan-brown px-6 py-2 text-sm font-bold text-white disabled:opacity-60"
        >
          {saving ? "جاري الحفظ..." : "حفظ الكل"}
        </button>
      </div>
      {saveMessage && <p className="mb-4 text-sm font-bold text-green-700">{saveMessage}</p>}
      {error && <p className="mb-4 text-sm font-bold text-red-600">{error}</p>}

      {/* Top banner messages (§6 item 1) */}
      <Section title="رسائل الشريط العلوي" hint="تظهر أعلى الصفحة، تتبدل تلقائياً إذا كانت أكثر من رسالة">
        <div className="flex flex-col gap-2">
          {content.bannerMessages.map((msg, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={msg}
                onChange={(e) => {
                  const next = [...content.bannerMessages];
                  next[i] = e.target.value;
                  setContent({ ...content, bannerMessages: next });
                }}
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <RemoveButton
                onClick={() =>
                  setContent({ ...content, bannerMessages: content.bannerMessages.filter((_, j) => j !== i) })
                }
              />
            </div>
          ))}
        </div>
        <AddButton
          label="إضافة رسالة"
          onClick={() => setContent({ ...content, bannerMessages: [...content.bannerMessages, ""] })}
        />
      </Section>

      {/* Hero carousel (§6 item 3) */}
      <Section title="سلايدر الغلاف الرئيسي" hint="الصور والعناوين التي تظهر في أعلى الصفحة الرئيسية">
        <div className="flex flex-col gap-3">
          {content.heroSlides.map((slide, i) => (
            <div key={i} className="rounded-lg border border-neutral-100 p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">صورة السلايد</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadImage(file);
                        const next = [...content.heroSlides];
                        next[i] = { ...next[i], imageUrl: url };
                        setContent({ ...content, heroSlides: next });
                      } catch (err: any) {
                        setError(err.message || "فشل رفع الصورة");
                      }
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                  <input
                    dir="ltr"
                    value={slide.imageUrl}
                    onChange={(e) => {
                      const next = [...content.heroSlides];
                      next[i] = { ...next[i], imageUrl: e.target.value };
                      setContent({ ...content, heroSlides: next });
                    }}
                    placeholder="أو أدخل رابط الصورة"
                    className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">العنوان</label>
                  <input
                    value={slide.headline}
                    onChange={(e) => {
                      const next = [...content.heroSlides];
                      next[i] = { ...next[i], headline: e.target.value };
                      setContent({ ...content, heroSlides: next });
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">نص الزر (اختياري)</label>
                  <input
                    value={slide.ctaLabel}
                    onChange={(e) => {
                      const next = [...content.heroSlides];
                      next[i] = { ...next[i], ctaLabel: e.target.value };
                      setContent({ ...content, heroSlides: next });
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">رابط الزر (اختياري)</label>
                  <input
                    dir="ltr"
                    value={slide.ctaHref}
                    onChange={(e) => {
                      const next = [...content.heroSlides];
                      next[i] = { ...next[i], ctaHref: e.target.value };
                      setContent({ ...content, heroSlides: next });
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <RemoveButton
                onClick={() => setContent({ ...content, heroSlides: content.heroSlides.filter((_, j) => j !== i) })}
              />
            </div>
          ))}
        </div>
        <AddButton
          label="إضافة سلايد"
          onClick={() =>
            setContent({
              ...content,
              heroSlides: [...content.heroSlides, { imageUrl: "", headline: "", ctaLabel: "", ctaHref: "" }],
            })
          }
        />
      </Section>

      {/* Embedded video (§6 item 5) */}
      <Section title="الفيديو المضمّن" hint="يمكن رفع فيديو من Cloudinary ثم حفظ الرابط تلقائياً">
        <input
          type="file"
          accept="video/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const url = await uploadImage(file);
              setContent({ ...content, videoUrl: url });
            } catch (err: any) {
              setError(err.message || "فشل رفع الفيديو");
            }
          }}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
        <input
          dir="ltr"
          value={content.videoUrl}
          onChange={(e) => setContent({ ...content, videoUrl: e.target.value })}
          placeholder="أو أدخل رابط الفيديو"
          className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
        />
      </Section>

      {/* Running bar (§6 item 5) */}
      <Section title="الشريط المتحرك" hint="مثال: الدفع عند الاستلام، توصيل 58 ولاية، خدمة العملاء">
        <div className="flex flex-col gap-2">
          {content.runningBarItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={item.icon}
                onChange={(e) => {
                  const next = [...content.runningBarItems];
                  next[i] = { ...next[i], icon: e.target.value };
                  setContent({ ...content, runningBarItems: next });
                }}
                placeholder="أيقونة (رمز تعبيري مثلاً)"
                className="w-24 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <input
                value={item.label}
                onChange={(e) => {
                  const next = [...content.runningBarItems];
                  next[i] = { ...next[i], label: e.target.value };
                  setContent({ ...content, runningBarItems: next });
                }}
                placeholder="النص"
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <RemoveButton
                onClick={() =>
                  setContent({ ...content, runningBarItems: content.runningBarItems.filter((_, j) => j !== i) })
                }
              />
            </div>
          ))}
        </div>
        <AddButton
          label="إضافة عنصر"
          onClick={() => setContent({ ...content, runningBarItems: [...content.runningBarItems, { icon: "", label: "" }] })}
        />
      </Section>

      {/* Testimonials (§6 item 10) */}
      <Section title="آراء العملاء" hint="تظهر في قسم منفصل بالصفحة الرئيسية">
        <div className="flex flex-col gap-3">
          {content.testimonials.map((t, i) => (
            <div key={i} className="rounded-lg border border-neutral-100 p-3">
              <div className="mb-2 grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">الاسم</label>
                  <input
                    value={t.name}
                    onChange={(e) => {
                      const next = [...content.testimonials];
                      next[i] = { ...next[i], name: e.target.value };
                      setContent({ ...content, testimonials: next });
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-neutral-500">التقييم (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={t.rating}
                    onChange={(e) => {
                      const next = [...content.testimonials];
                      next[i] = { ...next[i], rating: Number(e.target.value) };
                      setContent({ ...content, testimonials: next });
                    }}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <label className="mb-1 block text-xs text-neutral-500">النص</label>
              <textarea
                value={t.quote}
                onChange={(e) => {
                  const next = [...content.testimonials];
                  next[i] = { ...next[i], quote: e.target.value };
                  setContent({ ...content, testimonials: next });
                }}
                rows={2}
                className="mb-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
              <RemoveButton
                onClick={() => setContent({ ...content, testimonials: content.testimonials.filter((_, j) => j !== i) })}
              />
            </div>
          ))}
        </div>
        <AddButton
          label="إضافة رأي عميل"
          onClick={() =>
            setContent({ ...content, testimonials: [...content.testimonials, { name: "", quote: "", rating: 5 }] })
          }
        />
      </Section>
    </div>
  );
}
