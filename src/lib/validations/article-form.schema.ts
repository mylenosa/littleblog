import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string().trim().min(1, "Informe um título."),
  slug: z
    .string()
    .trim()
    .min(1, "Informe um slug.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas, números e hífens."
    ),
  summary: z.string().trim().min(1, "Informe um resumo."),
  content: z.string().trim().min(1, "Escreva o conteúdo do artigo."),
  tags: z.string().trim().min(1, "Informe pelo menos uma tag."),
  authorName: z.string().trim().min(1, "Informe o autor."),
  coverImageUrl: z.string().trim().optional(),
  publishedAt: z.string().trim().min(1, "Informe a data de publicação."),
});

export type ArticleFormInput = z.infer<typeof articleFormSchema>;

export function parseTags(tags: string): string[] {
  return Array.from(
    new Set(
      tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
    )
  );
}
