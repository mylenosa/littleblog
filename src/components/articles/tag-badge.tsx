import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const TAG_PALETTE = [
  { bg: "#f6dce9", fg: "#7a1f52" },
  { bg: "#e4d6f7", fg: "#4b1d91" },
  { bg: "#fbc7de", fg: "#5c1440" },
  { bg: "#d9c9f0", fg: "#3a1670" },
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

export function TagBadge({ tag }: { tag: string }) {
  const { bg, fg } = tagColor(tag);
  return (
    <Badge
      variant="outline"
      className="rounded-full border-transparent font-normal transition-transform hover:-translate-y-0.5"
      style={{ backgroundColor: bg, color: fg }}
      render={<Link href={`/tags/${encodeURIComponent(tag)}`} />}
    >
      #{tag}
    </Badge>
  );
}
