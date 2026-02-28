"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignOutButton() {
  const [supabase, setSupabase] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setSupabase(client);
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-gray-600 hover:text-gray-800"
    >
      Sign out
    </button>
  );
}
