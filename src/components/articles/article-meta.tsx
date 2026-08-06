import { getAuthor } from "@/lib/constants/authors";
import { formatDate } from "@/lib/format-date";

export function ArticleMeta({
  author,
  publishedAt,
  readingTimeMinutes,
  className,
}: {
  author: string;
  publishedAt: string;
  readingTimeMinutes: number;
  className?: string;
}) {
  const authorData = getAuthor(author);

  return (
    <div
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground ${
        className ?? ""
      }`}
    >
      <span className="font-medium text-foreground">
        {authorData?.name ?? author}
      </span>
      <span aria-hidden="true">·</span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{readingTimeMinutes} min de leitura</span>
    </div>
  );
}
