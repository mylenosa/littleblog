"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchMusicCatalog } from "@/lib/actions/music-search";
import type { SpotifySearchResult } from "@/lib/spotify";

export function MusicSearchInput({
  id,
  type,
  value,
  onChange,
  placeholder,
  "aria-invalid": ariaInvalid,
}: {
  id: string;
  type: "artist" | "track";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-invalid"?: boolean;
}) {
  const [results, setResults] = useState<SpotifySearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [configured, setConfigured] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!configured || value.trim().length < 2) {
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      const response = await searchMusicCatalog(value, type);
      if (cancelled) return;
      setConfigured(response.configured);
      setResults(response.results);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [value, type, configured]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        value={value}
        autoComplete="off"
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {configured && isOpen && value.trim().length >= 2 && results.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-input bg-popover shadow-md">
          {results.map((result) => (
            <li key={result.id}>
              <button
                type="button"
                className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-accent"
                onClick={() => {
                  onChange(result.name);
                  setIsOpen(false);
                }}
              >
                <span className="font-medium">{result.name}</span>
                <span className="text-xs text-muted-foreground">{result.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
