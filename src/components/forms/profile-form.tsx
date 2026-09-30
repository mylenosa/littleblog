"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageDropzone } from "@/components/common/image-dropzone";
import { PresetPicker } from "@/components/common/preset-picker";
import { PresetVisual } from "@/components/common/preset-visual";
import { MusicSearchInput } from "@/components/forms/music-search-input";
import {
  AVATAR_PRESETS,
  isPresetValue,
  presetIdFromValue,
  presetValueFromId,
} from "@/lib/constants/image-presets";
import {
  BACKGROUND_STYLES,
  BACKGROUND_STYLE_CLASSES,
  BUTTON_STYLES,
  BUTTON_STYLE_CLASSES,
  LINK_PLATFORMS,
} from "@/lib/constants/profile-themes";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile.schema";
import { updateProfile } from "@/lib/actions/profile";
import { initials } from "@/lib/initials";
import { resizeImage } from "@/lib/resize-image";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slugify";

const BIO_MAX_LENGTH = 500;

const selectClassName =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function initialAvatarTab(avatarUrl: string): "upload" | "link" | "icone" {
  if (avatarUrl && isPresetValue(avatarUrl)) return "icone";
  if (avatarUrl) return "link";
  return "upload";
}

export function ProfileForm({
  defaultValues,
}: {
  defaultValues: ProfileInput;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({ control, name: "links" });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarTab, setAvatarTab] = useState<"upload" | "link" | "icone">(() =>
    initialAvatarTab(defaultValues.avatarUrl ?? "")
  );

  const avatarUrl = watch("avatarUrl");
  const fullName = watch("fullName");
  const bio = watch("bio");
  const accentColor = watch("accentColor");
  const backgroundStyle = watch("backgroundStyle");
  const buttonStyle = watch("buttonStyle");
  const topArtist = watch("topArtist");
  const topTrack = watch("topTrack");

  async function handleAvatarUpload(file: File) {
    setIsUploadingAvatar(true);
    try {
      const {
        data: { user },
      } = await createClient().auth.getUser();
      if (!user) throw new Error("not authenticated");

      const resized = await resizeImage(file);
      const path = `${user.id}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.webp`;

      const supabase = createClient();
      const { error } = await supabase.storage.from("avatars").upload(path, resized, {
        contentType: "image/webp",
      });

      if (error) {
        toast.error("Não foi possível enviar a imagem.");
        return;
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setValue("avatarUrl", data.publicUrl, { shouldDirty: true });
    } catch {
      toast.error("Não foi possível processar a imagem.");
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  async function onSubmit(data: ProfileInput) {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success("Perfil atualizado.");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName">Nome</Label>
        <Input
          id="fullName"
          autoComplete="name"
          aria-invalid={!!errors.fullName}
          {...register("fullName")}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">Nome de usuário</Label>
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">/</span>
          <Input
            id="username"
            placeholder="seu_nome"
            aria-invalid={!!errors.username}
            {...register("username")}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Trocar o nome de usuário depois quebra links antigos pro seu perfil.
        </p>
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-0.5" {...register("isPublic")} />
        <span>
          <span className="font-medium">Perfil visível publicamente</span>
          <br />
          <span className="text-xs text-muted-foreground">
            Se desligar, ninguém consegue abrir seu perfil pelo link nem pelos
            comentários (seu nome continua aparecendo, só não vira link).
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-2">
        <Label>Avatar</Label>
        <div className="flex items-center gap-3">
          {avatarUrl && isPresetValue(avatarUrl) ? (
            <PresetVisual presetId={presetIdFromValue(avatarUrl)} shape="circle" className="size-14" />
          ) : (
            <Avatar size="lg">
              <AvatarImage src={avatarUrl || undefined} alt="" />
              <AvatarFallback>{initials(fullName || "?")}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-sm text-muted-foreground">
            Prévia do avatar atual
          </span>
        </div>

        <Tabs value={avatarTab} onValueChange={setAvatarTab}>
          <TabsList>
            <TabsTrigger value="upload">Enviar foto</TabsTrigger>
            <TabsTrigger value="link">Colar link</TabsTrigger>
            <TabsTrigger value="icone">Escolher ícone</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-3">
            <ImageDropzone
              className="size-32"
              uploading={isUploadingAvatar}
              hasValue={!!avatarUrl && !isPresetValue(avatarUrl)}
              preview={
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt=""
                  className="size-full rounded-full object-cover"
                />
              }
              onFile={handleAvatarUpload}
              onClear={() => setValue("avatarUrl", "", { shouldDirty: true })}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              A imagem é redimensionada automaticamente (até 256×256).
            </p>
          </TabsContent>

          <TabsContent value="link" className="mt-3">
            <Input
              id="avatarUrl"
              type="url"
              placeholder="cole a URL de uma imagem"
              aria-invalid={!!errors.avatarUrl}
              {...register("avatarUrl")}
            />
            {errors.avatarUrl && (
              <p className="mt-1 text-sm text-destructive">{errors.avatarUrl.message}</p>
            )}
          </TabsContent>

          <TabsContent value="icone" className="mt-3">
            <PresetPicker
              shape="circle"
              presets={AVATAR_PRESETS}
              value={avatarUrl && isPresetValue(avatarUrl) ? presetIdFromValue(avatarUrl) : undefined}
              onSelect={(id) =>
                setValue("avatarUrl", presetValueFromId(id), { shouldDirty: true })
              }
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={7}
          maxLength={BIO_MAX_LENGTH}
          aria-invalid={!!errors.bio}
          {...register("bio")}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Suporta Markdown — cole um link de imagem/GIF pra ilustrar, tipo{" "}
            <code>![legenda](https://...)</code>.
          </span>
          <span className="shrink-0">
            {(bio ?? "").length}/{BIO_MAX_LENGTH}
          </span>
        </div>
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="topArtist">Artista do momento</Label>
          <MusicSearchInput
            id="topArtist"
            type="artist"
            placeholder="ex: Nebulosa Elétrica"
            aria-invalid={!!errors.topArtist}
            value={topArtist ?? ""}
            onChange={(value) => setValue("topArtist", value, { shouldDirty: true })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="topTrack">Música favorita</Label>
          <MusicSearchInput
            id="topTrack"
            type="track"
            placeholder="ex: Constelação"
            aria-invalid={!!errors.topTrack}
            value={topTrack ?? ""}
            onChange={(value) => setValue("topTrack", value, { shouldDirty: true })}
          />
        </div>
      </div>

      <div
        className="rounded-lg border border-dashed border-border p-4"
        style={{ "--profile-accent": accentColor } as React.CSSProperties}
      >
        <h3 className="mb-3 text-sm font-semibold">Aparência do perfil</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Fundo</Label>
            <div className="flex flex-wrap gap-2">
              {BACKGROUND_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    setValue("backgroundStyle", style.id, { shouldDirty: true })
                  }
                  className={`flex flex-col items-center gap-1 rounded-md border-2 p-1 text-xs ${
                    backgroundStyle === style.id
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <span
                    className={`size-10 rounded-sm border border-border ${BACKGROUND_STYLE_CLASSES[style.id]}`}
                    aria-hidden="true"
                  />
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Estilo de botão</Label>
            <div className="flex flex-wrap gap-2">
              {BUTTON_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    setValue("buttonStyle", style.id, { shouldDirty: true })
                  }
                  className={`flex flex-col items-center gap-1 rounded-md border-2 p-1 text-xs ${
                    buttonStyle === style.id ? "border-primary" : "border-transparent"
                  }`}
                >
                  <span
                    className={`flex h-6 w-14 items-center justify-center bg-neutral-400 ${BUTTON_STYLE_CLASSES[style.id]}`}
                    aria-hidden="true"
                  />
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="accentColor">Cor de destaque</Label>
            <div className="flex items-center gap-2">
              <input
                id="accentColor"
                type="color"
                className="size-9 rounded-md border border-input"
                {...register("accentColor")}
              />
              <span className="text-sm text-muted-foreground">{accentColor}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="backgroundImageUrl">Imagem de fundo (opcional)</Label>
            <Input
              id="backgroundImageUrl"
              type="url"
              placeholder="cole a URL de uma imagem"
              aria-invalid={!!errors.backgroundImageUrl}
              {...register("backgroundImageUrl")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Links</Label>
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <select
                className={`${selectClassName} flex-1 sm:w-auto sm:flex-none`}
                {...register(`links.${index}.platform` as const)}
              >
                {LINK_PLATFORMS.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {platform.label}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remover link"
                className="shrink-0 sm:hidden"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="https://..."
                aria-invalid={!!errors.links?.[index]?.url}
                {...register(`links.${index}.url` as const)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remover link"
                className="hidden shrink-0 sm:inline-flex"
                onClick={() => remove(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {errors.links && typeof errors.links.message === "string" && (
          <p className="text-sm text-destructive">{errors.links.message}</p>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          onClick={() => append({ platform: "spotify", url: "" })}
        >
          <Plus className="size-4" /> Adicionar link
        </Button>
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
