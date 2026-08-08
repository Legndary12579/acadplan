"use client";

import { useState } from "react";

interface Stats {
  totalPlans: number;
  totalUsers: number;
  plansByDay: Record<string, number>;
  requestsByRoute: Record<string, number>;
  recentPlans: {
    student_name: string;
    intended_major: string;
    grade_level: string;
    created_at: string;
    user_id: string | null;
  }[];
}

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [entered, setEntered] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-secret": secret },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load stats.");
      }

      setStats(data);
      setEntered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!entered) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <form onSubmit={handleUnlock} className="w-full max-w-sm rounded-2xl p-6" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-semibold mb-4" style={{ color: "#F0F4FF" }}>Admin Access</p>
          <input
            type="password"
            className="form-input w-full mb-3"
            placeholder="Admin secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoFocus
          />
          {error && (
            <p className="text-xs mb-3" style={{ color: "#EF4444" }}>{error}</p>
          )}
          <button type="submit" disabled={loading || !secret} className="btn-primary w-full text-sm py-2.5">
            {loading ? "Checking…" : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  if (!stats) return null;

  const days = Object.keys(stats.plansByDay).sort();
  const maxDayCount = Math.max(1, ...Object.values(stats.plansByDay));

  return (
    <div className="container-app px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8" style={{ color: "#F0F4FF" }}>Admin Dashboard</h1>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Plans Generated", value: stats.totalPlans },
          { label: "Registered Users", value: stats.totalUsers },
          { label: "College Searches (7d)", value: stats.requestsByRoute["colleges"] ?? 0 },
          { label: "Chat Messages (7d)", value: stats.requestsByRoute["chat"] ?? 0 },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl p-4" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-2xl font-bold mb-1" style={{ color: "#F0F4FF" }}>{stat.value}</p>
            <p className="text-xs" style={{ color: "#64748B" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Plans by day chart */}
      <div className="rounded-xl p-5 mb-10" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm font-semibold mb-4" style={{ color: "#F0F4FF" }}>Plans Generated — Last 14 Days</p>
        {days.length === 0 ? (
          <p className="text-xs" style={{ color: "#64748B" }}>No plans generated in this window.</p>
        ) : (
          <div className="flex items-end gap-2 h-32">
            {days.map((day) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-t"
                  style={{
                    height: `${Math.max(4, (stats.plansByDay[day] / maxDayCount) * 100)}%`,
                    background: "linear-gradient(180deg, #4F46E5, #38BDF8)",
                  }}
                  title={`${stats.plansByDay[day]} plans`}
                />
                <p className="text-[10px] whitespace-nowrap" style={{ color: "#475569" }}>
                  {new Date(day).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent plans table */}
      <div className="rounded-xl p-5" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm font-semibold mb-4" style={{ color: "#F0F4FF" }}>Recent Plans</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left" style={{ color: "#64748B" }}>
                <th className="pb-2 pr-4 font-medium">Student</th>
                <th className="pb-2 pr-4 font-medium">Major</th>
                <th className="pb-2 pr-4 font-medium">Grade</th>
                <th className="pb-2 pr-4 font-medium">Account</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPlans.map((plan, i) => (
                <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <td className="py-2 pr-4" style={{ color: "#F0F4FF" }}>{plan.student_name}</td>
                  <td className="py-2 pr-4" style={{ color: "#94A3B8" }}>{plan.intended_major}</td>
                  <td className="py-2 pr-4" style={{ color: "#94A3B8" }}>{plan.grade_level}</td>
                  <td className="py-2 pr-4" style={{ color: "#94A3B8" }}>{plan.user_id ? "Logged in" : "Anonymous"}</td>
                  <td className="py-2" style={{ color: "#64748B" }}>
                    {new Date(plan.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
