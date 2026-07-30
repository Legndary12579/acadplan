import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { saveStudentPlan } from "@/lib/supabase";
import type { PlanRequest, PlanResponse, ApiError } from "@/types";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const GEMINI_MODEL = "gemini-3.5-flash";

// ── System Prompt ──────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert academic counselor and college planning advisor with 20+ years of experience helping high school students achieve their academic goals. You have access to web search to find real, current opportunities near the student's location.

When given a student's profile, produce a comprehensive, structured academic plan using the following format:

## 🎓 Academic Overview
Brief assessment of the student's current standing and potential.

## 📚 Course Recommendations by Year
For each remaining year of high school, list specific recommended courses with level (Standard / Honors / AP / IB / Dual Enrollment). Be specific about which AP courses align with their intended major.

## 🏆 Extracurricular & Leadership Strategy
List specific clubs, competitions, and leadership roles. Search for real programs and organizations near the student's location that match their major and career goals.

## 💼 Internships & Volunteering Near You
Search for and list REAL, specific internship programs and volunteering opportunities near the student's city or zip code that align with their intended major and career goals. Include organization names, program names, and how to apply. Focus on opportunities available to high school students.

## 📝 Standardized Test Roadmap
Testing timeline (PSAT, SAT/ACT), target scores based on their goal colleges, and specific prep recommendations.

## 🎯 College List Strategy
5-7 specific college recommendations across reach, match, and safety tiers. For each college, explain why it's a great fit for their specific major and career goals. Include acceptance rates and any notable programs.

## 💡 Key Action Items (Next 90 Days)
5 concrete, prioritized next steps the student should take immediately. Be specific and actionable.

## ⚠️ Areas to Watch
Honest assessment of gaps or challenges to address.

Use web search extensively to find real local opportunities, current program information, and up-to-date college data. Always use the student's name throughout the plan.`;

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

  return `Please create a comprehensive academic plan for the following student. Use web search to find real internships, volunteering opportunities, and extracurricular programs near their location that match their major and career goals.

**Name:** ${student.name}
**Current Grade:** ${student.gradeLevel} Grade
**GPA:** ${student.gpa}
**Intended Major / Field of Study:** ${student.intendedMajor}
**Target College Type:** ${collegeTypeLabel[student.collegeType] ?? student.collegeType}
**Location:** ${student.location || "Not specified"}
**Extracurricular Activities:** ${student.extracurriculars || "None listed"}
**Career Goals:** ${student.careerGoals}
**Current Challenges / Concerns:** ${student.challenges || "None listed"}
${student.satScore ? `**SAT Score:** ${student.satScore}` : ""}
${student.actScore ? `**ACT Score:** ${student.actScore}` : ""}

Important: Please search the web for:
1. Real internship programs for high school students near ${student.location || "their area"} related to ${student.intendedMajor}
2. Volunteering opportunities near ${student.location || "their area"} relevant to their goals
3. Local clubs, competitions, and organizations for ${student.intendedMajor} students
4. Current acceptance rates and program details for recommended colleges
5. Specific AP courses and dual enrollment options relevant to ${student.intendedMajor}

Please provide a detailed, personalized plan that addresses ${student.name}'s specific situation.`;
}

// ── POST Handler ───────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    let body: PlanRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ApiError>(
        { error: "Invalid request body. Expected JSON." },
        { status: 400 }
      );
    }

    const { student, userId } = body;

    if (!student?.name || !student?.gradeLevel || !student?.intendedMajor) {
      return NextResponse.json<ApiError>(
        { error: "Missing required fields: name, gradeLevel, intendedMajor." },
        { status: 400 }
      );
    }

    // Call Gemini with Google Search grounding enabled
    const response = await genAI.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildUserPrompt(body),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 4096,
        tools: [{ googleSearch: {} }],
      },
    });

    const planText = response.text ?? "";

    if (!planText) {
      return NextResponse.json<ApiError>(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // Save to Supabase (non-fatal)
    try {
      await saveStudentPlan(student, planText, userId);
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
    { status: "ok", route: "/api/plan", model: GEMINI_MODEL, webSearch: true },
    { status: 200 }
  );
}