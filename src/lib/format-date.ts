const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00`));
}
