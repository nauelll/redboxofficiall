// Marketplace section — dark band with marketplace cards (Shopee, Tokopedia, WhatsApp).
import { ShoppingBag, Store, MessageCircle, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/common/reveal";
import { MARKETPLACE_LINKS } from "@/lib/catalog";

const marketplaces = [
  { label: "Shopee", sub: "Star+ Seller · redbox_officialstore", href: MARKETPLACE_LINKS.shopee, icon: ShoppingBag, bg: "bg-[#ee4d2d]" },
  { label: "Tokopedia", sub: "redbox-official", href: MARKETPLACE_LINKS.tokopedia, icon: Store, bg: "bg-[#42b549]" },
  { label: "WhatsApp", sub: "Chat langsung — respons cepat", href: MARKETPLACE_LINKS.whatsapp, icon: MessageCircle, bg: "bg-[#25D366]" },
];

export function MarketplaceSection() {
  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="marketplace-title">
      <div className="container-premium">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-3">Belanja Resmi</p>
            <h2 id="marketplace-title" className="font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Pilih marketplace <span className="text-[#dc2626]">favoritmu.</span>
            </h2>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Semua produk REDBOX tersedia di marketplace resmi. Star+ Seller, 100% Original, buyer protection.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {marketplaces.map((m, i) => (
            <Reveal key={m.label} delay={Math.min(i * 0.08, 0.3)}>
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group block rounded-2xl ${m.bg} text-white p-6 md:p-7 transition-all hover:scale-[1.02] hover:shadow-xl`}
              >
                <m.icon className="h-7 w-7 mb-3" />
                <p className="font-display text-xl md:text-2xl font-bold tracking-tight">{m.label}</p>
                <p className="mt-1 text-xs text-white/80">{m.sub}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase opacity-90 group-hover:opacity-100">
                  Belanja sekarang <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
