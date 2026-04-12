import CopyButton from "@/components/shared/CopyButton";

type CodeBlockProps = {
  code: string;
  language?: string;
};

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  return (
    <div className="relative rounded-lg bg-zinc-900 border border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        {language ? (
          <span className="text-xs text-zinc-500 font-mono">{language}</span>
        ) : (
          <span />
        )}
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-sm text-zinc-200 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
