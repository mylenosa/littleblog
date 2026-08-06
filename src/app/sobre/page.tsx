import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a proposta do blog.",
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Sobre</h1>
      <div className="prose prose-neutral max-w-none dark:prose-invert prose-a:text-primary">
        <p>
          Este é um espaço para quem vive de música — não só para ouvir, mas
          para acompanhar de perto. Aqui você encontra notícias, coberturas
          de shows e festivais, lançamentos, reviews e opiniões sobre a cena
          musical, sempre com um olhar atento a quem está fazendo a música
          acontecer, dos grandes palcos às casas de show de bairro.
        </p>
        <p>
          A ideia nasceu de uma frustração simples: a maior parte da cobertura
          musical por aí é ou rápida demais para significar alguma coisa, ou
          formal demais para soar como uma conversa entre quem realmente
          curte música. Tentamos ficar no meio do caminho — textos com
          cuidado, mas sem academicismo.
        </p>
        <p>
          Todo mundo pode ler tudo por aqui, sem cadastro. Se você criar uma
          conta, também pode comentar, responder outros leitores, favoritar
          artigos para ler depois e manter seu perfil em dia.
        </p>
        <p>
          Encontrou um erro, quer sugerir uma pauta ou só bater um papo sobre
          o que estamos publicando? Fale com a gente pela{" "}
          <a href="/contato">página de contato</a>.
        </p>
      </div>
    </div>
  );
}
