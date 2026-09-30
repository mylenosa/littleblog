import ReactMarkdown from "react-markdown";

function BioImage({ alt, style, ...props }: React.ComponentProps<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt ?? ""}
      className="my-2 rounded-sm"
      style={{ maxHeight: "12rem", width: "auto", maxWidth: "100%", ...style }}
      {...props}
    />
  );
}

export function ProfileBio({ bio }: { bio: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-p:my-1 prose-a:text-[color:var(--profile-accent)]">
      <ReactMarkdown components={{ img: BioImage }}>{bio}</ReactMarkdown>
    </div>
  );
}
