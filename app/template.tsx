"use client";

import { useEffect, useState } from "react";

// This file re-mounts on every navigation (unlike layout.tsx, which
// persists across routes), so it's the right place for a per-page-visit
// transition — a subtle fade + slight rise whenever you move between
// tabs like Course Planner and College Finder.
export default function Template({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 280ms ease, transform 280ms ease",
      }}
    >
      {children}
    </div>
  );
}
