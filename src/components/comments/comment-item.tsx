"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CommentForm } from "@/components/comments/comment-form";
import { updateComment, deleteComment } from "@/lib/actions/comments";
import { formatDate } from "@/lib/format-date";
import type { CommentNode } from "@/lib/queries/comments";

export function CommentItem({
  comment,
  articleSlug,
  currentUserId,
}: {
  comment: CommentNode;
  articleSlug: string;
  currentUserId: string | null;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwn = currentUserId === comment.userId;

  async function handleSave() {
    setIsSaving(true);
    const result = await updateComment({
      id: comment.id,
      articleSlug,
      content: editValue,
    });
    setIsSaving(false);

    if (result.success) {
      setIsEditing(false);
    } else {
      toast.error(result.message);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteComment({ id: comment.id, articleSlug });
    setIsDeleting(false);

    if (!result.success) toast.error(result.message);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{comment.authorName}</span>
          <span className="text-muted-foreground" aria-hidden="true">
            ·
          </span>
          <time dateTime={comment.createdAt} className="text-muted-foreground">
            {formatDate(comment.createdAt.slice(0, 10))}
          </time>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editValue}
              onChange={(event) => setEditValue(event.target.value)}
              rows={3}
              aria-label="Editar comentário"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(comment.content);
                }}
              >
                Cancelar
              </Button>
              <Button type="button" size="sm" disabled={isSaving} onClick={handleSave}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
        )}

        {!isEditing && (
          <div className="mt-1 flex gap-3 text-xs">
            {currentUserId && (
              <button
                type="button"
                onClick={() => setIsReplying((value) => !value)}
                className="font-medium text-muted-foreground hover:text-primary"
              >
                Responder
              </button>
            )}
            {isOwn && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="font-medium text-muted-foreground hover:text-primary"
                >
                  Editar
                </button>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <button
                        type="button"
                        className="font-medium text-muted-foreground hover:text-destructive"
                      />
                    }
                  >
                    Excluir
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir comentário?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. As respostas a este
                        comentário também serão removidas.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeleting}
                        onClick={handleDelete}
                      >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        )}

        {isReplying && (
          <div className="mt-2">
            <CommentForm
              articleSlug={articleSlug}
              parentId={comment.id}
              placeholder="Escreva uma resposta..."
              submitLabel="Responder"
              onDone={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-6 flex flex-col gap-2 border-l border-border pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleSlug={articleSlug}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
