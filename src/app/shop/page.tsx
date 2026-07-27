// REDBOX Shop page — server component with filters from URL params.
import type { Metadata } from "next";
import { ProductGrid } from "@/components/product/product-grid";
import { ShopToolbar } from "@/components/product/shop-toolbar";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { JsonLd } from "@/components/common/json-ld";
import { filterProducts, getAllCategories, getCategoryBySlug, type SortKey, type ProductFilter } from "@/lib/catalog";
import { SearchX } from "lucide-react";

export const metadata: Metadata = {
  title: "Semua Produk",
  description: "Lihat semua produk REDBOX — kaos, polo, kemeja, muslim wear, celana, outerwear, dan parfum. Premium quality, desain modern.",
  alternates: { canonical: "/shop" },
};

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const filter: ProductFilter = {
    q: get("q"),
    category: get("cat") ?? "ALL",
    subcategory: get("sub") ?? "ALL",
    color: get("color"),
    size: get("size"),
    badge: (get("badge") as ProductFilter["badge"]) ?? "ALL",
    onSale: get("sale") === "1",
    sort: (get("sort") as SortKey) ?? "popular",
  };

  const [products, categories] = await Promise.all([
    filterProducts(filter),
    getAllCategories(),
  ]);

  const activeCat = filter.category && filter.category !== "ALL" ? await getCategoryBySlug(filter.category) : null;
  const heading = activeCat ? activeCat.name
    : filter.q ? `Hasil pencarian: "${filter.q}"`
    : filter.onSale ? "Sedang Diskon"
    : "Semua Produk";

  return (
    <>
      <div className="container-premium pt-24 md:pt-28">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(activeCat ? [{ label: activeCat.name }] : []),
        ]} />
        <div className="mt-6 mb-8 md:mb-10">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-3">Katalog Produk</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">{heading}</h1>
          {activeCat && <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl">{activeCat.description}</p>}
        </div>
      </div>

      <ShopToolbar resultCount={products.length} categories={categories} />

      <div className="container-premium py-8 md:py-12">
        {products.length === 0 ? (
          <EmptyState
            icon={<SearchX className="h-7 w-7" />}
            title="Tidak ada produk yang cocok"
            description="Coba ubah filter atau kata kunci pencarian Anda."
            actionLabel="Reset filter"
            actionHref="/shop"
          />
        ) : (
          <ProductGrid products={products} priorityCount={4} />
        )}
      </div>

      <JsonLd data={{
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://redbox-official.com/" },
          { "@type": "ListItem", position: 2, name: "Shop", item: "https://redbox-official.com/shop" },
        ],
      }} />
    </>
  );
}
