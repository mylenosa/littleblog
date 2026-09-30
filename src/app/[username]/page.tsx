import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/articles/article-card";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import { ProfileBio } from "@/components/profile/profile-bio";
import { RecentCommentsList } from "@/components/profile/recent-comments-list";
import { ReportProfileButton } from "@/components/profile/report-profile-button";
import {
  getCommentCountByUser,
  getPublicProfileByUsername,
  getRecentCommentsByUser,
  getTopFavoriteArticles,
  incrementProfileViews,
} from "@/lib/queries/profile";
import { getAuthState } from "@/lib/supabase/auth-state";
import {
  BACKGROUND_STYLE_CLASSES,
  BANNER_STYLE_CLASSES,
} from "@/lib/constants/profile-themes";
import { isPresetValue } from "@/lib/constants/image-presets";
import { stripMarkdown } from "@/lib/strip-markdown";

export async function generateMetadata(
  props: PageProps<"/[username]">
): Promise<Metadata> {
  const { username } = await props.params;
  const [profile, { user }] = await Promise.all([
    getPublicProfileByUsername(username),
    getAuthState(),
  ]);

  const notFoundMetadata: Metadata = {
    title: "Perfil não encontrado",
    robots: { index: false, follow: false },
  };

  if (!profile) return notFoundMetadata;

  const isOwner = user?.id === profile.id;
  if (!profile.isPublic && !isOwner) return notFoundMetadata;

  const title = `@${profile.username}`;
  const cardTitle = `${profile.fullName} (@${profile.username})`;
  const bioText = profile.bio ? stripMarkdown(profile.bio) : "";
  const combinedText = [profile.status, bioText].filter(Boolean).join(" — ");
  const description =
    (combinedText.length > 125 ? `${combinedText.slice(0, 124)}…` : combinedText) ||
    `Confira o perfil de @${profile.username} no Quarto.`;
  const images =
    profile.avatarUrl && !isPresetValue(profile.avatarUrl)
      ? [profile.avatarUrl]
      : undefined;

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      type: "profile",
      username: profile.username,
      title: cardTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: cardTitle,
      description,
      images,
    },
  };
}

function cursorStyle(color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='6' fill='${color}' stroke='white' stroke-width='2'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 10 10, auto`;
}

type TickerItem = { label: string; href?: string };

function TickerLink({ label, href, hidden }: TickerItem & { hidden?: boolean }) {
  if (!href) {
    return <span aria-hidden={hidden || undefined}>{label}</span>;
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="hover:underline"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
    >
      {label}
    </a>
  );
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
  const [favorites, recentComments, commentCount] = await Promise.all([
    getTopFavoriteArticles(profile.id),
    getRecentCommentsByUser(profile.id),
    getCommentCountByUser(profile.id),
  ]);
  const hasContent = favorites.length > 0 || recentComments.length > 0;

  const nowPlayingLabel = [profile.topArtist, profile.topTrack].filter(Boolean).join(" — ");
  const nowPlayingHref = profile.topTrackSpotifyId
    ? `https://open.spotify.com/track/${profile.topTrackSpotifyId}`
    : profile.topArtistSpotifyId
      ? `https://open.spotify.com/artist/${profile.topArtistSpotifyId}`
      : undefined;
  const tickerItems: TickerItem[] = nowPlayingLabel
    ? [{ label: `🎧 Ouvindo: ${nowPlayingLabel}`, href: nowPlayingHref }]
    : [];

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] ${BACKGROUND_STYLE_CLASSES[profile.backgroundStyle]}`}
      style={
        {
          "--profile-accent": profile.accentColor,
          cursor: cursorStyle(profile.accentColor),
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
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
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

        <div className="overflow-hidden rounded-sm border-2 border-black/10 bg-white/90 shadow-lg backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_0_0_3px_color-mix(in_srgb,var(--profile-accent)_50%,transparent),0_12px_28px_-8px_color-mix(in_srgb,var(--profile-accent)_45%,transparent)]">
          <div
            className={`relative h-28 sm:h-32 ${BANNER_STYLE_CLASSES[profile.backgroundStyle]}`}
          >
            {tickerItems.length > 0 && (
              <div
                className="absolute inset-x-0 bottom-0 overflow-hidden whitespace-nowrap bg-black/35 py-1.5 backdrop-blur-sm"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
                }}
              >
                <div className="inline-flex animate-[profile-marquee_14s_linear_infinite] gap-10 px-4 text-xs font-medium text-white">
                  <span className="inline-flex items-center gap-10">
                    {tickerItems.map((item) => (
                      <TickerLink key={item.label} {...item} />
                    ))}
                  </span>
                  <span className="inline-flex items-center gap-10" aria-hidden="true">
                    {tickerItems.map((item) => (
                      <TickerLink key={item.label} {...item} hidden />
                    ))}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">
            <div
              className="border-b border-dashed border-black/15 p-6 sm:border-r sm:border-b-0"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--profile-accent) 10%, transparent)",
              }}
            >
              <ProfileSidebar
                fullName={profile.fullName}
                username={profile.username}
                avatarUrl={profile.avatarUrl}
                buttonStyle={profile.buttonStyle}
                status={profile.status}
                links={profile.links}
                viewCount={profile.viewCount}
                updatedAt={profile.updatedAt}
                commentCount={commentCount}
                editHref={isOwner ? "/perfil" : undefined}
              />
            </div>

            <div className="flex flex-col gap-6 p-6">
              {profile.bio && <ProfileBio bio={profile.bio} />}

              {hasContent ? (
                <>
                  {favorites.length > 0 && (
                    <div>
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

                  <RecentCommentsList comments={recentComments} />
                </>
              ) : (
                <p className="rounded-sm border border-dashed border-black/15 p-4 text-sm text-neutral-500">
                  Ainda não tem nada por aqui — favorita um artigo ou comenta em
                  algum pra aparecer.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <ReportProfileButton username={profile.username} />
        </div>
      </div>
    </div>
  );
}
