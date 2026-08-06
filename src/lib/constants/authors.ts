export const AUTHORS = [
  {
    slug: "clara-mendes",
    name: "Clara Mendes",
    role: "Editora de Notícias",
    bio: "Acompanha a cena musical brasileira há mais de dez anos, com foco em turnês e negócios da música.",
  },
  {
    slug: "diego-farias",
    name: "Diego Farias",
    role: "Repórter de Shows e Festivais",
    bio: "Já cobriu mais de 200 shows ao vivo. Prefere a fila da frente e um bom par de tampões de ouvido.",
  },
  {
    slug: "iasmin-rocha",
    name: "Iasmin Rocha",
    role: "Crítica de Álbuns",
    bio: "Escreve reviews desde a época dos fanzines impressos. Não tem papas na língua.",
  },
  {
    slug: "pedro-almeida",
    name: "Pedro Almeida",
    role: "Colunista de Opinião",
    bio: "Formado em jornalismo, escreve sobre os bastidores e as tensões da indústria musical.",
  },
] as const;

export type AuthorSlug = (typeof AUTHORS)[number]["slug"];

export function getAuthor(slug: string) {
  return AUTHORS.find((a) => a.slug === slug);
}
