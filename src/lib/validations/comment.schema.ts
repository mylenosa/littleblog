import { z } from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escreva algo antes de enviar.")
    .max(2000, "Comentário muito longo."),
});

export type CommentInput = z.infer<typeof commentSchema>;
