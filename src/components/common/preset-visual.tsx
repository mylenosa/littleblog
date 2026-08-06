import { cn } from "@/lib/utils";
import { findPreset } from "@/lib/constants/image-presets";

export function PresetVisual({
  presetId,
  shape = "card",
  className,
}: {
  presetId: string;
  shape?: "card" | "circle";
  className?: string;
}) {
  const preset = findPreset(presetId);
  if (!preset) return null;

  const Icon = preset.icon;
  const gradient =
    preset.tone === "primary"
      ? "from-primary/20 via-secondary to-spotlight/10"
      : "from-spotlight/20 via-secondary to-primary/10";

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        shape === "circle" ? "aspect-square rounded-full" : "aspect-video rounded-lg",
        className
      )}
      aria-hidden="true"
    >
      <Icon
        className={shape === "circle" ? "size-1/2 text-foreground/40" : "size-14 text-foreground/25"}
        strokeWidth={1.25}
      />
    </div>
  );
}
