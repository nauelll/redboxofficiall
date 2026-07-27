"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ArrowLeft, Loader2, X, Save, Eye, EyeOff, FileQuestion } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Faq { id: string; question: string; answer: string; category: string; sortOrder: number; isActive: boolean; }
const FAQ_CATEGORIES = ["Umum", "Produk", "Pesanan", "Pengiriman", "Pembayaran"];

export function FaqAdminClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = React.useState(initialFaqs);
  const [editing, setEditing] = React.useState<Faq | null>(null);
  const [adding, setAdding] = React.useState(false);

  React.useEffect(() => { setFaqs(initialFaqs); }, [initialFaqs]);
  function refresh() { router.refresh(); }

  async function handleDelete(id: string, q: string) {
    if (!confirm(`Hapus FAQ "${q.slice(0, 50)}…"?`)) return;
    try {
      const res = await fetch("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", id }) });
      const data = await res.json();
      if (data.status === "ok") { toast.success("FAQ dihapus."); setFaqs((prev) => prev.filter((f) => f.id !== id)); refresh(); }
      else toast.error(data.message || "Gagal menghapus.");
    } catch { toast.error("Gagal menghapus."); }
  }

  async function toggleActive(f: Faq) {
    try {
      const res = await fetch("/api/admin/faq", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", id: f.id, isActive: !f.isActive }) });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success(`FAQ ${!f.isActive ? "diaktifkan" : "dinonaktifkan"}.`);
        setFaqs((prev) => prev.map((p) => p.id === f.id ? { ...p, isActive: !p.isActive } : p));
        refresh();
      }
    } catch { toast.error("Gagal mengubah status."); }
  }

  return (
    <div className="container-premium pt-24 md:pt-28 pb-6 md:pb-10">
      <div className="mb-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard</Link>
      </div>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">FAQ</h1>
          <p className="text-sm text-muted-foreground mt-2">Kelola pertanyaan yang sering diajukan.</p>
        </div>
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors text-sm"><Plus className="h-4 w-4" /> Tambah FAQ</button>
      </div>

      {faqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <FileQuestion className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="font-semibold">Belum ada FAQ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-background p-4 md:p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="inline-flex items-center h-5 px-2 rounded-full text-[9px] font-bold tracking-widest uppercase bg-secondary text-muted-foreground">{f.category}</span>
                    {!f.isActive && <span className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[9px] font-bold tracking-widest uppercase bg-gray-200 text-gray-700"><EyeOff className="h-2.5 w-2.5" /> Nonaktif</span>}
                  </div>
                  <p className="font-semibold text-sm md:text-base">{f.question}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => toggleActive(f)} title={f.isActive ? "Nonaktifkan" : "Aktifkan"} className={cn("inline-flex items-center justify-center h-9 w-9 rounded-full border border-border transition-colors", f.isActive ? "hover:border-amber-600 hover:text-amber-600" : "hover:border-emerald-600 hover:text-emerald-600")}>{f.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                  <button onClick={() => setEditing(f)} title="Edit" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-foreground/40 hover:bg-secondary transition-colors"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(f.id, f.question)} title="Hapus" className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(adding || editing) && <FaqModal faq={editing} onClose={() => { setAdding(false); setEditing(null); }} onSaved={() => { setAdding(false); setEditing(null); refresh(); }} />}
    </div>
  );
}

function FaqModal({ faq, onClose, onSaved }: { faq: Faq | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!faq;
  const [question, setQuestion] = React.useState(faq?.question ?? "");
  const [answer, setAnswer] = React.useState(faq?.answer ?? "");
  const [category, setCategory] = React.useState(faq?.category ?? "Umum");
  const [sortOrder, setSortOrder] = React.useState(String(faq?.sortOrder ?? 0));
  const [isActive, setIsActive] = React.useState(faq?.isActive ?? true);
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
    if (!question.trim() || !answer.trim()) { toast.error("Pertanyaan dan jawaban wajib diisi."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/faq", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isEdit ? "update" : "add",
          ...(isEdit ? { id: faq!.id } : {}),
          question: question.trim(), answer: answer.trim(), category,
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
          <h2 className="font-display text-lg font-bold">{isEdit ? "Edit FAQ" : "Tambah FAQ"}</h2>
          <button onClick={() => !saving && onClose()} disabled={saving} className="p-2 rounded-full hover:bg-secondary disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <Field label="Pertanyaan" required value={question} onChange={setQuestion} placeholder="Bagaimana cara pemesanan?" />
          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Jawaban</span>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} required rows={5} placeholder="Jawaban lengkap…"
              className="mt-1.5 w-full p-4 rounded-lg bg-secondary border border-border focus:border-foreground/30 outline-none resize-y text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Kategori</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1.5 w-full h-11 px-3 rounded-lg bg-secondary border border-border outline-none cursor-pointer">
              {FAQ_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <Field label="Urutan" type="number" value={sortOrder} onChange={setSortOrder} placeholder="0" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded border-border accent-foreground" />
            <span className="text-sm">Aktif (tampil di halaman FAQ)</span>
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
