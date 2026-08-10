import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { getVideoEmbedUrl } from "@/lib/video-embed";

function LinkOrVideoEmbed({
  href,
  children,
  ...props
}: ComponentProps<"a">) {
  const embedUrl = href ? getVideoEmbedUrl(href) : null;

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title="Vídeo incorporado"
        className="my-4 aspect-video w-full rounded-lg border border-border"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

function ArticleImage({ alt, ...props }: ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt ?? ""} className="rounded-lg border border-border" {...props} />;
}

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-foreground">
      <ReactMarkdown components={{ a: LinkOrVideoEmbed, img: ArticleImage }}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
