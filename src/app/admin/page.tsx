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

  const stats = [
    { label: "Temporada activa", value: activeSeason ? String(activeSeason.year) : "—" },
    { label: "Salidas",          value: String(outingsCount) },
    { label: "Socios",           value: String(membersCount ?? 0) },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-fg mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-surface rounded-xl border border-border p-4">
            <p className="text-sm text-fg-muted mb-2">{label}</p>
            <p className="text-3xl font-bold text-fg">{value}</p>
          </div>
        ))}
      </div>

      <p className="text-sm font-medium text-fg-muted mb-3">Acciones</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Link
          href="/admin/outings/new"
          className="bg-fg text-canvas rounded-xl px-4 py-3 text-sm font-semibold hover:bg-fg/90 transition-colors text-center"
        >
          Registrar salida
        </Link>
        <Link
          href="/admin/classification"
          className="bg-surface border border-border text-fg rounded-xl px-4 py-3 text-sm font-medium hover:bg-overlay transition-colors text-center"
        >
          Ver clasificacion
        </Link>
        <Link
          href="/admin/members"
          className="bg-surface border border-border text-fg rounded-xl px-4 py-3 text-sm font-medium hover:bg-overlay transition-colors text-center"
        >
          Gestionar socios
        </Link>
      </div>
    </div>
  );
}
