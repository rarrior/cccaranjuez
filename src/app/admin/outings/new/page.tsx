import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OutingFormClient from "./OutingFormClient";

export const dynamic = "force-dynamic";

export default async function NewOutingPage() {
  const supabase = await createClient();

  const { data: activeSeason } = await supabase
    .from("seasons")
    .select("*")
    .eq("is_active", true)
    .single();

  if (!activeSeason) {
    redirect("/admin/seasons");
  }

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("name", { ascending: true });

  return (
    <OutingFormClient
      seasonId={activeSeason.id}
      seasonYear={activeSeason.year}
      members={members ?? []}
    />
  );
}
