import type { ClassificationRow } from "@/lib/types";

interface ClassificationTableProps {
  rows: ClassificationRow[];
  year: number;
}

const POSITION_STYLE: Record<number, { badge: string; name: string; points: string }> = {
  1: { badge: "bg-[#b8860b] text-white",   name: "text-fg font-semibold",  points: "text-fg text-base" },
  2: { badge: "bg-[#708090] text-white",   name: "text-fg font-semibold",  points: "text-fg text-base" },
  3: { badge: "bg-[#8b4513] text-white",   name: "text-fg font-semibold",  points: "text-fg text-base" },
};

export default function ClassificationTable({ rows, year }: ClassificationTableProps) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium tracking-widest uppercase text-fg-muted mb-1">
          Temporada {year}
        </p>
        <h2 className="text-2xl font-bold text-fg">Clasificación</h2>
      </div>

      <div className="rounded-xl border border-border overflow-hidden bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted w-12">#</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Nombre</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-fg-muted pr-5">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const pos = index + 1;
              const style = POSITION_STYLE[pos];
              return (
                <tr
                  key={row.id}
                  className="border-b border-border-sub last:border-0 hover:bg-overlay transition-colors"
                >
                  <td className="px-4 py-3">
                    {style ? (
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${style.badge}`}>
                        {pos}
                      </span>
                    ) : (
                      <span className="text-fg-muted font-mono text-xs tabular-nums">{pos}</span>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${style ? style.name : "text-fg"}`}>
                    {row.name}
                  </td>
                  <td className="px-4 py-3 text-right pr-5">
                    <span className={`font-mono font-bold tabular-nums ${style ? style.points : "text-fg-muted"}`}>
                      {row.points}
                    </span>
                    {row.has_asterisk && (
                      <span className="text-accent text-xs ml-px font-bold">*</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-16 text-center text-fg-muted text-sm">
                  No hay datos de clasificacion
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {rows.length > 0 && (
        <p className="text-sm text-fg-muted mt-3 text-right pr-1">
          * salida no completada
        </p>
      )}
    </div>
  );
}
