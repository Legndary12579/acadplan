import type { Metadata } from "next";
import AutoAdmitCalculator from "./AutoAdmitCalculator";

export const metadata: Metadata = {
  title: "Texas Auto-Admit Calculator — UT Austin & Texas A&M Top % Checker",
  description:
    "Free calculator to check if your class rank qualifies for automatic admission to UT Austin (top 5%), Texas A&M, and other Texas public universities under the Texas Top 10% Rule. No sign-up required.",
  keywords: [
    "Texas auto admit calculator",
    "UT Austin auto admit",
    "Texas top 10% rule",
    "Texas top 6 percent rule",
    "automatic admission Texas",
    "UT Austin class rank",
    "Texas A&M automatic admission",
  ],
  openGraph: {
    title: "Texas Auto-Admit Calculator — Free, No Sign-Up",
    description:
      "Check your class rank against UT Austin, Texas A&M, and other Texas public university auto-admit thresholds in seconds.",
    type: "website",
  },
};

export default function AutoAdmitPage() {
  return (
    <div className="min-h-screen pt-16" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}>
      <div className="container-app px-6 py-12 md:py-16 max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="badge mb-4">Free · No Sign-Up Required</span>
          <h1
            className="font-display mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem, 4vw, 2.75rem)", letterSpacing: "-0.02em", color: "#F0F4FF" }}
          >
            Texas Auto-Admit Calculator
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: "#94A3B8" }}>
            Enter your class rank to instantly check automatic admission eligibility for UT Austin, Texas A&M, and other Texas public universities.
          </p>
        </div>

        <AutoAdmitCalculator />

        {/* SEO content block — explains the rule for search intent + context */}
        <div className="mt-16 space-y-6">
          <h2 className="text-lg font-bold" style={{ color: "#F0F4FF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            How Texas Automatic Admission Works
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
            Texas state law guarantees automatic admission to any Texas public university for in-state students who
            graduate in the top 10% of their high school class. This is often called the &quot;Texas Top 10% Rule.&quot;
            Individual universities can set a stricter threshold than the state minimum, and{" "}
            <strong style={{ color: "#C7D2FE" }}>UT Austin currently requires the top 5%</strong> for automatic
            admission (this cutoff has tightened in recent years, so always verify the current figure on UT&apos;s
            official site). Texas A&M uses the general 10% threshold.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
            Automatic admission guarantees a spot at the university itself — it does <strong style={{ color: "#C7D2FE" }}>not</strong> guarantee
            acceptance into competitive or limited-enrollment majors like Computer Science, Engineering, Nursing, or
            Business, which often require a separate, more selective review even for auto-admitted students.
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#3A4A63" }}>
            This calculator is an independent tool and not an official resource of UT Austin, Texas A&M, or any
            university. Admission policies change year to year — always confirm current thresholds and requirements
            with each school&apos;s official admissions office before making decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
