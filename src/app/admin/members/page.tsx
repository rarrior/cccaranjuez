import { createClient } from "@/lib/supabase/server";
import MembersClient from "./MembersClient";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("seniority", { ascending: true });

  return <MembersClient members={members ?? []} />;
}
