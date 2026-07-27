// /category/[slug] — show products in a specific category
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/shared/empty-state";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: "Kategori tidak ditemukan" };
  return {
    title: cat.seoTitle ?? `${cat.name} — REDBOX`,
    description: cat.seoDescription ?? cat.description ?? `Produk ${cat.name} dari REDBOX.`,
    alternates: { canonical: `/category/${cat.slug}` },
  };
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const products = await getProductsByCategory(slug);

  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24">
      <Breadcrumb items={[
        { label: "Home", href: "/" },
        { label: "Kategori", href: "/category" },
        { label: cat.name },
      ]} />
      <div className="mt-6 mb-8 md:mb-10">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-3">{cat.tagline ?? "REDBOX"}</p>
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">{cat.name}</h1>
        {cat.description && <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl">{cat.description}</p>}
        {cat.subcategories.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {cat.subcategories.map((s) => (
              <a key={s.id} href={`/shop?cat=${cat.slug}&sub=${s.slug}`} className="inline-flex items-center h-9 px-4 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/70 transition-colors">
                {s.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <EmptyState title="Belum ada produk" description={`Belum ada produk di kategori "${cat.name}". Cek kategori lain atau hubungi kami via WhatsApp.`} actionLabel="Lihat semua produk" actionHref="/shop" />
      ) : (
        <ProductGrid products={products} priorityCount={4} />
      )}
    </div>
  );
}
