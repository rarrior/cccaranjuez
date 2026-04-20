import Link from "next/link";
import Image from "next/image";
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
      <header className="bg-navy border-b border-navy/50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/icons/escudo-cccaranjuez.png" alt="CCC Aranjuez" width={36} height={36} />
            <div>
              <span className="font-extrabold text-sm text-white leading-none block">CCC Aranjuez</span>
              <span className="text-[10px] text-white/40 leading-none">Real Sitio</span>
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs text-white/50 hover:text-white/80 transition-colors border border-white/15 rounded-lg px-3 py-1.5"
          >
            Directiva
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-navy) 0%, var(--color-blue-mid) 55%, var(--color-blue-light) 100%)",
        }}
      >
        <div className="hero-stripes" />
        <div className="max-w-4xl mx-auto px-4 py-7 relative z-10">
          <p className="text-[10px] font-extrabold tracking-[.16em] uppercase text-accent mb-1">
            Temporada {year}
          </p>
          <h1 className="text-2xl font-black text-white leading-tight">
            Clasificación General
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Club Ciclista Cultural Real Sitio de Aranjuez
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {activeSeason ? (
          <ClassificationTable rows={rows} year={year} />
        ) : (
          <div className="text-center py-20">
            <p className="text-fg-muted text-sm">No hay temporada activa en este momento.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border text-center py-5 text-xs text-fg-muted">
        Club Ciclista CCC &middot; Real Sitio de Aranjuez
      </footer>
    </>
  );
}
