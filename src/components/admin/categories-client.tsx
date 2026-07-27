"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, Loader2, ArrowLeft, Eye, EyeOff, Tag, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Subcat { id: string; slug: string; name: string; }
interface Category {
  id: string; slug: string; name: string; tagline: string; description: string;
  image: string; isActive: boolean; sortOrder: number; productCount: number;
  subcategories: Subcat[];
}

export function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = React.useState(initialCategories);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  React.useEffect(() => { setCategories(initialCategories); }, [initialCategories]);

  function refresh() { router.refresh(); }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus kategori "${name}"? Produk yang ada akan tetap tapi tidak terikat kategori ini.`)) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (data.status === "ok") { toast.success("Kategori dihapus."); setCategories((prev) => prev.filter((c) => c.id !== id)); refresh(); }
      else toast.error(data.message || "Gagal menghapus.");
    } catch { toast.error("Gagal menghapus."); }
  }

  async function toggleActive(c: Category) {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update", id: c.id, isActive: !c.isActive }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success(`Kategori ${!c.isActive ? "diaktifkan" : "dinonaktifkan"}.`);
        setCategories((prev) => prev.map((p) => p.id === c.id ? { ...p, isActive: !p.isActive } : p));
        refresh();
      }
    } catch { toast.error("Gagal mengubah status."); }
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="container-premium pt-24 md:pt-28 pb-6 md:pb-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Kategori</h1>
          <p className="text-sm text-muted-foreground mt-2">Kelola kategori produk.</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors text-sm">
          <Plus className="h-4 w-4" /> Tambah Kategori
        </button>
      </div>

      <div className="space-y-3">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-background overflow-hidden">
            <div className="p-4 md:p-5 flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-secondary">
                {c.image && <img src={c.image} alt={c.name} className="h-full w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-display font-bold text-base">{c.name}</p>
                  <span className="inline-flex items-center h-5 px-2 rounded-full text-[9px] font-bold tracking-widest uppercase bg-secondary text-muted-foreground">/{c.slug}</span>
                  {!c.isActive && (
                    <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[9px] font-bold tracking-widest uppercase bg-gray-200 text-gray-700">
                      <EyeOff className="h-2.5 w-2.5" /> Nonaktif
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{c.tagline || "—"} · {c.productCount} produk · {c.subcategories.length} subkategori</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {c.subcategories.length > 0 && (
                  <button onClick={() => toggleExpand(c.id)} title="Lihat subkategori"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:bg-secondary transition-colors">
                    {expanded.has(c.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                )}
                <button onClick={() => toggleActive(c)} title={c.isActive ? "Nonaktifkan" : "Aktifkan"}
                  className={cn("inline-flex items-center justify-center h-9 w-9 rounded-full border border-border transition-colors",
                    c.isActive ? "hover:border-amber-600 hover:text-amber-600" : "hover:border-emerald-600 hover:text-emerald-600")}>
                  {c.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing(c)} title="Edit"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-foreground/40 hover:bg-secondary transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(c.id, c.name)} title="Hapus"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-[#dc2626] hover:text-[#dc2626] transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {expanded.has(c.id) && c.subcategories.length > 0 && (
              <div className="px-5 pb-4 border-t border-border pt-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">Subkategori</p>
                <div className="flex flex-wrap gap-2">
                  {c.subcategories.map((s) => (
                    <span key={s.id} className="inline-flex items-center h-7 px-3 rounded-full bg-secondary text-xs font-medium">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <CategoryModal category={editing} onClose={() => { setAdding(false); setEditing(null); }} onSaved={() => { setAdding(false); setEditing(null); refresh(); }} />
      )}
    </div>
  );
}

function CategoryModal({ category, onClose, onSaved }: { category: Category | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!category;
  const [name, setName] = React.useState(category?.name ?? "");
  const [slug, setSlug] = React.useState(category?.slug ?? "");
  const [tagline, setTagline] = React.useState(category?.tagline ?? "");
  const [description, setDescription] = React.useState(category?.description ?? "");
  const [image, setImage] = React.useState(category?.image ?? "");
  const [subcatsText, setSubcatsText] = React.useState(category?.subcategories.map((s) => s.name).join("\n") ?? "");
  const [sortOrder, setSortOrder] = React.useState(String(category?.sortOrder ?? 0));
  const [isActive, setIsActive] = React.useState(category?.isActive ?? true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!isEdit && name) setSlug(name.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 50));
  }, [name, isEdit]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose, saving]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!name.trim() || !slug.trim()) { toast.error("Nama dan slug wajib diisi."); return; }
    setSaving(true);
    const subcategories = subcatsText.split("\n").map((s) => s.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "add",
          ...(isEdit ? { id: category!.id } : {}),
          name: name.trim(), slug: slug.trim(), tagline: tagline.trim(),
          description: description.trim(), image: image.trim(),
          subcategories: isEdit ? undefined : subcategories,
          sortOrder: Number(sortOrder) || 0, isActive,
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
          <h2 className="font-display text-lg font-bold">{isEdit ? "Edit Kategori" : "Tambah Kategori"}</h2>
          <button onClick={() => !saving && onClose()} disabled={saving} className="p-2 rounded-full hover:bg-secondary disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Field label="Nama Kategori" required value={name} onChange={setName} placeholder="Kaos Anak" />
          <Field label="Slug" required value={slug} onChange={setSlug} placeholder="kaos-anak" disabled={isEdit} />
          <Field label="Tagline" value={tagline} onChange={setTagline} placeholder="Kaos premium untuk harian" />
          <Field label="Deskripsi" multiline rows={3} value={description} onChange={setDescription} placeholder="Deskripsi kategori…" />
          <Field label="URL Gambar" value={image} onChange={setImage} placeholder="/assets/categories/kaos-anak.svg" />
          {!isEdit && (
            <Field label="Subkategori (satu per baris)" multiline rows={4} value={subcatsText} onChange={setSubcatsText} placeholder={"Kaos Lengan Pendek\nKaos Lengan Panjang\nGraphic Tee"} />
          )}
          <Field label="Urutan" type="number" value={sortOrder} onChange={setSortOrder} placeholder="0" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-border accent-foreground" />
            <span className="text-sm">Aktif (tampil di katalog)</span>
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

function Field({ label, value, onChange, placeholder, type = "text", multiline, rows = 3, required, disabled }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; multiline?: boolean; rows?: number; required?: boolean; disabled?: boolean;
}) {
  const base = "mt-1.5 w-full px-4 rounded-lg bg-secondary border border-border focus:border-foreground/30 outline-none transition-colors text-sm disabled:opacity-60";
  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">{label}{required && <span className="text-[#dc2626] ml-1">*</span>}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} disabled={disabled} className={`${base} py-3 resize-y`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} disabled={disabled} className={`${base} h-11`} />
      )}
    </label>
  );
}
