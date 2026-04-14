import { createClient } from "@/lib/supabase/server";
import ClassificationTable from "@/components/ClassificationTable";
import ExportButton from "@/components/ExportButton";
import type { ClassificationRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminClassificationPage() {
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Clasificacion</h1>

      <ClassificationTable rows={rows} year={year} />

      {rows.length > 0 && <ExportButton rows={rows} year={year} />}
    </div>
  );
}
