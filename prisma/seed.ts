import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // --- Categories (§4): 6 fixed, only 3 unmasked at launch ---
  const categoryData = [
    { name: "T-shirts", nameAr: "أقمصة", slug: "t-shirts", visible: true, position: 1 },
    { name: "Totebags", nameAr: "توت باغز", slug: "totebags", visible: true, position: 2 },
    { name: "Hoodies", nameAr: "هووديز", slug: "hoodies", visible: true, position: 3 },
    { name: "Joggers", nameAr: "جوغرز", slug: "joggers", visible: false, position: 4 },
    { name: "Shorts", nameAr: "شورت", slug: "shorts", visible: false, position: 5 },
    { name: "Backpacks", nameAr: "حقائب ظهر", slug: "backpacks", visible: false, position: 6 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    categories[c.slug] = created.id;
  }

  // --- Products, including owner-only pricing fields ---
  const hoodie = await prisma.product.upsert({
    where: { slug: "hoodie-jazairi" },
    update: {},
    create: {
      name: 'هوودي "جزائري"',
      slug: "hoodie-jazairi",
      description: "هوودي عصري بطابع جزائري، قماش قطني ثقيل، تصميم أوفرسايز.",
      careInstructions: "غسيل بارد، لا يُستعمل المجفف.",
      salePrice: 4500,
      discountPrice: 3800,
      costPrice: 1600, // owner-only — must never leave the server
      rawPrice: 1200, // owner-only
      sponsorSpend: 150, // owner-only
      profit: 2050, // owner-only
      trending: true,
      metaDescription: 'هوودي جزائري أوفرسايز من كيان - تصميم يحمل الهوية الجزائرية.',
      categoryId: categories["hoodies"],
      images: {
        create: [
          { url: "/images/seed/hoodie.svg", position: 0, isLifestyle: false },
          { url: "/images/seed/hero-1.svg", position: 1, isLifestyle: true },
        ],
      },
      variants: {
        create: [
          { color: "أسود", size: "M", sku: "HD-JZ-BLK-M", stock: 12 },
          { color: "أسود", size: "L", sku: "HD-JZ-BLK-L", stock: 0 },
          { color: "بيج", size: "M", sku: "HD-JZ-BEG-M", stock: 5 },
        ],
      },
    },
    include: { images: true },
  });

  const tshirt = await prisma.product.upsert({
    where: { slug: "tshirt-kayaan-arabic" },
    update: {},
    create: {
      name: "تيشيرت خط عربي",
      slug: "tshirt-kayaan-arabic",
      description: "تيشيرت قطن 100% بطبعة خط عربي أصيل.",
      careInstructions: "غسيل يدوي أو بارد، كي على درجة منخفضة.",
      salePrice: 2800,
      discountPrice: null,
      costPrice: 900,
      rawPrice: 650,
      sponsorSpend: 80,
      profit: 1170,
      trending: false,
      metaDescription: "تيشيرت خط عربي أصيل من كيان.",
      categoryId: categories["t-shirts"],
      images: {
        create: [{ url: "/images/seed/tshirt.svg", position: 0, isLifestyle: false }],
      },
      variants: {
        create: [
          { color: "أبيض", size: "S", sku: "TS-AR-WHT-S", stock: 20 },
          { color: "أبيض", size: "M", sku: "TS-AR-WHT-M", stock: 18 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "totebag-hikma" },
    update: {},
    create: {
      name: 'توت باغ "حكمة"',
      slug: "totebag-hikma",
      description: "توت باغ قماشي متين بطبعة مستوحاة من الفن الإسلامي.",
      salePrice: 1800,
      costPrice: 500,
      rawPrice: 350,
      sponsorSpend: 40,
      profit: 910,
      categoryId: categories["totebags"],
      images: { create: [{ url: "/images/seed/totebag.svg", position: 0 }] },
      variants: { create: [{ color: "بيج", size: "One Size", sku: "TB-HK-BEG-OS", stock: 30 }] },
    },
  });

  // A hotspot: from the hoodie's lifestyle photo, link to the t-shirt (§7 item 4)
  const lifestyleImage = hoodie.images.find((i: { isLifestyle: boolean }) => i.isLifestyle);
  if (lifestyleImage) {
    await prisma.hotspot.upsert({
      where: { id: "seed-hotspot-1" },
      update: {},
      create: {
        id: "seed-hotspot-1",
        imageId: lifestyleImage.id,
        xPercent: 62.5,
        yPercent: 40.0,
        linkedProductId: tshirt.id,
      },
    });
  }

  // --- Bundle ---
  await prisma.bundle.upsert({
    where: { slug: "duo-hoodie-tshirt" },
    update: {},
    create: {
      name: "Duo هوودي + تيشيرت",
      slug: "duo-hoodie-tshirt",
      description: "اقتنِ الهوودي والتيشيرت معاً بسعر مميز.",
      bundlePrice: 6000,
      items: {
        create: [
          { productId: hoodie.id, quantity: 1 },
          { productId: tshirt.id, quantity: 1 },
        ],
      },
    },
  });

  // --- Collection ---
  const collection = await prisma.collection.upsert({
    where: { slug: "drop-ramadan-2026" },
    update: {},
    create: {
      name: "Ramadan Drop 2026",
      nameAr: "إطلاقة رمضان 2026",
      slug: "drop-ramadan-2026",
      description: "تشكيلة رمضان الجديدة.",
      visible: true,
    },
  });
  await prisma.collectionProduct.upsert({
    where: { collectionId_productId: { collectionId: collection.id, productId: hoodie.id } },
    update: {},
    create: { collectionId: collection.id, productId: hoodie.id, position: 0 },
  });

  // --- A review awaiting moderation + one approved ---
  await prisma.review.createMany({
    data: [
      { productId: hoodie.id, customerName: "سارة", rating: 5, comment: "جودة ممتازة!", approved: true },
      { productId: hoodie.id, customerName: "عمر", rating: 4, comment: "المقاس كبير شوي.", approved: false },
    ],
  });

  // --- Sample order for the dashboard and order management screens ---
  const order = await prisma.order.create({
    data: {
      customerName: "أمينة بلال",
      phone: "0550000000",
      email: "amina@example.com",
      shippingAddress: "الحي الصناعي، شارع 12",
      wilaya: "الجزائر",
      deliveryMethod: "HOME_DELIVERY",
      deliveryFee: 500,
      status: "AWAITING_PAYMENT",
      totalAmount: 4300,
      items: {
        create: [
          { productId: hoodie.id, quantity: 1, unitPrice: 3800 },
        ],
      },
      statusHistory: {
        create: [{ status: "AWAITING_PAYMENT", note: "تم إنشاء الطلب" }],
      },
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId: order.id,
      status: "AWAITING_PAYMENT",
      note: "طلب تجريبي لعرض لوحة التحكم",
    },
  });

  // --- Blocked numbers ---
  await prisma.blockedNumber.upsert({
    where: { phone: "0500000000" },
    update: {},
    create: { phone: "0500000000", reason: "طلبات وهمية متكررة" },
  });

  // --- Admin-editable homepage content (§14.11) ---
  await prisma.siteSetting.upsert({
    where: { key: "top_banner_messages" },
    update: {},
    create: {
      key: "top_banner_messages",
      value: JSON.stringify([
        "🚀 التوصيل السريع: يومين إلى ثلاثة أيام بعد التأكيد",
        "الدفع عند الاستلام متوفر لجميع الولايات",
      ]),
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "running_bar_items" },
    update: {},
    create: {
      key: "running_bar_items",
      value: JSON.stringify([
        { icon: "💵", label: "الدفع عند الاستلام" },
        { icon: "🚚", label: "توصيل 58 ولاية" },
        { icon: "🎧", label: "خدمة العملاء" },
        { icon: "🎨", label: "إمكانية التخصيص" },
      ]),
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "homepage_video_url" },
    update: {},
    create: { key: "homepage_video_url", value: "" }, // admin uploads/sets via dashboard
  });
  await prisma.siteSetting.upsert({
    where: { key: "hero_slides" },
    update: {},
    create: {
      key: "hero_slides",
      value: JSON.stringify([
        { imageUrl: "/images/seed/hero-1.svg", headline: "كيان… أكثر من ستايل", ctaLabel: "تسوق الآن", ctaHref: "/collections/drop-ramadan-2026" },
        { imageUrl: "/images/seed/hero-2.svg", headline: "إصدارات رمضان الجديدة", ctaLabel: "استكشف التشكيلة", ctaHref: "/collections/drop-ramadan-2026" },
      ]),
    },
  });
  await prisma.siteSetting.upsert({
    where: { key: "testimonials" },
    update: {},
    create: {
      key: "testimonials",
      value: JSON.stringify([
        { name: "سارة", quote: "جودة القماش ممتازة والتصميم مميز جداً.", rating: 5 },
        { name: "يوسف", quote: "التوصيل كان سريع والتعامل راقي.", rating: 5 },
      ]),
    },
  });

  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@kayaaan.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin1234!";
  const { hashPassword } = await import("../src/lib/password");
  const passwordHash = hashPassword(adminPassword);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });

  console.log(`Seed complete. Admin user: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
