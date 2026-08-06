import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com a equipe do blog.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Contato</h1>
      <p className="mb-8 text-muted-foreground">
        Erros, sugestões de pauta ou só uma mensagem — a gente lê tudo.
      </p>
      <ContactForm />
    </div>
  );
}
