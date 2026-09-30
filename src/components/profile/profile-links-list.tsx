import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import {
  InstagramIcon,
  SpotifyIcon,
  XIcon,
  YoutubeIcon,
  LastfmIcon,
  TiktokIcon,
} from "@/components/icons/social-icons";
import { LINK_PLATFORMS, BUTTON_STYLE_CLASSES, type ButtonStyle } from "@/lib/constants/profile-themes";
import type { PublicProfileLink } from "@/lib/queries/profile";

const PLATFORM_ICONS: Record<PublicProfileLink["platform"], React.ComponentType<{ className?: string }>> = {
  spotify: SpotifyIcon,
  instagram: InstagramIcon,
  x: XIcon,
  tiktok: TiktokIcon,
  youtube: YoutubeIcon,
  lastfm: LastfmIcon,
  outro: LinkIcon,
};

function platformLabel(platform: PublicProfileLink["platform"]) {
  return LINK_PLATFORMS.find((p) => p.id === platform)?.label ?? "Link";
}

export function ProfileLinksList({
  links,
  buttonStyle,
  vertical = false,
}: {
  links: PublicProfileLink[];
  buttonStyle: ButtonStyle;
  vertical?: boolean;
}) {
  if (links.length === 0) return null;

  return (
    <div className={vertical ? "flex flex-col gap-2" : "flex flex-wrap gap-2"}>
      {links.map((link) => {
        const Icon = PLATFORM_ICONS[link.platform];
        return (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`flex items-center gap-2 bg-[color:var(--profile-accent)] px-4 py-2 text-sm font-medium text-white ${vertical ? "justify-center" : ""} ${BUTTON_STYLE_CLASSES[buttonStyle]}`}
          >
            <Icon className="size-4" />
            {platformLabel(link.platform)}
          </Link>
        );
      })}
    </div>
  );
}
