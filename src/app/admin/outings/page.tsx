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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-fg">Salidas</h1>
          {activeSeason && <p className="text-sm text-fg-muted mt-0.5">Temporada {activeSeason.year}</p>}
        </div>
        {activeSeason && (
          <Link
            href="/admin/outings/new"
            className="bg-fg text-canvas px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-fg/90 transition-colors"
          >
            Nueva salida
          </Link>
        )}
      </div>

      {!activeSeason && (
        <div className="bg-amber-950/40 border border-amber-700/50 rounded-xl p-4 text-sm text-amber-300">
          No hay temporada activa.{" "}
          <Link href="/admin/seasons" className="underline font-medium hover:text-amber-200">
            Crea una temporada
          </Link>{" "}
          para empezar a registrar salidas.
        </div>
      )}

      {activeSeason && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Fecha</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-fg-muted">Descripcion</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-fg-muted">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {outings.map((outing) => (
                <tr key={outing.id} className="border-b border-border-sub last:border-0 hover:bg-overlay transition-colors">
                  <td className="px-4 py-3 text-fg font-medium">
                    {new Date(outing.date).toLocaleDateString("es-ES", {
                      weekday: "short", day: "numeric", month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-fg-muted">
                    {outing.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={deleteOuting} className="inline">
                      <input type="hidden" name="id" value={outing.id} />
                      <button type="submit" className="text-sm text-red-500 hover:text-red-400 transition-colors">
                        Eliminar
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {outings.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-fg-muted text-sm">
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
