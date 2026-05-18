"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export function PromoCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full uppercase tracking-wide hover:-translate-y-0.5 transition-all flex items-center gap-1.5 shrink-0"
    >
      {copied ? (
        <>
          <Check size={12} /> Copié !
        </>
      ) : (
        "Copier"
      )}
    </button>
  );
}
