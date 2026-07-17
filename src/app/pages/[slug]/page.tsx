import { notFound } from "next/navigation";
import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { TopBanner } from "@/components/home/TopBanner";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";

type PageContent = {
  title: string;
  titleEn: string;
  description?: string;
  icon: string;
  content: React.ReactNode;
};

// Map of slugs to page content, styled with rich, warm premium layouts.
const STATIC_PAGES: Record<string, PageContent> = {
  about: {
    title: "من نحن؟",
    titleEn: "About Kayaan",
    icon: "🤎",
    description: "قصة الهوية، الجودة، والتصميم الفريد.",
    content: (
      <div className="space-y-8">
        <div className="border-r-4 border-kayaan-brown pr-4 py-1">
          <p className="text-lg font-bold text-kayaan-brownDark">
            "كيان… أكثر من ستايل"
          </p>
          <p className="mt-2 leading-relaxed text-neutral-600">
            في كيان، نؤمن بأن الملابس ليست مجرد قطع نرتديها، بل هي امتداد وعبيّر ناطق عن الهوية، المبادئ، والاعتزاز بالثقافة. انطلقنا بشغف كبير لتقديم ستايلات عصرية تواكب الموضة العالمية ولكن بلمسة وهوية عربية وإسلامية فريدة.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <span className="mb-3 block text-2xl">🌱</span>
            <h3 className="text-base font-bold text-kayaan-ink">أصالة الفكرة</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              نهدف إلى دمج جماليات الخط العربي والشعارات الإسلامية الهادفة في قصات وتصاميم حديثة ومريحة للاستخدام اليومي.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <span className="mb-3 block text-2xl">⚡</span>
            <h3 className="text-base font-bold text-kayaan-ink">جودة تفوق التطلعات</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              نولي اهتماماً فائقاً بأدق تفاصيل المنتج، ابتداءً من اختيار خامات القطن الطبيعي 100% الثقيلة وانتهاءً بأجود أنواع الطباعة والتطريز.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
            <span className="mb-3 block text-2xl">🤝</span>
            <h3 className="text-base font-bold text-kayaan-ink">ثقة متبادلة</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-500">
              تسوقك مع كيان مدعوم بنظام تحقق آمن وتوصيل سريع وموثوق للدفع مباشرة عند الاستلام مع ضمان كامل لرضا العميل.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-kayaan-pink/40 p-6 text-center text-sm text-neutral-700">
          <p className="font-bold">شكراً لكونك جزءاً من رحلتنا ودعمك للإنتاج المحلي الإبداعي!</p>
        </div>
      </div>
    ),
  },
  "size-guide": {
    title: "دليل المقاسات",
    titleEn: "Size Guide",
    icon: "📏",
    description: "اعثر على القياس المثالي والموثوق لملابس كيان.",
    content: (
      <div className="space-y-8">
        <p className="text-sm leading-relaxed text-neutral-600">
          جميع تصاميم تيشيرتات وهوديز كيان تأتي بقصة **أوفرسايز (Oversized Fit)** لتوفير أقصى درجات الراحة والمظهر العصري. يرجى أخذ قياساتك بعناية ومقارنتها بالجدول أدناه قبل إتمام الشراء.
        </p>

        {/* Category 1 */}
        <div>
          <h3 className="mb-3 font-bold text-kayaan-brownDark border-b border-neutral-200 pb-2">
            1. التيشيرت والهودي الأوفرسايز (Oversized T-Shirts & Hoodies)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <th className="p-3">المقاس (Size)</th>
                  <th className="p-3">العرض / الصدر (Width - cm)</th>
                  <th className="p-3">الطول (Length - cm)</th>
                  <th className="p-3">طول الكم من الكتف (Sleeve - cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">54</td>
                  <td className="p-3">70</td>
                  <td className="p-3">21</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">57</td>
                  <td className="p-3">72</td>
                  <td className="p-3">22</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">60</td>
                  <td className="p-3">75</td>
                  <td className="p-3">23</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL</td>
                  <td className="p-3">63</td>
                  <td className="p-3">77</td>
                  <td className="p-3">24</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XXL</td>
                  <td className="p-3">66</td>
                  <td className="p-3">79</td>
                  <td className="p-3">25</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Category 2 */}
        <div>
          <h3 className="mb-3 font-bold text-kayaan-brownDark border-b border-neutral-200 pb-2">
            2. السراويل والجوغرز (Joggers & Pants)
          </h3>
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 font-bold border-b border-neutral-200">
                  <th className="p-3">المقاس (Size)</th>
                  <th className="p-3">محيط الخصر (Waist - cm)</th>
                  <th className="p-3">طول السروال (Total Length - cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                <tr>
                  <td className="p-3 font-bold">S</td>
                  <td className="p-3">70 - 80</td>
                  <td className="p-3">98</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">M</td>
                  <td className="p-3">74 - 84</td>
                  <td className="p-3">100</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">L</td>
                  <td className="p-3">78 - 88</td>
                  <td className="p-3">102</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XL</td>
                  <td className="p-3">82 - 94</td>
                  <td className="p-3">104</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">XXL</td>
                  <td className="p-3">86 - 100</td>
                  <td className="p-3">106</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="rounded-xl border border-kayaan-accent/20 bg-kayaan-accent/5 p-4 text-xs text-neutral-600 leading-relaxed">
          <span className="font-bold text-kayaan-brown">💡 نصيحة اختصاصي القياس في كيان:</span>
          <p className="mt-1">
            للحصول على أفضل قياس، استعن بقطعة ملابس مشابهة تحب مقاسها، ضعها مستوية على سطح واقس العرض والطول المناسبين لك، ثم طابقهم بالجدول أعلاه.
          </p>
        </div>
      </div>
    ),
  },
  "shipping-policy": {
    title: "سياسة الطلب والشحن",
    titleEn: "Order & Shipping Policy",
    icon: "🚚",
    description: "خيارات التوصيل، التكاليف وطريقة تأكيد الطلب لـ 58 ولاية.",
    content: (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-neutral-600">
          نسعى دوماً لتقديم خدمة تسليم مريحة وبأعلى درجات الموثوقية بالجزائر. إليك تفاصيل مسار طلبك معنا:
        </p>

        <div className="space-y-4">
          <div className="flex gap-4 rounded-xl bg-white border border-neutral-100 p-4 shadow-sm">
            <span className="text-2xl">📱</span>
            <div>
              <h4 className="font-bold text-kayaan-ink">الخطوة 1: تأكيد الطلب هاتفياً</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                بعد إرسالك للطلب، سيتصل بك أحد ممثلينا لتأكيد تفاصيل طلبك وجديته. بمجرد التأكيد، يُدرج طلبك فوراً في لوحة التحضير.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl bg-white border border-neutral-100 p-4 shadow-sm">
            <span className="text-2xl">📦</span>
            <div>
              <h4 className="font-bold text-kayaan-ink">الخطوة 2: تحضير الطلب وتغليفه</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                يتم تغليف منتجاتك بعناية فائقة لضمان معايير النظافة والجودة الفاخرة التي تميز متجر كيان، مع إرفاق عبوتنا الخاصة وكرت الهوية الترحيبي.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-xl bg-white border border-neutral-100 p-4 shadow-sm">
            <span className="text-2xl">🚗</span>
            <div>
              <h4 className="font-bold text-kayaan-ink">الخطوة 3: التوصيل والدفع</h4>
              <p className="mt-1 text-xs text-neutral-500 leading-relaxed">
                نوصل شحنتك عبر شركائنا الموثوقين لجميع الولايات الـ 58 مباشرة لباب بيتك أو لمكتب التوصيل الأقرب إليك. التوصيل يستغرق من يومين (2) إلى خمسة (5) أيام عمل كحد أقصى. الدفع يكون نقداً عند الاستلام.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs text-neutral-600">
          <span className="font-bold text-kayaan-ink">⚠️ ملاحظة هامة:</span>
          <p className="mt-1">
            بعض الولايات أو القرى والمناطق النائية قد تتطلب تأكيد سعر شحن يدوي وتسوية تكلفة التوصيل نظراً للمسافات وظروف التغطية. سنقوم بالتواصل معك هاتفياً قبل تأكيد الشحن النهائي وتوضيح القيمة بالتفصيل.
          </p>
        </div>
      </div>
    ),
  },
  "refund-policy": {
    title: "سياسة الاستبدال والاسترجاع",
    titleEn: "Return & Exchange Policy",
    icon: "🔄",
    description: "إرشادات الاستبدال وضمان سلامة مشترياتك في كيان.",
    content: (
      <div className="space-y-6">
        <p className="text-sm leading-relaxed text-neutral-600">
          يقوم فريق الجودة في كيان بفحص كل قطعة بدقة متناهية قبل شحنها. ولكن في حالة رغبتك بالاستبدال أو الاسترجاع، فنحن هنا لمساعدتك فوراً:
        </p>

        <div className="rounded-xl bg-white border border-neutral-200 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-kayaan-brown">مدة الاستبدال والاسترجاع:</h4>
            <p className="mt-0.5 text-xs text-neutral-500">
              يُسمح بالاستبدال والاسترجاع في غضون 7 أيام فقط من تاريخ استلامك للشحنة.
            </p>
          </div>

          <hr className="border-neutral-100" />

          <div>
            <h4 className="text-sm font-bold text-kayaan-brown">حالة المنتجات المطلوبة للموافقة:</h4>
            <p className="mt-0.5 text-xs text-neutral-500">
              يجب أن تكون القطعة في حالتها الأصلية تماماً: غير مستعملة، غير مغسولة، خالية من أي روائح (عطور/مساحيق)، وتحمل التيكيت والبطاقات التعريفية دون إزالة ومع العبوة الأصلية.
            </p>
          </div>

          <hr className="border-neutral-100" />

          <div>
            <h4 className="text-sm font-bold text-kayaan-brown">توزيع التكاليف والرسوم:</h4>
            <ul className="mt-1 list-inside list-disc text-xs text-neutral-500 space-y-1">
              <li>
                <strong>خطأ من المتجر (عيب مصنعي، مقاس خاطئ مرسل، منتج تالف):</strong> نتحمل نحن في كيان كامل رسوم شحن الإرجاع والتسليم الجديد.
              </li>
              <li>
                <strong>رغبة العميل (تغيير رأي، استبدال قياس العميل بالرغم من مطابقة جدول المقاسات):</strong> يتحمل العميل رسوم التوصيل المقررة للإرجاع أو الاستبدال.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl bg-kayaan-pink/50 p-4 text-xs text-neutral-700 text-center">
          <p>
            لبدء عملية الإرجاع، يرجى التواصل معنا فوراً على الواتساب <strong>213562009989+</strong> مع توفير رقم طلبك وصور للتوضيح.
          </p>
        </div>
      </div>
    ),
  },
  terms: {
    title: "شروط الاستخدام",
    titleEn: "Terms of Use",
    icon: "📄",
    description: "الأحكام القانونية والقواعد المنظمة لاستخدام متجر كيان.",
    content: (
      <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
        <p>
          أهلاً بكم في متجرنا. بدخولك وتصفحك لهذا الموقع، أنت توافق بشكل كامل على القيود والالتزام بالقواعد المنصوص عليها في هذه الاتفاقية:
        </p>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-kayaan-ink">1. صحة وأمان وموثوقية الطلب</h3>
            <p className="mt-1 text-xs text-neutral-500">
              أنت تقر بأن جميع البيانات المدخلة في طلبك (الاسم، العنوان، رقم الهاتف الجزائري) هي بيانات دقيقة، حديثة، وتخصك شخصياً. يمنحك ذلك حق الشراء ويتيح لنا إيصال طلبك دون معوقات.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-kayaan-ink">2. الأسعار وتوفر المخزون</h3>
            <p className="mt-1 text-xs text-neutral-500">
              جميع الأسعار المبينة على الموقع هي بالدينار الجزائري (DZD). ونسعى دائماً لتحديث المخزون بشكل دوري وسحب القطع غير المتوفرة فوراً؛ وفي الحالات النادرة لعدم توفر القطعة بعد الطلب، سنتواصل معك هاتفياً للاستبدال أو الإلغاء.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-kayaan-ink">3. حقوق الملكية الفكرية</h3>
            <p className="mt-1 text-xs text-neutral-500">
              كافة محتويات هذا الموقع بما فيها التصاميم المطبوعة على الملابس، الصور الحية، والنصوص، والشعارات، هي حقوق ملكية فكرية وحصرية مسجلة لصالح علامة كيان. يمنع منعاً باتاً إعادة نسخها أو استخدامها لأغراض تجارية أخرى.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  privacy: {
    title: "سياسة الخصوصية",
    titleEn: "Privacy Policy",
    icon: "🔒",
    description: "نلتزم بالحفاظ على أمن بياناتك ومعلوماتك الشخصية.",
    content: (
      <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
        <p>
          نحن في كيان نعتبر حماية بيانات عملائنا وخصوصيتهم أساساً لبناء الثقة. نوضح في هذه السياسة كيفية التعامل مع معلوماتك الشخصية:
        </p>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
          <div>
            <strong className="text-kayaan-ink block mb-1">ما هي البيانات التي يتم جمعها؟</strong>
            <p className="text-xs text-neutral-500">
              نقوم بجمع بيانات الاسم الكامل، رقم الهاتف، عنوان السكن التفصيلي، والولاية، بالإضافة للبريد الإلكتروني (اختياري لخدمات تتبع العروض والشحنات).
            </p>
          </div>

          <div>
            <strong className="text-kayaan-ink block mb-1">كيف نستخدم بياناتك؟</strong>
            <p className="text-xs text-neutral-500">
              تُستخدم بياناتك حصراً لأغراض إكمال المعاملة التجارية: إصدار الفاتورة، إنشاء الشحنة، تأكيد الطلب هاتفياً لتفادي الطلبات الوهمية، وتنسيق التسليم مع مندوب التوصيل المعتمد.
            </p>
          </div>

          <div>
            <strong className="text-kayaan-ink block mb-1">أمن وتشفير البيانات:</strong>
            <p className="text-xs text-neutral-500">
              يتم تخزين الرموز والبيانات الحساسة في خوادم مشفرة ومحمية بالكامل. لا نقوم إطلاقاً ببيع أو إعارة أو نشر معلوماتك لأي أطراف خارجية عدا شركاء التوصيل المخولين بتسليم شحنتك.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};

export default async function StaticPage({ params }: { params: { slug: string } }) {
  const page = STATIC_PAGES[params.slug];
  if (!page) {
    notFound();
  }

  // Fetch header/footer context to ensure UI remains complete and consistent
  const [categories, homepageContent] = await Promise.all([
    getPublicCategories(),
    getHomepageContent(),
  ]);

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <main className="mx-auto max-w-2xl px-6 py-12 md:py-16">
        <div className="mb-8 text-center md:mb-12">
          <span className="block text-4xl mb-4">{page.icon}</span>
          <h1 className="text-2xl font-bold tracking-tight text-kayaan-ink md:text-3xl font-arabic">
            {page.title}
          </h1>
          <p className="mt-1 text-xs tracking-wider uppercase text-neutral-400 font-medium">
            {page.titleEn}
          </p>
          {page.description && (
            <p className="mt-3 text-sm text-neutral-600">
              {page.description}
            </p>
          )}
          <div className="mx-auto mt-6 h-1 w-12 rounded bg-kayaan-accent" />
        </div>

        <section className="font-arabic leading-relaxed">
          {page.content}
        </section>
      </main>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}

// Support pre-rendering of these static paths automatically in Next.js
export async function generateStaticParams() {
  return Object.keys(STATIC_PAGES).map((slug) => ({ slug }));
}

// Automatic metadata tags for SEO best practices
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = STATIC_PAGES[params.slug];
  if (!page) return {};
  
  return {
    title: `${page.title} | Kayaaan Clothing كيان`,
    description: page.description || `${page.title} - متجر كيان للملابس العصرية`,
  };
}
