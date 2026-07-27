// Breadcrumb component.
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Crumb { label: string; href?: string; }

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-foreground transition-colors">{c.label}</Link>
              ) : (
                <span className={cn(isLast && "text-foreground font-medium")} aria-current={isLast ? "page" : undefined}>{c.label}</span>
              )}
              {!isLast && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
