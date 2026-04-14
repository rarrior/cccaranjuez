import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ClassificationTable from "@/components/ClassificationTable";
import type { ClassificationRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: activeSeason } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  let rows: ClassificationRow[] = [];

  if (activeSeason) {
    const { data } = await supabase
      .from("classification")
      .select("*")
      .order("points", { ascending: false })
      .order("asterisk_count", { ascending: true })
      .order("seniority", { ascending: true })
      .order("name", { ascending: true });
    rows = (data as ClassificationRow[]) ?? [];
  }

  const year = activeSeason?.year ?? new Date().getFullYear();

  return (
    <>
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-fg flex items-center justify-center">
              <span className="text-canvas font-black text-xs">C</span>
            </div>
            <span className="font-semibold text-sm text-fg">CCC Real Sitio de Aranjuez</span>
          </div>
          <Link href="/login" className="text-sm text-fg-muted hover:text-fg transition-colors">
            Directiva
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        <ClassificationTable rows={rows} year={year} />
        {!activeSeason && (
          <div className="text-center py-20">
            <p className="text-fg-muted text-sm">No hay temporada activa en este momento.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border text-center py-6 text-sm text-fg-muted">
        Club Ciclista CCC &middot; Real Sitio de Aranjuez
      </footer>
    </>
  );
}
