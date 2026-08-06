"use client";

import { useState, useRef, useEffect } from "react";

// ── Data ───────────────────────────────────────────────────
const YEARLY_ROADMAP = [
  {
    year: "9th Grade",
    color: "#4F46E5",
    icon: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
    academics: [
      "Focus on building strong GPA foundations — every grade counts",
      "Take Honors classes where available to show rigor",
      "Get organized with a planner or digital calendar",
      "Meet your school counselor and discuss 4-year plan",
    ],
    extracurriculars: [
      "Join 2-3 clubs that genuinely interest you",
      "Try out for sports teams or arts programs",
      "Start volunteering in your community",
      "Explore different activities to find your passions",
    ],
    testing: [
      "No major tests yet — focus on academics",
      "Take the PSAT 8/9 if your school offers it",
      "Start building your vocabulary daily",
      "Practice reading nonfiction and analytical texts",
    ],
  },
  {
    year: "10th Grade",
    color: "#38BDF8",
    icon: `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`,
    academics: [
      "Start taking AP or IB classes if eligible",
      "Aim for all A's and B's — GPA is critical this year",
      "Develop strong study habits and note-taking skills",
      "Explore subjects related to your intended major",
    ],
    extracurriculars: [
      "Take on leadership roles in clubs you joined",
      "Start pursuing activities related to your career goals",
      "Look into local competitions (Science Olympiad, DECA, etc.)",
      "Begin building a resume of activities",
    ],
    testing: [
      "Take the PSAT 10 in October",
      "Begin light SAT prep — learn the format",
      "Consider taking SAT Subject Tests if relevant",
      "Start researching SAT vs ACT to see which fits you better",
    ],
  },
  {
    year: "11th Grade",
    color: "#34D399",
    icon: `<path d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
    academics: [
      "Take the most rigorous schedule you can handle well",
      "AP classes — aim for 3s, 4s, and 5s on AP exams",
      "Junior year GPA is the most important to colleges",
      "Start researching colleges that match your profile",
    ],
    extracurriculars: [
      "Hold leadership positions — president, captain, founder",
      "Pursue a meaningful passion project or research",
      "Apply for competitive summer programs (see Summer tab)",
      "Start building relationships with teachers for recommendations",
    ],
    testing: [
      "Take PSAT/NMSQT in October — National Merit eligibility",
      "Take SAT or ACT in spring (March–June)",
      "Aim to take the SAT/ACT at least twice",
      "Target scores: SAT 1400+ for top schools, ACT 30+",
    ],
  },
  {
    year: "12th Grade",
    color: "#FBBF24",
    icon: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    academics: [
      "Keep your GPA up — colleges can rescind offers",
      "Take AP exams seriously for college credit",
      "Apply Early Decision/Early Action by November 1-15",
      "Regular Decision deadlines typically January 1",
    ],
    extracurriculars: [
      "Continue your commitments — don't drop activities senior year",
      "Finish any ongoing projects or initiatives",
      "Apply for scholarships aggressively (100+ if possible)",
      "Finalize college list: 2-3 reach, 3-4 match, 2-3 safety",
    ],
    testing: [
      "Retake SAT/ACT in fall if needed (August, October)",
      "Most schools are test-optional — check each school's policy",
      "Send official scores directly from College Board/ACT",
      "Some schools superscore — submit all sittings",
    ],
  },
  {
    year: "Summers",
    color: "#F472B6",
    icon: `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>`,
    academics: [
      "After 9th: Explore subjects through online courses (Coursera, edX)",
      "After 10th: Dual enrollment at local community college",
      "After 11th: Intensive SAT/ACT prep if needed",
      "All summers: Read books related to your intended major",
    ],
    extracurriculars: [
      "After 9th: Volunteer or get a part-time job",
      "After 10th: Apply to summer programs (RSI, PRIMES, Gov School)",
      "After 11th: Internship, research position, or startup experience",
      "All summers: Work on a meaningful independent project",
    ],
    testing: [
      "Summer before 11th: Begin structured SAT/ACT prep",
      "Summer before 12th: Final SAT/ACT retake if needed",
      "Use Khan Academy for free SAT prep (official College Board partner)",
      "Practice tests every 2 weeks during dedicated prep periods",
    ],
  },
];

const SAT_TIPS = [
  {
    title: "Know the Format Cold",
    icon: `<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>`,
    color: "#4F46E5",
    tips: [
      "SAT: 2 sections — Reading & Writing (64 min) + Math (70 min)",
      "ACT: 4 sections — English, Math, Reading, Science + optional Essay",
      "SAT is adaptive — harder questions = higher score potential",
      "Both are 400-1600 (SAT) and 1-36 (ACT) scaled scores",
    ],
  },
  {
    title: "Reading & Writing Strategy",
    icon: `<path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    color: "#38BDF8",
    tips: [
      "Always read the question before the passage",
      "Answer must be directly supported by text — no outside knowledge",
      "Eliminate answers that use extreme language (always, never)",
      "For grammar questions, choose the most concise correct option",
    ],
  },
  {
    title: "Math Strategy",
    icon: `<path d="M18 20V10M12 20V4M6 20v-6"/>`,
    color: "#34D399",
    tips: [
      "Calculator section: use it strategically, not for every problem",
      "No-calculator section tests core algebra and arithmetic fluency",
      "Focus on: linear equations, systems, quadratics, data analysis",
      "Skip and return — don't spend more than 90 seconds on one problem",
    ],
  },
  {
    title: "Timing & Pacing",
    icon: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    color: "#FBBF24",
    tips: [
      "Reading & Writing: ~1.5 minutes per question",
      "Math: ~1.5-2 minutes per question",
      "Flag hard questions and come back — never leave blanks",
      "Practice full timed tests monthly to build endurance",
    ],
  },
  {
    title: "Prep Resources",
    icon: `<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>`,
    color: "#F472B6",
    tips: [
      "Khan Academy SAT Prep — free, official College Board partner",
      "Official SAT Practice Tests (8 free on College Board website)",
      "Princeton Review or Kaplan for structured courses",
      "r/SAT on Reddit for community tips and score reports",
    ],
  },
  {
    title: "Score Improvement",
    icon: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
    color: "#818CF8",
    tips: [
      "Most students improve 100-200 points with structured prep",
      "Take a full diagnostic test before starting prep",
      "Focus on your weakest areas first for biggest gains",
      "Consistency beats cramming — 30 min/day beats 5 hrs/weekend",
    ],
  },
];

const FAQS = [
  {
    q: "When should I start preparing for the SAT/ACT?",
    a: "Ideally, start light prep in 10th grade to learn the format, then do intensive prep in the summer before 11th grade. Most students take the SAT/ACT for the first time in spring of junior year (March-June), leaving time to retake it in fall of senior year if needed.",
  },
  {
    q: "How many AP classes should I take?",
    a: "Quality over quantity. Top schools want to see you challenged, but a B in 8 APs is worse than an A in 4. A good target: 1-2 APs in 10th grade, 3-4 in 11th, and 3-5 in 12th. Choose APs that align with your intended major — those scores matter most.",
  },
  {
    q: "Does it matter what college I go to?",
    a: "It depends on your field. For investment banking, consulting, or certain STEM research roles, brand name matters more. For entrepreneurship, arts, or many tech roles, skills and portfolio matter more. That said, a strong GPA from a good state school often beats a weak GPA from a top school.",
  },
  {
    q: "What extracurriculars do colleges care about most?",
    a: "Depth over breadth. Colleges prefer students who are deeply committed to 2-3 meaningful activities over students who are superficially involved in 10. Leadership positions, awards, and real impact matter most. Pursue what genuinely interests you — passion shows in applications.",
  },
  {
    q: "What's the difference between Early Decision and Early Action?",
    a: "Early Decision (ED) is binding — if accepted, you must attend and withdraw all other applications. Early Action (EA) is non-binding — you get an early answer but can still compare offers. ED gives you a significant admissions boost (sometimes 10-15%) but only apply ED if that school is truly your #1 choice.",
  },
  {
    q: "How important is the college essay?",
    a: "Very important for competitive schools, less so for large state schools. A great essay can push a borderline applicant over the edge. The best essays are specific, personal, and reveal something not visible elsewhere in your application. Avoid clichés like sports injury comebacks or mission trip transformations.",
  },
  {
    q: "How do I build a balanced college list?",
    a: "Aim for 8-12 schools: 2-3 reach schools (acceptance rate below your stats), 3-4 match schools (your stats fit their middle 50%), and 2-3 safety schools (you're confident you'll get in and would genuinely be happy attending). Never apply somewhere you wouldn't go.",
  },
  {
    q: "When should I start thinking about financial aid?",
    a: "Now. FAFSA opens October 1 of your senior year — file it as early as possible since some aid is first-come, first-served. Research each college's Net Price Calculator to estimate your actual cost. Look into merit scholarships as early as sophomore year since some have early deadlines.",
  },
];

// ── Chat Message Type ──────────────────────────────────────
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ── Components ─────────────────────────────────────────────
function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/plan/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");

      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#111F3C", border: "1px solid rgba(79,70,229,0.25)", boxShadow: "0 0 40px rgba(79,70,229,0.1)" }}>
      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(17,31,60,0.9))", borderBottom: "1px solid rgba(79,70,229,0.2)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #4F46E5, #6366F1)", boxShadow: "0 0 12px rgba(79,70,229,0.5)" }}>
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#F0F4FF" }}>Ask a Question</p>
          <p className="text-xs" style={{ color: "#475569" }}>Get personalized college planning advice</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#34D399" }} />
          <span className="text-xs" style={{ color: "#34D399" }}>Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3" style={{ background: "#0F1B35" }}>
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <div className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center" style={{ background: "rgba(79,70,229,0.15)", border: "1px solid rgba(79,70,229,0.3)" }}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: "#94A3B8" }}>Ask me anything about college planning</p>
            <p className="text-xs" style={{ color: "#475569" }}>SAT tips, college lists, AP classes, essays…</p>

            {/* Starter prompts */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {[
                "What SAT score do I need for UCLA?",
                "How many APs should I take junior year?",
                "When should I start my college essays?",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{ background: "rgba(79,70,229,0.12)", border: "1px solid rgba(79,70,229,0.25)", color: "#818CF8" }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
              style={msg.role === "user"
                ? { background: "linear-gradient(135deg, #4F46E5, #6366F1)", color: "white", borderBottomRightRadius: "4px" }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94A3B8", borderBottomLeftRadius: "4px" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl flex items-center gap-2" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderBottomLeftRadius: "4px" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#818CF8", animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#818CF8", animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#818CF8", animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <input
          type="text"
          className="form-input flex-1 text-sm py-2.5"
          placeholder="Ask about SAT prep, college lists, AP classes…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 py-2.5 text-sm flex-shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <p className="px-4 pb-3 text-[11px] text-center" style={{ color: "#3A4A63" }}>
        AI-generated answers, not official school or admissions advice. Verify important details with your counselor or the school directly.
      </p>
    </div>
  );
}

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.06)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left transition-all"
        style={{ color: "#F0F4FF" }}
      >
        <span className="text-sm font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{q}</span>
        <svg
          className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", color: "#818CF8" }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <p className="text-sm leading-relaxed pt-4" style={{ color: "#94A3B8" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen pt-16" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,70,229,0.12) 0%, transparent 60%), #0B1629" }}>
      <div className="container-app px-6 py-12 md:py-16 max-w-5xl">

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="badge mb-4">Free Resources</span>
          <h1 className="font-display mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: "clamp(1.75rem, 4vw, 2.75rem)", letterSpacing: "-0.025em", color: "#F0F4FF" }}>
            Everything you need to{" "}
            <span style={{ background: "linear-gradient(135deg, #818CF8 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              succeed in high school
            </span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "#64748B" }}>
            SAT strategies, year-by-year roadmaps, and answers to the most common college planning questions — all in one place.
          </p>
        </div>

        {/* Year-by-Year Roadmap */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="badge mb-3">Roadmap</span>
            <h2 className="font-display text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
              What to focus on, year by year
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {YEARLY_ROADMAP.map((item, i) => (
              <button
                key={item.year}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={activeTab === i
                  ? { background: item.color, color: "white", boxShadow: `0 0 16px ${item.color}60` }
                  : { background: "rgba(255,255,255,0.05)", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                {item.year}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {YEARLY_ROADMAP.map((item, i) => (
            i === activeTab && (
              <div key={item.year} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "📚 Academics", items: item.academics },
                  { label: "🏆 Extracurriculars", items: item.extracurriculars },
                  { label: "📝 Testing", items: item.testing },
                ].map((section) => (
                  <div key={section.label} className="rounded-2xl p-5" style={{ background: "#111F3C", border: `1px solid ${item.color}25` }}>
                    <h3 className="text-sm font-bold mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: item.color }}>
                      {section.label}
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {section.items.map((tip, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                          <span className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
          ))}
        </section>

        {/* SAT Tips */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="badge mb-3">Test Prep</span>
            <h2 className="font-display text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
              SAT & ACT strategies that actually work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAT_TIPS.map((tip) => (
              <div key={tip.title} className="card p-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: `${tip.color}15`, border: `1px solid ${tip.color}30` }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={tip.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    dangerouslySetInnerHTML={{ __html: tip.icon }} />
                </div>
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
                  {tip.title}
                </h3>
                <div className="flex flex-col gap-2">
                  {tip.tips.map((t, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tip.color }} />
                      <span className="text-xs leading-relaxed" style={{ color: "#64748B" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-20">
          <div className="mb-8">
            <span className="badge mb-3">FAQs</span>
            <h2 className="font-display text-2xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
              Common questions, answered
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* AI Chat */}
        <section>
          <div className="mb-8">
            <span className="badge mb-3">AI Assistant</span>
            <h2 className="font-display text-2xl font-bold mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}>
              Still have questions?
            </h2>
            <p className="text-sm" style={{ color: "#64748B" }}>
              Ask our AI anything about college planning — SAT scores, AP classes, essays, financial aid, and more.
            </p>
          </div>
          <ChatBox />
        </section>

      </div>
    </div>
  );
}