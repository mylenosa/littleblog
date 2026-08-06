import Link from "next/link";
import { Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <Music2 className="size-10 text-muted-foreground" aria-hidden="true" />
      <h1 className="text-3xl font-semibold tracking-tight">
        Essa página saiu de cartaz
      </h1>
      <p className="text-muted-foreground">
        O conteúdo que você procura não existe ou foi movido. Que tal voltar
        para a página inicial?
      </p>
      <Button render={<Link href="/" />} nativeButton={false}>
        Voltar para a home
      </Button>
    </div>
  );
}
