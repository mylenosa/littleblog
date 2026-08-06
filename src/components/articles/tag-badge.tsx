import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function TagBadge({ tag }: { tag: string }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full font-normal text-muted-foreground hover:border-primary hover:text-primary"
      render={<Link href={`/tags/${encodeURIComponent(tag)}`} />}
    >
      #{tag}
    </Badge>
  );
}
