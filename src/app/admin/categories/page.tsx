// /admin/categories
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CategoriesClient } from "@/components/admin/categories-client";

export const metadata: Metadata = { title: "Kategori — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { subcategories: { orderBy: { sortOrder: "asc" } }, _count: { select: { products: true } } },
  });
  return (
    <CategoriesClient initialCategories={categories.map((c) => ({
      id: c.id, slug: c.slug, name: c.name, tagline: c.tagline ?? "", description: c.description ?? "",
      image: c.image ?? "", isActive: c.isActive, sortOrder: c.sortOrder,
      productCount: c._count.products,
      subcategories: c.subcategories.map((s) => ({ id: s.id, slug: s.slug, name: s.name })),
    }))} />
  );
}
