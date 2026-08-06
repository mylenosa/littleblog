"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";
import { setEditorStatus } from "@/lib/actions/admin";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string | null;
  isEditor: boolean;
  createdAt: string;
};

export function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  const [state, setState] = useState(
    Object.fromEntries(users.map((u) => [u.id, u.isEditor]))
  );
  const [isPending, startTransition] = useTransition();

  function handleToggle(userId: string) {
    const next = !state[userId];
    setState((prev) => ({ ...prev, [userId]: next }));

    startTransition(async () => {
      const result = await setEditorStatus(userId, next);
      if (!result.success) {
        setState((prev) => ({ ...prev, [userId]: !next }));
        toast.error(result.message);
      } else {
        toast.success(next ? "Agora é editor." : "Deixou de ser editor.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{user.fullName || "Sem nome"}</span>
              {state[user.id] && <Badge variant="secondary">Editor</Badge>}
              {user.id === currentUserId && (
                <Badge variant="outline">Você</Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <span className="text-xs text-muted-foreground">
              Cadastrado em {formatDate(user.createdAt.slice(0, 10))}
            </span>
          </div>
          <Button
            type="button"
            variant={state[user.id] ? "outline" : "default"}
            size="sm"
            disabled={isPending || user.id === currentUserId}
            onClick={() => handleToggle(user.id)}
          >
            {state[user.id] ? "Remover acesso de editor" : "Tornar editor"}
          </Button>
        </div>
      ))}
    </div>
  );
}
