import Link from "next/link";
import { formatDate } from "@/lib/format-date";
import type { RecentComment } from "@/lib/queries/profile";

export function RecentCommentsList({ comments }: { comments: RecentComment[] }) {
  if (comments.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-600">
        Comentários recentes
      </h2>
      <ul className="flex flex-col gap-3">
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="rounded-sm border border-dashed border-black/15 p-3 text-sm"
          >
            <p className="line-clamp-2 text-neutral-700">{comment.content}</p>
            <div className="mt-1.5 flex items-center justify-between text-xs text-neutral-500">
              <Link
                href={`/artigos/${comment.articleSlug}`}
                className="truncate font-medium hover:text-[color:var(--profile-accent)]"
              >
                em &ldquo;{comment.articleTitle}&rdquo;
              </Link>
              <span className="shrink-0">{formatDate(comment.createdAt)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
