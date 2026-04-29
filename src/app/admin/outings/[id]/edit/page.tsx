import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditOutingClient from "./EditOutingClient";

export const dynamic = "force-dynamic";

export default async function EditOutingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: outing } = await supabase
    .from("outings")
    .select("*")
    .eq("id", id)
    .single();

  if (!outing) redirect("/admin/outings");

  const [{ data: season }, { data: members }, { data: attendances }] = await Promise.all([
    supabase.from("seasons").select("*").eq("id", outing.season_id).single(),
    supabase.from("members").select("*").order("name", { ascending: true }),
    supabase.from("attendances").select("*").eq("outing_id", id),
  ]);

  return (
    <EditOutingClient
      outing={outing}
      seasonYear={season?.year ?? 0}
      members={members ?? []}
      attendances={attendances ?? []}
    />
  );
}
