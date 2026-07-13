"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: `<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>`,
    title: "Personalized Course Plans",
    description: "Get a year-by-year roadmap of courses — Standard, Honors, AP, and IB — matched to your GPA, goals, and target schools.",
    accent: { bg: "rgba(79,70,229,0.12)", border: "rgba(79,70,229,0.25)", text: "#818CF8", glow: "rgba(79,70,229,0.2)" },
  },
  {
    icon: `<path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>`,
    title: "College List Strategy",
    description: "Receive reach, match, and safety school recommendations with honest, data-driven rationale tailored to your profile.",
    accent: { bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.22)", text: "#38BDF8", glow: "rgba(56,189,248,0.15)" },
  },
  {
    icon: `<path d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
    title: "AI-Powered in Seconds",
    description: "Powered by Claude AI — not templates. Every plan is generated fresh from your actual profile, not a generic checklist.",
    accent: { bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.22)", text: "#34D399", glow: "rgba(52,211,153,0.15)" },
  },
  {
    icon: `<circle cx="12" cy="8" r="4"/><path d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>`,
    title: "Extracurricular Roadmap",
    description: "Discover clubs, competitions, internships, and leadership roles that align with your intended major and career goals.",
    accent: { bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.22)", text: "#FBBF24", glow: "rgba(251,191,36,0.15)" },
  },
];

const STATS = [
  { value: "4-Year", label: "Personalized Roadmap" },
  { value: "Claude AI", label: "Powered By" },
  { value: "7 Sections", label: "Comprehensive Plan" },
  { value: "Free", label: "To Get Started" },
];

function OrbitalHero() {
  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 flex-shrink-0 select-none" aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.5) 0%, rgba(79,70,229,0.1) 60%, transparent 100%)" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4F46E5 0%, #38BDF8 100%)", boxShadow: "0 0 32px rgba(79,70,229,0.6)" }}>
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 rounded-full border border-dashed opacity-20" style={{ borderColor: "#4F46E5" }} />
      <div className="absolute rounded-full border border-dashed opacity-15" style={{ inset: "48px", borderColor: "#38BDF8" }} />
      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "orbit 12s linear infinite" }}>
        <div className="absolute w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)", top: 0, left: "50%", transform: "translate(-50%, -50%)", boxShadow: "0 0 12px rgba(79,70,229,0.6)" }}>
          AP
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "orbit 18s linear infinite reverse" }}>
        <div className="absolute w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #0EA5E9, #38BDF8)", top: "15%", right: "5%", boxShadow: "0 0 10px rgba(56,189,248,0.5)" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: "orbit 22s linear infinite" }}>
        <div className="absolute w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #10B981, #34D399)", bottom: "10%", left: "8%", boxShadow: "0 0 10px rgba(52,211,153,0.5)" }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const featuresRef = useReveal();
  const statsRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="hero-bg relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="container-app px-6 py-20 md:py-0 relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 badge mb-6">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
                AI-Powered Academic Planning
              </div>
              <h1 className="font-display mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(2.4rem, 5vw, 4rem)", lineHeight: 1.07, letterSpacing: "-0.03em" }}>
                Your Personalized{" "}
                <span style={{ background: "linear-gradient(135deg, #818CF8 0%, #38BDF8 60%, #34D399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Academic Roadmap
                </span>
                {" "}Starts Here
              </h1>
              <p className="text-base md:text-lg mb-8 max-w-xl mx-auto md:mx-0" style={{ color: "#94A3B8" }}>
                Tell us about your goals. AcadPlan's AI builds a complete 4-year plan — courses, college list, test prep, and extracurriculars — personalized to you in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link href="/course-planner" className="btn-primary text-base px-7 py-3.5">
                  Build My Plan — Free
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a href="#features" className="btn-ghost text-base px-7 py-3.5">See How It Works</a>
              </div>
              <p className="mt-6 text-xs" style={{ color: "#475569" }}>
                No account required · Results in under 30 seconds · Powered by Claude AI
              </p>
            </div>
            <OrbitalHero />
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, #0B1629)" }} />
      </section>

      {/* Stats */}
      <section ref={statsRef} className="reveal relative py-10 border-y border-white/5">
        <div className="container-app px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl mb-1 font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(135deg, #C7D2FE, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {stat.value}
                </div>
                <div className="text-xs font-medium" style={{ color: "#475569" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div ref={featuresRef} className="reveal container-app">
          <div className="text-center mb-14">
            <span className="badge mb-4">What You Get</span>
            <h2 className="font-display mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em" }}>
              Everything you need to{" "}
              <span style={{ background: "linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                plan your path
              </span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#94A3B8" }}>
              AcadPlan combines academic counselor expertise with AI speed — no appointments, no generic advice, no waiting.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="card p-6 group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: feature.accent.bg, border: `1px solid ${feature.accent.border}`, boxShadow: `0 0 16px ${feature.accent.glow}` }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={feature.accent.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: feature.icon }} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section" style={{ background: "rgba(17,31,60,0.4)" }}>
        <div className="container-app">
          <div className="text-center mb-14">
            <span className="badge mb-4">Simple Process</span>
            <h2 className="font-display mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.02em" }}>
              Your plan in 3 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Fill Your Profile", desc: "Share your grade, GPA, intended major, and goals. Takes about 2 minutes.", color: "#4F46E5" },
              { step: "02", title: "AI Builds Your Plan", desc: "Claude analyzes your profile and generates a comprehensive, personalized academic roadmap.", color: "#38BDF8" },
              { step: "03", title: "Take Action", desc: "Follow your 90-day action items, course recommendations, and college strategy.", color: "#34D399" },
            ].map((item) => (
              <div key={item.step} className="text-center px-4">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <span className="text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: item.color }}>{item.step}</span>
                </div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div ref={ctaRef} className="reveal container-app">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center" style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(56,189,248,0.1) 100%)", border: "1px solid rgba(79,70,229,0.3)", boxShadow: "0 0 60px rgba(79,70,229,0.15)" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div className="relative">
              <span className="badge mb-5">Get Started — Free</span>
              <h2 className="font-display mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", letterSpacing: "-0.02em" }}>
                Ready to map your{" "}
                <span style={{ background: "linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  academic future?
                </span>
              </h2>
              <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: "#94A3B8" }}>
                It takes 2 minutes to fill out your profile. Your personalized AI plan is ready in seconds — no account, no cost.
              </p>
              <Link href="/course-planner" className="btn-primary text-base px-8 py-4">
                Build My Academic Plan
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}