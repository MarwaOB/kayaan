// Size charts — one source of truth.
//
// These numbers were previously written out twice: once in the PDP modal
// (`SizeGuideModal`) and once in the /pages/size-guide route, and the two did
// not agree. A shopper who opened both saw two different answers to the only
// question the size guide exists to settle. Both now read from here.
//
// All measurements are centimetres, taken on the garment laid flat.

export type SizeTableSpec = {
  id: string;
  title: string;
  /** Column headers. The first is always the size name. */
  columns: string[];
  /** `values` lines up with `columns.slice(1)`. */
  rows: { size: string; values: string[] }[];
};

export const SIZE_TOPS: SizeTableSpec = {
  id: "tops",
  title: "التيشيرتات والهوديز",
  columns: ["المقاس", "الصدر", "الطول", "الكتف"],
  rows: [
    { size: "S", values: ["50", "68", "44"] },
    { size: "M", values: ["54", "70", "46"] },
    { size: "L", values: ["58", "72", "48"] },
    { size: "XL", values: ["62", "74", "50"] },
    { size: "XXL", values: ["66", "76", "52"] },
  ],
};

export const SIZE_BOTTOMS: SizeTableSpec = {
  id: "bottoms",
  title: "الجوغرز والسراويل",
  columns: ["المقاس", "محيط الخصر", "الطول الكلي"],
  rows: [
    { size: "S", values: ["70–80", "98"] },
    { size: "M", values: ["74–84", "100"] },
    { size: "L", values: ["78–88", "102"] },
    { size: "XL", values: ["82–94", "104"] },
    { size: "XXL", values: ["86–100", "106"] },
  ],
};

/** "Which size am I?" is the real question — a bare table only half-answers it. */
export const MEASURE_STEPS: { label: string; text: string }[] = [
  { label: "الصدر", text: "افرد القطعة على سطح مستوٍ وقس العرض من تحت الإبط إلى الإبط الآخر." },
  { label: "الطول", text: "من أعلى الكتف عند الرقبة حتى أسفل القطعة." },
  { label: "الكتف", text: "من طرف الكتف إلى طرفه الآخر." },
  { label: "الخصر", text: "قس محيط الخصر عند المكان الذي يستقر فيه السروال عادةً." },
];

export const SIZE_TOLERANCE_NOTE =
  "القياسات تقريبية بالسنتيمتر، وقد تختلف بمقدار 1 إلى 2 سم حسب القطعة وطريقة الخياطة.";

export const SIZE_FIT_NOTE =
  "قصّات كيان أوفرسايز. إن كنت بين مقاسين، اختر الأصغر لمظهر أقرب إلى الجسم، والأكبر لمظهر أوسع.";
