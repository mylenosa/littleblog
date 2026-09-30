"use server";

import { isSpotifyConfigured, searchSpotifyCatalog, type SpotifySearchResult } from "@/lib/spotify";

export async function searchMusicCatalog(
  query: string,
  type: "artist" | "track"
): Promise<{ configured: boolean; results: SpotifySearchResult[] }> {
  if (!isSpotifyConfigured()) return { configured: false, results: [] };
  if (query.trim().length < 2) return { configured: true, results: [] };

  const results = await searchSpotifyCatalog(query, type);
  return { configured: true, results };
}
