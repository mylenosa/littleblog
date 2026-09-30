import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileBio } from "@/components/profile/profile-bio";
import { ProfileLinksList } from "@/components/profile/profile-links-list";
import { formatDate } from "@/lib/format-date";
import {
  BACKGROUND_STYLE_CLASSES,
  type BackgroundStyle,
  type ButtonStyle,
} from "@/lib/constants/profile-themes";
import type { PublicProfileLink } from "@/lib/queries/profile";
import { initials } from "@/lib/initials";

function cursorStyle(color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='6' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 10, auto`;
}

export function ProfileCard({
  fullName,
  username,
  bio,
  avatarUrl,
  backgroundStyle,
  accentColor,
  buttonStyle,
  backgroundImageUrl,
  topArtist,
  topTrack,
  links,
  viewCount,
  updatedAt,
  editHref,
}: {
  fullName: string;
  username: string;
  bio?: string | null;
  avatarUrl?: string | null;
  backgroundStyle: BackgroundStyle;
  accentColor: string;
  buttonStyle: ButtonStyle;
  backgroundImageUrl?: string | null;
  topArtist?: string | null;
  topTrack?: string | null;
  links: PublicProfileLink[];
  viewCount?: number;
  updatedAt?: string;
  editHref?: string;
}) {
  const nowPlaying = [topArtist, topTrack].filter(Boolean).join(" — ");

  return (
    <div
      className={`rounded-lg p-4 sm:p-6 ${BACKGROUND_STYLE_CLASSES[backgroundStyle]}`}
      style={
        {
          "--profile-accent": accentColor,
          cursor: cursorStyle(accentColor),
          ...(backgroundImageUrl
            ? {
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        } as React.CSSProperties
      }
    >
      <div className="rounded-sm border-2 border-black/10 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-20">
              <AvatarImage src={avatarUrl ?? undefined} alt="" />
              <AvatarFallback>{initials(fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{fullName}</h1>
              <p className="text-sm text-neutral-500">@{username}</p>
            </div>
          </div>
          {editHref && (
            <Link
              href={editHref}
              className="shrink-0 rounded-sm border-2 border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Editar perfil
            </Link>
          )}
        </div>

        {nowPlaying && (
          <div
            className="mt-4 overflow-hidden whitespace-nowrap rounded-sm border border-dashed border-black/15 bg-black/5 py-1.5"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div className="inline-flex animate-[profile-marquee_14s_linear_infinite] gap-12 text-xs font-medium text-neutral-700">
              <span>🎧 Ouvindo: {nowPlaying}</span>
              <span aria-hidden="true">🎧 Ouvindo: {nowPlaying}</span>
            </div>
          </div>
        )}

        {bio && (
          <div className="mt-4">
            <ProfileBio bio={bio} />
          </div>
        )}

        <div className="mt-4">
          <ProfileLinksList links={links} buttonStyle={buttonStyle} />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-dashed border-black/15 pt-3 text-xs text-neutral-500">
          {viewCount !== undefined && updatedAt ? (
            <>
              <span>Você é o visitante nº {viewCount.toLocaleString("pt-BR")}</span>
              <span>Visto por último em {formatDate(updatedAt)}</span>
            </>
          ) : (
            <span>Pré-visualização ao vivo</span>
          )}
        </div>
      </div>
    </div>
  );
}
