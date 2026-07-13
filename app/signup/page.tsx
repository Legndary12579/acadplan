"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await signUp(email, password);

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div
        className="min-h-screen pt-16 flex items-center justify-center px-6"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}
      >
        <div className="w-full max-w-md text-center">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1
            className="font-display mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "1.75rem", color: "#F0F4FF" }}
          >
            Check your email
          </h1>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            We sent a confirmation link to <strong style={{ color: "#94A3B8" }}>{email}</strong>.
            Click it to activate your account, then log in below.
          </p>
          <Link href="/login" className="btn-primary inline-flex">
            Go to Login
          </Link>
        </div>
      </div>
    );
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
            Create your account
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Save your academic plans and track your progress over time
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
                Creating account…
              </>
            ) : (
              <>
                Create Account
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <p className="text-center text-sm mt-6" style={{ color: "#64748B" }}>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#818CF8" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}