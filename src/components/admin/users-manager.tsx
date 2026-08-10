"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format-date";
import { normalizeText } from "@/lib/normalize-text";
import { setCanComment, setEditorStatus } from "@/lib/actions/admin";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  isEditor: boolean;
  canComment: boolean;
  createdAt: string;
};

export function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [query, setQuery] = useState("");
  const [editorState, setEditorState] = useState(
    Object.fromEntries(users.map((u) => [u.id, u.isEditor]))
  );
  const [canCommentState, setCanCommentState] = useState(
    Object.fromEntries(users.map((u) => [u.id, u.canComment]))
  );
  const [isPending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    if (!normalizedQuery) return users;

    return users.filter((user) => {
      const haystack = normalizeText(`${user.fullName ?? ""} ${user.email}`);
      return haystack.includes(normalizedQuery);
    });
  }, [users, query]);

  function handleToggleEditor(userId: string) {
    const next = !editorState[userId];
    setEditorState((prev) => ({ ...prev, [userId]: next }));

    startTransition(async () => {
      const result = await setEditorStatus(userId, next);
      if (!result.success) {
        setEditorState((prev) => ({ ...prev, [userId]: !next }));
        toast.error(result.message);
      } else {
        toast.success(next ? "Agora é editor." : "Deixou de ser editor.");
      }
    });
  }

  function handleToggleCanComment(userId: string) {
    const next = !canCommentState[userId];
    setCanCommentState((prev) => ({ ...prev, [userId]: next }));

    startTransition(async () => {
      const result = await setCanComment(userId, next);
      if (!result.success) {
        setCanCommentState((prev) => ({ ...prev, [userId]: !next }));
        toast.error(result.message);
      } else {
        toast.success(next ? "Comentários liberados." : "Comentários bloqueados.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          aria-label="Buscar usuários"
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{user.fullName || "Sem nome"}</span>
                {editorState[user.id] && <Badge variant="secondary">Editor</Badge>}
                {!canCommentState[user.id] && (
                  <Badge variant="destructive">Bloqueado</Badge>
                )}
                {user.id === currentUserId && (
                  <Badge variant="outline">Você</Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <span className="text-xs text-muted-foreground">
                Cadastrado em {formatDate(user.createdAt.slice(0, 10))}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant={canCommentState[user.id] ? "outline" : "default"}
                size="sm"
                disabled={isPending || user.id === currentUserId}
                onClick={() => handleToggleCanComment(user.id)}
              >
                {canCommentState[user.id] ? "Bloquear comentários" : "Desbloquear"}
              </Button>
              <Button
                type="button"
                variant={editorState[user.id] ? "outline" : "default"}
                size="sm"
                disabled={isPending || user.id === currentUserId}
                onClick={() => handleToggleEditor(user.id)}
              >
                {editorState[user.id] ? "Remover acesso de editor" : "Tornar editor"}
              </Button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum usuário encontrado para &quot;{query}&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
