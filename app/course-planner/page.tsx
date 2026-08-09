"use client";

import { useState, useRef, useEffect } from "react";
import type { StudentProfile, FormState, GradeLevel, CollegeType } from "@/types";
import { getUser, getSession } from "@/lib/supabase";

const EMPTY_STUDENT: StudentProfile = {
  name: "",
  email: "",
  gradeLevel: "",
  gpaUnweighted: "",
  gpaWeighted: "",
  intendedMajor: "",
  collegeType: "",
  extracurriculars: "",
  careerGoals: "",
  challenges: "",
  zipCode: "",
  satScore: "",
  satSuperscore: "",
  actScore: "",
};

function FieldGroup({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="form-label">{label}</label>
      {children}
      {hint && <p className="text-xs" style={{ color: "#475569" }}>{hint}</p>}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl" style={{ background: "rgba(79,70,229,0.2)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-4 rounded-lg w-48" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-3 rounded-lg w-32" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>
      {[90, 75, 85, 60, 80, 70, 55, 78, 65, 88, 50, 72].map((w, i) => (
        <div key={i} className="h-3 rounded-lg" style={{ width: `${w}%`, background: "rgba(255,255,255,0.05)" }} />
      ))}
    </div>
  );
}

function PlanRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      elements.push(<div key={key++} className="h-2" />);
    } else if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="text-lg font-bold mt-6 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold mt-4 mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#C7D2FE" }}>
          {line.replace("### ", "")}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 py-0.5">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#4F46E5" }} />
          <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}
            dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^[-*] /, "")) }} />
        </div>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={key++} className="flex items-start gap-3 py-0.5">
          <span className="flex-shrink-0 w-5 h-5 rounded-md text-xs font-bold flex items-center justify-center mt-0.5"
            style={{ background: "rgba(79,70,229,0.2)", color: "#818CF8" }}>
            {num}
          </span>
          <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}
            dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\.\s/, "")) }} />
        </div>
      );
    } else if (line.startsWith("---")) {
      elements.push(<div key={key++} className="my-4" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />);
    } else {
      elements.push(
        <p key={key++} className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}
          dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#E2E8F0;font-weight:600">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#C7D2FE">$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(79,70,229,0.15);color:#C7D2FE;padding:1px 6px;border-radius:4px;font-size:0.8em">$1</code>');
}

export default function CoursePlannerPage() {
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT);
  const [formState, setFormState] = useState<FormState>({ step: "form", plan: null, error: null });
  const [userId, setUserId] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUser().then((user) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (formState.step === "result" && resultRef.current) {
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [formState.step]);

  function update(field: keyof StudentProfile, value: string) {
    setStudent((prev) => ({ ...prev, [field]: value }));
  }

  function isFormValid() {
    return (
      student.name.trim() &&
      student.email.trim() &&
      student.gradeLevel &&
      student.gpaUnweighted.trim() &&
      student.intendedMajor.trim() &&
      student.collegeType &&
      student.careerGoals.trim()
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isFormValid()) return;

    setFormState({ step: "loading", plan: null, error: null });

    try {
      const session = await getSession();

      const res = await fetch("/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ student, userId: userId ?? undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setFormState({ step: "result", plan: data.plan, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormState({ step: "form", plan: null, error: message });
    }
  }

  function handleReset() {
    setStudent(EMPTY_STUDENT);
    setFormState({ step: "form", plan: null, error: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen pt-16" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}>
      <div className="container-app px-6 py-12 md:py-16 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="badge mb-4">AI Academic Planner</span>
          <h1 className="font-display mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.025em", color: "#F0F4FF" }}>
            Build Your{" "}
            <span style={{ background: "linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Academic Plan
            </span>
          </h1>
          <p className="text-sm md:text-base max-w-lg mx-auto" style={{ color: "#64748B" }}>
            Fill in your profile below and get a personalized, AI-generated academic roadmap just for you.
          </p>
          {userId && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34D399" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
              Signed in — your plan will be saved automatically
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="rounded-2xl p-6 md:p-8 mb-6" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>

            {/* Personal Info */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.3)" }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
                  </svg>
                </div>
                <h2 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#818CF8" }}>
                  Personal Info
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Full Name *">
                  <input type="text" className="form-input" placeholder="e.g. Alex Johnson" value={student.name} onChange={(e) => update("name", e.target.value)} required />
                </FieldGroup>
                <FieldGroup label="Email Address *">
                  <input type="email" className="form-input" placeholder="alex@email.com" value={student.email} onChange={(e) => update("email", e.target.value)} required />
                </FieldGroup>
                <FieldGroup label="ZIP Code *" hint="Used to find local opportunities">
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input"
                    placeholder="e.g. 78701"
                    value={student.zipCode}
                    onChange={(e) => update("zipCode", e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                    maxLength={5}
                  />
                </FieldGroup>
              </div>
            </div>

            <div className="divider mb-8" />

            {/* Academic Profile */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.25)" }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h2 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#38BDF8" }}>
                  Academic Profile
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FieldGroup label="Current Grade Level *">
                  <select className="form-select" value={student.gradeLevel} onChange={(e) => update("gradeLevel", e.target.value as GradeLevel)} required>
                    <option value="">Select grade…</option>
                    <option value="9th">9th Grade (Freshman)</option>
                    <option value="10th">10th Grade (Sophomore)</option>
                    <option value="11th">11th Grade (Junior)</option>
                    <option value="12th">12th Grade (Senior)</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="Unweighted GPA *" hint="Out of 4.0">
                  <input type="text" className="form-input" placeholder="e.g. 3.7" value={student.gpaUnweighted} onChange={(e) => update("gpaUnweighted", e.target.value)} required maxLength={4} />
                </FieldGroup>
                <FieldGroup label="Weighted GPA" hint="Optional — often out of 5.0">
                  <input type="text" className="form-input" placeholder="e.g. 4.3" value={student.gpaWeighted} onChange={(e) => update("gpaWeighted", e.target.value)} maxLength={4} />
                </FieldGroup>
                <FieldGroup label="Intended Major / Field *">
                  <input type="text" className="form-input" placeholder="e.g. Computer Science, Pre-Med, Business" value={student.intendedMajor} onChange={(e) => update("intendedMajor", e.target.value)} required />
                </FieldGroup>
                <FieldGroup label="Target College Type *">
                  <select className="form-select" value={student.collegeType} onChange={(e) => update("collegeType", e.target.value as CollegeType)} required>
                    <option value="">Select type…</option>
                    <option value="ivy_league">Ivy League / Top 10</option>
                    <option value="top_50">Top 50 National University</option>
                    <option value="state_school">State / Regional University</option>
                    <option value="community_college">Community College</option>
                    <option value="undecided">Undecided</option>
                  </select>
                </FieldGroup>
                <FieldGroup label="SAT Score" hint="Optional — most recent single test date">
                  <input type="text" className="form-input" placeholder="e.g. 1350" value={student.satScore} onChange={(e) => update("satScore", e.target.value)} maxLength={4} />
                </FieldGroup>
                <FieldGroup label="SAT Superscore" hint="Optional — best section scores combined across sittings">
                  <input type="text" className="form-input" placeholder="e.g. 1420" value={student.satSuperscore} onChange={(e) => update("satSuperscore", e.target.value)} maxLength={4} />
                </FieldGroup>
                <FieldGroup label="ACT Score" hint="Optional — leave blank if not taken">
                  <input type="text" className="form-input" placeholder="e.g. 29" value={student.actScore} onChange={(e) => update("actScore", e.target.value)} maxLength={2} />
                </FieldGroup>
              </div>
            </div>

            <div className="divider mb-8" />

            {/* Goals */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <h2 className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#34D399" }}>
                  Goals & Background
                </h2>
              </div>
              <div className="flex flex-col gap-5">
                <FieldGroup label="Extracurricular Activities" hint="Clubs, sports, volunteering, jobs, hobbies">
                  <textarea className="form-input resize-none" rows={3} placeholder="e.g. Varsity soccer captain, NHS, robotics club…" value={student.extracurriculars} onChange={(e) => update("extracurriculars", e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Career Goals *" hint="What do you want to do or become after college?">
                  <textarea className="form-input resize-none" rows={3} placeholder="e.g. I want to become a software engineer at a tech company…" value={student.careerGoals} onChange={(e) => update("careerGoals", e.target.value)} required />
                </FieldGroup>
                <FieldGroup label="Current Challenges / Concerns" hint="What's holding you back or worrying you most?">
                  <textarea className="form-input resize-none" rows={3} placeholder="e.g. My math grades slipped last semester…" value={student.challenges} onChange={(e) => update("challenges", e.target.value)} />
                </FieldGroup>
              </div>
            </div>
          </div>

          {/* Error */}
          {formState.error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#FCA5A5" }}>
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {formState.error}
            </div>
          )}

          {/* Submit */}
          <button type="submit" disabled={!isFormValid() || formState.step === "loading"} className="btn-primary w-full text-base py-4">
            {formState.step === "loading" ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.25"/>
                  <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/>
                </svg>
                Building your personalized plan…
              </>
            ) : (
              <>
                Generate My Academic Plan
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
          <p className="text-center text-xs mt-3" style={{ color: "#334155" }}>
            Fields marked * are required
          </p>
        </form>

        {/* Loading */}
        {formState.step === "loading" && (
          <div className="mt-8 rounded-2xl p-6 md:p-8" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.3)" }}>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.2"/>
                  <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#F0F4FF" }}>Building {student.name ? `${student.name}'s` : "your"} plan…</p>
                <p className="text-xs" style={{ color: "#475569" }}>This usually takes 15–30 seconds</p>
              </div>
            </div>
            <LoadingSkeleton />
          </div>
        )}

        {/* Result */}
        {formState.step === "result" && formState.plan && (
          <div ref={resultRef} className="mt-8 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(79,70,229,0.25)", boxShadow: "0 0 40px rgba(79,70,229,0.12)" }}>
            <div className="px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(17,31,60,0.9) 100%)", borderBottom: "1px solid rgba(79,70,229,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)", boxShadow: "0 0 16px rgba(79,70,229,0.5)" }}>
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#F0F4FF" }}>{student.name ? `${student.name}'s` : "Your"} Academic Plan</p>
                  <p className="text-xs" style={{ color: "#475569" }}>AI-generated · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => {
                  const blob = new Blob([formState.plan ?? ""], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${student.name.replace(/\s+/g, "-").toLowerCase() || "academic"}-plan.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }} className="btn-ghost text-xs px-3 py-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Download
                </button>
                <button onClick={handleReset} className="btn-ghost text-xs px-3 py-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
                  </svg>
                  New Plan
                </button>
              </div>
            </div>
            <div className="px-6 md:px-8 py-8" style={{ background: "#0F1B35" }}>
              <PlanRenderer text={formState.plan} />
            </div>
            <div className="px-6 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3"
              style={{ background: "rgba(11,22,41,0.8)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p className="text-xs" style={{ color: "#334155" }}>
                This plan is AI-generated guidance, not professional counseling. Always verify with your school counselor.
              </p>
              <button onClick={handleReset} className="btn-primary text-xs px-4 py-2 whitespace-nowrap">
                Build Another Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}