// /contact — contact form (WhatsApp-powered) + map + info.
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactClient } from "@/components/contact/contact-client";
import { getSettings, WHATSAPP_NUMBER } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Kontak — REDBOX",
  description: "Hubungi REDBOX. Alamat di Bandung, WhatsApp, email, jam operasional, dan peta lokasi.",
  alternates: { canonical: "/contact" },
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-premium pt-24 md:pt-28 pb-16 md:pb-24">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Kontak" }]} />
      <div className="mt-6 mb-10 md:mb-14 max-w-2xl">
        <SectionHeading
          eyebrow="Hubungi Kami"
          title={<>Mari <span className="text-[#dc2626]">berbicara.</span></>}
          description="Respon paling cepat via WhatsApp. Atau kirim pesan melalui formulir di bawah — kami balas via email."
        />
      </div>

      <ContactClient settings={settings} whatsappNumber={WHATSAPP_NUMBER} />
    </div>
  );
}
