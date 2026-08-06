import ReactMarkdown from "react-markdown";

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-primary prose-blockquote:border-primary prose-blockquote:text-foreground">
      <ReactMarkdown>{source}</ReactMarkdown>
    </div>
  );
}
