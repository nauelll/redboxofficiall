// /about — Brand story, vision, mission, values, materials, QC, production.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart, Award, Globe, Recycle, Users, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { Reveal } from "@/components/common/reveal";

export const metadata: Metadata = {
  title: "Tentang REDBOX",
  description: "REDBOX — brand fashion remaja asal Bandung, Indonesia. Cerita brand, visi, misi, nilai, material, quality control, dan produksi.",
  alternates: { canonical: "/about" },
};

export const dynamic = "force-dynamic";

const values = [
  { icon: Award, title: "Premium Quality", body: "Kami menggunakan bahan katun combed, lacoste, dan linen premium. Setiap produk melalui quality control sebelum dikirim." },
  { icon: Heart, title: "Comfortable", body: "Kenyamanan anak adalah prioritas. Bahan adem, potongan yang tepat, jahitan rapi — semua dipikirkan untuk aktivitas harian." },
  { icon: Sparkles, title: "Modern Design", body: "Desain mengikuti tren fashion remaja terkini. Tim desainer kami selalu riset tren global dan lokal." },
  { icon: Recycle, title: "Neat Stitching", body: "Jahitan rantai (chain stitch) untuk daya tahan maksimal. Setiap produk dijahit dengan presisi." },
];

const timeline = [
  { year: "2021", event: "REDBOX lahir di Bandung — dari keinginan menyediakan fashion remaja premium" },
  { year: "2023", event: "Launch koleksi pertama — kaos, polo, dan kemeja anak laki-laki" },
  { year: "2025", event: "Ekspansi ke 7 kategori produk + parfum · Dipercaya ribuan pelanggan" },
];

export default function AboutPage() {
  return (
    <div className="pb-16 md:pb-24">
      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[16/10] md:aspect-[16/5] overflow-hidden">
          <Image src="/assets/banners/hero-1.svg" alt="REDBOX Brand Story" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container-premium w-full pb-10 md:pb-16">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/70 mb-3">Bandung · Since 2021</p>
              <h1 className="font-display text-3xl md:text-6xl font-extrabold tracking-tight leading-[1.02] text-white max-w-3xl text-balance">
                Lahir di Bandung, <span className="text-[#dc2626]">tumbuh bersama</span> anak Indonesia.
              </h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container-premium pt-24 md:pt-28">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Tentang REDBOX" }]} />
      </div>

      {/* Story */}
      <section className="container-premium py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-4">Cerita REDBOX</p>
            <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight leading-tight">
              Brand fashion remaja untuk anak Indonesia.
            </h2>
          </Reveal>
          <Reveal direction="left" delay={0.1}>
            <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                REDBOX adalah brand fashion remaja asal Bandung yang lahir dari keinginan menyediakan pakaian berkualitas premium dengan desain modern untuk anak usia 9–17 tahun.
              </p>
              <p>
                Kami percaya anak muda Indonesia berhak tampil percaya diri tanpa mengorbankan kenyamanan. Setiap produk REDBOX dibuat dengan material terbaik, jahitan rapi, dan desain yang mengikuti tren fashion masa kini.
              </p>
              <p>
                Dari Bandung untuk Indonesia — REDBOX terus bertumbuh menjadi pilihan utama fashion remaja Indonesia.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-premium grid md:grid-cols-2 gap-6 md:gap-10">
          <Reveal>
            <div className="rounded-2xl bg-background border border-border p-7 md:p-9">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-foreground text-background mb-4">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">Visi</h3>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Menjadi brand fashion remaja Indonesia yang dikenal luas karena kualitas produk, desain modern, kenyamanan, serta pelayanan terbaik.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl bg-background border border-border p-7 md:p-9">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#dc2626] text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">Misi</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Menghasilkan produk berkualitas premium</li>
                <li>• Menggunakan material terbaik</li>
                <li>• Menghadirkan desain yang mengikuti tren</li>
                <li>• Memberikan harga terbaik</li>
                <li>• Memberikan pelayanan terbaik</li>
                <li>• Menjadi pilihan utama fashion remaja Indonesia</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="container-premium py-16 md:py-24">
        <SectionHeading
          eyebrow="Nilai Brand"
          title={<>Empat nilai yang kami <span className="text-[#dc2626]">jaga erat.</span></>}
          align="center"
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={Math.min(i * 0.08, 0.3)}>
              <div className="rounded-2xl bg-background border border-border p-6 h-full">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-foreground text-background mb-4">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Production & QC */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container-premium grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <Reveal direction="right">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary">
              <Image src="/assets/banners/hero-2.svg" alt="Produksi REDBOX" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-4">Material & Produksi</p>
              <h2 className="font-display text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                Material terbaik, produksi rapi, quality control ketat.
              </h2>
              <div className="mt-6 space-y-4 text-base text-muted-foreground leading-relaxed">
                <p><strong className="text-foreground">Material:</strong> Katun combed 24s-30s, lacoste, linen, dan fleece premium. Semua bahan dipilih untuk kenyamanan anak di cuaca tropis Indonesia.</p>
                <p><strong className="text-foreground">Produksi:</strong> Setiap produk dijahit di workshop kami di Bandung dengan mesin industri dan jahitan rantai untuk daya tahan maksimal.</p>
                <p><strong className="text-foreground">Quality Control:</strong> Setiap produk melalui inspeksi ketat sebelum dikirim — dari jahitan, sablon, hingga finishing.</p>
              </div>
              <Link href="/shop" className="group inline-flex items-center gap-2 mt-8 h-12 px-6 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors">
                Lihat produk kami
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-premium py-16 md:py-24">
        <SectionHeading
          eyebrow="Perjalanan"
          title={<>Dari Bandung untuk <span className="text-muted-foreground">Indonesia.</span></>}
        />
        <div className="mt-10 max-w-2xl">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={Math.min(i * 0.1, 0.2)}>
              <div className="flex gap-6 py-4 border-b border-border">
                <span className="font-display text-xl md:text-2xl font-bold tabular-nums w-16 shrink-0">{t.year}</span>
                <p className="text-sm md:text-base pt-1">{t.event}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
