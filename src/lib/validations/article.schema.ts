import { z } from "zod";

export const articleFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  author: z.string().min(1),
  publishedAt: z.string().min(1),
  coverImage: z.string().optional(),
  featured: z.boolean().optional().default(false),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;
