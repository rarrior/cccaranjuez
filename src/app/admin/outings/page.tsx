import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteOuting } from "./actions";

export const dynamic = "force-dynamic";

export default async function OutingsPage() {
  const supabase = await createClient();

  const { data: activeSeason } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  let outings: Array<{ id: string; date: string; description: string | null; created_at: string }> = [];

  if (activeSeason) {
    const { data } = await supabase
      .from("outings")
      .select("*")
      .eq("season_id", activeSeason.id)
      .order("date", { ascending: false });
    outings = data ?? [];
  }

  const total = outings.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-fg-muted mb-0.5">
            {activeSeason ? `Temporada ${activeSeason.year}` : "Sin temporada activa"}
          </p>
          <h1 className="text-xl font-black text-fg">Salidas</h1>
        </div>
        {activeSeason && (
          <Link
            href="/admin/outings/new"
            className="bg-blue-mid text-white px-3 py-1.5 rounded-lg text-xs font-extrabold hover:bg-blue-mid/90 transition-colors flex items-center gap-1.5"
          >
            <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nueva salida
          </Link>
        )}
      </div>

      {!activeSeason && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
          No hay temporada activa.{" "}
          <Link href="/admin/seasons" className="underline font-semibold hover:text-amber-900">
            Crea una temporada
          </Link>{" "}
          para empezar a registrar salidas.
        </div>
      )}

      {activeSeason && (
        <div className="bg-surface rounded-xl border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-canvas">
                <th className="text-left px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.08em] text-fg-muted w-12">#</th>
                <th className="text-left px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.08em] text-fg-muted">Fecha</th>
                <th className="text-left px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.08em] text-fg-muted">Descripcion</th>
                <th className="text-right px-4 py-3 text-[10px] font-extrabold uppercase tracking-[.08em] text-fg-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {outings.map((outing, index) => (
                <tr key={outing.id} className="border-b border-border-sub last:border-0 hover:bg-overlay transition-colors">
                  <td className="px-4 py-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white"
                      style={{ background: "var(--color-blue-mid)" }}
                    >
                      {total - index}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-fg font-semibold">
                    {new Date(outing.date).toLocaleDateString("es-ES", {
                      weekday: "short", day: "numeric", month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-fg-muted">
                    {outing.description || <span className="text-fg-subtle">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteOuting} className="inline">
                      <input type="hidden" name="id" value={outing.id} />
                      <button
                        type="submit"
                        className="text-xs text-red-500 hover:text-red-600 transition-colors border border-red-200 hover:border-red-300 rounded-md px-2.5 py-1"
                      >
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {outings.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-fg-muted text-sm">
                    No hay salidas registradas esta temporada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
