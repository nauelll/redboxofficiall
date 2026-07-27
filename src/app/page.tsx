// REDBOX Home page — premium editorial design matching the reference.
// Dark hero + trust badges + kategori editorial + tentang + testimoni + FAQ + CTA + footer.
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles, Award, Heart, ShieldCheck, Recycle, Star, Quote, ArrowRight, Flame, Truck,
} from "lucide-react";
import {
  getAllProducts, getAllCategories, getTestimonials, getFaqs, MARKETPLACE_LINKS, SOCIAL_LINKS,
} from "@/lib/catalog";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/common/reveal";
import { JsonLd } from "@/components/common/json-ld";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { formatIDR } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "REDBOX — Fashion Anak & Remaja Premium",
  description: "Koleksi baju anak & remaja premium dari Bandung. Desain eksklusif, kualitas terbaik. Belanja via Shopee & Tokopedia.",
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

const catImages = [
  "/assets/categories/cat-1.png",
  "/assets/categories/cat-2.png",
  "/assets/categories/cat-3.png",
  "/assets/categories/cat-4.png",
  "/assets/categories/cat-5.png",
];

const catData = [
  { name: "Short Sleeve T-Shirt", tag: "Unisex · Anak & Remaja", desc: "Solusi tampil keren tanpa repot. Koleksi Basic Short Sleeve kami hadir untuk nemenin semua aktivitas harianmu. Simpel, rapi, dan gak pernah salah buat gaya apa aja.", rating: "4.9/5", sold: "Terjual 1.200+", tags: ["Nyaman Sehari-hari", "Bahan Berkualitas", "Desain Trendy", "Unisex"], best: true, img: 0 },
  { name: "Long Sleeve T-Shirt", tag: "Unisex · Anak & Remaja", desc: "Tampil Rapi Instan untuk Segala Usia. Pilihan terbaik untuk acara keluarga, jalan-jalan ke mall, atau momen formal pertama si remaja.", rating: "4.8/5", sold: "Terjual 850+", tags: ["Berbagai Desain", "Bahan Berkualitas", "Lembut & Nyaman", "Unisex"], best: false, img: 1 },
  { name: "Polo Shirt", tag: "Unisex · Anak & Remaja", desc: "Klasik & Rapi untuk Acara Semi Formal. Cocok untuk seragam, acara keluarga, atau saat ingin tampil lebih dewasa.", rating: "4.9/5", sold: "Terjual 950+", tags: ["Bahan Lacoste", "Tidak Kerah Kusut", "Premium", "Unisex"], best: true, img: 2 },
  { name: "Kemeja Anak", tag: "Unisex · Anak & Remaja", desc: "Smart Casual untuk Tampil Beda. Kemeja yang bikin anak terlihat rapi tanpa kehilangan kenyamanan bergerak.", rating: "4.8/5", sold: "Terjual 720+", tags: ["Bahan Adem", "Potongan Modern", "Formal & Casual", "Unisex"], best: false, img: 3 },
  { name: "Hoodie & Outerwear", tag: "Unisex · Anak & Remaja", desc: "Hangat & Stylish untuk Cuaca Apapun. Hoodie, sweater, dan jacket premium untuk tampil keren di setiap cuaca.", rating: "4.9/5", sold: "Terjual 1.100+", tags: ["Fleece Premium", "Tebal & Hangat", "Streetwear", "Unisex"], best: true, img: 4 },
];

export default async function Home() {
  const [products, categories, testimonials, faqs] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getTestimonials(),
    getFaqs(),
  ]);

  return (
    <>
      {/* ===== HERO — Dark premium ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1A1A1A] pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#1A1A1A]/95 to-[#7f1d1d]/80" />
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-20">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#dc2626] rounded-full blur-[120px]" />
        </div>

        <div className="relative container-premium py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <p className="inline-block text-[#f87171] text-xs sm:text-sm tracking-[0.3em] uppercase font-semibold mb-5 sm:mb-7 border border-[#f87171]/30 px-5 py-2 rounded-lg">
                Premium Kids Fashion
              </p>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.05] mb-6 sm:mb-8">
                Style <em className="text-[#dc2626] not-italic">Premium</em><br />
                untuk Generasi<br />
                Masa Depan
              </h1>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8 sm:mb-10">
                Koleksi baju anak & remaja pilihan dengan desain eksklusif dan kualitas terbaik. Karena setiap anak layak tampil istimewa.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <a href={MARKETPLACE_LINKS.shopee} target="_blank" rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex flex-col items-center sm:items-start gap-0.5 bg-[#dc2626] text-white px-8 py-4 rounded-xl hover:bg-[#b91c1c] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#dc2626]/30">
                  <span className="text-xs tracking-[0.15em] uppercase opacity-80">Belanja di</span>
                  <span className="font-display text-lg font-bold tracking-tight">Shopee Star+</span>
                </a>
                <a href={MARKETPLACE_LINKS.tokopedia} target="_blank" rel="noopener noreferrer"
                  className="group w-full sm:w-auto inline-flex flex-col items-center sm:items-start gap-0.5 bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 hover:-translate-y-1">
                  <span className="text-xs tracking-[0.15em] uppercase opacity-80">Belanja di</span>
                  <span className="font-display text-lg font-bold tracking-tight">Tokopedia</span>
                </a>
              </div>
              {/* Social */}
              <div className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
                <span className="text-xs tracking-widest uppercase text-white/40">Ikuti Kami</span>
                <SocialIcons />
              </div>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="/assets/banners/hero-showcase.png" alt="REDBOX — Premium Kids Fashion" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/40 via-transparent to-transparent" />
                {/* Stats */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/10">
                    <p className="font-display text-2xl font-bold text-white">27.5K+</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">Followers</p>
                  </div>
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/10">
                    <p className="font-display text-2xl font-bold text-white">100%</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">Original</p>
                  </div>
                  <div className="text-center backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/10">
                    <p className="font-display text-2xl font-bold text-white">Star+</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">Seller</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="bg-white py-14 sm:py-20 border-b border-[#1A1A1A]/5">
        <div className="container-premium">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Award, title: "Premium Material", desc: "Katun combed, lacoste, linen pilihan terbaik." },
              { icon: Heart, title: "Comfortable", desc: "Adem, lembut, nyaman dipakai seharian." },
              { icon: ShieldCheck, title: "Quality Control", desc: "Setiap produk melalui quality check ketat." },
              { icon: Truck, title: "Pengiriman Cepat", desc: "Diproses same-day, sampai 2-5 hari kerja." },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center md:flex-row md:text-left gap-3 md:gap-4 p-4 rounded-2xl hover:bg-[#FAF7F2] transition-colors">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#1A1A1A] text-[#dc2626] shrink-0">
                  <v.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold tracking-tight">{v.title}</h3>
                  <p className="text-xs text-[#8A8A8A] mt-0.5 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KATEGORI PRODUK — Editorial alternating ===== */}
      <section id="koleksi" className="py-20 sm:py-28 bg-white">
        <div className="container-premium">
          <div className="text-center mb-16 sm:mb-20">
            <p className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Kategori</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-5">Kategori Produk</h2>
            <p className="text-[#8A8A8A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Jelajahi setiap kategori koleksi premium REDBOX. Unisex — cocok untuk semua anak dan remaja Indonesia.
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-[#dc2626] to-[#f87171] mx-auto mt-8 rounded-full" />
          </div>

          <div className="space-y-20 sm:space-y-28">
            {catData.map((cat, idx) => (
              <div key={idx} className="group">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  {/* Image */}
                  <div className={`relative overflow-hidden rounded-2xl border border-[#1A1A1A]/5 shadow-lg group-hover:shadow-2xl transition-shadow duration-500 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="relative aspect-[4/5] sm:aspect-[4/3] bg-[#FAF7F2]">
                      <Image src={catImages[cat.img]} alt={`${cat.name} — REDBOX`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className={`absolute top-5 ${cat.best ? "left-5 bg-[#dc2626]/90" : "left-5 bg-[#1A1A1A]/90"} backdrop-blur text-white text-[9px] tracking-[0.2em] uppercase px-4 py-2 rounded-lg font-semibold`}>Kategori</div>
                    {cat.best && (
                      <div className="absolute top-5 right-5 bg-[#1A1A1A] text-white text-[9px] tracking-[0.15em] uppercase px-3.5 py-2 rounded-lg font-bold shadow-lg flex items-center gap-1.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Best Seller
                      </div>
                    )}
                  </div>
                  {/* Text */}
                  <div className={`${idx % 2 === 1 ? "lg:order-1 lg:pr-6" : "lg:pl-6"}`}>
                    <p className={`text-xs tracking-[0.3em] uppercase font-semibold mb-4 ${cat.best ? "text-[#dc2626]" : "text-[#1A1A1A]/60"}`}>{cat.tag}</p>
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-3 leading-tight">{cat.name}</h3>
                    <div className="flex items-center gap-3 mb-5">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1A1A]">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> {cat.rating}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-[#8A8A8A]/40" />
                      <span className="text-xs text-[#8A8A8A] font-medium">{cat.sold}</span>
                    </div>
                    <p className="text-[#8A8A8A] text-base sm:text-lg leading-relaxed mb-8">{cat.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {cat.tags.map((t) => (
                        <span key={t} className="inline-flex items-center text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B] bg-white px-3.5 py-1.5 rounded-full border border-[#1A1A1A]/8 font-semibold transition-all hover:bg-[#1A1A1A] hover:text-white cursor-default">{t}</span>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={MARKETPLACE_LINKS.shopee} target="_blank" rel="noopener noreferrer"
                        className="group/btn inline-flex items-center justify-center gap-2 bg-[#dc2626] text-white px-7 py-3.5 text-xs font-bold tracking-[0.15em] uppercase rounded-xl hover:bg-[#b91c1c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#dc2626]/20">
                        Beli di Shopee
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </a>
                      <a href={MARKETPLACE_LINKS.tokopedia} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 border-2 border-[#1A1A1A] text-[#1A1A1A] px-7 py-3.5 text-xs font-bold tracking-[0.15em] uppercase rounded-xl hover:bg-[#1A1A1A] hover:text-white transition-all duration-300">
                        Beli di Tokopedia
                      </a>
                    </div>
                  </div>
                </div>
                {idx < catData.length - 1 && (
                  <div className="flex items-center gap-4 mt-20">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1A1A1A]/12 to-transparent" />
                    <div className="w-2.5 h-2.5 bg-[#dc2626] rounded-full" style={{ boxShadow: "0 0 0 4px rgba(220, 38, 38, 0.12)" }} />
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#1A1A1A]/12 to-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DAFTAR PRODUK ===== */}
      {products.length > 0 && (
        <section className="py-16 md:py-24 bg-[#FAF7F2]">
          <div className="container-premium">
            <div className="text-center mb-12">
              <p className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Koleksi</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-5">Daftar Produk</h2>
              <p className="text-[#8A8A8A] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                Pilih produk favoritmu — belanja langsung via Shopee, Tokopedia, atau WhatsApp.
              </p>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#dc2626] to-[#f87171] mx-auto mt-8 rounded-full" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {products.slice(0, 8).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} priority={i < 4} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/shop" className="group inline-flex items-center gap-2 h-12 px-8 rounded-full bg-[#1A1A1A] text-white font-semibold hover:bg-[#dc2626] transition-colors text-sm">
                Lihat Semua Produk
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== TENTANG REDBOX ===== */}
      <section className="py-20 sm:py-28 bg-[#1A1A1A] text-white">
        <div className="container-premium">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <Reveal>
              <div>
                <p className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-semibold mb-4 inline-flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" /> Tentang REDBOX
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] text-balance">
                  Brand fashion remaja <span className="text-[#dc2626]">asal Bandung</span> sejak 2021.
                </h2>
                <div className="mt-6 space-y-4 text-base text-white/60 leading-relaxed max-w-xl">
                  <p>
                    REDBOX adalah brand fashion anak dan remaja premium yang berkomitmen menghadirkan pakaian berkualitas tinggi dengan desain yang trendy dan nyaman dikenakan. Setiap produk kami melalui proses seleksi ketat untuk memastikan kualitas jahitan, bahan, dan detail yang sempurna.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="border-l-2 border-[#dc2626] pl-3">
                    <p className="font-display text-3xl font-bold">2021</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Sejak</p>
                  </div>
                  <div className="border-l-2 border-[#dc2626] pl-3">
                    <p className="font-display text-3xl font-bold">27.5K+</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Followers</p>
                  </div>
                  <div className="border-l-2 border-[#dc2626] pl-3">
                    <p className="font-display text-3xl font-bold">100%</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Original</p>
                  </div>
                </div>
                <Link href="/about" className="group inline-flex items-center gap-2 mt-8 h-12 px-6 rounded-full bg-white text-[#1A1A1A] font-semibold hover:bg-[#dc2626] hover:text-white transition-colors">
                  Selengkapnya
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
            <Reveal direction="left" delay={0.1}>
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/assets/banners/about.png" alt="REDBOX Brand Story" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONI ===== */}
      {testimonials.length > 0 && (
        <section className="py-20 sm:py-28 bg-white">
          <div className="container-premium">
            <div className="text-center mb-12">
              <p className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-semibold mb-3">Testimoni</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-5">Kata Pelanggan</h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#dc2626] to-[#f87171] mx-auto mt-8 rounded-full" />
            </div>
            <div className="grid md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={Math.min(i * 0.1, 0.3)}>
                  <div className="bg-white border border-[#1A1A1A]/6 rounded-2xl p-7 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl">
                    <Quote className="h-8 w-8 text-[#dc2626] opacity-30 mb-3" />
                    <div className="flex mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className={s < t.rating ? "h-4 w-4 fill-[#dc2626] text-[#dc2626]" : "h-4 w-4 text-gray-300"} />
                      ))}
                    </div>
                    <p className="text-sm md:text-base text-[#8A8A8A] leading-relaxed">{t.body}</p>
                    <div className="mt-5 pt-4 border-t border-[#1A1A1A]/6">
                      <p className="font-semibold text-sm text-[#1A1A1A]">{t.author}</p>
                      {t.role && <p className="text-xs text-[#8A8A8A] mt-0.5">{t.role}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {faqs.length > 0 && (
        <section className="py-20 sm:py-28 bg-[#FAF7F2]">
          <div className="container-premium max-w-3xl">
            <div className="text-center mb-12">
              <p className="text-[#dc2626] text-xs tracking-[0.3em] uppercase font-semibold mb-3">FAQ</p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-5">Pertanyaan Umum</h2>
              <div className="w-16 h-0.5 bg-gradient-to-r from-[#dc2626] to-[#f87171] mx-auto mt-8 rounded-full" />
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.slice(0, 6).map((f, i) => (
                <AccordionItem key={f.id} value={`item-${i}`} className="bg-white border border-[#1A1A1A]/6 rounded-2xl px-5 py-2 shadow-sm">
                  <AccordionTrigger className="text-left text-sm md:text-base font-semibold py-3 hover:no-underline text-[#1A1A1A]">{f.question}</AccordionTrigger>
                  <AccordionContent className="text-sm md:text-base text-[#8A8A8A] leading-relaxed pb-4">{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-20 sm:py-28 bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7f1d1d]/60 via-[#1A1A1A] to-[#1A1A1A]" />
        <div className="relative container-premium max-w-4xl mx-auto text-center px-4">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4">
            Siap tampil <span className="text-[#dc2626]">istimewa?</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Belanja sekarang di marketplace resmi REDBOX. Star+ Seller, 100% Original, kualitas premium.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={MARKETPLACE_LINKS.shopee} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#dc2626] text-white px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-[#b91c1c] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#dc2626]/30">
              Belanja di Shopee
            </a>
            <a href={MARKETPLACE_LINKS.tokopedia} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 hover:-translate-y-1">
              Belanja di Tokopedia
            </a>
            <a href={MARKETPLACE_LINKS.whatsapp} target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold tracking-wide hover:bg-[#20B954] transition-all duration-300 hover:-translate-y-1">
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function SocialIcons() {
  const icons = [
    { href: SOCIAL_LINKS.instagram, label: "Instagram", bg: "hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400",
      svg: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>' },
    { href: SOCIAL_LINKS.facebook, label: "Facebook", bg: "hover:bg-blue-600",
      svg: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
    { href: SOCIAL_LINKS.tiktok, label: "TikTok", bg: "hover:bg-white hover:text-[#1A1A1A]",
      svg: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48v-7.15a8.16 8.16 0 005.58 2.17v-3.45c-1.13 0-2.84-.59-3.77-1.46V6.69h3.77z"/></svg>' },
    { href: MARKETPLACE_LINKS.whatsapp, label: "WhatsApp", bg: "hover:bg-[#25D366]",
      svg: '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' },
  ];
  return (
    <>
      {icons.map((ic) => (
        <a key={ic.label} href={ic.href} target="_blank" rel="noopener noreferrer" aria-label={ic.label}
          className={`w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all duration-300 ${ic.bg}`}
          dangerouslySetInnerHTML={{ __html: ic.svg }}
        />
      ))}
    </>
  );
}
