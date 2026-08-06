"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentSchema, type CommentInput } from "@/lib/validations/comment.schema";
import { createComment } from "@/lib/actions/comments";

export function CommentForm({
  articleSlug,
  parentId,
  placeholder = "Escreva um comentário...",
  submitLabel = "Comentar",
  onDone,
}: {
  articleSlug: string;
  parentId?: string;
  placeholder?: string;
  submitLabel?: string;
  onDone?: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentInput>({ resolver: zodResolver(commentSchema) });

  async function onSubmit(data: CommentInput) {
    const result = await createComment({
      articleSlug,
      content: data.content,
      parentId,
    });

    if (result.success) {
      reset();
      onDone?.();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-2">
      <Textarea
        rows={3}
        placeholder={placeholder}
        aria-label={placeholder}
        aria-invalid={!!errors.content}
        {...register("content")}
      />
      {errors.content && (
        <p className="text-sm text-destructive">{errors.content.message}</p>
      )}
      <div className="flex justify-end gap-2">
        {onDone && (
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Cancelar
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
