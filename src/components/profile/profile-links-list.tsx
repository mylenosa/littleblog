import Link from "next/link";
import { Music2, Link as LinkIcon } from "lucide-react";
import {
  InstagramIcon,
  XIcon,
  YoutubeIcon,
  LastfmIcon,
  TiktokIcon,
} from "@/components/icons/social-icons";
import { LINK_PLATFORMS, BUTTON_STYLE_CLASSES, type ButtonStyle } from "@/lib/constants/profile-themes";
import type { PublicProfileLink } from "@/lib/queries/profile";

const PLATFORM_ICONS: Record<PublicProfileLink["platform"], React.ComponentType<{ className?: string }>> = {
  spotify: Music2,
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
}: {
  links: PublicProfileLink[];
  buttonStyle: ButtonStyle;
}) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => {
        const Icon = PLATFORM_ICONS[link.platform];
        return (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className={`flex items-center gap-1.5 bg-[color:var(--profile-accent)] px-3 py-1.5 text-xs font-medium text-white ${BUTTON_STYLE_CLASSES[buttonStyle]}`}
          >
            <Icon className="size-3.5" />
            {platformLabel(link.platform)}
          </Link>
        );
      })}
    </div>
  );
}
