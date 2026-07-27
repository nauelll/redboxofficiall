// REDBOX data access layer — Prisma-backed with in-memory cache.
// Dual API: async getX() for server components, getXSync() for client components.

import { db } from "@/lib/db";
import type {
  Product, Category, Subcategory, Banner, BlogPost, Faq, Testimonial,
  SiteSettings, Badge,
} from "@/types";
import type {
  Product as PrismaProduct, Category as PrismaCategory,
  Subcategory as PrismaSubcategory, Banner as PrismaBanner,
  BlogPost as PrismaBlogPost, Faq as PrismaFaq, Testimonial as PrismaTestimonial,
} from "@prisma/client";

export const SITE_URL = "https://redbox-official.com";

// ---------------------------------------------------------------------------
// Default settings (used as fallback when DB not available)
// ---------------------------------------------------------------------------

export const DEFAULT_SETTINGS: SiteSettings = {
  marketplace: {
    shopee: "https://shopee.co.id/redbox_officialstore",
    tokopedia: "https://www.tokopedia.com/redbox-official",
    lazada: "https://www.lazada.co.id/shop/redbox_03",
    tiktokShop: "https://www.tiktok.com/@redbox.official",
    whatsapp: "https://wa.me/6281324898585",
    whatsappNumber: "6281324898585",
  },
  social: {
    instagram: "https://www.instagram.com/redbox.official",
    instagramHandle: "@redbox.official",
    tiktok: "https://www.tiktok.com/@redbox.official",
    facebook: "https://www.facebook.com/share/1Fm7EDcktv/",
    whatsapp: "https://wa.me/6281324898585",
  },
  brand: {
    name: "REDBOX",
    tagline: "Premium Teen Fashion Brand dari Bandung",
    email: "hello@redbox-official.com",
    phone: "+62 813-2489-8585",
    location: "Bandung, Indonesia",
    address: "Jl. Setiabudi No. 207, Bandung 40154, Jawa Barat, Indonesia",
    operatingHours: "Senin–Sabtu, 09:00–18:00 WIB",
    mapsEmbed: "https://maps.google.com/maps?q=Bandung&output=embed",
  },
  seo: {
    defaultTitle: "REDBOX — Premium Teen Fashion Brand dari Bandung",
    defaultDescription: "REDBOX Official — brand fashion remaja asal Bandung, Indonesia. Pakaian premium dengan desain modern dan nyaman untuk anak usia 9–17 tahun. Belanja via Shopee, TikTok Shop, Lazada & WhatsApp.",
  },
  contact: {
    formEmail: "hello@redbox-official.com",
  },
};

// Backward-compat constants (static — used by client components)
export const WHATSAPP_NUMBER = DEFAULT_SETTINGS.marketplace.whatsappNumber;
export const INSTAGRAM_HANDLE = DEFAULT_SETTINGS.social.instagramHandle;
export const BRAND_NAME = DEFAULT_SETTINGS.brand.name;
export const MARKETPLACE_LINKS = DEFAULT_SETTINGS.marketplace;
export const SOCIAL_LINKS = DEFAULT_SETTINGS.social;

// ---------------------------------------------------------------------------
// Settings cache
// ---------------------------------------------------------------------------

let settingsCache: { value: SiteSettings; ts: number } | null = null;
const SETTINGS_TTL_MS = process.env.NODE_ENV === "production" ? 60_000 : 1_000;

export async function getSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (settingsCache && now - settingsCache.ts < SETTINGS_TTL_MS) {
    return settingsCache.value;
  }
  try {
    const rows = await db.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    const settings: SiteSettings = {
      marketplace: {
        shopee: map["marketplace.shopee"] ?? DEFAULT_SETTINGS.marketplace.shopee,
        tokopedia: map["marketplace.tokopedia"] ?? DEFAULT_SETTINGS.marketplace.tokopedia,
        lazada: map["marketplace.lazada"] ?? DEFAULT_SETTINGS.marketplace.lazada,
        tiktokShop: map["marketplace.tiktok_shop"] ?? DEFAULT_SETTINGS.marketplace.tiktokShop,
        whatsapp: map["marketplace.whatsapp"] ?? DEFAULT_SETTINGS.marketplace.whatsapp,
        whatsappNumber: map["marketplace.whatsapp_number"] ?? DEFAULT_SETTINGS.marketplace.whatsappNumber,
      },
      social: {
        instagram: map["social.instagram"] ?? DEFAULT_SETTINGS.social.instagram,
        instagramHandle: map["social.instagram_handle"] ?? DEFAULT_SETTINGS.social.instagramHandle,
        tiktok: map["social.tiktok"] ?? DEFAULT_SETTINGS.social.tiktok,
        facebook: map["social.facebook"] ?? DEFAULT_SETTINGS.social.facebook,
        whatsapp: map["social.whatsapp"] ?? DEFAULT_SETTINGS.social.whatsapp,
      },
      brand: {
        name: map["brand.name"] ?? DEFAULT_SETTINGS.brand.name,
        tagline: map["brand.tagline"] ?? DEFAULT_SETTINGS.brand.tagline,
        email: map["brand.email"] ?? DEFAULT_SETTINGS.brand.email,
        phone: map["brand.phone"] ?? DEFAULT_SETTINGS.brand.phone,
        location: map["brand.location"] ?? DEFAULT_SETTINGS.brand.location,
        address: map["brand.address"] ?? DEFAULT_SETTINGS.brand.address,
        operatingHours: map["brand.operating_hours"] ?? DEFAULT_SETTINGS.brand.operatingHours,
        mapsEmbed: map["brand.maps_embed"] ?? DEFAULT_SETTINGS.brand.mapsEmbed,
      },
      seo: {
        defaultTitle: map["seo.default_title"] ?? DEFAULT_SETTINGS.seo.defaultTitle,
        defaultDescription: map["seo.default_description"] ?? DEFAULT_SETTINGS.seo.defaultDescription,
      },
      contact: {
        formEmail: map["contact.form_email"] ?? DEFAULT_SETTINGS.contact.formEmail,
      },
    };
    settingsCache = { value: settings, ts: now };
    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function getSettingsSync(): SiteSettings {
  return settingsCache?.value ?? DEFAULT_SETTINGS;
}

// ---------------------------------------------------------------------------
// Catalog cache
// ---------------------------------------------------------------------------

interface CatalogCache {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  ts: number;
}

let catalogCache: CatalogCache | null = null;
const CATALOG_TTL_MS = process.env.NODE_ENV === "production" ? 60_000 : 1_000;

function safeJsonParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

function mapProduct(p: PrismaProduct, category?: PrismaCategory | null, subcategory?: PrismaSubcategory | null): Product {
  return {
    id: p.id, slug: p.slug, name: p.name, sku: p.sku ?? undefined,
    description: p.description ?? "", detailInfo: p.detailInfo ?? undefined,
    careInfo: p.careInfo ?? undefined, material: p.material ?? undefined,
    categoryId: p.categoryId ?? undefined,
    categorySlug: category?.slug, categoryName: category?.name,
    subcategoryId: p.subcategoryId ?? undefined,
    subcategorySlug: subcategory?.slug, subcategoryName: subcategory?.name,
    price: p.price ?? undefined, weightGram: p.weightGram ?? undefined,
    images: safeJsonParse(p.images, []), video: p.video ?? undefined,
    sizes: safeJsonParse(p.sizes, []), colors: safeJsonParse(p.colors, []),
    badge: (p.badge as Badge | null) ?? null,
    rating: p.rating, reviewCount: p.reviewCount, popularity: p.popularity,
    shopeeUrl: p.shopeeUrl ?? undefined, tiktokUrl: p.tiktokUrl ?? undefined,
    lazadaUrl: p.lazadaUrl ?? undefined, whatsappUrl: p.whatsappUrl ?? undefined,
    seoTitle: p.seoTitle ?? undefined, seoDescription: p.seoDescription ?? undefined,
    altImage: p.altImage ?? undefined, status: p.status as Product["status"],
    createdAt: p.createdAt.toISOString(),
  };
}

function mapCategory(c: PrismaCategory & { subcategories?: PrismaSubcategory[]; _count?: { products: number } }): Category {
  return {
    id: c.id, slug: c.slug, name: c.name, tagline: c.tagline ?? undefined,
    description: c.description ?? undefined, icon: c.icon ?? undefined,
    image: c.image ?? undefined, bannerImage: c.bannerImage ?? undefined,
    seoTitle: c.seoTitle ?? undefined, seoDescription: c.seoDescription ?? undefined,
    sortOrder: c.sortOrder, isActive: c.isActive,
    subcategories: (c.subcategories ?? []).map((s) => ({
      id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId,
      sortOrder: s.sortOrder, isActive: s.isActive,
    })),
    productCount: c._count?.products,
  };
}

function mapBanner(b: PrismaBanner): Banner {
  return {
    id: b.id, title: b.title, subtitle: b.subtitle ?? undefined,
    ctaText: b.ctaText ?? undefined, ctaHref: b.ctaHref ?? undefined,
    imageDesktop: b.imageDesktop, imageMobile: b.imageMobile ?? undefined,
    placement: b.placement, overlay: b.overlay,
    sortOrder: b.sortOrder,
    startAt: b.startAt?.toISOString() ?? null,
    endAt: b.endAt?.toISOString() ?? null,
  };
}

async function loadCatalog(): Promise<CatalogCache> {
  const now = Date.now();
  if (catalogCache && now - catalogCache.ts < CATALOG_TTL_MS) {
    return catalogCache;
  }
  try {
    const [prismaProducts, prismaCategories, prismaBanners] = await Promise.all([
      db.product.findMany({
        where: { status: "published" },
        include: { category: true, subcategory: true },
        orderBy: { createdAt: "desc" },
      }),
      db.category.findMany({
        where: { isActive: true },
        include: { subcategories: { where: { isActive: true }, orderBy: { sortOrder: "asc" } }, _count: { select: { products: { where: { status: "published" } } } } },
        orderBy: { sortOrder: "asc" },
      }),
      db.banner.findMany({
        where: {
          isActive: true,
          AND: [
            { OR: [{ startAt: null }, { startAt: { lte: new Date() } }] },
            { OR: [{ endAt: null }, { endAt: { gte: new Date() } }] },
          ],
        },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    const products = prismaProducts.map((p) => mapProduct(p, p.category, p.subcategory));
    const categories = prismaCategories.map(mapCategory);
    const banners = prismaBanners.map(mapBanner);

    catalogCache = { products, categories, banners, ts: now };
    return catalogCache;
  } catch (err) {
    console.error("loadCatalog failed:", err);
    return { products: [], categories: [], banners: [], ts: now };
  }
}

export function bustCache() {
  catalogCache = null;
  settingsCache = null;
}

export async function refreshCache() {
  bustCache();
  await loadCatalog();
  await getSettings();
}

// ---------------------------------------------------------------------------
// SYNC API (for client components — returns cached or empty)
// ---------------------------------------------------------------------------

export function getAllProductsSync(): Product[] {
  return catalogCache?.products ?? [];
}

export function getAllCategoriesSync(): Category[] {
  return catalogCache?.categories ?? [];
}

export function getActiveBannersSync(placement?: string): Banner[] {
  const all = catalogCache?.banners ?? [];
  return placement ? all.filter((b) => b.placement === placement) : all;
}

export function getProductBySlugSync(slug: string): Product | undefined {
  return getAllProductsSync().find((p) => p.slug === slug);
}

export function getCategoryBySlugSync(slug: string): Category | undefined {
  return getAllCategoriesSync().find((c) => c.slug === slug);
}

export function searchSuggestionsSync(query: string, limit = 6): string[] {
  const all = getAllProductsSync();
  if (!query.trim()) return all.slice(0, limit).map((p) => p.name);
  const q = query.toLowerCase();
  return Array.from(new Set(
    all
      .filter((p) => p.name.toLowerCase().includes(q) || (p.categoryName ?? "").toLowerCase().includes(q))
      .map((p) => p.name),
  )).slice(0, limit);
}

// ---------------------------------------------------------------------------
// ASYNC API (preferred for server components)
// ---------------------------------------------------------------------------

export async function getAllProducts(): Promise<Product[]> {
  const c = await loadCatalog();
  return c.products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.slug === slug);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => p.categorySlug === categorySlug);
}

export async function getAllCategories(): Promise<Category[]> {
  return (await loadCatalog()).categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getAllCategories()).find((c) => c.slug === slug);
}

export async function getActiveBanners(placement?: string): Promise<Banner[]> {
  const all = (await loadCatalog()).banners;
  return placement ? all.filter((b) => b.placement === placement) : all;
}

export async function getNewArrivals(limit?: number): Promise<Product[]> {
  const list = (await getAllProducts()).filter((p) => p.badge === "NEW_ARRIVAL");
  const sorted = list.length > 0 ? list : (await getAllProducts()).slice(0, 10);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getBestSellers(limit?: number): Promise<Product[]> {
  const list = (await getAllProducts())
    .filter((p) => p.badge === "BEST_SELLER" || p.rating >= 4.8)
    .sort((a, b) => b.reviewCount - a.reviewCount);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getTrending(limit?: number): Promise<Product[]> {
  const list = (await getAllProducts())
    .filter((p) => p.badge === "TRENDING" || p.popularity >= 85)
    .sort((a, b) => b.popularity - a.popularity);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getOnSale(limit?: number): Promise<Product[]> {
  const list = (await getAllProducts()).filter((p) => p.badge === "SALE");
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  const sameCat = all.filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug);
  if (sameCat.length >= limit) return sameCat.slice(0, limit);
  const others = all
    .filter((p) => p.slug !== product.slug && !sameCat.includes(p))
    .sort((a, b) => b.popularity - a.popularity);
  return [...sameCat, ...others].slice(0, limit);
}

// ---------------------------------------------------------------------------
// Blog + FAQ + Testimonials (always async — fetched from DB on demand)
// ---------------------------------------------------------------------------

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });
    return posts.map((p) => ({
      id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt ?? undefined,
      content: p.content, coverImage: p.coverImage ?? undefined, category: p.category,
      tags: safeJsonParse(p.tags, []), author: p.author,
      seoTitle: p.seoTitle ?? undefined, seoDescription: p.seoDescription ?? undefined,
      featured: p.featured, publishedAt: p.publishedAt.toISOString(),
    }));
  } catch { return []; }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const p = await db.blogPost.findUnique({ where: { slug } });
    if (!p || p.status !== "published") return undefined;
    return {
      id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt ?? undefined,
      content: p.content, coverImage: p.coverImage ?? undefined, category: p.category,
      tags: safeJsonParse(p.tags, []), author: p.author,
      seoTitle: p.seoTitle ?? undefined, seoDescription: p.seoDescription ?? undefined,
      featured: p.featured, publishedAt: p.publishedAt.toISOString(),
    };
  } catch { return undefined; }
}

export async function getFaqs(): Promise<Faq[]> {
  try {
    const faqs = await db.faq.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return faqs.map((f) => ({
      id: f.id, question: f.question, answer: f.answer,
      category: f.category, sortOrder: f.sortOrder,
    }));
  } catch { return []; }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const ts = await db.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    return ts.map((t) => ({
      id: t.id, author: t.author, role: t.role ?? undefined, avatar: t.avatar ?? undefined,
      rating: t.rating, body: t.body,
    }));
  } catch { return []; }
}

// ---------------------------------------------------------------------------
// Filtering / sorting
// ---------------------------------------------------------------------------

export type SortKey = "newest" | "popular" | "price-asc" | "price-desc";

export interface ProductFilter {
  q?: string;
  category?: string;
  subcategory?: string;
  color?: string;
  size?: string;
  badge?: Badge | "ALL";
  onSale?: boolean;
  sort?: SortKey;
}

export function formatIDR(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(value);
}

export async function filterProducts(filter: ProductFilter): Promise<Product[]> {
  const list = await getAllProducts();
  let result = [...list];

  if (filter.q) {
    const q = filter.q.toLowerCase().trim();
    if (q) {
      result = result.filter((p) => {
        const haystack = [p.name, p.description, p.material, p.categoryName, p.subcategoryName, p.sku]
          .filter(Boolean).join(" ").toLowerCase();
        return haystack.includes(q);
      });
    }
  }
  if (filter.category && filter.category !== "ALL") {
    result = result.filter((p) => p.categorySlug === filter.category);
  }
  if (filter.subcategory && filter.subcategory !== "ALL") {
    result = result.filter((p) => p.subcategorySlug === filter.subcategory);
  }
  if (filter.color) {
    result = result.filter((p) => p.colors.some((c) => c.name.toLowerCase() === filter.color!.toLowerCase()));
  }
  if (filter.size) {
    result = result.filter((p) => p.sizes.includes(filter.size!));
  }
  if (filter.badge && filter.badge !== "ALL") {
    result = result.filter((p) => p.badge === filter.badge);
  }
  if (filter.onSale) {
    result = result.filter((p) => p.badge === "SALE");
  }

  switch (filter.sort) {
    case "newest":
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "popular":
      result.sort((a, b) => b.popularity - a.popularity);
      break;
    case "price-asc":
      result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case "price-desc":
      result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    default:
      result.sort((a, b) => b.popularity - a.popularity);
  }
  return result;
}

// ---------------------------------------------------------------------------
// SEO helpers
// ---------------------------------------------------------------------------

export function buildProductJsonLd(p: Product, settings?: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => i.startsWith("http") ? i : `${SITE_URL}${i}`),
    description: p.description,
    sku: p.sku ?? p.id,
    brand: { "@type": "Brand", name: settings?.brand.name ?? "REDBOX" },
    category: p.categoryName,
    material: p.material,
    offers: p.price ? {
      "@type": "Offer",
      url: `${SITE_URL}/product/${p.slug}`,
      price: p.price,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
    } : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating,
      reviewCount: p.reviewCount,
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
