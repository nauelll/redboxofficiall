// /admin/login — public login page.
import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginClient } from "@/components/admin/admin-login-client";

export const metadata: Metadata = {
  title: "Login Admin — REDBOX",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginClient />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12 bg-secondary/30">
      <div className="w-full max-w-md rounded-3xl bg-background border border-border p-10 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-foreground text-background mb-4">
          <span className="h-7 w-7 rounded-full border-2 border-background border-t-transparent animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground">Memuat halaman login…</p>
      </div>
    </div>
  );
}
