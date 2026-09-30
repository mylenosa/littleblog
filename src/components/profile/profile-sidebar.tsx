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
  status,
  links,
  viewCount,
  updatedAt,
  commentCount,
  editHref,
}: {
  fullName: string;
  username: string;
  avatarUrl?: string | null;
  buttonStyle: ButtonStyle;
  status?: string | null;
  links: PublicProfileLink[];
  viewCount?: number;
  updatedAt?: string;
  commentCount?: number;
  editHref?: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <Avatar
        className="-mt-20 size-28 border-4 border-photo-border shadow-md"
      >
        <AvatarImage src={avatarUrl ?? undefined} alt="" />
        <AvatarFallback>{initials(fullName)}</AvatarFallback>
      </Avatar>
      <h1 className="mt-3 text-xl font-bold">{fullName}</h1>
      <p className="text-sm text-neutral-500">@{username}</p>
      {status && (
        <p className="mt-1 text-xs italic text-neutral-500">{status}</p>
      )}

      {editHref && (
        <Link
          href={editHref}
          className="mt-3 self-start rounded-sm border-2 border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Editar perfil
        </Link>
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
        {commentCount !== undefined && commentCount > 0 && (
          <span>
            {commentCount.toLocaleString("pt-BR")}{" "}
            {commentCount === 1 ? "comentário feito" : "comentários feitos"}
          </span>
        )}
      </div>
    </div>
  );
}
