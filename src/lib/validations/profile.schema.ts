import { z } from "zod";
import { isPresetValue } from "@/lib/constants/image-presets";
import { isReservedUsername } from "@/lib/constants/reserved-usernames";

const urlOrEmpty = z
  .union([z.string().trim().url("Informe uma URL válida."), z.literal("")])
  .optional();

export const profileLinkSchema = z.object({
  platform: z.enum([
    "spotify",
    "instagram",
    "x",
    "tiktok",
    "youtube",
    "lastfm",
    "outro",
  ]),
  url: z.string().trim().url("Informe uma URL válida."),
});

export type ProfileLinkInput = z.infer<typeof profileLinkSchema>;

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Informe seu nome."),
  bio: z.string().trim().max(500, "Máximo de 500 caracteres.").optional(),
  avatarUrl: z
    .union([
      z.string().trim().url("Informe uma URL válida."),
      z.string().trim().refine(isPresetValue),
      z.literal(""),
    ])
    .optional(),
  username: z
    .union([
      z
        .string()
        .trim()
        .toLowerCase()
        .regex(
          /^[a-z0-9_]{3,20}$/,
          "Use 3 a 20 letras minúsculas, números ou _."
        )
        .refine((value) => !isReservedUsername(value), {
          message: "Esse nome de usuário não está disponível.",
        }),
      z.literal(""),
    ])
    .optional(),
  isPublic: z.boolean(),
  backgroundStyle: z.enum([
    "solido",
    "gradiente_azul",
    "tileado_spacehey",
    "grunge_tumblr",
  ]),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Escolha uma cor válida."),
  buttonStyle: z.enum(["bevel", "glossy", "grunge"]),
  backgroundImageUrl: urlOrEmpty,
  topArtist: z.string().trim().max(80, "Máximo de 80 caracteres.").optional(),
  topArtistSpotifyId: z.string().trim().optional(),
  topTrack: z.string().trim().max(80, "Máximo de 80 caracteres.").optional(),
  topTrackSpotifyId: z.string().trim().optional(),
  status: z.string().trim().max(40, "Máximo de 40 caracteres.").optional(),
  links: z.array(profileLinkSchema).max(12, "No máximo 12 links."),
});

export type ProfileInput = z.infer<typeof profileSchema>;
