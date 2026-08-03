"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────
interface CollegeQuick {
  id: string;
  name: string;
  location: string;
  tier: "reach" | "match" | "safety";
  acceptanceRate: string;
  avgGPA: string;
  avgSAT: string;
  tuition: string;
  tagline: string;
  autoAdmitEligible?: boolean;
  autoAdmitNote?: string;
}

interface CollegeDeep {
  id: string;
  whyItFits: string;
  notablePrograms: string[];
  applicationTips: string[];
  financialAid: string;
  deadlines: string;
  strengths: string[];
  campusLife: string;
}

interface CollegeResult {
  quickList: CollegeQuick[];
  deepDives: CollegeDeep[];
}

interface FormData {
  name: string;
  gpa: string;
  satScore: string;
  actScore: string;
  intendedMajor: string;
  collegeType: string;
  location: string;
  interests: string;
  isTexasResident: boolean;
  classRank: string;
  classSize: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  gpa: "",
  satScore: "",
  actScore: "",
  intendedMajor: "",
  collegeType: "",
  location: "",
  interests: "",
  isTexasResident: false,
  classRank: "",
  classSize: "",
};

const TIER_CONFIG = {
  reach: { label: "Reach", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", text: "#FCA5A5", dot: "#EF4444" },
  match: { label: "Match", bg: "rgba(79,70,229,0.12)", border: "rgba(79,70,229,0.3)", text: "#818CF8", dot: "#4F46E5" },
  safety: { label: "Safety", bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.3)", text: "#34D399", dot: "#34D399" },
};

// ── Loading Skeleton ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl" style={{ background: "rgba(79,70,229,0.2)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded-lg w-56" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-3 rounded-lg w-36" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl p-5 space-y-3" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="h-4 rounded w-3/4" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 rounded w-1/2" style={{ background: "rgba(255,255,255,0.04)" }} />
            <div className="h-3 rounded w-2/3" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── College Card ───────────────────────────────────────────
function CollegeCard({
  college,
  deep,
}: {
  college: CollegeQuick;
  deep: CollegeDeep | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const tier = TIER_CONFIG[college.tier];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "#111F3C",
        border: expanded ? "1px solid rgba(79,70,229,0.35)" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: expanded ? "0 0 30px rgba(79,70,229,0.1)" : "none",
      }}
    >
      {/* Quick info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: tier.bg, border: `1px solid ${tier.border}`, color: tier.text }}
              >
                {tier.label}
              </span>
              {college.autoAdmitEligible && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34D399" }}
                >
                  🎓 Auto-Admit Eligible
                </span>
              )}
            </div>
            <h3
              className="text-base font-bold"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}
            >
              {college.name}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
              {college.location}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: tier.bg, border: `1px solid ${tier.border}` }}
          >
            <span className="text-lg">🎓</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: "Accept Rate", value: college.acceptanceRate },
            { label: "Avg GPA", value: college.avgGPA },
            { label: "Avg SAT", value: college.avgSAT },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg p-2 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-xs font-semibold" style={{ color: "#F0F4FF" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "#475569" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed mb-4" style={{ color: "#64748B" }}>
          {college.tagline}
        </p>

        {college.autoAdmitNote && (
          <p className="text-xs leading-relaxed mb-4" style={{ color: "#34D399" }}>
            🎓 {college.autoAdmitNote}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: "#475569" }}>
            {college.tuition}
          </span>
          {deep && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold transition-all"
              style={{ color: "#818CF8" }}
            >
              {expanded ? "Hide details" : "Deep dive"}
              <svg
                className="w-3.5 h-3.5 transition-transform duration-300"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Deep dive */}
      {expanded && deep && (
        <div
          className="px-5 pb-5 pt-4 space-y-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Why it fits */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#4F46E5" }}>
              Why It Fits You
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{deep.whyItFits}</p>
          </div>

          {/* Notable programs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#38BDF8" }}>
              Notable Programs
            </h4>
            <div className="flex flex-wrap gap-2">
              {deep.notablePrograms.map((p) => (
                <span
                  key={p}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "#38BDF8" }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#34D399" }}>
              Strengths
            </h4>
            <div className="flex flex-col gap-1.5">
              {deep.strengths.map((s) => (
                <div key={s} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#34D399" }} />
                  <span className="text-sm" style={{ color: "#94A3B8" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Application tips */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#FBBF24" }}>
              Application Tips
            </h4>
            <div className="flex flex-col gap-1.5">
              {deep.applicationTips.map((t) => (
                <div key={t} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FBBF24" }} />
                  <span className="text-sm" style={{ color: "#94A3B8" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial aid + deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: "rgba(79,70,229,0.08)", border: "1px solid rgba(79,70,229,0.2)" }}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#818CF8" }}>
                Financial Aid
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>{deep.financialAid}</p>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)" }}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#38BDF8" }}>
                Key Deadlines
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>{deep.deadlines}</p>
            </div>
          </div>

          {/* Campus life */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#F472B6" }}>
              Campus Life
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{deep.campusLife}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function CollegesPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CollegeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function isValid() {
    return form.name.trim() && form.gpa.trim() && form.intendedMajor.trim() && form.collegeType;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/plan/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(EMPTY_FORM);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const reaches = result?.quickList.filter((c) => c.tier === "reach") ?? [];
  const matches = result?.quickList.filter((c) => c.tier === "match") ?? [];
  const safeties = result?.quickList.filter((c) => c.tier === "safety") ?? [];

  return (
    <div
      className="min-h-screen pt-16"
      style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}
    >
      <div className="container-app px-6 py-12 md:py-16 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="badge mb-4">College Finder</span>
          <h1
            className="font-display mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.025em", color: "#F0F4FF" }}
          >
            Find Your{" "}
            <span style={{ background: "linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Perfect College Match
            </span>
          </h1>
          <p className="text-sm md:text-base max-w-lg mx-auto" style={{ color: "#64748B" }}>
            Tell us your profile and goals. Claude will search the web for real, current data and build your personalized college list with reach, match, and safety schools.
          </p>
        </div>

        {/* Form */}
        {!result && (
          <form onSubmit={handleSubmit} noValidate>
            <div
              className="rounded-2xl p-6 md:p-8 mb-6"
              style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Full Name *</label>
                  <input type="text" className="form-input" placeholder="e.g. Alex Johnson" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Current GPA *</label>
                  <input type="text" className="form-input" placeholder="e.g. 3.8" value={form.gpa} onChange={(e) => update("gpa", e.target.value)} required maxLength={4} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Intended Major *</label>
                  <input type="text" className="form-input" placeholder="e.g. Computer Science, Pre-Med" value={form.intendedMajor} onChange={(e) => update("intendedMajor", e.target.value)} required />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Target College Type *</label>
                  <select className="form-select" value={form.collegeType} onChange={(e) => update("collegeType", e.target.value)} required>
                    <option value="">Select type…</option>
                    <option value="Ivy League / Top 10">Ivy League / Top 10</option>
                    <option value="Top 50 National University">Top 50 National University</option>
                    <option value="State / Regional University">State / Regional University</option>
                    <option value="Liberal Arts College">Liberal Arts College</option>
                    <option value="Community College">Community College</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">SAT Score</label>
                  <input type="text" className="form-input" placeholder="e.g. 1400" value={form.satScore} onChange={(e) => update("satScore", e.target.value)} maxLength={4} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">ACT Score</label>
                  <input type="text" className="form-input" placeholder="e.g. 31" value={form.actScore} onChange={(e) => update("actScore", e.target.value)} maxLength={2} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Your Location</label>
                  <input type="text" className="form-input" placeholder="e.g. Austin, TX" value={form.location} onChange={(e) => update("location", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="form-label">Special Interests / Notes</label>
                  <input type="text" className="form-input" placeholder="e.g. strong research, small campus, warm weather" value={form.interests} onChange={(e) => update("interests", e.target.value)} />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.isTexasResident}
                      onChange={(e) => update("isTexasResident", e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="form-label !mb-0">I'm a Texas resident (check auto-admit eligibility)</span>
                  </label>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Texas law guarantees admission to Texas public universities for in-state students in the top 10% of their class — some schools (like UT Austin) set a stricter cutoff.
                  </p>
                </div>

                {form.isTexasResident && (
                  <>
                    <div className="flex flex-col gap-1.5">
                      <label className="form-label">Class Rank</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        placeholder="e.g. 15"
                        value={form.classRank}
                        onChange={(e) => update("classRank", e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="form-label">Graduating Class Size</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-input"
                        placeholder="e.g. 450"
                        value={form.classSize}
                        onChange={(e) => update("classSize", e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>

                    {form.classRank && form.classSize && Number(form.classSize) > 0 && (
                      <div className="md:col-span-2 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(79,70,229,0.1)", border: "1px solid rgba(79,70,229,0.25)", color: "#A5B4FC" }}>
                        {(() => {
                          const percentile = (Number(form.classRank) / Number(form.classSize)) * 100;
                          return (
                            <>
                              You're in the top <strong>{percentile.toFixed(1)}%</strong> of your class.{" "}
                              {percentile <= 5
                                ? "This likely qualifies you for automatic admission to UT Austin and most Texas public universities."
                                : percentile <= 10
                                ? "This likely qualifies you for automatic admission to Texas A&M and most Texas public universities (UT Austin's cutoff is stricter, currently top 5%)."
                                : "This is above the general 10% auto-admit cutoff for Texas public universities, though some schools may still offer other guaranteed-admission pathways — worth checking each school directly."}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </>
                )}
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

            <button type="submit" disabled={!isValid() || loading} className="btn-primary w-full text-base py-4">
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25" />
                    <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                  </svg>
                  Finding your best matches…
                </>
              ) : (
                <>
                  Find My College Matches
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-center text-xs mt-3" style={{ color: "#334155" }}>
              Fields marked * are required · Results include real-time web data
            </p>
          </form>
        )}

        {/* Loading */}
        {loading && (
          <div
            className="mt-8 rounded-2xl p-6 md:p-8"
            style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.3)" }}
              >
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2" />
                  <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F0F4FF" }}>
                  Searching for {form.name ? `${form.name}'s` : "your"} best college matches…
                </p>
                <p className="text-xs" style={{ color: "#475569" }}>
                  Claude is searching the web for real data — usually takes 20–40 seconds
                </p>
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-10">

            {/* Summary bar */}
            <div
              className="rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: "#111F3C", border: "1px solid rgba(79,70,229,0.2)" }}
            >
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#F0F4FF" }}>
                  {form.name ? `${form.name}'s` : "Your"} College List — {result.quickList.length} Schools
                </p>
                <div className="flex items-center gap-3">
                  {[
                    { label: `${reaches.length} Reach`, color: "#EF4444" },
                    { label: `${matches.length} Match`, color: "#4F46E5" },
                    { label: `${safeties.length} Safety`, color: "#34D399" },
                  ].map((item) => (
                    <span key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <button onClick={handleReset} className="btn-ghost text-sm px-4 py-2 whitespace-nowrap">
                Start Over
              </button>
            </div>

            {/* Reach schools */}
            {reaches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#EF4444" }} />
                  <h2 className="text-base font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                    Reach Schools
                  </h2>
                  <span className="text-xs" style={{ color: "#475569" }}>— Ambitious but attainable</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {reaches.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      deep={result.deepDives.find((d) => d.id === college.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Match schools */}
            {matches.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4F46E5" }} />
                  <h2 className="text-base font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                    Match Schools
                  </h2>
                  <span className="text-xs" style={{ color: "#475569" }}>— Strong fit for your profile</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {matches.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      deep={result.deepDives.find((d) => d.id === college.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Safety schools */}
            {safeties.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#34D399" }} />
                  <h2 className="text-base font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                    Safety Schools
                  </h2>
                  <span className="text-xs" style={{ color: "#475569" }}>— Where you'll thrive for sure</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {safeties.map((college) => (
                    <CollegeCard
                      key={college.id}
                      college={college}
                      deep={result.deepDives.find((d) => d.id === college.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Footer note */}
            <p className="text-xs text-center pb-4" style={{ color: "#334155" }}>
              College data sourced via web search at time of generation. Always verify current acceptance rates and deadlines on each school's official website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}