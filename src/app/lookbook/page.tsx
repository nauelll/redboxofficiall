// /lookbook — masonry gallery of lifestyle images.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";
import { getAllCategories, SOCIAL_LINKS } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "Galeri gaya REDBOX — lihat anak muda Indonesia memakai produk kami dalam aktivitas sehari-hari.",
  alternates: { canonical: "/lookbook" },
};

export const dynamic = "force-dynamic";

const lookbookTiles = [
  { src: null, title: "Everyday Style", sub: "Gaya harian untuk sekolah & jalan", span: "md:col-span-2 md:row-span-2" },
  { src: null, title: "Casual Day", sub: "Outfit santai akhir pekan", span: "" },
  { src: null, title: "Street Style", sub: "Gaya urban muda", span: "" },
  { src: null, title: "Family Event", sub: "Tampil rapi untuk acara keluarga", span: "" },
  { src: null, title: "Weekend Hangout", sub: "Bersama teman", span: "" },
  { src: null, title: "School Day", sub: "Berkunjung ke sekolah", span: "md:col-span-2" },
];

export default async function LookbookPage() {
  const categories = await getAllCategories();

  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Lookbook" }]} />
      <div className="mt-6 mb-10 md:mb-14">
        <SectionHeading
          eyebrow="Lookbook"
          title={<>Gaya anak muda <span className="text-muted-foreground">Indonesia.</span></>}
          description="Bukan foto studio — ini gaya nyata pelanggan REDBOX di sekolah, jalan, dan akhir pekan. Tag kami di Instagram untuk di-repost."
          link={{ label: `Follow ${SOCIAL_LINKS.instagramHandle}`, href: SOCIAL_LINKS.instagram }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[260px]">
        {lookbookTiles.map((t, i) => {
          const cat = categories[i % categories.length];
          const imgSrc = t.src ?? (cat?.image ?? "/assets/placeholder.svg");
          return (
            <Reveal key={i} delay={Math.min(i * 0.06, 0.3)} className={cn("group relative overflow-hidden rounded-2xl bg-secondary", t.span)}>
              <Link href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="block w-full h-full" aria-label={`Lookbook ${i + 1}: ${t.title}`}>
                <Image src={imgSrc} alt={`REDBOX Lookbook ${i + 1} — ${t.title}`} fill sizes={t.span.includes("col-span-2") ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase opacity-70">Lookbook 0{i + 1}</p>
                  <p className="font-display text-xl md:text-2xl font-bold tracking-tight mt-1">{t.title}</p>
                  <p className="text-sm opacity-80 mt-0.5">{t.sub}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase opacity-90 group-hover:opacity-100">
                    Lihat di Instagram <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
