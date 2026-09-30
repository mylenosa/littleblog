import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArticleCard } from "@/components/articles/article-card";
import { ProfileBio } from "@/components/profile/profile-bio";
import { ProfileLinksList } from "@/components/profile/profile-links-list";
import { ReportProfileButton } from "@/components/profile/report-profile-button";
import {
  getPublicProfileByUsername,
  getTopFavoriteArticles,
  incrementProfileViews,
} from "@/lib/queries/profile";
import { getAuthState } from "@/lib/supabase/auth-state";
import { formatDate } from "@/lib/format-date";
import { BACKGROUND_STYLE_CLASSES } from "@/lib/constants/profile-themes";

export async function generateMetadata(
  props: PageProps<"/[username]">
): Promise<Metadata> {
  const { username } = await props.params;
  const profile = await getPublicProfileByUsername(username);

  return {
    title: profile ? `@${profile.username}` : "Perfil não encontrado",
    robots: { index: false, follow: false },
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default async function PublicProfilePage(
  props: PageProps<"/[username]">
) {
  const { username } = await props.params;
  const [profile, { user }] = await Promise.all([
    getPublicProfileByUsername(username),
    getAuthState(),
  ]);

  if (!profile) notFound();

  const isOwner = user?.id === profile.id;
  if (!profile.isPublic && !isOwner) notFound();

  await incrementProfileViews(profile.username);
  const favorites = await getTopFavoriteArticles(profile.id);

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] ${BACKGROUND_STYLE_CLASSES[profile.backgroundStyle]}`}
      style={
        {
          "--profile-accent": profile.accentColor,
          ...(profile.backgroundImageUrl
            ? {
                backgroundImage: `url(${profile.backgroundImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {!profile.isPublic && isOwner && (
          <p className="mb-4 rounded-sm border border-dashed border-black/30 bg-white/80 px-3 py-2 text-xs text-neutral-700">
            Seu perfil está marcado como privado — só você está vendo essa página.
            Ative &ldquo;Perfil visível publicamente&rdquo; em{" "}
            <Link href="/perfil" className="underline">
              /perfil
            </Link>{" "}
            pra que outras pessoas consigam abrir.
          </p>
        )}

        <div className="rounded-sm border-2 border-black/10 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Avatar size="lg" className="size-20">
              <AvatarImage src={profile.avatarUrl ?? undefined} alt="" />
              <AvatarFallback>{initials(profile.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl font-bold">{profile.fullName}</h1>
              <p className="text-sm text-neutral-500">@{profile.username}</p>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-4">
              <ProfileBio bio={profile.bio} />
            </div>
          )}

          <div className="mt-4">
            <ProfileLinksList links={profile.links} buttonStyle={profile.buttonStyle} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-dashed border-black/15 pt-3 text-xs text-neutral-500">
            <span>Você é o visitante nº {profile.viewCount.toLocaleString("pt-BR")}</span>
            <span>Atualizado em {formatDate(profile.updatedAt)}</span>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="mt-6 rounded-sm border-2 border-black/10 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-600">
              Top favoritos
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {favorites.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <ReportProfileButton username={profile.username} />
        </div>
      </div>
    </div>
  );
}
