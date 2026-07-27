// /category — list all categories
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { getAllCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Semua Kategori",
  description: "Lihat semua kategori produk REDBOX — Kaos Anak, Kaos Polo, Kemeja, Muslim Wear, Celana, Outerwear, dan Parfume.",
  alternates: { canonical: "/category" },
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Kategori" }]} />
      <div className="mt-6 mb-10 md:mb-14">
        <SectionHeading
          eyebrow="Kategori Produk"
          title={<>Semua <span className="text-[#dc2626]">kategori.</span></>}
          description="Pilih kategori untuk melihat produk-produk REDBOX."
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={Math.min(i * 0.06, 0.3)}>
            <Link href={`/category/${c.slug}`} className="group block relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
              {c.image && (
                <Image src={c.image} alt={c.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute inset-0 p-5 md:p-7 flex flex-col justify-end text-white">
                <p className="text-[10px] font-semibold tracking-[0.3em] uppercase opacity-70 mb-1">{c.tagline ?? "REDBOX"}</p>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">{c.name}</h3>
                <p className="mt-1 text-sm opacity-80 line-clamp-2">{c.description}</p>
                {c.subcategories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {c.subcategories.slice(0, 4).map((s) => (
                      <span key={s.id} className="inline-flex items-center h-6 px-2 rounded-full bg-white/15 backdrop-blur text-[10px] font-medium">{s.name}</span>
                    ))}
                    {c.subcategories.length > 4 && (
                      <span className="inline-flex items-center h-6 px-2 rounded-full bg-white/15 backdrop-blur text-[10px] font-medium">+{c.subcategories.length - 4}</span>
                    )}
                  </div>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                  Lihat koleksi <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
