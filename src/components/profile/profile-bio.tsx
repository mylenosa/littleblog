import ReactMarkdown from "react-markdown";

function BioImage({ alt, ...props }: React.ComponentProps<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt ?? ""} className="my-2 max-h-48 rounded-sm" {...props} />;
}

export function ProfileBio({ bio }: { bio: string }) {
  return (
    <div className="prose prose-sm max-w-none prose-p:my-1 prose-a:text-[color:var(--profile-accent)]">
      <ReactMarkdown components={{ img: BioImage }}>{bio}</ReactMarkdown>
    </div>
  );
}
