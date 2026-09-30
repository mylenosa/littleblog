import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileLinksList } from "@/components/profile/profile-links-list";
import { formatDate } from "@/lib/format-date";
import type { ButtonStyle } from "@/lib/constants/profile-themes";
import type { PublicProfileLink } from "@/lib/queries/profile";
import { initials } from "@/lib/initials";

export function ProfileSidebar({
  fullName,
  username,
  avatarUrl,
  buttonStyle,
  topArtist,
  topTrack,
  links,
  viewCount,
  updatedAt,
  editHref,
}: {
  fullName: string;
  username: string;
  avatarUrl?: string | null;
  buttonStyle: ButtonStyle;
  topArtist?: string | null;
  topTrack?: string | null;
  links: PublicProfileLink[];
  viewCount?: number;
  updatedAt?: string;
  editHref?: string;
}) {
  const nowPlaying = [topArtist, topTrack].filter(Boolean).join(" — ");

  return (
    <div className="flex h-full flex-col">
      <Avatar size="lg" className="size-20">
        <AvatarImage src={avatarUrl ?? undefined} alt="" />
        <AvatarFallback>{initials(fullName)}</AvatarFallback>
      </Avatar>
      <h1 className="mt-3 text-xl font-bold">{fullName}</h1>
      <p className="text-sm text-neutral-500">@{username}</p>

      {editHref && (
        <Link
          href={editHref}
          className="mt-3 self-start rounded-sm border-2 border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Editar perfil
        </Link>
      )}

      {nowPlaying && (
        <div
          className="mt-4 min-w-0 overflow-hidden whitespace-nowrap rounded-sm border border-dashed border-black/15 bg-black/5 py-1.5"
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

      <div className="mt-4">
        <ProfileLinksList links={links} buttonStyle={buttonStyle} vertical />
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-dashed border-black/15 pt-3 text-xs text-neutral-500">
        {viewCount !== undefined && updatedAt && (
          <>
            <span>Visitante nº {viewCount.toLocaleString("pt-BR")}</span>
            <span>Visto por último em {formatDate(updatedAt)}</span>
          </>
        )}
      </div>
    </div>
  );
}
