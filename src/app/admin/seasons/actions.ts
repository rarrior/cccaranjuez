"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSeason(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const year = parseInt(formData.get("year") as string, 10);
  if (isNaN(year)) return { error: "Anno invalido" };

  // Deactivate all other seasons
  await supabase.from("seasons").update({ is_active: false }).neq("id", "");

  const { error } = await supabase
    .from("seasons")
    .insert({ year, is_active: true });

  if (error) return { error: error.message };

  revalidatePath("/admin/seasons");
  revalidatePath("/admin");
  return { success: true };
}

export async function activateSeason(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID requerido");

  // Deactivate all
  await supabase.from("seasons").update({ is_active: false }).neq("id", "");

  // Activate selected
  const { error } = await supabase
    .from("seasons")
    .update({ is_active: true })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/seasons");
  revalidatePath("/admin");
  revalidatePath("/");
}
