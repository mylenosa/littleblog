"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/comments/emoji-picker";
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
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CommentInput>({ resolver: zodResolver(commentSchema) });

  const { ref: contentRegisterRef, ...contentField } = register("content");

  function insertEmoji(emoji: string) {
    const el = contentRef.current;
    const current = getValues("content") || "";
    const start = el?.selectionStart ?? current.length;
    const end = el?.selectionEnd ?? current.length;

    const next = current.slice(0, start) + emoji + current.slice(end);
    setValue("content", next, { shouldDirty: true, shouldValidate: true });

    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  }

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
        {...contentField}
        ref={(el) => {
          contentRegisterRef(el);
          contentRef.current = el;
        }}
      />
      {errors.content && (
        <p className="text-sm text-destructive">{errors.content.message}</p>
      )}
      <div className="flex items-center justify-between gap-2">
        <EmojiPicker onSelect={insertEmoji} label="Inserir emoji" variant="ghost" size="icon-sm">
          <Smile />
        </EmojiPicker>
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
      </div>
    </form>
  );
}
