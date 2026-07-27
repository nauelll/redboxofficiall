// Empty state component.
import Link from "next/link";
import { PackageSearch, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Tidak ada produk ditemukan",
  description = "Coba ubah filter atau kata kunci pencarian Anda.",
  actionLabel = "Lihat semua produk",
  actionHref = "/shop",
  className,
  icon,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-6 py-20 rounded-3xl border border-dashed border-border bg-secondary/30", className)}>
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-secondary text-muted-foreground mb-5">
        {icon ?? <PackageSearch className="h-7 w-7" />}
      </div>
      <h3 className="text-xl font-bold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity">
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
