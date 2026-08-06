"use client";

import { IMAGE_PRESETS } from "@/lib/constants/image-presets";
import { PresetVisual } from "@/components/common/preset-visual";
import { cn } from "@/lib/utils";

export function PresetPicker({
  value,
  onSelect,
  shape = "card",
}: {
  value?: string;
  onSelect: (presetId: string) => void;
  shape?: "card" | "circle";
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        shape === "circle" ? "grid-cols-8 sm:grid-cols-8" : "grid-cols-4 sm:grid-cols-8"
      )}
    >
      {IMAGE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset.id)}
          aria-label={`Usar imagem padrão ${preset.id}`}
          aria-pressed={value === preset.id}
          className={cn(
            "rounded-lg outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
            value === preset.id
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
              : "opacity-70 hover:opacity-100"
          )}
        >
          <PresetVisual presetId={preset.id} shape={shape} />
        </button>
      ))}
    </div>
  );
}
