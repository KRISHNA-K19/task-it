"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";

// schemas for validation
const taskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).min(3, { message: "Title must be at least 3 characters" }),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  due_date: z.string().optional().nullable(),
});

const editTaskSchema = taskSchema.extend({
  id: z.string().uuid(),
});

async function getServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function createTask(formData: FormData) {
  try {
    const title = formData.get("title");
    const priority = formData.get("priority") || "medium";
    const due_date = formData.get("due_date") || null;

    const parsed = taskSchema.safeParse({ title, priority, due_date });
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(errors);
    }

    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { error } = await supabase.from("tasks").insert({
      title: parsed.data.title,
      priority: parsed.data.priority,
      due_date: parsed.data.due_date || null,
      user_id: user.id,
    });

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to create task");
  }
}

export async function editTask(formData: FormData) {
  try {
    const id = formData.get("id");
    const title = formData.get("title");
    const priority = formData.get("priority") || "medium";
    const due_date = formData.get("due_date") || null;

    const parsed = editTaskSchema.safeParse({ id, title, priority, due_date });
    if (!parsed.success) {
      const errors = parsed.error.issues.map((e) => e.message).join(", ");
      throw new Error(errors);
    }

    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        title: parsed.data.title,
        priority: parsed.data.priority,
        due_date: parsed.data.due_date || null,
      })
      .eq("id", parsed.data.id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to edit task");
  }
}

export async function toggleTask(id: string) {
  try {
    const supabase = await getServerSupabase();

    const { data: existing, error: fetchError } = await supabase
      .from("tasks")
      .select("is_completed")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) throw new Error("Task not found");

    const { error: updateError } = await supabase
      .from("tasks")
      .update({ is_completed: !existing.is_completed })
      .eq("id", id);

    if (updateError) throw updateError;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to toggle task");
  }
}

export async function deleteTask(id: string) {
  try {
    const supabase = await getServerSupabase();

    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete task");
  }
}
