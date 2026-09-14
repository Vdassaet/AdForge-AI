"use client";

import Link from "next/link";
import { resetPassword } from "../actions";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      const result = await resetPassword(formData);
      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        setIsSuccess(true);
        toast.success("Password reset link sent!");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {isSuccess 
              ? "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>
        
        {!isSuccess && (
          <form className="mt-8 space-y-6" action={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </div>
          </form>
        )}
        
        <p className="text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
