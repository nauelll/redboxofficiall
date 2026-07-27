"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Banner {
  id: string; title: string; subtitle: string | null; ctaText: string | null; ctaHref: string | null;
  imageDesktop: string; imageMobile: string | null; placement: string; overlay: string;
  sortOrder: number; isActive: boolean; startAt: string | null; endAt: string | null;
}

const PLACEMENTS = [
  { value: "hero", label: "Hero (slider utama)" },
  { value: "promo", label: "Promo (strip tengah)" },
];
const OVERLAYS = [
  { value: "dark-left", label: "Gelap kiri" }, { value: "dark-right", label: "Gelap kanan" }, { value: "dark-bottom", label: "Gelap bawah" },
  { value: "light-left", label: "Terang kiri" }, { value: "light-right", label: "Terang kanan" }, { value: "light-bottom", label: "Terang bawah" },
];

export function BannersClient({ initialBanners }: { initialBanners: Banner[] }) {
  const router = useRouter();
  const [banners, setBanners] = React.useState(initialBanners);
  const [editing, setEditing] = React.useState<Banner | null>(null);
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => { setBanners(initialBanners); }, [initialBanners]);

  function refresh() { router.refresh(); }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus banner "${title}"?`)) return;
    try {
      const res = await fetch("/api/admin/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
      const data = await res.json();
      if (data.status === "ok") { toast.success("Banner dihapus."); setBanners((prev) => prev.filter((b) => b.id !== id)); refresh(); }
      else toast.error(data.message || "Gagal menghapus.");
    } catch { toast.error("Gagal menghapus."); }
  }

  async function toggleActive(b: Banner) {
    try {
      const res = await fetch("/api/admin/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", id: b.id, isActive: !b.isActive }) });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success(`Banner ${!b.isActive ? "diaktifkan" : "dinonaktifkan"}.`);
        setBanners((prev) => prev.map((p) => p.id === b.id ? { ...p, isActive: !p.isActive } : p));
        refresh();
      }
    } catch { toast.error("Gagal mengubah status."); }
  }

  const grouped = PLACEMENTS.map((p) => ({ ...p, items: banners.filter((b) => b.placement === p.value) }));

  return (
    <div className="container-premium pt-24 md:pt-28 pb-6 md:pb-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard</Link>
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Banner</h1>
          <p className="text-sm text-muted-foreground mt-2">Atur banner hero (slider home) dan banner promo.</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors text-sm"><Plus className="h-4 w-4" /> Tambah Banner</button>
      </div>

      {grouped.map((group) => (
        <div key={group.value} className="mb-8">
          <h2 className="font-display text-lg font-bold mb-3">{group.label} ({group.items.length})</h2>
          {group.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">Belum ada banner di posisi ini.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((b) => (
                <div key={b.id} className="rounded-2xl border border-border bg-background overflow-hidden">
                  <div className="relative aspect-[16/9] bg-secondary">
                    {b.imageDesktop && <img src={b.imageDesktop} alt={b.title} className="absolute inset-0 h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />}
                    {!b.isActive && <div className="absolute top-3 right-3 inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-gray-900/80 text-white text-[10px] font-bold tracking-widest uppercase"><EyeOff className="h-3 w-3" /> Nonaktif</div>}
                  </div>
                  <div className="p-4">
                    <p className="font-display font-bold text-base truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{b.subtitle || "—"}</p>
                    <p className="text-xs text-muted-foreground mt-1">CTA: {b.ctaText || "—"} → {b.ctaHref || "—"} · urutan {b.sortOrder}</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <button onClick={() => toggleActive(b)} title={b.isActive ? "Nonaktifkan" : "Aktifkan"} className={cn("inline-flex items-center justify-center h-9 w-9 rounded-full border border-border transition-colors", b.isActive ? "hover:border-amber-600 hover:text-amber-600" : "hover:border-emerald-600 hover:text-emerald-600")}>{b.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                      <button onClick={() => setEditing(b)} title="Edit" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-foreground/40 hover:bg-secondary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(b.id, b.title)} title="Hapus" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {(adding || editing) && <BannerModal banner={editing} onClose={() => { setAdding(false); setEditing(null); }} onSaved={() => { setAdding(false); setEditing(null); refresh(); }} />}
    </div>
  );
}

function BannerModal({ banner, onClose, onSaved }: { banner: Banner | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!banner;
  const [title, setTitle] = React.useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = React.useState(banner?.subtitle ?? "");
  const [ctaText, setCtaText] = React.useState(banner?.ctaText ?? "");
  const [ctaHref, setCtaHref] = React.useState(banner?.ctaHref ?? "");
  const [imageDesktop, setImageDesktop] = React.useState(banner?.imageDesktop ?? "");
  const [imageMobile, setImageMobile] = React.useState(banner?.imageMobile ?? "");
  const [placement, setPlacement] = React.useState(banner?.placement ?? "hero");
  const [overlay, setOverlay] = React.useState(banner?.overlay ?? "dark-left");
  const [sortOrder, setSortOrder] = React.useState(String(banner?.sortOrder ?? 0));
  const [isActive, setIsActive] = React.useState(banner?.isActive ?? true);
  const [startAt, setStartAt] = React.useState(banner?.startAt ? banner.startAt.slice(0, 10) : "");
  const [endAt, setEndAt] = React.useState(banner?.endAt ? banner.endAt.slice(0, 10) : "");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, saving]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!title.trim() || !imageDesktop.trim()) { toast.error("Judul dan gambar desktop wajib diisi."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "add",
          ...(isEdit ? { id: banner!.id } : {}),
          title: title.trim(), subtitle: subtitle.trim() || null,
          ctaText: ctaText.trim() || null, ctaHref: ctaHref.trim() || null,
          imageDesktop: imageDesktop.trim(), imageMobile: imageMobile.trim() || null,
          placement, overlay, sortOrder: Number(sortOrder) || 0, isActive,
          startAt: startAt ? new Date(startAt).toISOString() : null,
          endAt: endAt ? new Date(endAt).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (data.status === "ok") { toast.success(data.message); onSaved(); onClose(); }
      else toast.error(data.message || "Gagal menyimpan.");
    } catch { toast.error("Gagal terhubung."); }
    finally { setSaving(false); }
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !saving && onClose()} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
        className="fixed inset-x-3 sm:inset-x-4 top-3 sm:top-10 bottom-3 sm:bottom-10 z-50 mx-auto max-w-lg rounded-2xl bg-background shadow-premium flex flex-col overflow-hidden"
        role="dialog" aria-modal="true"
      >
        <div className="shrink-0 px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{isEdit ? "Edit Banner" : "Tambah Banner"}</h2>
          <button onClick={() => !saving && onClose()} disabled={saving} className="p-2 rounded-full hover:bg-secondary disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Field label="Judul" required value={title} onChange={setTitle} placeholder="Style For The Next Generation" />
          <Field label="Subtitle" value={subtitle} onChange={setSubtitle} placeholder="Premium teen fashion dari Bandung" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Teks Tombol" value={ctaText} onChange={setCtaText} placeholder="Shop Now" />
            <Field label="Link Tombol" value={ctaHref} onChange={setCtaHref} placeholder="/shop" />
          </div>
          <Field label="URL Gambar Desktop" required value={imageDesktop} onChange={setImageDesktop} placeholder="/assets/banners/hero-1.svg" />
          <Field label="URL Gambar Mobile (opsional)" value={imageMobile} onChange={setImageMobile} placeholder="/assets/banners/hero-1-mobile.svg" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Posisi</span>
              <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-secondary border border-border outline-none cursor-pointer">
                {PLACEMENTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Overlay Teks</span>
              <select value={overlay} onChange={(e) => setOverlay(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-secondary border border-border outline-none cursor-pointer">
                {OVERLAYS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tgl Mulai" type="date" value={startAt} onChange={setStartAt} />
            <Field label="Tgl Berakhir" type="date" value={endAt} onChange={setEndAt} />
          </div>
          <Field label="Urutan" type="number" value={sortOrder} onChange={setSortOrder} placeholder="0" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-border accent-foreground" />
            <span className="text-sm">Aktif (tampil di website)</span>
          </label>
        </form>
        <div className="shrink-0 px-5 py-4 border-t border-border flex items-center justify-end gap-3 bg-background">
          <button type="button" onClick={() => !saving && onClose()} disabled={saving} className="h-11 px-5 rounded-full border border-border hover:bg-secondary text-sm font-semibold disabled:opacity-50">Batal</button>
          <button type="button" onClick={handleSubmit} disabled={saving} className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors disabled:opacity-50">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Menyimpan…</> : <><Save className="h-4 w-4" />Simpan</>}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{label}{required && <span className="text-[#dc2626] ml-1">*</span>}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="mt-1.5 w-full h-11 px-4 rounded-lg bg-secondary border border-border focus:border-foreground/30 outline-none transition-colors text-sm" />
    </label>
  );
}
