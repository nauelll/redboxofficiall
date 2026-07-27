// /blog — list all blog posts.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { getBlogPosts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Tips fashion, mix & match, tren fashion remaja, perawatan baju, dan inspirasi outfit dari REDBOX.",
  alternates: { canonical: "/blog" },
};

export const dynamic = "force-dynamic";

const blogCategories = ["Semua", "Tips Fashion", "Mix & Match", "Fashion Trend", "Perawatan Baju", "Inspirasi Outfit"];

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      <div className="mt-6 mb-8 md:mb-12">
        <SectionHeading
          eyebrow="Blog REDBOX"
          title={<>Tips, tren & <span className="text-[#dc2626]">inspirasi.</span></>}
          description="Temukan tips fashion, ide mix & match, dan tren fashion remaja terbaru dari REDBOX."
        />
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
        {blogCategories.map((c, i) => (
          <button
            key={c}
            className={cn(
              "inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
              i === 0 ? "bg-foreground text-background" : "bg-secondary text-foreground hover:bg-secondary/70",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="font-semibold">Belum ada artikel</p>
          <p className="mt-1 text-sm text-muted-foreground">Artikel blog pertama akan segera hadir.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.08, 0.3)}>
              <Link href={`/blog/${p.slug}`} className="group block rounded-2xl overflow-hidden border border-border bg-background hover:shadow-premium transition-all">
                <div className="relative aspect-[16/10] bg-secondary overflow-hidden">
                  {p.coverImage && (
                    <Image src={p.coverImage} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <span className="absolute top-3 left-3 inline-flex items-center h-6 px-2.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-bold tracking-widest uppercase">
                    {p.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    <span>·</span>
                    <span>{p.author}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight leading-snug line-clamp-2 group-hover:text-[#dc2626] transition-colors">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">{p.excerpt}</p>}
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase group-hover:text-[#dc2626] transition-colors">
                    Baca selengkapnya <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
