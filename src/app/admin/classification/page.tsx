import { createClient } from "@/lib/supabase/server";
import ClassificationTable from "@/components/ClassificationTable";
import ExportButton from "@/components/ExportButton";
import ShareImageButton from "@/components/ShareImageButton";
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
      <ClassificationTable rows={rows} year={year} />

      {rows.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="sm:flex-1"><ExportButton rows={rows} year={year} /></div>
          <div className="sm:flex-1"><ShareImageButton rows={rows} year={year} /></div>
        </div>
      )}
    </div>
  );
}
