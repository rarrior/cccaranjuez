"use client";

import { useState, useEffect } from "react";
import type { ClassificationRow } from "@/lib/types";
import { formatClassificationForWhatsApp } from "@/lib/utils";

interface ExportButtonProps {
  rows: ClassificationRow[];
  year: number;
}

export default function ExportButton({ rows, year }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare("share" in navigator);
  }, []);

  const text = formatClassificationForWhatsApp(rows, year);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try { await navigator.share({ text }); } catch { /* cancelled */ }
    } else {
      handleCopy();
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopy}
        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          copied
            ? "bg-overlay text-fg-muted border border-border"
            : "bg-fg text-canvas hover:bg-fg/90"
        }`}
      >
        {copied ? "Copiado" : "Copiar para WhatsApp"}
      </button>
      {canShare && (
        <button
          onClick={handleShare}
          className="flex-1 bg-surface border border-border text-fg py-2.5 rounded-lg text-sm font-medium hover:bg-overlay transition-colors"
        >
          Compartir
        </button>
      )}
    </div>
  );
}
