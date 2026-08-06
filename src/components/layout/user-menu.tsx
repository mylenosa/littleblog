import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UserMenu() {
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
