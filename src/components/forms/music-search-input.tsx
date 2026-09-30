"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchMusicCatalog } from "@/lib/actions/music-search";
import type { SpotifySearchResult } from "@/lib/spotify";

export function MusicSearchInput({
  id,
  type,
  configured,
  value,
  spotifyId,
  onSelect,
  onClear,
  onFreeTextChange,
  placeholder,
}: {
  id: string;
  type: "artist" | "track";
  configured: boolean;
  value: string;
  spotifyId?: string;
  onSelect: (name: string, spotifyId: string, subtitle: string) => void;
  onClear: () => void;
  onFreeTextChange: (value: string) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifySearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      const response = await searchMusicCatalog(query, type);
      if (!cancelled) setResults(response.results);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, type]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sem Spotify configurado: campo de texto comum, igual antes.
  if (!configured) {
    return (
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onFreeTextChange(event.target.value)}
      />
    );
  }

  // Já tem uma seleção validada: mostra como "chip" fixo + botão de trocar.
  if (spotifyId) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-input bg-muted/50 px-3 py-1.5 text-sm">
        <span className="flex-1 truncate">{value}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-6"
          aria-label="Trocar"
          onClick={onClear}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  // Buscar e selecionar (tipo Instagram) - sem seleção ainda não salva texto livre.
  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        placeholder={placeholder ? `Buscar: ${placeholder}` : "Buscar..."}
        autoComplete="off"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && query.trim().length >= 2 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-input bg-popover shadow-md">
          {results.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Nenhum resultado
            </li>
          ) : (
            results.map((result) => (
              <li key={result.id}>
                <button
                  type="button"
                  className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-accent"
                  onClick={() => {
                    onSelect(result.name, result.id, result.subtitle);
                    setQuery("");
                    setIsOpen(false);
                  }}
                >
                  <span className="font-medium">{result.name}</span>
                  <span className="text-xs text-muted-foreground">{result.subtitle}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
