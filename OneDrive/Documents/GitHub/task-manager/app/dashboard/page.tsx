import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import SignOutButton from "../components/SignOutButton";
import DashboardClient from "../components/DashboardClient";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  // Fetch tasks with all fields
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, is_completed, priority, due_date, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">📋 My Tasks</h1>
            <p className="text-gray-600 mt-1">Manage your daily tasks efficiently</p>
          </div>
          <SignOutButton />
        </div>
      </header>

      {/* Pass to client component */}
      <DashboardClient initialTasks={tasks || []} />
    </div>
  );
}
