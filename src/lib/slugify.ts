import { normalizeText } from "@/lib/normalize-text";

export function slugify(value: string) {
  return normalizeText(value)
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
