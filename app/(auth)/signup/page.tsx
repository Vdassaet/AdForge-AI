"use client";

import Link from "next/link";
import { signup } from "../actions";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
        },
      });
      if (error) throw error;
    } catch {
      toast.error("Failed to connect to Google");
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await signup(formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success("Account created successfully!");
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-[400px] bg-white p-10 rounded-3xl shadow-xl border relative">
        <Link href="/" className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </Link>
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            Create an account
          </h2>
          <p className="text-sm text-slate-600">
            Launch your ads effortlessly without the complexity of Meta.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
          
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-full border border-slate-300 bg-white py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors opacity-60 cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.05 2.53.82 3.1 1.18 1.14-.92 2.66-1.3 3.94-1.05 1.63.31 3.06 1.25 3.84 2.58-3.14 1.77-2.63 6.01.44 7.23-.74 1.4-1.63 2.76-2.32 3.03zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.02 4.46-3.74 4.25z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        <div className="relative mt-8 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-slate-500">OR</span>
          </div>
        </div>

        <form className="space-y-4" action={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="First Name"
              className="block w-full rounded-full border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
            />
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Last Name"
              className="block w-full rounded-full border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
            />
          </div>
          <div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Email address"
              className="block w-full rounded-full border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
            />
          </div>
          <div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Password"
              className="block w-full rounded-full border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="flex w-full justify-center rounded-full bg-black py-3 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Continuing..." : "Continue"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center justify-center space-y-2 text-sm text-slate-600">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
