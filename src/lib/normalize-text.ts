const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

export function normalizeText(value: string) {
  return value.normalize("NFD").replace(DIACRITICS_PATTERN, "").toLowerCase();
}
