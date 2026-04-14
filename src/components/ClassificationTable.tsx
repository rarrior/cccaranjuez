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
                    <span className="inline-flex items-center justify-end gap-2">
                      {row.asterisk_count > 0 && (
                        <span className="relative group cursor-default outline-none" tabIndex={0}>
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent text-[10px] font-bold leading-none">
                            {row.asterisk_count}
                          </span>
                          <span className="pointer-events-none absolute bottom-full right-0 mb-1.5 w-max max-w-[160px] rounded-lg bg-overlay border border-border px-2.5 py-1.5 text-xs text-fg shadow-lg opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-150 text-center">
                            {row.asterisk_count === 1
                              ? "1 salida no completada"
                              : `${row.asterisk_count} salidas no completadas`}
                          </span>
                        </span>
                      )}
                      <span className={`font-mono font-bold tabular-nums ${style ? style.points : "text-fg-muted"}`}>
                        {row.points}
                      </span>
                    </span>
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

    </div>
  );
}
