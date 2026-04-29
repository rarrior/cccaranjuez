"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOuting(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const seasonId = formData.get("season_id") as string;
  const date = formData.get("date") as string;
  const description = (formData.get("description") as string) || null;

  if (!seasonId || !date) {
    return { error: "Temporada y fecha son obligatorias" };
  }

  // Create the outing
  const { data: outing, error: outingError } = await supabase
    .from("outings")
    .insert({ season_id: seasonId, date, description })
    .select()
    .single();

  if (outingError) return { error: outingError.message };

  // Process attendances
  const attendees = formData.getAll("attendee") as string[];
  const completedList = formData.getAll("completed") as string[];

  if (attendees.length > 0) {
    const attendances = attendees.map((memberId) => ({
      outing_id: outing.id,
      member_id: memberId,
      completed: completedList.includes(memberId),
    }));

    const { error: attError } = await supabase
      .from("attendances")
      .insert(attendances);

    if (attError) return { error: attError.message };
  }

  revalidatePath("/admin/outings");
  revalidatePath("/admin/classification");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/classification");
}

export async function updateOuting(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const outingId = formData.get("outing_id") as string;
  const date = formData.get("date") as string;
  const description = (formData.get("description") as string) || null;

  if (!outingId || !date) {
    return { error: "ID y fecha son obligatorios" };
  }

  const { error: outingError } = await supabase
    .from("outings")
    .update({ date, description })
    .eq("id", outingId);

  if (outingError) return { error: outingError.message };

  const { error: deleteError } = await supabase
    .from("attendances")
    .delete()
    .eq("outing_id", outingId);

  if (deleteError) return { error: deleteError.message };

  const attendees = formData.getAll("attendee") as string[];
  const completedList = formData.getAll("completed") as string[];

  if (attendees.length > 0) {
    const attendances = attendees.map((memberId) => ({
      outing_id: outingId,
      member_id: memberId,
      completed: completedList.includes(memberId),
    }));

    const { error: attError } = await supabase.from("attendances").insert(attendances);
    if (attError) return { error: attError.message };
  }

  revalidatePath("/admin/outings");
  revalidatePath("/admin/classification");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/outings");
}

export async function deleteOuting(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID requerido");

  const { error } = await supabase.from("outings").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/outings");
  revalidatePath("/admin/classification");
  revalidatePath("/admin");
  revalidatePath("/");
}
