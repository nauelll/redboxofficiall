// /admin — dashboard with stats + product list + nav to sub-sections.
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";
import { getAllCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Dashboard Admin — REDBOX",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: { category: true, subcategory: true },
      orderBy: { createdAt: "desc" },
    }),
    getAllCategories(),
  ]);

  const stats = {
    total: products.length,
    published: products.filter((p) => p.status === "published").length,
    draft: products.filter((p) => p.status === "draft").length,
    archived: products.filter((p) => p.status === "archived").length,
  };

  return (
    <AdminDashboardClient
      products={products.map((p) => ({
        id: p.id, slug: p.slug, name: p.name,
        price: p.price, sku: p.sku,
        categoryId: p.categoryId, categoryName: p.category?.name,
        subcategoryId: p.subcategoryId, subcategoryName: p.subcategory?.name,
        images: p.images ? safeParse(p.images, []) : [],
        stock: p.stock, badge: p.badge, status: p.status,
        shopeeUrl: p.shopeeUrl, tiktokUrl: p.tiktokUrl, lazadaUrl: p.lazadaUrl, whatsappUrl: p.whatsappUrl,
        description: p.description ?? "", material: p.material ?? "",
        detailInfo: p.detailInfo ?? "", careInfo: p.careInfo ?? "",
        weightGram: p.weightGram, sizes: safeParse(p.sizes, []), colors: safeParse(p.colors, []),
        video: p.video ?? undefined, popularity: p.popularity, rating: p.rating, reviewCount: p.reviewCount,
        createdAt: p.createdAt.toISOString(),
      }))}
      stats={stats}
      categories={categories.map((c) => ({
        id: c.id, slug: c.slug, name: c.name,
        subcategories: c.subcategories.map((s) => ({ id: s.id, slug: s.slug, name: s.name, categoryId: s.categoryId })),
      }))}
    />
  );
}

function safeParse<T>(s: string | null, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
