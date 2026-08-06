import Link from "next/link";
import { Heart, LayoutDashboard, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/actions/auth";
import type { AuthState } from "@/lib/supabase/auth-state";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserMenu({ user, profile }: AuthState) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/login" />}
        >
          Entrar
        </Button>
        <Button size="sm" nativeButton={false} render={<Link href="/cadastro" />}>
          Cadastrar
        </Button>
      </div>
    );
  }

  const displayName = profile?.fullName || user.email || "Perfil";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Menu do usuário"
          />
        }
      >
        <Avatar className="size-8">
          <AvatarFallback>{initials(displayName)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="truncate px-1.5 py-1 text-xs font-medium text-muted-foreground">
          {displayName}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/perfil" />}>
          <User /> Perfil
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/favoritos" />}>
          <Heart /> Favoritos
        </DropdownMenuItem>
        {profile?.isEditor && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <LayoutDashboard /> Painel admin
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          render={
            <form action={signOut} className="w-full">
              <button type="submit" className="flex w-full items-center gap-2">
                <LogOut /> Sair
              </button>
            </form>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
