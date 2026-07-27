"use client";
// REDBOX footer — charcoal dark, premium marketplace + social.
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, ArrowUpRight, Mail, MapPin, Clock, ShoppingBag, Store, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { getAllCategoriesSync, MARKETPLACE_LINKS, SOCIAL_LINKS, DEFAULT_SETTINGS } from "@/lib/catalog";

const customerServiceLinks = [
  { label: "Tentang REDBOX", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/contact" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Kebijakan Privasi", href: "/privacy-policy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
];

const marketplaces = [
  { label: "Shopee", href: MARKETPLACE_LINKS.shopee, store: "redbox_officialstore", icon: ShoppingBag, bg: "hover:bg-[#ee4d2d]" },
  { label: "Tokopedia", href: MARKETPLACE_LINKS.tokopedia, store: "redbox-official", icon: Store, bg: "hover:bg-[#42b549]" },
  { label: "WhatsApp", href: MARKETPLACE_LINKS.whatsapp, store: "+62 813-2489-8585", icon: MessageCircle, bg: "hover:bg-[#25D366]" },
];

export function SiteFooter() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const categories = getAllCategoriesSync().slice(0, 7);

  function onSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) { toast.error("Mohon masukkan email yang valid."); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false); setEmail("");
      toast.success("Terima kasih sudah berlangganan newsletter REDBOX!");
    }, 700);
  }

  return (
    <footer className="mt-auto bg-[#1A1A1A] text-white">
      {/* Newsletter band */}
      <div className="container-premium py-14 md:py-20 border-b border-white/10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-3">Newsletter REDBOX</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              Dapatkan info <span className="text-[#dc2626]">drop terbaru</span> & promo.
            </h2>
          </div>
          <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@kamu.com" aria-label="Email"
              className="flex-1 h-14 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:border-white/60 transition-colors" />
            <button type="submit" disabled={submitting}
              className="h-14 px-7 rounded-full bg-white text-[#1A1A1A] font-semibold hover:bg-[#dc2626] hover:text-white transition-colors disabled:opacity-50">
              {submitting ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-premium py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden">
                <Image src="/assets/brand/logo-footer.png" alt="REDBOX Official" fill sizes="48px" className="object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-extrabold tracking-tight">REDBOX</span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase opacity-70 mt-1">Bandung · Since 2021</span>
              </div>
            </Link>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              Brand fashion remaja asal Bandung. Pakaian premium dengan desain modern dan nyaman untuk anak usia 9–17 tahun.
            </p>
            <div className="mt-5 space-y-2 text-sm opacity-70">
              <a href={`mailto:${DEFAULT_SETTINGS.brand.email}`} className="flex items-center gap-2 hover:opacity-100"><Mail className="h-4 w-4" />{DEFAULT_SETTINGS.brand.email}</a>
              <a href={MARKETPLACE_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-100"><MessageCircle className="h-4 w-4" />+62 813-2489-8585</a>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{DEFAULT_SETTINGS.brand.location}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" />{DEFAULT_SETTINGS.brand.operatingHours}</div>
            </div>
            {/* Social — prominent */}
            <div className="mt-5 flex items-center gap-2">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 text-xs font-bold">TT</a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
              <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-[#25D366] transition-all duration-300">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase opacity-50 mb-4">Kategori</p>
            <ul className="space-y-2.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="text-sm opacity-70 hover:opacity-100 hover:text-[#dc2626] transition-colors">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase opacity-50 mb-4">Layanan</p>
            <ul className="space-y-2.5">
              {customerServiceLinks.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm opacity-70 hover:opacity-100 hover:text-[#dc2626] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplaces */}
          <div className="col-span-2 lg:col-span-3">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase opacity-50 mb-4">Marketplace Resmi</p>
            <div className="space-y-2">
              {marketplaces.map((m) => (
                <a key={m.label} href={m.href} target="_blank" rel="noopener noreferrer"
                  className={`group flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all ${m.bg}`}>
                  <m.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-[10px] opacity-60 truncate">{m.store}</p>
                  </div>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-premium py-6 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs opacity-50">
          <p>© {new Date().getFullYear()} REDBOX Official Store. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Made with <span className="text-[#dc2626]">❤</span> in Bandung, Indonesia</p>
        </div>
      </div>
    </footer>
  );
}
