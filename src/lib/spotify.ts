let cachedToken: { value: string; expiresAt: number } | null = null;

export function isSpotifyConfigured() {
  return !!(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

async function getAccessToken(): Promise<string | null> {
  if (!isSpotifyConfigured()) return null;
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const credentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) return null;

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export type SpotifySearchResult = {
  id: string;
  name: string;
  subtitle: string;
};

export async function searchSpotifyCatalog(
  query: string,
  type: "artist" | "track"
): Promise<SpotifySearchResult[]> {
  const token = await getAccessToken();
  if (!token || !query.trim()) return [];

  const params = new URLSearchParams({ q: query, type, limit: "8" });
  const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return [];

  const data = await response.json();

  if (type === "artist") {
    return (data.artists?.items ?? []).map((artist: { id: string; name: string }) => ({
      id: artist.id,
      name: artist.name,
      subtitle: "Artista",
    }));
  }

  return (data.tracks?.items ?? []).map(
    (track: { id: string; name: string; artists: { name: string }[] }) => ({
      id: track.id,
      name: track.name,
      subtitle: track.artists.map((a) => a.name).join(", "),
    })
  );
}
