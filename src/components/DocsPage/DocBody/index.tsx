type DocBodyProps = {
  contentHtml: string;
};

const DocBody = ({ contentHtml }: DocBodyProps) => {
  return (
    <article
      className="prose prose-invert prose-zinc max-w-none prose-headings:font-mono prose-code:text-zinc-300 prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-a:text-zinc-300 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-zinc-100"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
};

export default DocBody;
