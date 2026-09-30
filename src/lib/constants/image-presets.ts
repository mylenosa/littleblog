import {
  BoomBox,
  CassetteTape,
  Crown,
  Disc3,
  DiscAlbum,
  Gem,
  Guitar,
  Headphones,
  Mic2,
  Music2,
  PartyPopper,
  PlayCircle,
  Radio,
  Sparkles,
  Videotape,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const PRESET_PREFIX = "preset:";

export type PresetTone = "primary" | "spotlight";

export type ImagePreset = {
  id: string;
  icon: LucideIcon;
  tone: PresetTone;
};

export const IMAGE_PRESETS: ImagePreset[] = [
  { id: "disc3-primary", icon: Disc3, tone: "primary" },
  { id: "music2-spotlight", icon: Music2, tone: "spotlight" },
  { id: "radio-spotlight", icon: Radio, tone: "primary" },
  { id: "waves-primary", icon: Waves, tone: "spotlight" },
  { id: "mic2-spotlight", icon: Mic2, tone: "primary" },
  { id: "headphones-primary", icon: Headphones, tone: "spotlight" },
  { id: "guitar-spotlight", icon: Guitar, tone: "primary" },
  { id: "play-primary", icon: PlayCircle, tone: "spotlight" },
];

export const AVATAR_PRESETS: ImagePreset[] = [
  { id: "cassette-primary", icon: CassetteTape, tone: "primary" },
  { id: "boombox-spotlight", icon: BoomBox, tone: "spotlight" },
  { id: "discalbum-primary", icon: DiscAlbum, tone: "spotlight" },
  { id: "videotape-spotlight", icon: Videotape, tone: "primary" },
  { id: "party-primary", icon: PartyPopper, tone: "spotlight" },
  { id: "sparkles-spotlight", icon: Sparkles, tone: "primary" },
  { id: "gem-primary", icon: Gem, tone: "spotlight" },
  { id: "crown-spotlight", icon: Crown, tone: "primary" },
];

export function findPreset(id: string) {
  return (
    IMAGE_PRESETS.find((preset) => preset.id === id) ??
    AVATAR_PRESETS.find((preset) => preset.id === id)
  );
}

export function isPresetValue(value: string | null | undefined) {
  return !!value?.startsWith(PRESET_PREFIX);
}

export function presetIdFromValue(value: string) {
  return value.slice(PRESET_PREFIX.length);
}

export function presetValueFromId(id: string) {
  return `${PRESET_PREFIX}${id}`;
}
