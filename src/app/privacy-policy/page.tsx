// Privacy Policy page.
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi REDBOX Official.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24 max-w-3xl">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Kebijakan Privasi" }]} />
      <article className="mt-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">Kebijakan Privasi</h1>
        <p className="text-sm text-muted-foreground mb-6">Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long" })}</p>
        <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
          <p>REDBOX menghargai privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Informasi yang Kami Kumpulkan</h2>
          <p>Kami mengumpulkan informasi yang Anda berikan saat menghubungi kami via WhatsApp atau email, serta data analitik anonim untuk meningkatkan layanan.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Penggunaan Informasi</h2>
          <p>Informasi Anda digunakan untuk merespons pertanyaan, memproses pesanan (via marketplace), dan meningkatkan pengalaman pengguna.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Keamanan</h2>
          <p>Kami menerapkan langkah-langkah keamanan untuk melindungi data Anda. Pembayaran dilakukan di marketplace resmi dengan enkripsi mereka sendiri.</p>
          <h2 className="font-display text-xl font-bold text-foreground pt-4">Kontak</h2>
          <p>Untuk pertanyaan tentang privasi, hubungi kami via WhatsApp atau email yang tertera di halaman Kontak.</p>
        </div>
      </article>
    </div>
  );
}
