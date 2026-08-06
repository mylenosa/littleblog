import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function AdminBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Trilha" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
      <span>Admin</span>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="size-3.5" aria-hidden="true" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
