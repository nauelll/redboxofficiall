// /faq — FAQ page with accordion grouped by category.
import type { Metadata } from "next";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { JsonLd } from "@/components/common/json-ld";
import { getFaqs, WHATSAPP_NUMBER } from "@/lib/catalog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "FAQ — Pertanyaan yang Sering Diajukan",
  description: "Pertanyaan umum seputar produk REDBOX, pemesanan, pengiriman, dan pembayaran. Tidak menemukan jawaban? Chat WhatsApp kami.",
  alternates: { canonical: "/faq" },
};

export const dynamic = "force-dynamic";

const categoryOrder = ["Umum", "Produk", "Pesanan", "Pengiriman", "Pembayaran"];

export default async function FaqPage() {
  const faqs = await getFaqs();
  const grouped = categoryOrder.map((cat) => ({
    cat, items: faqs.filter((f) => f.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <div className="mt-6 mb-10 md:mb-14 max-w-2xl">
        <SectionHeading
          eyebrow="Pusat Bantuan"
          title={<>Pertanyaan yang <span className="text-muted-foreground">sering diajukan.</span></>}
          description="Jawaban cepat untuk pertanyaan umum. Tidak menemukan yang Anda cari? Chat WhatsApp kami — kami merespons cepat."
        />
      </div>

      <div className="grid lg:grid-cols-[200px_1fr] gap-8 lg:gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24">
            <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-3">Kategori</p>
            <ul className="space-y-1">
              {grouped.map((g) => (
                <li key={g.cat}>
                  <a href={`#${g.cat.toLowerCase()}`} className="block px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors">{g.cat}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Accordion groups */}
        <div className="space-y-10">
          {grouped.map((g) => (
            <section key={g.cat} id={g.cat.toLowerCase()} className="scroll-mt-24">
              <h2 className="font-display text-lg md:text-xl font-bold mb-4 flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-[#dc2626]" />{g.cat}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {g.items.map((f, i) => (
                  <AccordionItem key={f.id} value={`${g.cat}-${i}`} className="rounded-xl border border-border px-4">
                    <AccordionTrigger className="text-left text-sm md:text-base font-semibold py-4 hover:no-underline">{f.question}</AccordionTrigger>
                    <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed pb-4">{f.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>

      {/* Help CTA */}
      <div className="mt-16 md:mt-24 rounded-3xl bg-foreground text-background p-8 md:p-12 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-background/10 mb-4">
          <MessageCircle className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Masih butuh bantuan?</h2>
        <p className="mt-2 opacity-70 max-w-md mx-auto">Tim kami siap membantu. Chat langsung via WhatsApp untuk respon cepat.</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 mt-6 h-12 px-6 rounded-full bg-background text-foreground font-semibold hover:scale-[1.02] transition-transform"
        >
          Chat di WhatsApp
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* FAQ JSON-LD */}
      <JsonLd data={{
        "@context": "https://schema.org", "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question", name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }} />
    </div>
  );
}
