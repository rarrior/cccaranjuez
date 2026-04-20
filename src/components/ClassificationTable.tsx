import type { ReactNode } from "react";
import type { ClassificationRow } from "@/lib/types";

interface Props {
  rows: ClassificationRow[];
  year: number;
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

const STRIPE_BG: Record<number, string> = {
  1: "linear-gradient(180deg,#c8960c,#f5c842)",
  2: "linear-gradient(180deg,#6b7d90,#9daec4)",
  3: "linear-gradient(180deg,#8a4c20,#c07540)",
};

const MEDAL_BG: Record<number, string> = {
  1: "linear-gradient(135deg,#c8960c,#f5c842)",
  2: "linear-gradient(135deg,#6b7d90,#9daec4)",
  3: "linear-gradient(135deg,#8a4c20,#c07540)",
};

const ROW_BG: Record<number, string> = {
  1: "linear-gradient(90deg, rgba(200,150,12,.07) 0%, transparent 55%)",
  2: "linear-gradient(90deg, rgba(107,125,144,.06) 0%, transparent 55%)",
  3: "linear-gradient(90deg, rgba(138,76,32,.06) 0%, transparent 55%)",
};

const PT_COLOR: Record<number, string> = {
  1: "#b8900a",
  2: "#6b7d90",
  3: "#8a4c20",
};

const PRIZE_LABEL: Record<number, string> = {
  1: "🇪🇺 Maillot Campeón de Europa",
  2: "🥈 Premio",
  3: "🥉 Premio",
};

const TOP10_STRIPE = "#f5c200";
const TOP10_ROW_BG = "linear-gradient(90deg, rgba(245,194,0,.05) 0%, transparent 60%)";

/* ─── Single row ──────────────────────────────────────────────────────── */

function ClassifRow({ row, pos }: { row: ClassificationRow; pos: number }) {
  const isTop3  = pos <= 3;
  const isTop10 = pos > 3 && pos <= 10;

  const stripeBg = isTop3
    ? STRIPE_BG[pos]
    : isTop10
    ? TOP10_STRIPE
    : "var(--color-border-sub)";

  const rowBg = isTop3 ? ROW_BG[pos] : isTop10 ? TOP10_ROW_BG : undefined;

  const avatarBg = isTop3
    ? MEDAL_BG[pos]
    : "linear-gradient(135deg, var(--color-blue-mid), var(--color-blue-light))";

  return (
    <div
      className="flex items-center border-b border-border last:border-0 transition-colors"
      style={rowBg ? { background: rowBg } : undefined}
    >
      {/* Tier stripe — div element avoids CSS border specificity bugs */}
      <div className="w-1 self-stretch shrink-0" style={{ background: stripeBg }} />

      {/* Position */}
      <div className="w-8 text-center shrink-0 px-1 py-2.5">
        {isTop3 ? (
          <div
            className="w-6 h-6 rounded-full inline-flex items-center justify-center text-[10px] font-black text-white"
            style={{ background: MEDAL_BG[pos] }}
          >
            {pos}
          </div>
        ) : (
          <span className="text-xs font-bold text-fg-subtle tabular-nums">{pos}</span>
        )}
      </div>

      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white shrink-0 mr-2.5"
        style={{ background: avatarBg }}
      >
        {initials(row.name)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-2.5">
        <p
          className="truncate"
          style={{
            fontSize:   isTop3 ? "14px" : "13px",
            fontWeight: isTop3 ? 700 : 600,
            color: "var(--color-fg)",
          }}
        >
          {row.name}
        </p>
        {(isTop3 || isTop10) && (
          <p className="text-[10px] text-fg-subtle mt-0.5">
            {isTop3 ? PRIZE_LABEL[pos] : "🏆 Premio"}
          </p>
        )}
      </div>

      {/* Points + asterisk */}
      <div className="flex items-center gap-1.5 shrink-0 px-3.5">
        {row.asterisk_count > 0 && (
          <span className="relative group cursor-default" tabIndex={0}>
            <span
              className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[8px] font-extrabold border"
              style={{
                background:   "rgba(245,194,0,.15)",
                borderColor:  "rgba(245,194,0,.45)",
                color:        "#b8900a",
              }}
            >
              {row.asterisk_count}
            </span>
            <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-max max-w-[160px] rounded-lg bg-surface border border-border px-2.5 py-1.5 text-xs text-fg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 text-center z-10">
              {row.asterisk_count === 1
                ? "1 salida no completada"
                : `${row.asterisk_count} salidas no completadas`}
            </span>
          </span>
        )}
        <span
          className="font-extrabold tabular-nums"
          style={{
            fontSize: isTop3 && pos === 1 ? "17px" : "15px",
            color:    isTop3 ? PT_COLOR[pos] : "var(--color-fg)",
          }}
        >
          {row.points}
        </span>
        <span className="text-[9px] text-fg-subtle font-semibold">pts</span>
      </div>
    </div>
  );
}

/* ─── Section header ──────────────────────────────────────────────────── */

function SectionHeader({
  color,
  icon,
  label,
}: {
  color: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-canvas border-b border-border">
      {icon}
      <span className="text-[9px] font-extrabold tracking-[.12em] uppercase" style={{ color }}>
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

const StarIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PeopleIcon = ({ color }: { color: string }) => (
  <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

/* ─── Main component ──────────────────────────────────────────────────── */

export default function ClassificationTable({ rows, year }: Props) {
  const top3  = rows.slice(0, 3);
  const top10 = rows.slice(3, 10);
  const rest  = rows.slice(10);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[.12em] uppercase text-fg-muted mb-0.5">
            Temporada {year}
          </p>
          <h2 className="text-xl font-extrabold text-fg">Clasificación</h2>
        </div>
        <span className="text-xs text-fg-muted bg-surface border border-border rounded-full px-3 py-1">
          {rows.length} ciclistas
        </span>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-surface">

        {/* ── Top 3 ── */}
        {top3.length > 0 && (
          <>
            <SectionHeader
              color="#b8900a"
              icon={<StarIcon color="#b8900a" />}
              label="Podio · Premio especial"
            />
            {top3.map((row, i) => (
              <ClassifRow key={row.id} row={row} pos={i + 1} />
            ))}
          </>
        )}

        {/* ── Top 4–10 ── */}
        {top10.length > 0 && (
          <>
            <SectionHeader
              color="#b8900a"
              icon={<PeopleIcon color="#b8900a" />}
              label="Top 10 · También premiados"
            />
            {top10.map((row, i) => (
              <ClassifRow key={row.id} row={row} pos={i + 4} />
            ))}
          </>
        )}

        {/* ── Resto ── */}
        {rest.length > 0 && (
          <>
            <SectionHeader
              color="var(--color-fg-subtle)"
              icon={<PeopleIcon color="var(--color-fg-subtle)" />}
              label="Resto de participantes"
            />
            {rest.map((row, i) => (
              <ClassifRow key={row.id} row={row} pos={i + 11} />
            ))}
          </>
        )}

        {rows.length === 0 && (
          <div className="px-4 py-16 text-center text-fg-muted text-sm">
            No hay datos de clasificacion
          </div>
        )}

        {/* Legend */}
        {rows.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-3 border-t border-border bg-canvas">
            <div className="flex items-center gap-1.5 text-[10px] text-fg-muted font-semibold">
              <span
                className="inline-block w-1 h-3.5 rounded-sm shrink-0"
                style={{ background: "linear-gradient(180deg,#c8960c,#f5c842)" }}
              />
              1º Maillot Campeón de Europa · Top 3 Premio
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-fg-muted font-semibold">
              <span className="inline-block w-1 h-3.5 rounded-sm shrink-0 bg-accent" />
              Top 10 — Premio
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-fg-muted font-semibold">
              <span
                className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[8px] font-bold border shrink-0"
                style={{
                  background:  "rgba(245,194,0,.15)",
                  borderColor: "rgba(245,194,0,.45)",
                  color:       "#b8900a",
                }}
              >
                N
              </span>
              Salidas no completadas
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
