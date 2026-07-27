"use client";
// Contact client — info cards + form that opens WhatsApp with prefilled message.
import * as React from "react";
import { MessageCircle, Mail, MapPin, Phone, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettings } from "@/types";

interface ContactClientProps {
  settings: SiteSettings;
  whatsappNumber: string;
}

export function ContactClient({ settings, whatsappNumber }: ContactClientProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [topic, setTopic] = React.useState("Pertanyaan umum");
  const [message, setMessage] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Mohon isi nama, email, dan pesan.");
      return;
    }
    const text = `Hi REDBOX, nama saya ${name}.%0A${topic}: ${message}%0ABalas ke: ${email}`;
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank", "noopener,noreferrer");
    toast.success("Membuka WhatsApp…");
  }

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-12">
      {/* Info cards */}
      <div className="space-y-3">
        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-foreground/30 transition-colors bg-[#25D366]/5">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#25D366] text-white shrink-0">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">WhatsApp (direkomendasikan)</p>
            <p className="text-sm text-muted-foreground mt-0.5">{settings.brand.phone}</p>
            <p className="text-xs text-muted-foreground mt-1">Respon paling cepat · {settings.brand.operatingHours}</p>
          </div>
        </a>

        <a href={`mailto:${settings.brand.email}`} className="group flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-foreground/30 transition-colors">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-foreground text-background shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Email</p>
            <p className="text-sm text-muted-foreground mt-0.5">{settings.brand.email}</p>
            <p className="text-xs text-muted-foreground mt-1">Untuk kerja sama & pertanyaan bisnis</p>
          </div>
        </a>

        <div className="flex items-start gap-4 p-5 rounded-2xl border border-border">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-secondary text-foreground shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Alamat</p>
            <p className="text-sm text-muted-foreground mt-0.5">{settings.brand.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 rounded-2xl border border-border">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-secondary text-foreground shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Jam Operasional</p>
            <p className="text-sm text-muted-foreground mt-0.5">{settings.brand.operatingHours}</p>
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl border border-border overflow-hidden">
          <iframe
            src={settings.brand.mapsEmbed}
            width="100%"
            height="240"
            style={{ border: 0 }}
            loading="lazy"
            title="Lokasi REDBOX"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="rounded-2xl border border-border p-6 md:p-8 bg-secondary/30">
        <h2 className="font-display text-lg md:text-xl font-bold tracking-tight mb-5">Kirim pesan</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Nama</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="mt-1.5 w-full h-11 px-4 rounded-lg bg-background border border-border focus:border-foreground/30 outline-none transition-colors"
                placeholder="Nama Anda" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-1.5 w-full h-11 px-4 rounded-lg bg-background border border-border focus:border-foreground/30 outline-none transition-colors"
                placeholder="email@kamu.com" />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Topik</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}
              className="mt-1.5 w-full h-11 px-4 rounded-lg bg-background border border-border focus:border-foreground/30 outline-none cursor-pointer">
              <option>Pertanyaan umum</option>
              <option>Status pesanan</option>
              <option>Ukuran & fit</option>
              <option>Pengiriman</option>
              <option>Pengembalian & tukar</option>
              <option>Grosir & kerja sama</option>
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Pesan</span>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
              className="mt-1.5 w-full p-4 rounded-lg bg-background border border-border focus:border-foreground/30 outline-none resize-none"
              placeholder="Apa yang bisa kami bantu? Sertakan nama produk atau nomor pesanan jika ada." />
          </label>
        </div>

        <button type="submit"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors">
          <Send className="h-4 w-4" />
          Kirim via WhatsApp
        </button>
        <p className="mt-3 text-xs text-muted-foreground text-center">
          Detail Anda tidak akan dibagikan. Kirim akan membuka WhatsApp dengan pesan yang sudah terisi.
        </p>
      </form>
    </div>
  );
}
