import { createClient } from "@/lib/supabase/server";
import SeasonsClient from "./SeasonsClient";

export const dynamic = "force-dynamic";

export default async function SeasonsPage() {
  const supabase = await createClient();
  const { data: seasons } = await supabase
    .from("seasons")
    .select("*")
    .order("year", { ascending: false });

  return <SeasonsClient seasons={seasons ?? []} />;
}
