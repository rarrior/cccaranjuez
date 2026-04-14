"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMember(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const name = formData.get("name") as string;
  const seniorityMonth = formData.get("seniority") as string; // "YYYY-MM"

  if (!name || !seniorityMonth) {
    return { error: "Nombre y antiguedad son obligatorios" };
  }

  const seniority = `${seniorityMonth}-01`; // "YYYY-MM-01"

  const { error } = await supabase
    .from("members")
    .insert({ name, seniority });

  if (error) return { error: error.message };

  revalidatePath("/admin/members");
  return { success: true };
}

export async function updateMember(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const seniorityMonth = formData.get("seniority") as string;

  if (!id || !name || !seniorityMonth) {
    return { error: "Datos incompletos" };
  }

  const seniority = `${seniorityMonth}-01`;

  const { error } = await supabase
    .from("members")
    .update({ name, seniority })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/members");
  return { success: true };
}

export async function deleteMember(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID requerido");

  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/members");
}
