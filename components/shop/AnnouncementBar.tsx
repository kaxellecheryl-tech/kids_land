"use client";

import { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";

const DISMISS_KEY = "kl-announcement-dismissed";
const BAR_H = 40; // px

type Props = {
  code: string;
  label: string;
};

export function AnnouncementBar({ code, label }: Props) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(DISMISS_KEY)) {
      setVisible(true);
      document.documentElement.style.setProperty("--announcement-h", `${BAR_H}px`);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
    document.documentElement.style.setProperty("--announcement-h", "0px");
  }

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 inset-x-0 z-[60] flex items-center justify-center gap-3 bg-brand-blue-dark text-white text-[11px] font-semibold tracking-wide px-4"
      style={{ height: BAR_H }}
    >
      <Tag size={11} className="shrink-0 opacity-70" />

      <span className="opacity-80">{label}</span>

      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase transition-colors"
      >
        <span className="font-mono tracking-widest">{code}</span>
        <span className="opacity-70">{copied ? "✓ Copié" : "· Copier"}</span>
      </button>

      <button
        onClick={dismiss}
        aria-label="Fermer"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  );
}
