const BLOG_TIMEZONE = "America/Sao_Paulo";

function getTimeZoneParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BLOG_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour") % 24,
    minute: get("minute"),
  };
}

/** Formats a UTC ISO timestamp as a "YYYY-MM-DDTHH:mm" string in the blog's timezone (Brasília). */
export function isoToDatetimeLocal(iso: string): string {
  const { year, month, day, hour, minute } = getTimeZoneParts(new Date(iso));
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
}

/** Interprets a "YYYY-MM-DDTHH:mm" string as the blog's timezone (Brasília) and returns the matching UTC ISO timestamp. */
export function datetimeLocalToIso(value: string): string {
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Treat the wall-clock value as if it were UTC, then measure how far off
  // the blog's timezone renders that same instant, and correct by the gap.
  // This stays correct even if the timezone's UTC offset ever changes.
  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute);
  const rendered = getTimeZoneParts(new Date(naiveUtc));
  const renderedAsUtc = Date.UTC(
    rendered.year,
    rendered.month - 1,
    rendered.day,
    rendered.hour,
    rendered.minute
  );
  const offset = renderedAsUtc - naiveUtc;

  return new Date(naiveUtc - offset).toISOString();
}
