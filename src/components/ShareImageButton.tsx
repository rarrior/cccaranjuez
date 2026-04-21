"use client";

import { useState } from "react";
import type { ClassificationRow } from "@/lib/types";

interface Props {
  rows: ClassificationRow[];
  year: number;
}

const CHUNK_SIZE = 15;
const SCALE      = 3; // 3× for high-DPI sharpness

// ── Colours ───────────────────────────────────────────────────────────────
const NAVY   = "#0a1540";
const BLUE   = "#1756d6";
const YELLOW = "#f5c200";
const GOLD_A = "#c8960c";
const GOLD_B = "#f5c842";
const SIL_A  = "#6b7d90";
const SIL_B  = "#9daec4";
const BRZ_A  = "#8a4c20";
const BRZ_B  = "#c07540";
const WHITE  = "#ffffff";
const BG     = "#f4f7ff";
const TEXT   = "#0f1629";
const MUTED  = "#5b6b8a";
const SUBTLE = "#9aaac4";
const BORDER = "#dce3f5";

// ── Helpers ───────────────────────────────────────────────────────────────
function drawCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.closePath();
}

function lgrad(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, a: string, b: string) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, a); g.addColorStop(1, b);
  return g;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

type Tier = "podio" | "top10" | "rest";
function tier(pos: number): Tier {
  if (pos <= 3)  return "podio";
  if (pos <= 10) return "top10";
  return "rest";
}

function tierConfig(pos: number) {
  if (pos === 1) return { stripeA: GOLD_A, stripeB: GOLD_B, rowBg: "rgba(200,150,12,.07)", ptColor: GOLD_A };
  if (pos === 2) return { stripeA: SIL_A,  stripeB: SIL_B,  rowBg: "rgba(107,125,144,.06)", ptColor: SIL_A };
  if (pos === 3) return { stripeA: BRZ_A,  stripeB: BRZ_B,  rowBg: "rgba(138,76,32,.06)",  ptColor: BRZ_A };
  if (pos <= 10) return { stripeA: YELLOW, stripeB: YELLOW,  rowBg: "rgba(245,194,0,.05)",  ptColor: TEXT };
  return { stripeA: BORDER, stripeB: BORDER, rowBg: null, ptColor: TEXT };
}

function prizeLabel(pos: number): string {
  if (pos === 1) return "🇪🇺 Maillot Campeón de Europa";
  if (pos === 2) return "🥈 Premio";
  if (pos === 3) return "🥉 Premio";
  if (pos <= 10) return "🏆 Premio";
  return "";
}

const SECT_LABELS: Record<Tier, { text: string; color: string }> = {
  podio:  { text: "⭐ PODIO · PREMIO ESPECIAL",     color: GOLD_A },
  top10:  { text: "🏆 TOP 10 · TAMBIÉN PREMIADOS",  color: GOLD_A },
  rest:   { text: "RESTO DE PARTICIPANTES",          color: SUBTLE },
};

// ── Build one page image ───────────────────────────────────────────────────

async function buildPageImage(
  chunk: ClassificationRow[],
  startPos: number,
  pageNum: number,
  totalPages: number,
  year: number,
  logoImg: HTMLImageElement,
): Promise<Blob> {
  const W        = 640;
  const HEADER_H = 72;
  const HERO_H   = 68;
  const ROW_H    = 54;
  const SECT_H   = 30;
  const FOOTER_H = 44;
  const LEGEND_H = totalPages === 1 || pageNum === totalPages ? 44 : 0;
  const PAD      = 18;

  // Count how many section headers appear in this chunk
  let sects = 0;
  let prevTier: Tier | null = startPos > 1 ? tier(startPos - 1) : null;
  chunk.forEach((_, i) => {
    const t = tier(startPos + i);
    if (t !== prevTier) { sects++; prevTier = t; }
  });

  const H = HEADER_H + HERO_H + sects * SECT_H + chunk.length * ROW_H + LEGEND_H + FOOTER_H;

  const canvas  = document.createElement("canvas");
  canvas.width  = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(SCALE, SCALE);

  // background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // ── header ──
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, 0, W, HEADER_H);

  const logoSize = 44;
  const logoX    = PAD;
  const logoY    = (HEADER_H - logoSize) / 2;
  ctx.save();
  drawCircle(ctx, logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2);
  ctx.clip();
  ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  ctx.restore();

  ctx.fillStyle = WHITE;
  ctx.font      = "800 15px -apple-system, sans-serif";
  ctx.fillText("CCC Aranjuez", logoX + logoSize + 10, logoY + 17);
  ctx.fillStyle = "rgba(255,255,255,.4)";
  ctx.font      = "600 11px -apple-system, sans-serif";
  ctx.fillText("Real Sitio de Aranjuez", logoX + logoSize + 10, logoY + 34);

  if (totalPages > 1) {
    ctx.fillStyle = "rgba(255,255,255,.3)";
    ctx.font      = "700 11px -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${pageNum} / ${totalPages}`, W - PAD, HEADER_H / 2 + 4);
    ctx.textAlign = "left";
  }

  // ── hero ──
  const heroY = HEADER_H;
  ctx.fillStyle = BLUE;
  ctx.fillRect(0, heroY, W, HERO_H);

  ctx.save();
  ctx.translate(W - 60, heroY - 20);
  ctx.rotate(0.31);
  ctx.fillStyle = "rgba(255,255,255,.14)";
  ctx.fillRect(0, 0, 12, HERO_H + 60);
  ctx.fillStyle = YELLOW;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(28, 0, 24, HERO_H + 60);
  ctx.restore();

  ctx.fillStyle = YELLOW;
  ctx.font      = "800 10px -apple-system, sans-serif";
  ctx.fillText(`⬤  TEMPORADA ${year}`, PAD, heroY + 22);
  ctx.fillStyle = WHITE;
  ctx.font      = "900 22px -apple-system, sans-serif";
  ctx.fillText("Clasificación General", PAD, heroY + 50);

  // ── rows ──
  let y        = HEADER_H + HERO_H;
  let lastTier: Tier | null = startPos > 1 ? tier(startPos - 1) : null;

  chunk.forEach((row, i) => {
    const pos = startPos + i;
    const t   = tier(pos);
    const cfg = tierConfig(pos);

    // section header on tier change
    if (t !== lastTier) {
      const { text, color } = SECT_LABELS[t];
      ctx.fillStyle = BG;
      ctx.fillRect(0, y, W, SECT_H);
      ctx.fillStyle = BORDER;
      ctx.fillRect(0, y + SECT_H - 1, W, 1);
      ctx.fillStyle = color;
      ctx.font      = "800 9px -apple-system, sans-serif";
      ctx.fillText(text, PAD + 2, y + SECT_H / 2 + 4);
      y += SECT_H;
      lastTier = t;
    }

    // row bg
    if (cfg.rowBg) {
      const parsed = cfg.rowBg.match(/[\d.]+/g)!.map(Number);
      const grad   = ctx.createLinearGradient(0, y, W * 0.6, y);
      grad.addColorStop(0, `rgba(${parsed[0]},${parsed[1]},${parsed[2]},${parsed[3]})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, W, ROW_H);
    }

    // tier stripe
    ctx.fillStyle = lgrad(ctx, 0, y, 0, ROW_H, cfg.stripeA, cfg.stripeB);
    ctx.fillRect(0, y, 4, ROW_H);

    // row border
    ctx.fillStyle = BORDER;
    ctx.fillRect(0, y + ROW_H - 1, W, 1);

    const cy = y + ROW_H / 2;

    // position / medal
    const posX = 16;
    if (pos <= 3) {
      drawCircle(ctx, posX, cy, 12);
      ctx.fillStyle = lgrad(ctx, posX - 12, cy - 12, 0, 24, cfg.stripeA, cfg.stripeB);
      ctx.fill();
      ctx.fillStyle = WHITE;
      ctx.font      = "900 10px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(pos), posX, cy + 4);
      ctx.textAlign = "left";
    } else {
      ctx.fillStyle = SUBTLE;
      ctx.font      = "700 12px -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(pos), posX, cy + 4);
      ctx.textAlign = "left";
    }

    // avatar
    const avR  = 15;
    const avCx = 38 + avR;
    const avGrad = pos <= 3
      ? lgrad(ctx, avCx - avR, cy - avR, 0, avR * 2, cfg.stripeA, cfg.stripeB)
      : lgrad(ctx, avCx - avR, cy - avR, 0, avR * 2, BLUE, "#4ba3d9");
    drawCircle(ctx, avCx, cy, avR);
    ctx.fillStyle = avGrad;
    ctx.fill();
    ctx.fillStyle = WHITE;
    ctx.font      = "800 11px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(initials(row.name), avCx, cy + 4);
    ctx.textAlign = "left";

    // name + prize
    const nameX  = avCx + avR + 10;
    const prize  = prizeLabel(pos);
    ctx.fillStyle = TEXT;
    ctx.font      = pos <= 3 ? "700 14px -apple-system, sans-serif" : "600 13px -apple-system, sans-serif";
    let name      = row.name;
    const maxW    = W - nameX - 95;
    while (ctx.measureText(name).width > maxW && name.length > 0) name = name.slice(0, -1);
    if (name !== row.name) name = name.slice(0, -1) + "…";
    ctx.fillText(name, nameX, cy - (prize ? 6 : 0));
    if (prize) {
      ctx.fillStyle = MUTED;
      ctx.font      = "600 10px -apple-system, sans-serif";
      ctx.fillText(prize, nameX, cy + 10);
    }

    // asterisk badge
    let ptsX = W - PAD;
    if (row.asterisk_count > 0) {
      const aStr = String(row.asterisk_count);
      ctx.font    = "800 9px -apple-system, sans-serif";
      const aCx   = ptsX - 38;
      drawCircle(ctx, aCx, cy, 9);
      ctx.fillStyle = "rgba(245,194,0,.2)"; ctx.fill();
      ctx.strokeStyle = "rgba(245,194,0,.5)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = GOLD_A;
      ctx.textAlign = "center";
      ctx.fillText(aStr, aCx, cy + 3);
      ctx.textAlign = "left";
      ptsX -= 26;
    }

    // points
    const ptsStr = String(row.points);
    ctx.font      = pos === 1 ? "800 18px -apple-system, sans-serif" : "700 15px -apple-system, sans-serif";
    const ptsW    = ctx.measureText(ptsStr).width;
    ctx.fillStyle = cfg.ptColor;
    ctx.textAlign = "right";
    ctx.fillText(ptsStr, ptsX - 18, cy + 5);
    ctx.fillStyle = SUBTLE;
    ctx.font      = "600 9px -apple-system, sans-serif";
    ctx.fillText("pts", ptsX - 18 + ptsW + 4, cy + 5);
    ctx.textAlign = "left";

    y += ROW_H;
  });

  // ── legend (last page only) ──
  if (LEGEND_H > 0) {
    ctx.fillStyle = BG;
    ctx.fillRect(0, y, W, LEGEND_H);
    ctx.fillStyle = BORDER;
    ctx.fillRect(0, y, W, 1);
    const items = [
      { a: GOLD_A, b: GOLD_B, label: "1º Maillot Campeón de Europa · Top 3 Premio" },
      { a: YELLOW, b: YELLOW, label: "Top 10 — Premio" },
    ];
    let lx = PAD;
    ctx.font = "600 10px -apple-system, sans-serif";
    items.forEach(({ a, b, label }) => {
      ctx.fillStyle = lgrad(ctx, lx, y + 13, 0, 15, a, b);
      ctx.fillRect(lx, y + 13, 4, 15);
      ctx.fillStyle = MUTED;
      ctx.fillText(label, lx + 8, y + 24);
      lx += ctx.measureText(label).width + 22;
    });
    y += LEGEND_H;
  }

  // ── footer ──
  ctx.fillStyle = NAVY;
  ctx.fillRect(0, y, W, FOOTER_H);
  const now = new Date().toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.font      = "600 11px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`Club Ciclista CCC Real Sitio de Aranjuez · ${now}`, W / 2, y + FOOTER_H / 2 + 4);
  ctx.textAlign = "left";

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("canvas toBlob failed"))), "image/png");
  });
}

// ── Build all pages ────────────────────────────────────────────────────────

async function buildImages(rows: ClassificationRow[], year: number): Promise<File[]> {
  const logoImg = new Image();
  logoImg.src   = "/icons/escudo-cccaranjuez.png";
  await new Promise<void>((res) => { logoImg.onload = () => res(); logoImg.onerror = () => res(); });

  const chunks: ClassificationRow[][] = [];
  for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
    chunks.push(rows.slice(i, i + CHUNK_SIZE));
  }
  if (chunks.length === 0) chunks.push([]);

  const total = chunks.length;
  const files = await Promise.all(
    chunks.map(async (chunk, idx) => {
      const blob = await buildPageImage(chunk, idx * CHUNK_SIZE + 1, idx + 1, total, year, logoImg);
      const name = total === 1
        ? `clasificacion-ccc-${year}.png`
        : `clasificacion-ccc-${year}-${idx + 1}de${total}.png`;
      return new File([blob], name, { type: "image/png" });
    }),
  );

  return files;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function ShareImageButton({ rows, year }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleShare() {
    setState("loading");
    try {
      const files = await buildImages(rows, year);

      const canShareFiles =
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files });

      if (canShareFiles) {
        await navigator.share({ files, title: `Clasificación CCC Aranjuez ${year}` });
      } else {
        // Fallback: download each file
        files.forEach((file) => {
          const url = URL.createObjectURL(file);
          const a   = document.createElement("a");
          a.href    = url;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(url);
        });
      }

      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setState("idle");
      } else {
        setState("error");
        setTimeout(() => setState("idle"), 3000);
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      disabled={state === "loading"}
      className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 bg-[#25D366] text-white hover:bg-[#1fb855]"
    >
      {state === "loading" && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
      {state === "idle" && (
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )}
      {state === "done"    && "✓ Compartido"}
      {state === "error"   && "Error al generar imagen"}
      {state === "idle"    && "Compartir imagen por WhatsApp"}
      {state === "loading" && "Generando imagen…"}
    </button>
  );
}
