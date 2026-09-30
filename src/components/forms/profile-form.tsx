"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PresetPicker } from "@/components/common/preset-picker";
import { PresetVisual } from "@/components/common/preset-visual";
import {
  isPresetValue,
  presetIdFromValue,
  presetValueFromId,
} from "@/lib/constants/image-presets";
import {
  BACKGROUND_STYLES,
  BUTTON_STYLES,
  LINK_PLATFORMS,
} from "@/lib/constants/profile-themes";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile.schema";
import { updateProfile } from "@/lib/actions/profile";

const selectClassName =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
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

  const avatarUrl = watch("avatarUrl");
  const fullName = watch("fullName");
  const accentColor = watch("accentColor");

  async function onSubmit(data: ProfileInput) {
    const result = await updateProfile(data);
    if (result.success) {
      toast.success("Perfil atualizado.");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
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
          <span className="text-sm text-muted-foreground">/usuarios/</span>
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
          <Input
            id="avatarUrl"
            type="url"
            placeholder="ou cole a URL de uma imagem"
            aria-invalid={!!errors.avatarUrl}
            {...register("avatarUrl")}
          />
        </div>
        {errors.avatarUrl && (
          <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Ou escolha um avatar padrão:
        </p>
        <PresetPicker
          shape="circle"
          value={avatarUrl && isPresetValue(avatarUrl) ? presetIdFromValue(avatarUrl) : undefined}
          onSelect={(id) =>
            setValue("avatarUrl", presetValueFromId(id), { shouldDirty: true })
          }
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" rows={4} aria-invalid={!!errors.bio} {...register("bio")} />
        <p className="text-xs text-muted-foreground">
          Suporta Markdown — cole um link de imagem/GIF pra ilustrar, tipo{" "}
          <code>![legenda](https://...)</code>.
        </p>
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <div className="rounded-lg border border-dashed border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Estilo do perfil (Y2K)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="backgroundStyle">Fundo</Label>
            <select id="backgroundStyle" className={selectClassName} {...register("backgroundStyle")}>
              {BACKGROUND_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="buttonStyle">Estilo de botão</Label>
            <select id="buttonStyle" className={selectClassName} {...register("buttonStyle")}>
              {BUTTON_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
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
          <div key={field.id} className="flex items-center gap-2">
            <select
              className={selectClassName}
              {...register(`links.${index}.platform` as const)}
            >
              {LINK_PLATFORMS.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.label}
                </option>
              ))}
            </select>
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
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
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
