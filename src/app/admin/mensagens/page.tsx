import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format-date";

export const metadata: Metadata = {
  title: "Mensagens",
};

export default async function MensagensPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, subject, message, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Mensagens</h1>
      <p className="mb-8 text-muted-foreground">
        Mensagens enviadas pelo formulário de contato.
      </p>

      {!messages || messages.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((message) => (
            <div key={message.id} className="rounded-lg border border-border p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium">{message.name}</span>{" "}
                  <span className="text-sm text-muted-foreground">
                    &lt;{message.email}&gt;
                  </span>
                </div>
                <time
                  dateTime={message.created_at}
                  className="text-xs text-muted-foreground"
                >
                  {formatDate(message.created_at.slice(0, 10))}
                </time>
              </div>
              <p className="mb-1 text-sm font-medium">{message.subject}</p>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {message.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
