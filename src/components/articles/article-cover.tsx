import Image from "next/image";
import { Disc3, Music2, Radio, Waves } from "lucide-react";
import { PresetVisual } from "@/components/common/preset-visual";
import { isPresetValue, presetIdFromValue } from "@/lib/constants/image-presets";

const ICONS = [Disc3, Music2, Radio, Waves];

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function ArticleCover({
  slug,
  src,
  alt,
  className,
}: {
  slug: string;
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  if (src && isPresetValue(src)) {
    return (
      <PresetVisual presetId={presetIdFromValue(src)} shape="card" className={className} />
    );
  }

  if (src) {
    return (
      <div
        className={`relative aspect-video overflow-hidden rounded-lg bg-secondary ${
          className ?? ""
        }`}
      >
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
    );
  }

  const hash = hashSlug(slug);
  const Icon = ICONS[hash % ICONS.length];
  const flipped = hash % 2 === 0;

  return (
    <div
      className={`relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${
        flipped
          ? "from-primary/15 via-secondary to-spotlight/10"
          : "from-spotlight/10 via-secondary to-primary/15"
      } ${className ?? ""}`}
      aria-hidden="true"
    >
      <Icon className="size-14 text-foreground/15" strokeWidth={1.25} />
    </div>
  );
}
