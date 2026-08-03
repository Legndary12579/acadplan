import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "AcadPlan — AI College & Academic Planning for High Schoolers",
    template: "%s | AcadPlan",
  },
  description: "AcadPlan uses AI to build personalized academic roadmaps, course plans, and college strategies for high school students.",
  authors: [{ name: "AcadPlan" }],
  creator: "AcadPlan",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://acadplan.vercel.app"),
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B1629",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased" style={{ background: "#0B1629" }} suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-white focus:text-sm focus:font-semibold">
          Skip to main content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="relative border-t border-white/5 mt-auto">
          <div className="container-app px-6 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #4F46E5, #38BDF8)" }}>
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#94A3B8", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  AcadPlan
                </span>
              </div>

              <nav className="flex items-center gap-6">
                <a href="/" className="text-xs hover:text-white transition-colors" style={{ color: "#475569" }}>Home</a>
                <a href="/course-planner" className="text-xs hover:text-white transition-colors" style={{ color: "#475569" }}>Course Planner</a>
              </nav>

              <p className="text-xs" style={{ color: "#475569" }}>
                © {new Date().getFullYear()} AcadPlan. Powered by AI.
              </p>
            </div>
          </div>
        </footer>

        <Analytics />
      </body>
    </html>
  );
}