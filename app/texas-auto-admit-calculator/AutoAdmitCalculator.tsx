"use client";

import { useState } from "react";
import Link from "next/link";

export default function AutoAdmitCalculator() {
  const [classRank, setClassRank] = useState("");
  const [classSize, setClassSize] = useState("");

  const rank = Number(classRank);
  const size = Number(classSize);
  const hasValidInput = classRank && classSize && size > 0 && rank > 0 && rank <= size;
  const percentile = hasValidInput ? (rank / size) * 100 : null;

  let resultLabel = "";
  let resultDetail = "";
  let resultColor = "#94A3B8";
  let resultBg = "rgba(255,255,255,0.04)";
  let resultBorder = "rgba(255,255,255,0.08)";

  if (percentile !== null) {
    if (percentile <= 5) {
      resultLabel = "Auto-Admit Eligible — UT Austin & Most TX Public Universities";
      resultDetail =
        "You're within UT Austin's current top 5% cutoff, which also covers Texas A&M's top 10% threshold and most other Texas public universities.";
      resultColor = "#34D399";
      resultBg = "rgba(52,211,153,0.08)";
      resultBorder = "rgba(52,211,153,0.25)";
    } else if (percentile <= 10) {
      resultLabel = "Auto-Admit Eligible — Texas A&M & Most TX Public Universities";
      resultDetail =
        "You're within the general Texas Top 10% Rule, covering Texas A&M and most Texas public universities. UT Austin's cutoff is stricter (currently top 5%), so this alone likely doesn't qualify you there.";
      resultColor = "#38BDF8";
      resultBg = "rgba(56,189,248,0.08)";
      resultBorder = "rgba(56,189,248,0.25)";
    } else {
      resultLabel = "Above the General 10% Auto-Admit Cutoff";
      resultDetail =
        "You're outside the statewide top 10% threshold, so automatic admission likely doesn't apply. You can still be a strong candidate through regular holistic admission — many students outside the top 10% are admitted every year.";
      resultColor = "#FBBF24";
      resultBg = "rgba(251,191,36,0.08)";
      resultBorder = "rgba(251,191,36,0.25)";
    }
  }

  return (
    <div className="rounded-2xl p-6 md:p-8" style={{ background: "#111F3C", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="form-label">Class Rank</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            placeholder="e.g. 15"
            value={classRank}
            onChange={(e) => setClassRank(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="form-label">Class Size</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input"
            placeholder="e.g. 450"
            value={classSize}
            onChange={(e) => setClassSize(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>
      </div>

      {percentile !== null ? (
        <div className="rounded-xl p-5" style={{ background: resultBg, border: `1px solid ${resultBorder}` }}>
          <p className="text-2xl font-bold mb-1" style={{ color: resultColor, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Top {percentile.toFixed(1)}%
          </p>
          <p className="text-sm font-semibold mb-2" style={{ color: "#F0F4FF" }}>{resultLabel}</p>
          <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>{resultDetail}</p>
        </div>
      ) : (
        <div className="rounded-xl p-5 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)" }}>
          <p className="text-sm" style={{ color: "#64748B" }}>Enter your class rank and size to see your result</p>
        </div>
      )}

      <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm mb-3" style={{ color: "#94A3B8" }}>
          Want a full personalized college list based on your grades, activities, and goals?
        </p>
        <Link href="/signup" className="btn-primary text-sm px-6 py-3 inline-flex">
          Join for Free — Get Your College List
        </Link>
      </div>
    </div>
  );
}
