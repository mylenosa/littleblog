import type { Metadata } from "next";
import Link from "next/link";
import { FileText, MessageSquare, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getAllArticles } from "@/lib/queries/articles";

export const metadata: Metadata = {
  title: "Painel admin",
};

export default async function AdminPage() {
  const supabase = await createClient();

  const [articles, { count: userCount }, { count: messageCount }] = await Promise.all([
    getAllArticles(),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      href: "/admin/artigos",
      label: "Artigos",
      value: articles.length,
      icon: FileText,
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      value: userCount ?? 0,
      icon: Users,
    },
    {
      href: "/admin/mensagens",
      label: "Mensagens",
      value: messageCount ?? 0,
      icon: MessageSquare,
    },
  ];

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Painel admin</h1>
      <p className="mb-8 text-muted-foreground">
        Visão geral do blog. Escolha uma seção pra gerenciar.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-3 rounded-lg border border-border p-5 transition-colors hover:border-primary hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <card.icon className="size-5 text-primary" aria-hidden="true" />
            <div>
              <p className="text-2xl font-semibold tracking-tight">{card.value}</p>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
