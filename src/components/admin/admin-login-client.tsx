"use client";
// Admin login form.
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function AdminLoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/admin";
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!username.trim() || !password) {
      toast.error("Mohon isi username dan password.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        toast.success("Login berhasil!");
        setTimeout(() => router.push(redirect), 600);
      } else {
        toast.error(data.message || "Login gagal.");
        setSubmitting(false);
      }
    } catch {
      toast.error("Gagal terhubung ke server. Coba lagi.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-8.5rem)] flex items-center justify-center px-4 py-12 bg-secondary/30">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="rounded-3xl bg-background border border-border shadow-premium p-7 md:p-10">
          <div className="text-center mb-7">
            <div className="relative h-16 w-16 mx-auto rounded-2xl overflow-hidden mb-4">
              <Image src="/assets/brand/logo-login.png" alt="REDBOX Official" fill sizes="64px" className="object-contain" priority />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Login Admin</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Masuk untuk mengelola REDBOX</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Username</span>
              <div className="relative mt-1.5">
                <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username" autoCapitalize="off" spellCheck={false} disabled={submitting}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary border border-border focus:border-foreground/30 outline-none transition-colors text-sm disabled:opacity-60"
                  placeholder="Masukkan username"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">Password</span>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password" disabled={submitting}
                  className="w-full h-12 pl-10 pr-12 rounded-xl bg-secondary border border-border focus:border-foreground/30 outline-none transition-colors text-sm disabled:opacity-60"
                  placeholder="Masukkan password"
                />
                <button
                  type="button" onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-foreground/5 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            <button
              type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-foreground text-background font-semibold hover:bg-[#dc2626] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Memproses…</> : <>Masuk<ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <div className="mt-7 pt-6 border-t border-border text-center">
            <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">← Kembali ke beranda</Link>
          </div>
        </div>
        <p className="mt-5 text-center text-[11px] text-muted-foreground">Area terbatas · Hanya untuk admin REDBOX Official</p>
      </motion.div>
    </div>
  );
}
