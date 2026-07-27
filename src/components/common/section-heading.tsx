// Section heading — eyebrow + title + optional link.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  link?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow, title, description, link, align = "left", className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center text-center",
        className,
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl mx-auto")}>
        {eyebrow && (
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-[#dc2626] mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-xl">{description}</p>
        )}
      </div>
      {link && (
        <Link href={link.href} className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-[#dc2626] transition-colors">
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
