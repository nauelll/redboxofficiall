// REDBOX 404 page.
import Link from "next/link";
import { Home, Search, ArrowRight, MessageCircle } from "lucide-react";
import { getAllCategoriesSync, WHATSAPP_NUMBER } from "@/lib/catalog";

export default function NotFound() {
  const categories = getAllCategoriesSync();
  return (
    <div className="container-premium py-20 md:py-32 min-h-[60vh] flex items-center">
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-3">Error 404</p>
          <h1 className="font-display text-6xl md:text-8xl font-extrabold tracking-tight leading-none">
            Halaman <br /><span className="text-[#dc2626]">tidak ditemukan.</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-md">
            Maaf, halaman yang Anda cari tidak ada. Mungkin sudah dipindahkan atau tidak pernah ada.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors">
              <Home className="h-4 w-4" /> Ke Beranda
            </Link>
            <Link href="/shop" className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-border hover:bg-secondary font-semibold transition-colors">
              <Search className="h-4 w-4" /> Lihat Katalog
            </Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-6 rounded-full border border-border hover:bg-secondary font-semibold transition-colors">
              <MessageCircle className="h-4 w-4" /> Tanya WhatsApp
            </a>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">Tujuan populer</p>
          <ul className="divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {[
              { label: "Semua Produk", href: "/shop" },
              { label: "Kategori", href: "/category" },
              { label: "Lookbook", href: "/lookbook" },
              { label: "Tentang REDBOX", href: "/about" },
              { label: "Blog", href: "/blog" },
              { label: "FAQ", href: "/faq" },
              { label: "Kontak", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors">
                  <span className="font-medium">{l.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                </Link>
              </li>
            ))}
          </ul>
          {categories.length > 0 && (
            <>
              <p className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mt-6 mb-3">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c.id} href={`/category/${c.slug}`} className="inline-flex items-center h-9 px-4 rounded-full bg-secondary text-sm font-medium hover:bg-secondary/70 transition-colors">{c.name}</Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
