import { z } from "zod";
import { isPresetValue } from "@/lib/constants/image-presets";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome."),
  bio: z.string().trim().max(280, "Máximo de 280 caracteres.").optional(),
  avatarUrl: z
    .union([
      z.string().trim().url("Informe uma URL válida."),
      z.string().trim().refine(isPresetValue),
      z.literal(""),
    ])
    .optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
