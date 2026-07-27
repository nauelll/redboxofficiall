"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Store, Share2, Building2 } from "lucide-react";
import { toast } from "sonner";

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);

  // Marketplace
  const [shopee, setShopee] = React.useState(initialSettings["marketplace.shopee"] ?? "");
  const [tokopedia, setTokopedia] = React.useState(initialSettings["marketplace.tokopedia"] ?? "");
  const [lazada, setLazada] = React.useState(initialSettings["marketplace.lazada"] ?? "");
  const [tiktokShop, setTiktokShop] = React.useState(initialSettings["marketplace.tiktok_shop"] ?? "");
  const [whatsapp, setWhatsapp] = React.useState(initialSettings["marketplace.whatsapp"] ?? "");
  const [whatsappNumber, setWhatsappNumber] = React.useState(initialSettings["marketplace.whatsapp_number"] ?? "");
  // Social
  const [instagram, setInstagram] = React.useState(initialSettings["social.instagram"] ?? "");
  const [instagramHandle, setInstagramHandle] = React.useState(initialSettings["social.instagram_handle"] ?? "");
  const [tiktok, setTiktok] = React.useState(initialSettings["social.tiktok"] ?? "");
  const [facebook, setFacebook] = React.useState(initialSettings["social.facebook"] ?? "");
  // Brand
  const [brandName, setBrandName] = React.useState(initialSettings["brand.name"] ?? "REDBOX");
  const [brandTagline, setBrandTagline] = React.useState(initialSettings["brand.tagline"] ?? "");
  const [brandEmail, setBrandEmail] = React.useState(initialSettings["brand.email"] ?? "");
  const [brandPhone, setBrandPhone] = React.useState(initialSettings["brand.phone"] ?? "");
  const [brandLocation, setBrandLocation] = React.useState(initialSettings["brand.location"] ?? "");
  const [brandAddress, setBrandAddress] = React.useState(initialSettings["brand.address"] ?? "");
  const [brandHours, setBrandHours] = React.useState(initialSettings["brand.operating_hours"] ?? "");
  const [brandMaps, setBrandMaps] = React.useState(initialSettings["brand.maps_embed"] ?? "");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            "marketplace.shopee": shopee, "marketplace.tokopedia": tokopedia,
            "marketplace.lazada": lazada, "marketplace.tiktok_shop": tiktokShop,
            "marketplace.whatsapp": whatsapp, "marketplace.whatsapp_number": whatsappNumber,
            "social.instagram": instagram, "social.instagram_handle": instagramHandle,
            "social.tiktok": tiktok, "social.facebook": facebook,
            "brand.name": brandName, "brand.tagline": brandTagline,
            "brand.email": brandEmail, "brand.phone": brandPhone,
            "brand.location": brandLocation, "brand.address": brandAddress,
            "brand.operating_hours": brandHours, "brand.maps_embed": brandMaps,
          },
        }),
      });
      const data = await res.json();
      if (data.status === "ok") { toast.success("Pengaturan disimpan."); router.refresh(); }
      else toast.error(data.message || "Gagal menyimpan.");
    } catch { toast.error("Gagal terhubung ke server."); }
    finally { setSaving(false); }
  }

  return (
    <div className="container-premium pt-24 md:pt-28 pb-6 md:pb-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
      </div>
      <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-2">Pengaturan</h1>
      <p className="text-sm text-muted-foreground mb-8">Ubah link marketplace, sosial media, dan info brand tanpa edit kode.</p>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        <Section title="Link Marketplace" icon={Store} description="Tombol belanja di seluruh website akan mengarah ke URL ini.">
          <Field label="Shopee URL" value={shopee} onChange={setShopee} placeholder="https://shopee.co.id/redbox_officialstore" />
          <Field label="Tokopedia URL" value={tokopedia} onChange={setTokopedia} placeholder="https://www.tokopedia.com/redbox-official" />
          <Field label="Lazada URL" value={lazada} onChange={setLazada} placeholder="https://www.lazada.co.id/shop/redbox_03" />
          <Field label="TikTok Shop URL" value={tiktokShop} onChange={setTiktokShop} placeholder="https://www.tiktok.com/@redbox.official" />
          <Field label="WhatsApp URL" value={whatsapp} onChange={setWhatsapp} placeholder="https://wa.me/6281324898585" />
          <Field label="WhatsApp Number" value={whatsappNumber} onChange={setWhatsappNumber} placeholder="6281324898585" />
        </Section>

        <Section title="Sosial Media" icon={Share2}>
          <Field label="Instagram URL" value={instagram} onChange={setInstagram} placeholder="https://www.instagram.com/redbox.official" />
          <Field label="Instagram Handle" value={instagramHandle} onChange={setInstagramHandle} placeholder="@redbox.official" />
          <Field label="TikTok URL" value={tiktok} onChange={setTiktok} placeholder="https://www.tiktok.com/@redbox.official" />
          <Field label="Facebook URL" value={facebook} onChange={setFacebook} placeholder="https://www.facebook.com/..." />
        </Section>

        <Section title="Info Brand" icon={Building2}>
          <Field label="Nama Brand" value={brandName} onChange={setBrandName} />
          <Field label="Tagline" value={brandTagline} onChange={setBrandTagline} />
          <Field label="Email" value={brandEmail} onChange={setBrandEmail} />
          <Field label="Telepon" value={brandPhone} onChange={setBrandPhone} />
          <Field label="Lokasi (singkat)" value={brandLocation} onChange={setBrandLocation} />
          <Field label="Alamat Lengkap" value={brandAddress} onChange={setBrandAddress} multiline rows={2} />
          <Field label="Jam Operasional" value={brandHours} onChange={setBrandHours} />
          <Field label="Google Maps Embed URL" value={brandMaps} onChange={setBrandMaps} multiline rows={2} />
        </Section>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/admin" className="h-11 px-5 rounded-full border border-border hover:bg-secondary text-sm font-semibold inline-flex items-center">Batal</Link>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan…</> : <><Save className="h-4 w-4" />Simpan</>}
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({ title, description, icon: Icon, children }: { title: string; description?: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-foreground text-background shrink-0"><Icon className="h-5 w-5" /></div>
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, multiline, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean; rows?: number }) {
  const base = "mt-1.5 w-full px-4 rounded-lg bg-secondary border border-border focus:border-foreground/30 outline-none transition-colors text-sm";
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={`${base} py-3 resize-y`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} h-11`} />
      )}
    </label>
  );
}
