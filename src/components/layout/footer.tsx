import Link from "next/link";
import { Music2 } from "lucide-react";
import { InstagramIcon, XIcon, YoutubeIcon } from "@/components/icons/social-icons";

const SOCIAL_LINKS = [
  { href: "#", label: "Instagram", Icon: InstagramIcon },
  { href: "#", label: "X (Twitter)", Icon: XIcon },
  { href: "#", label: "YouTube", Icon: YoutubeIcon },
  { href: "#", label: "Spotify", Icon: Music2 },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="text-lg font-semibold tracking-tight">
            Quarto
          </span>
          <p className="max-w-xs text-sm text-muted-foreground">
            Notícias, shows, festivais e lançamentos para quem vive de
            música.
          </p>
          <div className="flex gap-1">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <Icon className="size-4" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>

        <nav aria-label="Explorar" className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-foreground">Explorar</h2>
          <ul className="flex flex-col gap-1.5">
            <li>
              <Link
                href="/tags"
                className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
              >
                Tags
              </Link>
            </li>
            <li>
              <Link
                href="/busca"
                className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
              >
                Busca
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Institucional" className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-foreground">Institucional</h2>
          <ul className="flex flex-col gap-1.5">
            <li>
              <Link
                href="/sobre"
                className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/contato"
                className="text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {year} Quarto. Todos os direitos reservados.
      </div>
    </footer>
  );
}
