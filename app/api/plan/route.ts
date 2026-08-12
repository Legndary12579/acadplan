import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { saveStudentPlan, createUserScopedClient, verifyAccessToken } from "@/lib/supabase";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import type { PlanRequest, PlanResponse, ApiError } from "@/types";

// 5 plan generations per IP per hour — this is the most expensive route
const RATE_LIMIT = 5;
const RATE_WINDOW_MINUTES = 60;

const GEMINI_MODEL = "gemini-3.5-flash";

let genAI: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not set in this environment. Add it in Vercel → Settings → Environment Variables and redeploy."
    );
  }
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAI;
}

// ── System Prompt ──────────────────────────────────────────
// Note: no web search grounding — Gemini's free-tier search grounding
// quota was returning 429s immediately for this account. This relies
// on the model's own training knowledge instead of live search.
const SYSTEM_PROMPT = `You are an expert academic counselor and college planning advisor with 20+ years of experience helping high school students achieve their academic goals.

When given a student's profile, produce a comprehensive, structured academic plan using the following format:

## 🎓 Academic Overview
Brief assessment of the student's current standing and potential.

## 📚 Course Recommendations by Year
For each remaining year of high school, list specific recommended courses with level (Standard / Honors / AP / IB / Dual Enrollment). Be specific about which AP courses align with their intended major.

## 🏆 Extracurricular & Leadership Strategy
List specific types of clubs, competitions, and leadership roles that fit the student's interests and major. Describe well-known national/regional programs and organizations relevant to their field (note: since this doesn't use live web search, favor well-established, broadly-known programs over hyper-local or newly-launched ones).

## 💼 Internships & Volunteering Strategies
Describe the TYPES of internship programs and volunteering opportunities that align with their intended major and career goals, and general strategies for finding them locally (e.g. "search for X type of organization near your city," "check with your school's Y department"). Since you don't have live web access, avoid inventing specific named local organizations you can't verify — speak in terms of categories and search strategies instead.

## 📝 Standardized Test Roadmap
Testing timeline (PSAT, SAT/ACT), target scores based on their goal colleges, and specific prep recommendations.

## 🎯 College List Strategy
5-7 specific college recommendations across reach, match, and safety tiers, based on your general knowledge. For each college, explain why it's a great fit for their specific major and career goals. Include a general sense of selectivity and any well-known programs, but note that acceptance rates and program details should be verified on the school's website since they change year to year.

## 💡 Key Action Items (Next 90 Days)
5 concrete, prioritized next steps the student should take immediately. Be specific and actionable.

## ⚠️ Areas to Watch
Honest assessment of gaps or challenges to address.

Always use the student's name throughout the plan.`;

// ── Build User Prompt ──────────────────────────────────────
function buildUserPrompt(req: PlanRequest): string {
  const { student } = req;

  const collegeTypeLabel: Record<string, string> = {
    ivy_league: "Ivy League / Top 10",
    top_50: "Top 50 National Universities",
    state_school: "State / Regional Universities",
    community_college: "Community College",
    undecided: "Undecided",
  };

  return `Please create a comprehensive academic plan for the following student.

**Name:** ${student.name}
**Current Grade:** ${student.gradeLevel} Grade
**GPA:** ${student.gpaUnweighted} unweighted${student.gpaWeighted ? ` (${student.gpaWeighted} weighted)` : ""}
**Intended Major / Field of Study:** ${student.intendedMajor}
**Target College Type:** ${collegeTypeLabel[student.collegeType] ?? student.collegeType}
**ZIP Code:** ${student.zipCode || "Not specified"}
**Extracurricular Activities:** ${student.extracurriculars || "None listed"}
**Career Goals:** ${student.careerGoals}
**Current Challenges / Concerns:** ${student.challenges || "None listed"}
${student.satScore ? `**SAT Score:** ${student.satScore}` : ""}
${student.satSuperscore ? `**SAT Superscore:** ${student.satSuperscore}` : ""}
${student.actScore ? `**ACT Score:** ${student.actScore}` : ""}

Please provide a detailed, personalized plan that addresses ${student.name}'s specific situation.`;
}

// ── POST Handler ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = await checkRateLimit(clientIp, "plan", RATE_LIMIT, RATE_WINDOW_MINUTES);

    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.retryAfterSeconds ?? 3600) / 60);
      return NextResponse.json<ApiError>(
        {
          error: `You've reached the limit of ${RATE_LIMIT} plan generations per hour. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds ?? 3600) } }
      );
    }

    let body: PlanRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiError>(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    const { student, userId: claimedUserId } = body;

    // Require a valid, verified login — never trust a userId sent in the
    // request body alone, since it could be spoofed. This route now
    // requires an account (previously supported anonymous generation).
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ") || !claimedUserId) {
      return NextResponse.json<ApiError>(
        { error: "Please sign up or log in to generate a plan." },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const verifiedUserId = await verifyAccessToken(token);
    if (!verifiedUserId || verifiedUserId !== claimedUserId) {
      return NextResponse.json<ApiError>(
        { error: "Your session has expired. Please log in again." },
        { status: 401 }
      );
    }

    const saveClient = createUserScopedClient(token);

    if (!student?.name || !student?.gradeLevel || !student?.intendedMajor) {
      return NextResponse.json<ApiError>(
        { error: "Missing required fields: name, gradeLevel, intendedMajor." },
        { status: 400 }
      );
    }

    const response = await getGenAI().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildUserPrompt(body),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 4096,
      },
    });

    const planText = response.text ?? "";

    if (!planText) {
      return NextResponse.json<ApiError>(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // Save to Supabase (non-fatal — a save failure shouldn't block the
    // student from seeing their generated plan)
    try {
      const { error: saveError } = await saveStudentPlan(student, planText, verifiedUserId, saveClient);
      if (saveError) {
        console.warn("[API /plan] Supabase save returned an error:", saveError);
      }
    } catch (dbErr) {
      console.warn("[API] Supabase save failed (non-fatal):", dbErr);
    }

    const result: PlanResponse = {
      plan: planText,
      timestamp: new Date().toISOString(),
      studentName: student.name,
    };

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    console.error("[API /plan] Unhandled error:", err);

    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status) || 500
        : 500;

    return NextResponse.json<ApiError>(
      { error: "Gemini API error. Please try again.", details: message },
      { status }
    );
  }
}

// ── GET — health check ─────────────────────────────────────
export async function GET() {
  return NextResponse.json(
    { status: "ok", route: "/api/plan", model: GEMINI_MODEL, webSearch: false },
    { status: 200 }
  );
}
