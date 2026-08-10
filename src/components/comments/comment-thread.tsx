import Link from "next/link";
import { CommentForm } from "@/components/comments/comment-form";
import { CommentItem } from "@/components/comments/comment-item";
import { getCommentsForArticle } from "@/lib/queries/comments";
import { getAuthState } from "@/lib/supabase/auth-state";

function countComments(nodes: Awaited<ReturnType<typeof getCommentsForArticle>>): number {
  return nodes.reduce((total, node) => total + 1 + countComments(node.replies), 0);
}

export async function CommentThread({ articleSlug }: { articleSlug: string }) {
  const { user, profile } = await getAuthState();
  const comments = await getCommentsForArticle(articleSlug, user?.id ?? null);

  const total = countComments(comments);

  return (
    <section aria-labelledby="comentarios" className="mt-16 border-t border-border pt-10">
      <h2 id="comentarios" className="mb-5 text-lg font-semibold tracking-tight">
        {total === 0
          ? "Comentários"
          : `${total} comentário${total === 1 ? "" : "s"}`}
      </h2>

      {user ? (
        <div className="mb-6">
          <CommentForm articleSlug={articleSlug} />
        </div>
      ) : (
        <p className="mb-6 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entre
          </Link>{" "}
          para comentar e responder outros leitores.
        </p>
      )}

      {comments.length > 0 ? (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleSlug={articleSlug}
              currentUserId={user?.id ?? null}
              isEditor={!!profile?.isEditor}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Nenhum comentário ainda. Seja o primeiro a comentar.
        </p>
      )}
    </section>
  );
}
