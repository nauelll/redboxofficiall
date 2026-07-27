// /admin/banners
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { BannersClient } from "@/components/admin/banners-client";

export const metadata: Metadata = { title: "Banner — Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: [{ placement: "asc" }, { sortOrder: "asc" }] });
  return (
    <BannersClient initialBanners={banners.map((b) => ({
      id: b.id, title: b.title, subtitle: b.subtitle, ctaText: b.ctaText, ctaHref: b.ctaHref,
      imageDesktop: b.imageDesktop, imageMobile: b.imageMobile, placement: b.placement,
      overlay: b.overlay, sortOrder: b.sortOrder, isActive: b.isActive,
      startAt: b.startAt?.toISOString() ?? null, endAt: b.endAt?.toISOString() ?? null,
    }))} />
  );
}
