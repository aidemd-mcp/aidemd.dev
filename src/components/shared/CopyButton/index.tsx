"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type CopyButtonProps = {
  text: string;
};

const CopyButton = ({ text }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 font-mono text-xs"
    >
      {copied ? "Copied ✓" : "Copy"}
    </Button>
  );
};

export default CopyButton;
