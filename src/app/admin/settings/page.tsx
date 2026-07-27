// /admin/settings — edit marketplace URLs, social, brand info.
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { SettingsClient } from "@/components/admin/settings-client";

export const metadata: Metadata = { title: "Pengaturan — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rows = await db.siteSetting.findMany();
  const settings: Record<string, string> = {};
  for (const r of rows) settings[r.key] = r.value;
  return <SettingsClient initialSettings={settings} />;
}
