"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser, getMyPlans, signOut } from "@/lib/supabase";
import type { DbStudentPlan } from "@/types";

export default function MyPlansPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<DbStudentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DbStudentPlan | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const user = await getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email ?? null);

      const { data } = await getMyPlans();
      setPlans(data);
      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ background: "#0B1629" }}>
        <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2" />
          <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}
    >
      <div className="container-app px-6 py-12 md:py-16 max-w-5xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <span className="badge mb-3">My Account</span>
            <h1
              className="font-display mb-1"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em", color: "#F0F4FF" }}
            >
              My Academic Plans
            </h1>
            {userEmail && (
              <p className="text-sm" style={{ color: "#64748B" }}>
                Signed in as {userEmail}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/course-planner" className="btn-primary text-sm px-5 py-2.5">
              New Plan
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <button onClick={handleSignOut} className="btn-ghost text-sm px-5 py-2.5">
              Sign Out
            </button>
          </div>
        </div>

        {/* Empty state */}
        {plans.length === 0 && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
              style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.3)" }}
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
              No saved plans yet
            </h2>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              Generate your first academic plan and it will automatically be saved here.
            </p>
            <Link href="/course-planner" className="btn-primary inline-flex">
              Build My First Plan
            </Link>
          </div>
        )}

        {/* Plans list + detail view */}
        {plans.length > 0 && !selectedPlan && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className="card p-6 text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.3)" }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <span className="text-xs" style={{ color: "#475569" }}>
                    {formatDate(plan.created_at)}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                  {plan.intended_major}
                </h3>
                <p className="text-sm mb-3" style={{ color: "#64748B" }}>
                  {plan.grade_level} Grade · GPA {plan.gpa}
                  {plan.location && ` · ${plan.location}`}
                </p>
                <span className="text-xs font-semibold" style={{ color: "#818CF8" }}>
                  View full plan →
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Selected plan detail */}
        {selectedPlan && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(79,70,229,0.25)", boxShadow: "0 0 40px rgba(79,70,229,0.12)" }}>
            <div
              className="px-6 md:px-8 py-5 flex items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(17,31,60,0.9) 100%)", borderBottom: "1px solid rgba(79,70,229,0.2)" }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F0F4FF" }}>
                  {selectedPlan.intended_major} Plan
                </p>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Created {formatDate(selectedPlan.created_at)}
                </p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="btn-ghost text-xs px-3 py-2">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to all plans
              </button>
            </div>
            <div className="px-6 md:px-8 py-8" style={{ background: "#0F1B35" }}>
              <div className="space-y-1">
                {selectedPlan.ai_plan.split("\n").map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-2" />;
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-lg font-bold mt-6 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                        {line.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <div key={i} className="flex items-start gap-2 py-0.5">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#4F46E5" }} />
                        <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                          {line.replace(/^[-*] /, "")}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}