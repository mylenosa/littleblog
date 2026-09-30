const RESERVED_USERNAMES = new Set([
  "admin",
  "login",
  "cadastro",
  "sobre",
  "contato",
  "tags",
  "busca",
  "artigos",
  "perfil",
  "favoritos",
  "usuarios",
  "api",
  "quarto",
]);

export function isReservedUsername(username: string): boolean {
  return RESERVED_USERNAMES.has(username.toLowerCase());
}
