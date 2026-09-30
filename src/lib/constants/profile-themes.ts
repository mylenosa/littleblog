export const BACKGROUND_STYLES = [
  { id: "solido", label: "Sólido" },
  { id: "gradiente_azul", label: "Gradiente" },
  { id: "tileado_spacehey", label: "Pontilhado" },
  { id: "grunge_tumblr", label: "Textura escura" },
] as const;

export type BackgroundStyle = (typeof BACKGROUND_STYLES)[number]["id"];

export const BACKGROUND_STYLE_CLASSES: Record<BackgroundStyle, string> = {
  solido: "bg-[color:var(--profile-accent)]/10",
  gradiente_azul:
    "bg-gradient-to-b from-[color:var(--profile-accent)]/30 via-white to-[color:var(--profile-accent)]/10",
  tileado_spacehey:
    "bg-[radial-gradient(circle,_color-mix(in_srgb,_var(--profile-accent)_35%,_transparent)_2px,_transparent_2px)] [background-size:16px_16px] bg-white",
  grunge_tumblr: "bg-neutral-900 bg-[url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2740%27 height=%2740%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27/%3E%3C/filter%3E%3Crect width=%2740%27 height=%2740%27 filter=%27url(%23n)%27 opacity=%270.08%27/%3E%3C/svg%3E')]",
};

// Tratamento mais opaco/saturado que BACKGROUND_STYLE_CLASSES, pensado pra
// uma faixa pequena (banner) que precisa ficar sempre visivelmente diferente
// do fundo da página atrás dela — os estilos "fracos" (solido, gradiente)
// ficariam parecendo transparentes se reusassem a classe do fundo da página.
export const BANNER_STYLE_CLASSES: Record<BackgroundStyle, string> = {
  solido: "bg-[color-mix(in_srgb,var(--profile-accent)_45%,white)]",
  gradiente_azul:
    "bg-gradient-to-r from-[color-mix(in_srgb,var(--profile-accent)_75%,white)] to-[color-mix(in_srgb,var(--profile-accent)_35%,white)]",
  tileado_spacehey:
    "bg-[radial-gradient(circle,_color-mix(in_srgb,_var(--profile-accent)_45%,_transparent)_2px,_transparent_2px)] [background-size:16px_16px] bg-[color-mix(in_srgb,var(--profile-accent)_18%,white)]",
  grunge_tumblr: BACKGROUND_STYLE_CLASSES.grunge_tumblr,
};

export const BUTTON_STYLES = [
  { id: "bevel", label: "Biselado" },
  { id: "glossy", label: "Brilhante" },
  { id: "grunge", label: "Fosco" },
] as const;

export type ButtonStyle = (typeof BUTTON_STYLES)[number]["id"];

export const BUTTON_STYLE_CLASSES: Record<ButtonStyle, string> = {
  bevel:
    "border-t-2 border-l-2 border-white/70 border-b-2 border-r-2 border-black/30 rounded-sm shadow-sm",
  glossy:
    "rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_2px_4px_rgba(0,0,0,0.25)]",
  grunge: "rounded-none border border-white/20 shadow-none",
};

export const LINK_PLATFORMS = [
  { id: "spotify", label: "Spotify" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X (Twitter)" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
  { id: "lastfm", label: "Last.fm" },
  { id: "outro", label: "Outro" },
] as const;

export type LinkPlatform = (typeof LINK_PLATFORMS)[number]["id"];
