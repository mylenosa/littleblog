"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  articleSlug,
  initialFavorited,
  isLoggedIn,
}: {
  articleSlug: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href="/login" />}
      >
        <Heart aria-hidden="true" /> Favoritar
      </Button>
    );
  }

  function handleClick() {
    const next = !favorited;
    setFavorited(next);
    startTransition(async () => {
      const result = await toggleFavorite(articleSlug, favorited);
      if (!result.success) {
        setFavorited(!next);
        toast.error(result.message);
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      aria-pressed={favorited}
      onClick={handleClick}
    >
      <Heart
        aria-hidden="true"
        className={cn(favorited && "fill-spotlight text-spotlight")}
      />
      {favorited ? "Favoritado" : "Favoritar"}
    </Button>
  );
}
