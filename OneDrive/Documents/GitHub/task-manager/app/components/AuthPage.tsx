"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [supabase, setSupabase] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    setSupabase(client);

    // Check if user is already logged in
    const checkSession = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session) {
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Session check error:", error);
      }
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          console.log("User signed in:", session.user.email);
          // Small delay to ensure session is synced
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  if (!supabase || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-80 h-80 bg-purple-600 rounded-full blur-3xl opacity-20 -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20 -bottom-40 -right-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-600 rounded-2xl shadow-2xl mb-4 mx-auto transform hover:scale-110 transition-transform duration-300">
            <span className="text-3xl">📋</span>
          </div>
<h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Task-it
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Organize your work, amplify your productivity
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700 backdrop-blur-xl hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#a855f7",
                    brandAccent: "#9333ea",
                  },
                },
              },
            }}
            providers={["github"]}
            socialLayout="horizontal"
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Powered by
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold ml-1">
              Next.js • Supabase • Zod
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
