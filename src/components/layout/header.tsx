import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserMenu } from "@/components/layout/user-menu";
import { getAuthState } from "@/lib/supabase/auth-state";

const NAV_LINKS = [
  { href: "/tags", label: "Tags" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export async function Header() {
  const { user, profile } = await getAuthState();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="shrink-0 rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          [Nome do Blog]
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden flex-1 items-center gap-1 lg:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<Link href="/busca" aria-label="Buscar artigos" />}
          >
            <Search aria-hidden="true" />
          </Button>
          <ThemeToggle />
          <div className="hidden sm:block">
            <UserMenu user={user} profile={profile} />
          </div>
          <MobileNav links={NAV_LINKS} user={user} profile={profile} />
        </div>
      </div>
    </header>
  );
}
