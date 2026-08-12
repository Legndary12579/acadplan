import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AcadPlan's privacy policy — what information we collect, how it's used, and your rights.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "August 11, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-16" style={{ background: "#0B1629" }}>
      <div className="container-app px-6 py-12 md:py-16 max-w-3xl mx-auto">
        <h1
          className="font-display mb-2"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.9rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "#F0F4FF" }}
        >
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: "#64748B" }}>Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
          <p>
            AcadPlan (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;) is an independent, AI-powered academic and
            college planning tool. This page explains what information we collect when you use AcadPlan, how it&apos;s
            used, and the choices you have. This policy is written in plain language to be genuinely understandable,
            not to replace formal legal review — if you have specific legal questions, please consult a lawyer.
          </p>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Information We Collect</h2>
            <p className="mb-3">When you use AcadPlan, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong style={{ color: "#C7D2FE" }}>Account information:</strong> your email address and password (handled securely via our authentication provider, Supabase) if you create an account.</li>
              <li><strong style={{ color: "#C7D2FE" }}>Academic profile information:</strong> details you enter to generate a plan or college list — name, grade level, GPA, test scores, intended major, extracurricular activities, awards/honors, career goals, challenges, ZIP code, and Texas residency/class rank if applicable.</li>
              <li><strong style={{ color: "#C7D2FE" }}>Generated content:</strong> the AI-generated academic plans and college recommendations produced from your profile, saved to your account so you can revisit them.</li>
              <li><strong style={{ color: "#C7D2FE" }}>Usage data:</strong> basic, aggregated analytics (page visits, general usage patterns) via Vercel Analytics, which does not use cookies or track you individually across sites.</li>
              <li><strong style={{ color: "#C7D2FE" }}>Chat messages:</strong> if you use the Resources chat feature, your messages and the AI&apos;s responses are processed to generate a reply.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>How We Use Your Information</h2>
            <p className="mb-3">We use the information you provide solely to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Generate your personalized academic plan, college list, and chat responses using Google&apos;s Gemini API.</li>
              <li>Save your plans so you can access them later if you have an account.</li>
              <li>Maintain basic rate limiting to keep the service available and prevent abuse.</li>
              <li>Understand general usage of the site to improve it.</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information, and we do not use your data to serve you ads — AcadPlan is
              currently ad-free.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Third-Party Services</h2>
            <p className="mb-3">AcadPlan relies on a small number of third-party services to operate:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong style={{ color: "#C7D2FE" }}>Google (Gemini API):</strong> processes your academic profile information to generate plans, college recommendations, and chat responses. Google&apos;s own privacy policy governs how they handle API requests.</li>
              <li><strong style={{ color: "#C7D2FE" }}>Supabase:</strong> stores your account information and saved plans in a secure database.</li>
              <li><strong style={{ color: "#C7D2FE" }}>Vercel:</strong> hosts the website and provides basic, privacy-friendly analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Data for Minors</h2>
            <p>
              AcadPlan is built primarily for high school students, many of whom are under 18. We collect only the
              academic information needed to generate a plan and do not knowingly collect sensitive personal
              information beyond what you choose to enter in the profile form. If you are a parent or guardian and
              have concerns about your child&apos;s use of AcadPlan, please contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Your Choices</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You can use the Course Planner, College Finder, and Resources chat without creating an account for some features, though an account is required to generate and save plans.</li>
              <li>You can delete your account and associated data at any time by contacting us.</li>
              <li>You can request a copy of the data associated with your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Data Security</h2>
            <p>
              We take reasonable measures to protect your information, including using established providers
              (Supabase, Vercel, Google) with their own security practices, and restricting database access with
              row-level security so accounts can only access their own saved plans. That said, no method of
              transmission or storage is 100% secure, and we can&apos;t guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Changes to This Policy</h2>
            <p>
              We may update this policy as AcadPlan evolves. We&apos;ll update the &quot;Last updated&quot; date at
              the top of this page when changes are made.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold mb-3" style={{ color: "#F0F4FF" }}>Contact</h2>
            <p>
              If you have questions about this policy, want to request deletion of your data, or have any other
              privacy concerns, please reach out via the contact information available on our site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
