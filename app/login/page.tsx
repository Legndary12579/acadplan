"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/my-plans");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen pt-16 flex items-center justify-center px-6"
      style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4F46E5, #38BDF8)", boxShadow: "0 0 24px rgba(79,70,229,0.5)" }}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <h1
            className="font-display mb-2"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.875rem", color: "#F0F4FF" }}
          >
            Welcome back
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Log in to view and manage your saved academic plans
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 md:p-8"
          style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
        >
          <div className="flex flex-col gap-5 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}
            >
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-base py-3.5">
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
                  <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                </svg>
                Logging in…
              </>
            ) : (
              <>
                Log In
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm mt-6" style={{ color: "#64748B" }}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold" style={{ color: "#818CF8" }}>
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
}