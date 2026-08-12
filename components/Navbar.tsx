"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, signOut } from "@/lib/supabase";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Course Planner", href: "/course-planner" },
  { label: "College Finder", href: "/colleges" },
  { label: "Resources", href: "/resources" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    getUser().then((user) => {
      setUserEmail(user?.email ?? null);
      setAuthLoading(false);
    });
  }, [pathname]);

  async function handleSignOut() {
    await signOut();
    setUserEmail(null);
    router.push("/");
    router.refresh();
  }

  const loggedIn = !authLoading && !!userEmail;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass border-b border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-app px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex-shrink-0">
              <div
                className="absolute inset-0 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"
                style={{ background: "linear-gradient(135deg, #4F46E5, #38BDF8)" }}
              />
              <svg
                className="absolute inset-0 w-full h-full p-1.5 text-white"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <span
              className="font-bold text-base"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#F0F4FF" }}
            >
              Acad
              <span style={{
                background: "linear-gradient(135deg, #C7D2FE, #818CF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Plan
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? "text-white" : "hover:text-white"
                  }`}
                  style={{ color: isActive ? "#F0F4FF" : "#94A3B8" }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
            {loggedIn && (
              <Link
                href="/my-plans"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === "/my-plans" ? "text-white" : "hover:text-white"
                }`}
                style={{ color: pathname === "/my-plans" ? "#F0F4FF" : "#94A3B8" }}
              >
                {pathname === "/my-plans" && (
                  <span
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                )}
                <span className="relative">My Plans</span>
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!authLoading && (
              loggedIn ? (
                <>
                  <span
                    className="text-xs max-w-[120px] truncate"
                    style={{ color: "#475569" }}
                  >
                    {userEmail}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="btn-ghost text-sm px-4 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium px-3 py-2 transition-colors hover:text-white"
                    style={{ color: "#94A3B8" }}
                  >
                    Log In
                  </Link>
                  <Link href="/signup" className="btn-primary text-sm px-5 py-2.5">
                    Join for Free
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
              style={{ background: "#94A3B8" }}
            />
            <span
              className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
              style={{ background: "#94A3B8" }}
            />
            <span
              className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
              style={{ background: "#94A3B8" }}
            />
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass border-t border-white/5 px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: isActive ? "rgba(79,70,229,0.15)" : "transparent",
                  color: isActive ? "#F0F4FF" : "#94A3B8",
                  border: isActive
                    ? "1px solid rgba(79,70,229,0.3)"
                    : "1px solid transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
          {loggedIn && (
            <Link
              href="/my-plans"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: pathname === "/my-plans" ? "rgba(79,70,229,0.15)" : "transparent",
                color: pathname === "/my-plans" ? "#F0F4FF" : "#94A3B8",
                border: pathname === "/my-plans"
                  ? "1px solid rgba(79,70,229,0.3)"
                  : "1px solid transparent",
              }}
            >
              My Plans
            </Link>
          )}

          <div className="pt-2 mt-1 border-t border-white/5 flex flex-col gap-2">
            {loggedIn ? (
              <button onClick={handleSignOut} className="btn-ghost w-full text-sm">
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/login" className="btn-ghost w-full text-sm">
                  Log In
                </Link>
                <Link href="/signup" className="btn-primary w-full text-sm">
                  Join for Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}