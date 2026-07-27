import { notFound } from "next/navigation";
import { getPublicCategories } from "@/lib/queries/publicCategory";
import { getHomepageContent } from "@/lib/queries/siteSettings";
import { TopBanner } from "@/components/home/TopBanner";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { WhatsAppBubble } from "@/components/home/WhatsAppBubble";
import { InfoPageShell } from "@/components/pages/InfoPageShell";
import {
  BrandQuote,
  Callout,
  CheckList,
  Clauses,
  Em,
  ExcludeList,
  Lede,
  P,
  Panels,
  Section,
  SizeTable,
  Stat,
  Steps,
} from "@/components/pages/blocks";
import { INFO_PAGES, getInfoPage, CONTACT } from "@/data/site-pages";
import {
  MEASURE_STEPS,
  SIZE_BOTTOMS,
  SIZE_FIT_NOTE,
  SIZE_TOLERANCE_NOTE,
  SIZE_TOPS,
} from "@/data/size-guide";

/**
 * The six standing information pages.
 *
 * Copy is the client's own text from `docs/kayaaan-website-full-spec.md` §1 —
 * the previous version of this route paraphrased it, and in the case of the
 * refund policy the paraphrase had dropped the refund window and the list of
 * non-returnable products entirely. The spec is the source of truth for what a
 * page *contains*; this file only decides how it is arranged.
 */
const CONTENT: Record<string, React.ReactNode> = {
  /* ------------------------------------------------------------- about --- */
  about: (
    <>
      <Lede>في كيان، لا نبيع مجرد ملابس… نحن نصنع أثراً.</Lede>
      <P>
        نؤمن أن كل قطعة ترتديها هي رسالة، وأن أسلوبك هو انعكاس لهويتك. لهذا السبب، جاءت فكرة كيان
        لتقديم ملابس عصرية تحمل طابعاً عربياً وإسلامياً بلمسة حديثة، تجمع بين البساطة والمعنى.
      </P>

      <Panels
        panels={[
          {
            title: "رؤيتنا",
            body: "أن نكون أكثر من مجرد علامة تجارية، بل تجربة تترك انطباعاً يدوم. نريد لكل شخص يرتدي كيان أن يشعر بأنه يعبّر عن نفسه، وعن ثقافته، وعن قصته الخاصة.",
          },
          {
            title: "رسالتنا",
            body: "تصميم ملابس بجودة عالية وأفكار مبتكرة تدمج بين الأناقة والمعنى، لتمنحك ستايلاً فريداً يميّزك ويترك أثراً في كل مكان تذهب إليه.",
          },
        ]}
      />

      <Section title="ماذا نقدّم؟">
        <CheckList
          items={[
            "تيشيرتات وهوديز عصرية بقصّات أوفرسايز مريحة.",
            "تصاميم مستوحاة من الثقافة العربية والإسلامية.",
            "جودة عالية واهتمام بأدق التفاصيل، من الخامة إلى الطباعة.",
            "تجربة مختلفة: رمز استجابة سريعة على القطعة يحمل رسالة خاصة.",
          ]}
        />
      </Section>

      <Section title="لماذا كيان؟">
        <P>
          لأننا لا نصنع ملابس فقط، بل نصنع تجربة. كل تصميم في كيان له فكرة، وكل قطعة لها قصة، وكل
          عميل هو جزء من هذا الأثر.
        </P>
      </Section>

      <BrandQuote
        line="كيان… أكثر من ستايل"
        sub="كيان هو اختيارك لتكون مختلفاً، بسيطاً، وذا معنى."
      />
    </>
  ),

  /* -------------------------------------------------------- size-guide --- */
  "size-guide": (
    <>
      <Lede>
        كل قطع كيان تأتي بقصّة أوفرسايز. خذ قياساتك من قطعة تحب مقاسها، وقارنها بالجدول — لا تعتمد
        على المقاس المكتوب على ملابسك السابقة، فهو يختلف من علامة لأخرى.
      </Lede>

      <Section title={SIZE_TOPS.title}>
        <SizeTable spec={SIZE_TOPS} />
      </Section>

      <Section title={SIZE_BOTTOMS.title}>
        <SizeTable spec={SIZE_BOTTOMS} />
      </Section>

      <Section title="كيف تقيس؟">
        <P>افرد القطعة على سطح مستوٍ، ثم قس كما يلي — القياسات كلها بالسنتيمتر.</P>
        <ul className="space-y-3">
          {MEASURE_STEPS.map((step) => (
            <li key={step.label} className="text-body text-ink-muted">
              <Em>{step.label}:</Em> {step.text}
            </li>
          ))}
        </ul>
      </Section>

      <Callout tone="tip" title="بين مقاسين؟">
        <p>{SIZE_FIT_NOTE}</p>
      </Callout>

      <Callout tone="note" title="هامش القياس">
        <p>{SIZE_TOLERANCE_NOTE}</p>
      </Callout>
    </>
  ),

  /* --------------------------------------------------- shipping-policy --- */
  "shipping-policy": (
    <>
      <Lede>
        نوصل إلى الولايات الـ 58، والدفع عند الاستلام. هذا ما يحدث بين لحظة إرسالك للطلب ووصوله
        إليك.
      </Lede>

      <Section title="مسار طلبك">
        <Steps
          steps={[
            {
              title: "تأكيد الطلب هاتفياً",
              body: "بعد إرسال الطلب يتصل بك أحد ممثلينا لتأكيد التفاصيل والعنوان. لا يدخل أي طلب مرحلة التجهيز قبل هذا الاتصال.",
            },
            {
              title: "التجهيز والتغليف",
              body: "نجهّز القطعة ونغلّفها في عبوة كيان مع بطاقة التعريف، ونراجعها قبل تسليمها لشركة التوصيل.",
            },
            {
              title: "التوصيل والدفع",
              body: "تصلك الشحنة إلى المنزل أو إلى مكتب التوصيل الأقرب حسب اختيارك، وتدفع نقداً عند الاستلام.",
            },
          ]}
        />
      </Section>

      <Section title="طرق التوصيل">
        <Panels
          panels={[
            {
              title: "التوصيل السريع",
              body: "من يومين إلى ثلاثة أيام بعد التأكيد والتجهيز.",
            },
            {
              title: "التوصيل الاقتصادي",
              body: "من يومين إلى ثلاثة أيام بعد التأكيد والتجهيز، بتكلفة أقل.",
            },
          ]}
        />
      </Section>

      <Callout tone="warn" title="أسعار التوصيل إلى المنزل">
        <p>
          الأسعار المعروضة في الموقع هي أسعار التوصيل إلى <Em>مكتب التوصيل</Em> فقط. أسعار التوصيل
          إلى المنزل تختلف حسب الولاية، لذلك ندعوك للتواصل معنا للاستفسار عن سعر ولايتك قبل تأكيد
          الطلب.
        </p>
      </Callout>

      <Callout tone="note" title="بعد تأكيد الشراء">
        <p>
          سيتم الاتصال بك لتأكيد الطلبية، فيرجى ترك هاتفك متاحاً. وعند وصول الطلبية لديك مهلة{" "}
          <Em>3 أيام</Em> لاستلامها، وإلا تعيّن علينا دفع حق الإرجاع (الروتور) وهو خسارة على المتجر.
        </p>
      </Callout>
    </>
  ),

  /* ----------------------------------------------------- refund-policy --- */
  "refund-policy": (
    <>
      <Lede>
        نسعى دائماً لضمان رضاك الكامل عن منتجاتنا{" "}
        <span className="emoji" role="img" aria-label="قلب بني">
          🤎
        </span>{" "}
        وإن لم تكن راضياً عن طلبك، يمكنك الاستفادة من سياسة الاسترجاع والاستبدال وفق الشروط التالية.
      </Lede>

      <Stat value="7" unit="أيام" label="مهلة طلب الاسترجاع أو الاستبدال من تاريخ استلام الطلب." />

      <Section title="شروط الاسترجاع">
        <CheckList
          items={[
            "أن يكون المنتج في حالته الأصلية: غير مستعمل وغير مغسول.",
            "المنتجات المصممة حسب الطلب لا تُسترجع، إلا في حالة وجود خطأ أو عيب من طرفنا.",
          ]}
        />
      </Section>

      <Section title="حالات الاستبدال">
        <CheckList
          items={[
            "خطأ في المقاس.",
            "خطأ في المنتج المستلم.",
            "الاستبدال يكون حسب توفر المنتج في المخزون.",
          ]}
        />
      </Section>

      <Section title="الاسترجاع المالي">
        <P>
          يتم استرجاع المبلغ بعد استلام المنتج وفحصه، خلال <Em>3 إلى 5 أيام عمل</Em>. رسوم التوصيل
          غير قابلة للاسترجاع، إلا في حالة وجود خطأ من طرفنا.
        </P>
      </Section>

      <Section title="من يتحمّل تكاليف الشحن؟">
        <Panels
          panels={[
            {
              title: "الخطأ من طرفنا",
              body: "عيب مصنعي، منتج تالف، أو مقاس مختلف عن المطلوب: نتحمّل كامل تكاليف الشحن في الاتجاهين.",
            },
            {
              title: "رغبة العميل",
              body: "تغيير الرأي أو تبديل المقاس رغم مطابقته لجدول المقاسات: يتحمّل العميل تكاليف الشحن.",
            },
          ]}
        />
      </Section>

      <Section title="منتجات غير قابلة للاسترجاع">
        <ExcludeList items={["المنتجات المخفّضة", "المنتجات المخصّصة حسب الطلب"]} />
      </Section>

      <Callout tone="note" title="لبدء الاسترجاع أو الاستبدال">
        <p>
          راسلنا على واتساب{" "}
          <span dir="ltr" className="tabular">
            {CONTACT.whatsapp}
          </span>{" "}
          خلال المهلة المذكورة، مع رقم طلبك وصور توضّح حالة المنتج.
        </p>
      </Callout>
    </>
  ),

  /* ------------------------------------------------------------- terms --- */
  terms: (
    <>
      <Lede>
        مرحباً بكم في متجر كيان{" "}
        <span className="emoji" role="img" aria-label="قلب بني">
          🤎
        </span>{" "}
        باستخدامكم لهذا المتجر، فإنكم توافقون على الالتزام بشروط الاستخدام التالية.
      </Lede>

      <Clauses
        clauses={[
          {
            title: "استخدام الموقع",
            body: "يجب استخدام المتجر لأغراض قانونية فقط. يُمنع استخدام الموقع لأي نشاط احتيالي أو مسيء، ونحتفظ بحق إلغاء أي طلب في حال الاشتباه في استخدام غير مشروع.",
          },
          {
            title: "الطلبات والقبول",
            body: "جميع الطلبات تخضع للتأكيد والتوفر. نحتفظ بحق رفض أو إلغاء أي طلب في حالات: خطأ في المعلومات المقدَّمة، أو عدم توفر المنتج، أو الاشتباه في طلب غير جدي.",
          },
          {
            title: "الأسعار والدفع",
            body: "الأسعار قابلة للتغيير في أي وقت دون إشعار مسبق، ويتم تأكيد السعر النهائي عند إتمام الطلب. الدفع يتم حسب الطرق المتاحة، ومنها الدفع عند الاستلام.",
          },
          {
            title: "الشحن والتوصيل",
            body: "يخضع الشحن لسياسة التوصيل المعتمدة، وقد تختلف المدة حسب الولاية أو ظروف خارجة عن الإرادة.",
          },
          {
            title: "الاسترجاع والاستبدال",
            body: "تخضع جميع طلبات الاسترجاع والاستبدال لسياسة الاسترجاع الخاصة بالمتجر.",
          },
          {
            title: "الملكية الفكرية",
            body: "جميع التصاميم والمحتوى ملك حصري للمتجر. يُمنع نسخ أو استخدام أي تصميم دون إذن مسبق.",
          },
          {
            title: "المسؤولية",
            body: "المتجر غير مسؤول عن أي تأخير خارج عن إرادته، والعميل مسؤول عن صحة المعلومات التي يقدّمها.",
          },
          {
            title: "التعديلات على الشروط",
            body: "يحتفظ المتجر بحق تعديل هذه الشروط في أي وقت، ويسري التعديل من تاريخ نشره على هذه الصفحة.",
          },
          {
            title: "التواصل",
            body: "لأي استفسار بخصوص هذه الشروط، تواصل معنا عبر واتساب أو البريد الإلكتروني أو إنستغرام.",
          },
        ]}
      />
    </>
  ),

  /* ----------------------------------------------------------- privacy --- */
  privacy: (
    <>
      <Lede>كيان يحترم خصوصية عملائه ويلتزم بحماية بياناتهم الشخصية.</Lede>

      <Clauses
        clauses={[
          {
            title: "المعلومات التي نجمعها",
            body: "الاسم الكامل، رقم الهاتف، عنوان الشحن، البريد الإلكتروني (إن وُجد)، ومعلومات الطلبات من منتجات ومقاسات وتفضيلات.",
          },
          {
            title: "كيف نستخدم المعلومات",
            body: "لمعالجة الطلبات وتأكيدها، وللتوصيل، وللتواصل معك بخصوص طلبك، ولتحسين الخدمة، ولإرسال العروض والتحديثات — وهذا الأخير اختياري.",
          },
          {
            title: "حماية المعلومات",
            body: "نستخدم وسائل أمنية مناسبة لحفظ بياناتك، ويبقى استخدامها محصوراً في الأغراض المذكورة أعلاه.",
          },
          {
            title: "مشاركة المعلومات",
            body: "لا تُباع بياناتك ولا تُشارَك مع أي طرف ثالث، باستثناء شركات التوصيل لغرض تسليم الطلبات فقط، أو عند وجود التزام قانوني.",
          },
          {
            title: "ملفات تعريف الارتباط",
            body: "قد نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل أداء الموقع.",
          },
          {
            title: "بيانات محفوظة على جهازك",
            body: "المفضّلة ومعلومات التوصيل التي تدخلها عند الطلب تُحفظ في متصفحك على هذا الجهاز وحده، لتوفير الوقت في زيارتك القادمة. يمكنك مسحها في أي وقت من إعدادات المتصفح.",
          },
          {
            title: "حقوق المستخدم",
            body: "لك حق الاطلاع على بياناتك، وطلب تعديلها أو حذفها، وإلغاء الاشتراك في الرسائل الترويجية في أي وقت.",
          },
          {
            title: "التعديلات على السياسة",
            body: "قد تُحدَّث هذه السياسة من وقت لآخر، وتُنشر النسخة السارية على هذه الصفحة.",
          },
          {
            title: "التواصل",
            body: "لأي سؤال عن خصوصيتك أو بياناتك، تواصل معنا عبر واتساب أو البريد الإلكتروني أو إنستغرام.",
          },
        ]}
      />
    </>
  ),
};

export default async function StaticPage({ params }: { params: { slug: string } }) {
  const page = getInfoPage(params.slug);
  const content = CONTENT[params.slug];
  if (!page || !content) {
    notFound();
  }

  const [categories, homepageContent] = await Promise.all([
    getPublicCategories(),
    getHomepageContent(),
  ]);

  return (
    <>
      <TopBanner messages={homepageContent.bannerMessages} />
      <Header categories={categories} />

      <InfoPageShell page={page}>{content}</InfoPageShell>

      <Footer categories={categories} />
      <WhatsAppBubble />
    </>
  );
}

export async function generateStaticParams() {
  return INFO_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getInfoPage(params.slug);
  if (!page) return {};

  return {
    title: `${page.title} | كيان`,
    description: page.description,
  };
}
