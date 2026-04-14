import { ClassificationRow } from "./types";

export function formatClassificationForWhatsApp(
  rows: ClassificationRow[],
  year: number
): string {
  const header = `CLASIFICACION CCC REAL SITIO DE ARANJUEZ ${year}`;
  const separator = "";

  const maxNameLength = Math.max(...rows.map((r) => r.name.length), 20);
  const maxPointsLength = Math.max(...rows.map((r) => String(r.points).length + (r.has_asterisk ? 1 : 0)));

  const lines = rows.map((row) => {
    const pointsStr = `${row.points}${row.has_asterisk ? "*" : ""}`;
    const namePadding = " ".repeat(maxNameLength - row.name.length + 2);
    const pointsPadding = " ".repeat(maxPointsLength - pointsStr.length);
    return `${row.name}${namePadding}${pointsPadding}${pointsStr}`;
  });

  // Triple backtick forces monospace font in WhatsApp, ensuring column alignment
  return ["```", header, separator, ...lines, "```"].join("\n");
}
