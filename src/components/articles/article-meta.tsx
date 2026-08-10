import { Eye } from "lucide-react";
import { formatDate } from "@/lib/format-date";

export function ArticleMeta({
  authorName,
  publishedAt,
  readingTimeMinutes,
  viewCount,
  className,
}: {
  authorName: string;
  publishedAt: string;
  readingTimeMinutes: number;
  viewCount?: number;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground ${
        className ?? ""
      }`}
    >
      <span className="font-medium text-foreground">{authorName}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{readingTimeMinutes} min de leitura</span>
      {typeof viewCount === "number" && (
        <>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3.5" aria-hidden="true" />
            {viewCount.toLocaleString("pt-BR")}
          </span>
        </>
      )}
    </div>
  );
}
