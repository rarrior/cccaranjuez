import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: activeSeason } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  let outingsCount = 0;
  if (activeSeason) {
    const { count } = await supabase
      .from("outings")
      .select("*", { count: "exact", head: true })
      .eq("season_id", activeSeason.id);
    outingsCount = count ?? 0;
  }

  const { count: membersCount } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true });

  return (
    <div>
      <div className="mb-6">
        <p className="text-[10px] font-extrabold tracking-[.12em] uppercase text-fg-muted mb-0.5">
          Panel de directiva
        </p>
        <h1 className="text-xl font-black text-fg">Dashboard</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {/* Temporada — yellow accent */}
        <div
          className="rounded-xl border p-4"
          style={{
            background: "linear-gradient(135deg, #fffbeb, #fff6c2)",
            borderColor: "rgba(245,194,0,.4)",
          }}
        >
          <p className="text-xs text-fg-muted mb-1.5 truncate">Temporada</p>
          <p className="text-3xl font-black" style={{ color: "#b8900a" }}>
            {activeSeason ? String(activeSeason.year) : "—"}
          </p>
        </div>

        {/* Salidas — blue accent */}
        <div
          className="rounded-xl border p-4"
          style={{
            background: "linear-gradient(135deg, #eef3ff, #dce6ff)",
            borderColor: "rgba(23,86,214,.2)",
          }}
        >
          <p className="text-xs text-fg-muted mb-1.5 truncate">Salidas</p>
          <p className="text-3xl font-black text-blue-mid">{outingsCount}</p>
        </div>

        {/* Socios */}
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-xs text-fg-muted mb-1.5 truncate">Socios</p>
          <p className="text-3xl font-black text-fg">{membersCount ?? 0}</p>
        </div>
      </div>

      <p className="text-[10px] font-extrabold text-fg-muted uppercase tracking-[.1em] mb-3">
        Acciones rápidas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Link
          href="/admin/outings/new"
          className="bg-blue-mid text-white rounded-xl px-4 py-3 text-sm font-extrabold hover:bg-blue-mid/90 transition-colors text-center flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Registrar salida
        </Link>
        <Link
          href="/admin/classification"
          className="bg-surface border border-border text-fg rounded-xl px-4 py-3 text-sm font-semibold hover:bg-overlay transition-colors text-center"
        >
          Ver clasificacion
        </Link>
        <Link
          href="/admin/members"
          className="bg-surface border border-border text-fg rounded-xl px-4 py-3 text-sm font-semibold hover:bg-overlay transition-colors text-center"
        >
          Gestionar socios
        </Link>
      </div>
    </div>
  );
}
