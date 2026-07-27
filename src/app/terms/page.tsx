// Terms & Conditions page.
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan website REDBOX Official.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24 max-w-3xl">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Syarat & Ketentuan" }]} />
      <article className="mt-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">Syarat & Ketentuan</h1>
        <p className="text-sm text-muted-foreground mb-6">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long" })}</p>
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>Dengan menggunakan website REDBOX, Anda menyetujui syarat dan ketentuan berikut.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Katalog Produk</h2>
          <p>Website ini berfungsi sebagai katalog. Semua transaksi pembelian dilakukan melalui marketplace resmi (Shopee, TikTok Shop, Lazada) atau WhatsApp. REDBOX tidak memproses pembayaran langsung.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Pemesanan</h2>
          <p>Pemesanan dilakukan via marketplace resmi. Kebijakan retur, pengiriman, dan pembayaran mengikuti kebijakan masing-masing marketplace.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Hak Cipta</h2>
          <p>Seluruh konten di website ini (logo, desain, foto, teks) adalah milik REDBOX dan dilindungi hak cipta.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Kontak</h2>
          <p>Untuk pertanyaan tentang syarat & ketentuan, hubungi kami via WhatsApp atau email.</p>
        </div>
      </article>
    </div>
  );
}
