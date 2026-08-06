"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { profileSchema, type ProfileInput } from "@/lib/validations/profile.schema";
import { updateProfile } from "@/lib/actions/profile";

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
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const avatarUrl = watch("avatarUrl");
  const fullName = watch("fullName");

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
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
