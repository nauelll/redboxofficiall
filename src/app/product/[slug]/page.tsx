// REDBOX product detail page — gallery, info, buy buttons, related.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Star, Truck, ShieldCheck, RefreshCw, Check, Weight, Ruler, Tag } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { BuyButtons } from "@/components/product/buy-buttons";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductGallery } from "@/components/product/product-gallery";
import { SectionHeading } from "@/components/common/section-heading";
import { JsonLd } from "@/components/common/json-ld";
import {
  getProductBySlug, getRelatedProducts, getCategoryBySlug, buildProductJsonLd, buildBreadcrumbJsonLd, formatIDR,
} from "@/lib/catalog";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Produk tidak ditemukan", robots: { index: false, follow: false } };
  }
  const title = product.seoTitle ?? `${product.name} — REDBOX`;
  const description = product.seoDescription ?? product.description.slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/product/${product.slug}`,
      images: product.images.map((src) => ({ url: src, width: 1200, height: 1500, alt: product.altImage ?? product.name })),
    },
    twitter: { card: "summary_large_image", title, description, images: [product.images[0]] },
    keywords: [product.name, "REDBOX", product.categoryName ?? "", product.material ?? ""].filter(Boolean),
  };
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [cat, related] = await Promise.all([
    product.categorySlug ? getCategoryBySlug(product.categorySlug) : Promise.resolve(undefined),
    getRelatedProducts(product, 4),
  ]);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    ...(cat ? [{ name: cat.name, url: `/category/${cat.slug}` }] : []),
    { name: product.name, url: `/product/${product.slug}` },
  ];

  return (
    <>
      <div className="container-premium pt-24 md:pt-28">
        <Breadcrumb items={breadcrumbItems.map((b, i, arr) => ({ label: b.name, href: i === arr.length - 1 ? undefined : b.url }))} />
      </div>

      <div className="container-premium py-6 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={product.images} alt={product.name} />

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.badge && (
                  <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#dc2626] text-white">
                    {badgeLabel(product.badge)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                  <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
                  <span aria-hidden>·</span>
                  <span>{product.reviewCount} ulasan</span>
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-bold tracking-tight leading-tight">{product.name}</h1>
              {product.sku && <p className="mt-2 text-xs text-muted-foreground">SKU: {product.sku}</p>}
              {product.price && (
                <p className="mt-4 font-display text-2xl md:text-3xl font-bold tabular-nums">{formatIDR(product.price)}</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {product.categoryName}{product.subcategoryName ? ` · ${product.subcategoryName}` : ""}
              </p>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
              {product.weightGram && (
                <div className="text-center">
                  <Weight className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-xs font-semibold">Berat</p>
                  <p className="text-[10px] text-muted-foreground">{product.weightGram}g</p>
                </div>
              )}
              {product.sizes.length > 0 && (
                <div className="text-center">
                  <Ruler className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-xs font-semibold">Ukuran</p>
                  <p className="text-[10px] text-muted-foreground">{product.sizes.join(", ")}</p>
                </div>
              )}
              {product.colors.length > 0 && (
                <div className="text-center">
                  <Tag className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  <p className="text-xs font-semibold">Warna</p>
                  <p className="text-[10px] text-muted-foreground">{product.colors.length} pilihan</p>
                </div>
              )}
            </div>

            {/* Colors preview */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Pilihan Warna</p>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c) => (
                    <div key={c.name} className="flex flex-col items-center gap-1">
                      <div className="h-9 w-9 rounded-full border-2 border-border" style={{ backgroundColor: c.hex }} title={c.name} />
                      <span className="text-[10px] text-muted-foreground">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buy buttons */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Beli di Marketplace Resmi</p>
              <BuyButtons product={product} variant="detail" />
              <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                Anda akan diarahkan ke marketplace pilihan untuk menyelesaikan pembelian dengan aman.
              </p>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-border">
              {[
                { icon: Truck, title: "Pengiriman Cepat", sub: "2–5 hari" },
                { icon: ShieldCheck, title: "Buyer Protection", sub: "Via marketplace" },
                { icon: RefreshCw, title: "Tukar 7 Hari", sub: "Belum dipakai" },
              ].map((t) => (
                <div key={t.title} className="text-center">
                  <t.icon className="h-5 w-5 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold">{t.title}</p>
                  <p className="text-[10px] text-muted-foreground">{t.sub}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="font-display text-lg font-bold mb-2">Deskripsi</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>

            {/* Detail info */}
            {product.detailInfo && (
              <div>
                <h2 className="font-display text-lg font-bold mb-2">Detail Produk</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.detailInfo}</p>
              </div>
            )}

            {/* Material */}
            {product.material && (
              <div>
                <h2 className="font-display text-lg font-bold mb-2">Material</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.material}</p>
              </div>
            )}

            {/* Care info */}
            {product.careInfo && (
              <div>
                <h2 className="font-display text-lg font-bold mb-2">Cara Perawatan</h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{product.careInfo}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-border py-12 md:py-20">
          <div className="container-premium">
            <SectionHeading
              eyebrow="Mungkin Anda Suka"
              title={<>Produk <span className="text-muted-foreground">terkait.</span></>}
              link={{ label: "Lihat semua", href: "/shop" }}
            />
            <div className="mt-10">
              <ProductGrid products={related} columns={4} priorityCount={0} />
            </div>
          </div>
        </section>
      )}

      <JsonLd data={buildProductJsonLd(product)} />
      <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems)} />
    </>
  );
}

function badgeLabel(badge: string): string {
  const labels: Record<string, string> = {
    NEW_ARRIVAL: "Baru", BEST_SELLER: "Terlaris", TRENDING: "Trending",
    LIMITED_EDITION: "Limited", SALE: "Sale",
  };
  return labels[badge] ?? badge;
}
