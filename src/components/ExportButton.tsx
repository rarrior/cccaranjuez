"use client";

import { useState } from "react";
import type { ClassificationRow } from "@/lib/types";
import { formatClassificationForWhatsApp } from "@/lib/utils";

interface ExportButtonProps {
  rows: ClassificationRow[];
  year: number;
}

export default function ExportButton({ rows, year }: ExportButtonProps) {
  const [shared, setShared] = useState(false);

  const text = formatClassificationForWhatsApp(rows, year);

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch { /* cancelled */ }
  }

  return (
    <button
      onClick={handleShare}
      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-colors bg-surface border border-border text-fg hover:bg-overlay"
    >
      {shared ? "✓ Compartido" : "Compartir texto"}
    </button>
  );
}
