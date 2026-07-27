// REDBOX seed script — populates DB with:
//   - Admin user (nfllmzqi / asd123)
//   - Site settings (marketplace, social, brand, SEO)
//   - 7 categories with subcategories
//   - 10 sample products
//   - 2 banners (hero + promo)
//   - 3 blog posts
//   - 8 FAQ entries
//   - 3 testimonials
//
// Run: bun run scripts/seed.ts
// Safe to re-run — uses upsert pattern.

import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";

const db = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha512").update(`${salt}:${password}`).digest("hex");
  return `pbkdf2$100000$${salt}$${hash}`;
}

async function main() {
  console.log("🌱 Seeding REDBOX database...\n");

  // --- Admin user ---
  await db.adminUser.upsert({
    where: { username: "nfllmzqi" },
    update: {},
    create: {
      username: "nfllmzqi",
      passwordHash: hashPassword("asd123"),
      name: "REDBOX Admin",
    },
  });
  console.log("✓ Admin user (nfllmzqi / asd123)");

  // --- Site settings ---
  const settings: Record<string, string> = {
    "marketplace.shopee": "https://shopee.co.id/redbox_officialstore",
    "marketplace.tokopedia": "https://www.tokopedia.com/redbox-official",
    "marketplace.lazada": "https://www.lazada.co.id/shop/redbox_03",
    "marketplace.tiktok_shop": "https://www.tiktok.com/@redbox.official",
    "marketplace.whatsapp": "https://wa.me/6281324898585",
    "marketplace.whatsapp_number": "6281324898585",
    "social.instagram": "https://www.instagram.com/redbox.official",
    "social.instagram_handle": "@redbox.official",
    "social.tiktok": "https://www.tiktok.com/@redbox.official",
    "social.facebook": "https://www.facebook.com/share/1Fm7EDcktv/",
    "social.whatsapp": "https://wa.me/6281324898585",
    "brand.name": "REDBOX",
    "brand.tagline": "Premium Teen Fashion Brand dari Bandung",
    "brand.email": "hello@redbox-official.com",
    "brand.phone": "+62 813-2489-8585",
    "brand.location": "Bandung, Indonesia",
    "brand.address": "Jl. Setiabudi No. 207, Bandung 40154, Jawa Barat, Indonesia",
    "brand.operating_hours": "Senin–Sabtu, 09:00–18:00 WIB",
    "brand.maps_embed": "https://maps.google.com/maps?q=Bandung&output=embed",
    "seo.default_title": "REDBOX — Premium Teen Fashion Brand dari Bandung",
    "seo.default_description": "REDBOX Official — brand fashion remaja asal Bandung, Indonesia. Pakaian premium dengan desain modern dan nyaman untuk anak usia 9–17 tahun. Belanja via Shopee, TikTok Shop, Lazada & WhatsApp.",
    "contact.form_email": "hello@redbox-official.com",
  };
  for (const [key, value] of Object.entries(settings)) {
    await db.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log(`✓ ${Object.keys(settings).length} site settings`);

  // --- Categories + Subcategories ---
  const categoryDefs = [
    {
      slug: "kaos-anak", name: "Kaos Anak", tagline: "Kaos premium untuk aktivitas harian",
      description: "Kaos anak laki-laki dengan bahan katun premium, nyaman dipakai seharian.",
      icon: "shirt", image: "/assets/categories/kaos-anak.svg",
      subcategories: ["Kaos Lengan Pendek", "Kaos Lengan Panjang", "Graphic Tee", "Basic Tee", "Oversize Tee"],
    },
    {
      slug: "kaos-polo", name: "Kaos Polo", tagline: "Polo klasik untuk tampil rapi",
      description: "Kaos polo anak dengan bahan lacoste premium, cocok untuk acara semi-formal.",
      icon: "shirt", image: "/assets/categories/kaos-polo.svg",
      subcategories: ["Polo Lengan Pendek"],
    },
    {
      slug: "kemeja", name: "Kemeja", tagline: "Kemeja untuk tampil smart casual",
      description: "Kemeja anak laki-laki bahan katun premium, potongan modern.",
      icon: "shirt", image: "/assets/categories/kemeja.svg",
      subcategories: ["Kemeja Lengan Panjang"],
    },
    {
      slug: "muslim-wear", name: "Muslim Wear", tagline: "Busana muslim nyaman untuk anak",
      description: "Koko, gamis, dan set muslim anak dengan bahan adem dan desain modern.",
      icon: "shirt", image: "/assets/categories/muslim-wear.svg",
      subcategories: ["Koko Anak", "Koko Remaja", "Gamis Anak", "Set Muslim"],
    },
    {
      slug: "celana", name: "Celana", tagline: "Celana nyaman untuk segala aktivitas",
      description: "Celana anak laki-laki dengan potongan modern dan bahan berkualitas.",
      icon: "pants", image: "/assets/categories/celana.svg",
      subcategories: ["Celana Pendek", "Celana Panjang", "Cargo", "Chino", "Jogger", "Jeans"],
    },
    {
      slug: "outerwear", name: "Outerwear", tagline: "Lapisan luar untuk tampil keren",
      description: "Hoodie, sweater, crewneck, jacket, dan windbreaker anak laki-laki.",
      icon: "jacket", image: "/assets/categories/outerwear.svg",
      subcategories: ["Hoodie", "Sweater", "Crewneck", "Jacket", "Windbreaker"],
    },
    {
      slug: "parfume", name: "Parfume", tagline: "Wangi segar untuk anak muda",
      description: "Parfum dengan wangi segar dan tahan lama, aman untuk anak.",
      icon: "spray", image: "/assets/categories/parfume.svg",
      subcategories: ["Parfum 10 ml", "Parfum 15 ml", "Parfum 30 ml"],
    },
  ];

  for (let i = 0; i < categoryDefs.length; i++) {
    const c = categoryDefs[i];
    const cat = await db.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        icon: c.icon,
        image: c.image,
        sortOrder: i,
        isActive: true,
      },
    });
    for (let j = 0; j < c.subcategories.length; j++) {
      const subName = c.subcategories[j];
      const subSlug = subName.toLowerCase().replace(/\s+/g, "-");
      await db.subcategory.upsert({
        where: { categoryId_slug: { categoryId: cat.id, slug: subSlug } },
        update: {},
        create: {
          slug: subSlug,
          name: subName,
          categoryId: cat.id,
          sortOrder: j,
          isActive: true,
        },
      });
    }
  }
  console.log(`✓ ${categoryDefs.length} categories + ${categoryDefs.reduce((s, c) => s + c.subcategories.length, 0)} subcategories`);

  // --- Products ---
  const cats = await db.category.findMany({ include: { subcategories: true } });
  const findCat = (slug: string) => cats.find((c) => c.slug === slug)!;
  const findSub = (catSlug: string, subSlug: string) =>
    findCat(catSlug).subcategories.find((s) => s.slug === subSlug);

  const productDefs = [
    {
      slug: "kaos-basic-tee-hitam", name: "Basic Tee Hitam — Premium Cotton",
      sku: "RDB-KA-001", categoryId: "kaos-anak", subcategoryId: "basic-tee",
      price: 79000, material: "100% Katun Combed 30s, 180 GSM",
      description: "Kaos basic warna hitam dengan bahan katun combed premium. Potongan regular fit, nyaman dipakai seharian.",
      detailInfo: "Bahan: Katun Combed 30s. Berat: 180 GSM. Fit: Regular Fit. Jahitan: Rantai (chain stitch) untuk daya tahan maksimal.",
      careInfo: "Cuci dengan air dingin. Setrika suhu sedang. Jangan gunakan pemutih. Cuci terbalik untuk menjaga warna.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Hitam", hex: "#0a0a0a"}, {name: "Putih", hex: "#ffffff"}, {name: "Navy", hex: "#1a2b4a"}],
      weightGram: 180, badge: "BEST_SELLER", rating: 4.9, reviewCount: 1240, popularity: 95,
      images: ["/assets/products/p1.svg", "/assets/products/p1-2.svg", "/assets/products/p1-3.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
      lazadaUrl: "https://www.lazada.co.id/shop/redbox_03",
    },
    {
      slug: "graphic-tee-urban-white", name: "Graphic Tee Urban — Putih",
      sku: "RDB-KA-002", categoryId: "kaos-anak", subcategoryId: "graphic-tee",
      price: 99000, material: "100% Katun Combed 24s, 220 GSM",
      description: "Graphic tee dengan desain urban modern. Bahan tebal premium, sablonan tahan lama.",
      detailInfo: "Bahan: Katun Combed 24s. Berat: 220 GSM. Fit: Oversized. Sablon: Plastisol untuk ketajaman warna.",
      careInfo: "Cuci terbalik dengan air dingin. Jangan disetrika di area sablon.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Putih", hex: "#ffffff"}, {name: "Hitam", hex: "#0a0a0a"}],
      weightGram: 220, badge: "NEW_ARRIVAL", rating: 4.8, reviewCount: 380, popularity: 88,
      images: ["/assets/products/p2.svg", "/assets/products/p2-2.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
      lazadaUrl: "https://www.lazada.co.id/shop/redbox_03",
    },
    {
      slug: "oversize-tee-street-black", name: "Oversize Tee Street — Hitam",
      sku: "RDB-KA-003", categoryId: "kaos-anak", subcategoryId: "oversize-tee",
      price: 109000, material: "100% Katun Combed 24s, 240 GSM",
      description: "Oversize tee dengan potongan streetwear modern. Bahan tebal, jatuh sempurna.",
      detailInfo: "Bahan: Katun Combed 24s. Berat: 240 GSM. Fit: Oversized drop shoulder.",
      careInfo: "Cuci air dingin, setrika sedang, jangan pemutih.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Hitam", hex: "#0a0a0a"}, {name: "Cream", hex: "#efe6d2"}],
      weightGram: 240, badge: "TRENDING", rating: 4.9, reviewCount: 720, popularity: 92,
      images: ["/assets/products/p3.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
    },
    {
      slug: "polo-classic-navy", name: "Polo Classic Navy",
      sku: "RDB-KP-001", categoryId: "kaos-polo", subcategoryId: "polo-lengan-pendek",
      price: 119000, material: "Lacoste Pique 220 GSM",
      description: "Polo klasik bahan lacoste premium. Cocok untuk acara semi-formal dan seragam.",
      detailInfo: "Bahan: Lacoste Pique (katun 100%). Berat: 220 GSM. Fit: Regular. Kerah: Ribbed collar.",
      careInfo: "Cuci air dingin, jangan diperas kuat, jemur di tempat teduh.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Navy", hex: "#1a2b4a"}, {name: "Putih", hex: "#ffffff"}, {name: "Hitam", hex: "#0a0a0a"}],
      weightGram: 220, badge: "BEST_SELLER", rating: 4.9, reviewCount: 890, popularity: 90,
      images: ["/assets/products/p4.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
      lazadaUrl: "https://www.lazada.co.id/shop/redbox_03",
    },
    {
      slug: "kemeja-flanel-merah", name: "Kemeja Flanel Merah",
      sku: "RDB-KM-001", categoryId: "kemeja", subcategoryId: "kemeja-lengan-panjang",
      price: 149000, material: "Flanel Katun 200 GSM",
      description: "Kemeja flanel dengan motif klasik. Bahan adem, cocok untuk cuaca Bandung.",
      detailInfo: "Bahan: Flanel Katun. Berat: 200 GSM. Fit: Slim Fit. Kancing: Matt pearl.",
      careInfo: "Cuci air dingin, setrika sedang, jangan pemutih.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Merah", hex: "#E60012"}, {name: "Biru", hex: "#1e3a8a"}],
      weightGram: 350, badge: "NEW_ARRIVAL", rating: 4.7, reviewCount: 210, popularity: 80,
      images: ["/assets/products/p5.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
    },
    {
      slug: "koko-anak-modern-cream", name: "Koko Anak Modern Cream",
      sku: "RDB-MW-001", categoryId: "muslim-wear", subcategoryId: "koko-anak",
      price: 129000, material: "Katun Linen Adem",
      description: "Koko anak dengan desain modern, bahan adem dan nyaman dipakai beribadah.",
      detailInfo: "Bahan: Katun Linen. Fit: Regular. Saku: 2 saku samping.",
      careInfo: "Cuci air dingin, setrika sedang.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Cream", hex: "#efe6d2"}, {name: "Putih", hex: "#ffffff"}],
      weightGram: 280, badge: null, rating: 4.8, reviewCount: 150, popularity: 75,
      images: ["/assets/products/p6.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
    },
    {
      slug: "celana-cargo-army", name: "Celana Cargo Army",
      sku: "RDB-CL-001", categoryId: "celana", subcategoryId: "cargo",
      price: 139000, material: "Katun Twill 280 GSM",
      description: "Celana cargo dengan 6 saku fungsional. Bahan tebal, cocok untuk aktivitas outdoor.",
      detailInfo: "Bahan: Katun Twill. Berat: 280 GSM. Fit: Regular tapered. Saku: 6 saku.",
      careInfo: "Cuci air dingin, setrika sedang.",
      sizes: ["28", "30", "32", "34"], colors: [{name: "Army", hex: "#5c5c42"}, {name: "Hitam", hex: "#0a0a0a"}],
      weightGram: 450, badge: "TRENDING", rating: 4.8, reviewCount: 540, popularity: 87,
      images: ["/assets/products/p7.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
    },
    {
      slug: "hoodie-premium-gray", name: "Hoodie Premium Gray",
      sku: "RDB-OW-001", categoryId: "outerwear", subcategoryId: "hoodie",
      price: 179000, material: "Fleece Premium 320 GSM",
      description: "Hoodie premium dengan bahan fleece tebal, hangat dan nyaman.",
      detailInfo: "Bahan: Fleece (katun-polyester blend). Berat: 320 GSM. Fit: Regular. Hood: Double layer.",
      careInfo: "Cuci air dingin, jangan pemutih, setrika rendah.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Gray", hex: "#6b6b6b"}, {name: "Hitam", hex: "#0a0a0a"}, {name: "Navy", hex: "#1a2b4a"}],
      weightGram: 520, badge: "BEST_SELLER", rating: 4.9, reviewCount: 980, popularity: 94,
      images: ["/assets/products/p8.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
      lazadaUrl: "https://www.lazada.co.id/shop/redbox_03",
    },
    {
      slug: "jacket-windbreaker-black", name: "Jacket Windbreaker Black",
      sku: "RDB-OW-002", categoryId: "outerwear", subcategoryId: "windbreaker",
      price: 199000, material: "Nylon Taslan Waterproof",
      description: "Windbreaker ringan tahan angin dan gerimis. Cocok untuk aktifitas outdoor.",
      detailInfo: "Bahan: Nylon Taslan. Fit: Regular. Fitur: Hood lipat, saku samping, zipper full.",
      careInfo: "Cuci air dingin, jangan setrika suhu tinggi.",
      sizes: ["S", "M", "L", "XL"], colors: [{name: "Hitam", hex: "#0a0a0a"}, {name: "Navy", hex: "#1a2b4a"}],
      weightGram: 380, badge: "NEW_ARRIVAL", rating: 4.7, reviewCount: 260, popularity: 82,
      images: ["/assets/products/p9.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
    },
    {
      slug: "parfum-fresh-30ml", name: "Parfum Fresh 30ml",
      sku: "RDB-PF-001", categoryId: "parfume", subcategoryId: "parfum-30-ml",
      price: 89000, material: "Eau de Parfum 30ml",
      description: "Parfum dengan wangi fresh citrus, tahan 6-8 jam. Aman untuk remaja.",
      detailInfo: "Volume: 30ml. Konsentrasi: Eau de Parfum. Top note: Citrus. Base note: Musk.",
      careInfo: "Simpan di tempat sejuk, hindari sinar matahari langsung.",
      sizes: ["30ml"], colors: [{name: "Default", hex: "#E60012"}],
      weightGram: 200, badge: "SALE", rating: 4.8, reviewCount: 420, popularity: 78,
      images: ["/assets/products/p10.svg"],
      shopeeUrl: "https://shopee.co.id/redbox_officialstore", tiktokUrl: "https://www.tiktok.com/@redbox.official",
    },
  ];

  for (const p of productDefs) {
    const cat = findCat(p.categoryId);
    const sub = p.subcategoryId ? findSub(p.categoryId, p.subcategoryId) : null;
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        sku: p.sku,
        description: p.description,
        detailInfo: p.detailInfo,
        careInfo: p.careInfo,
        material: p.material,
        categoryId: cat?.id,
        subcategoryId: sub?.id,
        price: p.price,
        weightGram: p.weightGram,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        badge: p.badge,
        rating: p.rating,
        reviewCount: p.reviewCount,
        popularity: p.popularity,
        shopeeUrl: p.shopeeUrl,
        tiktokUrl: p.tiktokUrl,
        lazadaUrl: p.lazadaUrl,
        whatsappUrl: `https://wa.me/6281324898585?text=Hi%20REDBOX%2C%20saya%20tertarik%20dengan%20${encodeURIComponent(p.name)}`,
        status: "published",
      },
    });
  }
  console.log(`✓ ${productDefs.length} products`);

  // --- Banners ---
  const existingBanners = await db.banner.count();
  if (existingBanners === 0) {
    await db.banner.createMany({
      data: [
        {
          title: "Style For The Next Generation",
          subtitle: "Premium teen fashion brand asal Bandung. Pakaian modern dan nyaman untuk usia 9–17 tahun.",
          ctaText: "Shop Now", ctaHref: "/shop",
          imageDesktop: "/assets/banners/hero-1.svg",
          imageMobile: "/assets/banners/hero-1-mobile.svg",
          placement: "hero", overlay: "dark-left", sortOrder: 0, isActive: true,
        },
        {
          title: "New Collection 2026",
          subtitle: "Drop terbaru dengan desain streetwear modern.",
          ctaText: "Lihat Koleksi", ctaHref: "/category/kaos-anak",
          imageDesktop: "/assets/banners/hero-2.svg",
          imageMobile: "/assets/banners/hero-2-mobile.svg",
          placement: "hero", overlay: "dark-right", sortOrder: 1, isActive: true,
        },
        {
          title: "Flash Sale — Diskon hingga 30%",
          subtitle: "Khusus pembelian via marketplace resmi. Terbatas!",
          ctaText: "Lihat Promo", ctaHref: "/shop?sale=1",
          imageDesktop: "/assets/banners/promo-1.svg",
          imageMobile: "/assets/banners/promo-1.svg",
          placement: "promo", overlay: "dark-bottom", sortOrder: 0, isActive: true,
        },
      ],
    });
    console.log("✓ 3 banners (2 hero + 1 promo)");
  } else {
    console.log(`✓ ${existingBanners} banners already exist — skipping`);
  }

  // --- Blog posts ---
  const blogPosts = [
    {
      slug: "tips-memilih-kaos-anak-yang-nyaman",
      title: "5 Tips Memilih Kaos Anak yang Nyaman Dipakai Seharian",
      excerpt: "Kaos adalah pilihan utama untuk aktivitas harian anak. Ini panduan memilih kaos yang nyaman dan tahan lama.",
      content: "## 1. Perhatikan Bahan\n\nPilih kaos dengan bahan katun combed 30s atau 24s. Bahan ini adem, lembut di kulit, dan tahan lama.\n\n## 2. Pilih Berat yang Tepat\n\nUntuk cuaca Indonesia, kaos dengan berat 180-220 GSM sudah cukup. Terlalu tipis mudah transparan, terlalu tebal gerah.\n\n## 3. Potongan yang Sesuai\n\nRegular fit cocok untuk aktivitas harian. Oversized untuk gaya streetwear.\n\n## 4. Perhatikan Jahitan\n\nJahitan rantai (chain stitch) lebih tahan lama dibanding jahitan biasa.\n\n## 5. Pilih Warna Netral\n\nHitam, putih, navy, dan gray mudah dipadukan dan tidak mudah pudar.",
      coverImage: "/assets/blog/post-1.svg",
      category: "Tips Fashion",
      tags: JSON.stringify(["kaos", "tips", "anak"]),
      featured: true,
    },
    {
      slug: "mix-and-match-outfit-sekolah",
      title: "Mix & Match: Outfit Sekolah Anak Laki-laki yang Stylish",
      excerpt: "Ide padu-padan baju untuk sekolah yang rapi tapi tetap stylish dan nyaman.",
      content: "## Outfit 1: Smart Casual\n\nKemeja flanel + celana chino + sneakers putih.\n\n## Outfit 2: Daily Comfort\n\nKaos basic + celana cargo + sneakers.\n\n## Outfit 3: Street Style\n\nOversize tee + jogger + sneakers + cap.",
      coverImage: "/assets/blog/post-2.svg",
      category: "Mix & Match",
      tags: JSON.stringify(["mix match", "sekolah", "outfit"]),
      featured: false,
    },
    {
      slug: "tren-fashion-remaja-2026",
      title: "Tren Fashion Remaja 2026: Streetwear Dominan",
      excerpt: "Streetwear masih mendominasi tren fashion remaja tahun ini. Inilah yang sedang hype.",
      content: "## Streetwear tetap dominan\n\nOversized tee, cargo pants, dan hoodie masih jadi favorit.\n\n## Warna earth tone\n\nCream, brown, dan army green sedang tren.\n\n## Aksesoris minimalis\n\nCap dan socks dengan desain simple.",
      coverImage: "/assets/blog/post-3.svg",
      category: "Fashion Trend",
      tags: JSON.stringify(["tren", "2026", "streetwear"]),
      featured: false,
    },
  ];
  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags,
        featured: post.featured,
        status: "published",
        author: "REDBOX Team",
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✓ ${blogPosts.length} blog posts`);

  // --- FAQ ---
  const faqs = [
    { question: "Bagaimana cara pemesanan produk REDBOX?", answer: "Semua pemesanan dilakukan melalui marketplace resmi kami: Shopee, TikTok Shop, Lazada, atau langsung chat WhatsApp. Pilih tombol belanja di halaman produk.", category: "Pesanan" },
    { question: "Apakah REDBOX memiliki toko fisik?", answer: "Saat ini REDBOX berbasis di Bandung dan berfokus pada penjualan online melalui marketplace. Untuk kunjungan langsung, silakan hubungi kami via WhatsApp.", category: "Umum" },
    { question: "Berapa lama pengiriman?", answer: "Pengiriman ditangani marketplace tempat Anda memesan. Standar 2-5 hari kerja untuk seluruh Indonesia via JNE, J&T, SiCepat, atau AnterAja.", category: "Pengiriman" },
    { question: "Bagaimana cara pembayaran?", answer: "Pembayaran dilakukan di marketplace pilihan Anda. Tersedia berbagai metode: transfer bank, e-wallet (OVO, DANA, GoPay), COD, dan lainnya.", category: "Pembayaran" },
    { question: "Apakah bisa retur atau tukar barang?", answer: "Ya, retur dan tukar barang bisa dilakukan sesuai kebijakan marketplace (biasanya 7 hari setelah pesanan diterima). Hubungi marketplace tempat Anda memesan.", category: "Pesanan" },
    { question: "Bagaimana cara memilih ukuran yang tepat?", answer: "Setiap produk memiliki panduan ukuran di halaman detail. Jika ragu, chat kami via WhatsApp dengan tinggi dan berat badan anak untuk rekomendasi.", category: "Produk" },
    { question: "Apakah bahan REDBOX aman untuk anak?", answer: "Ya, semua produk REDBOX menggunakan bahan premium yang aman untuk anak. Katun combed, lacoste, dan linen yang adem dan tidak menyebabkan iritasi.", category: "Produk" },
    { question: "Apakah ada garantinya?", answer: "Garansi mengikuti kebijakan marketplace. Untuk cacat produksi, hubungi marketplace dalam 7 hari setelah barang diterima.", category: "Pesanan" },
  ];
  for (let i = 0; i < faqs.length; i++) {
    await db.faq.create({
      data: {
        question: faqs[i].question,
        answer: faqs[i].answer,
        category: faqs[i].category,
        sortOrder: i,
        isActive: true,
      },
    });
  }
  console.log(`✓ ${faqs.length} FAQ entries`);

  // --- Testimonials ---
  const testimonials = [
    {
      author: "Dewi Anggraini", role: "Bunda dari Arka (12 tahun)", rating: 5,
      body: "Bahan kaosnya adem banget, anak saya betul pakai seharian ke sekolah. Jahitan rapi, model modern. Pasti repeat order!",
    },
    {
      author: "Rizki Pratama", role: "Pelanggan Jakarta", rating: 5,
      body: "Awalnya ragu karena harga terjangkau, ternyata kualitasnya premium. Polosannya cocok untuk anak SMP, tidak kebesaran tidak kekecilan.",
    },
    {
      author: "Sinta Wulandari", role: "Bunda dari Bima (14 tahun)", rating: 5,
      body: "Pengiriman cepat ke Surabaya. Kain premium, desain keren, anak senang. Redbox paham banget selera anak muda sekarang.",
    },
  ];
  for (let i = 0; i < testimonials.length; i++) {
    await db.testimonial.create({
      data: {
        author: testimonials[i].author,
        role: testimonials[i].role,
        rating: testimonials[i].rating,
        body: testimonials[i].body,
        sortOrder: i,
        isActive: true,
      },
    });
  }
  console.log(`✓ ${testimonials.length} testimonials`);

  console.log("\n✅ Seed completed!");
  console.log("   Admin: nfllmzqi / asd123");
  console.log("   DB: SQLite at db/redbox.db");
}

main()
  .catch((err) => { console.error("❌ Seed failed:", err); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
