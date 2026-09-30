import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { ProfileCard } from "@/components/profile/profile-card";
import { ReportProfileButton } from "@/components/profile/report-profile-button";
import {
  getPublicProfileByUsername,
  getTopFavoriteArticles,
  incrementProfileViews,
} from "@/lib/queries/profile";
import { getAuthState } from "@/lib/supabase/auth-state";

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
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-100">
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

        <ProfileCard
          fullName={profile.fullName}
          username={profile.username}
          bio={profile.bio}
          avatarUrl={profile.avatarUrl}
          backgroundStyle={profile.backgroundStyle}
          accentColor={profile.accentColor}
          buttonStyle={profile.buttonStyle}
          backgroundImageUrl={profile.backgroundImageUrl}
          topArtist={profile.topArtist}
          topTrack={profile.topTrack}
          links={profile.links}
          viewCount={profile.viewCount}
          updatedAt={profile.updatedAt}
          editHref={isOwner ? "/perfil" : undefined}
        />

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
