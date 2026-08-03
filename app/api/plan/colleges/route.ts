import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

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

// Note: no web search grounding — Gemini's free-tier search grounding
// quota was returning 429s immediately for this account. This relies
// on the model's own training knowledge instead of live search, so
// acceptance rates/tuition are approximate and should be verified.
const SYSTEM_PROMPT = `You are an expert college admissions counselor with deep knowledge of hundreds of universities across the United States.

When given a student profile, return a JSON object with this exact structure — no markdown, no explanation, just raw JSON:

{
  "quickList": [
    {
      "id": "unique-id",
      "name": "University Name",
      "location": "City, State",
      "tier": "reach" | "match" | "safety",
      "acceptanceRate": "14%",
      "avgGPA": "3.9",
      "avgSAT": "1450-1550",
      "tuition": "$58,000/year",
      "tagline": "One sentence on why this fits the student"
    }
  ],
  "deepDives": [
    {
      "id": "same-id-as-quicklist",
      "whyItFits": "2-3 sentences on why this school is perfect for this specific student's major, goals, and profile",
      "notablePrograms": ["Program 1", "Program 2", "Program 3"],
      "applicationTips": ["Tip 1 specific to this school", "Tip 2", "Tip 3"],
      "financialAid": "General info about merit aid, need-based aid, or scholarships typically available at this type of school",
      "deadlines": "Typical: Early Decision ~Nov 1, Regular Decision ~Jan 1 (verify exact current dates on the school's site)",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "campusLife": "1-2 sentences about campus culture and student life"
    }
  ]
}

Include 7-10 schools total: 2-3 reach, 3-4 match, 2-3 safety. Use your general knowledge to provide realistic acceptance rates, tuition, and program info, and note in the tagline/deepDive fields where relevant that exact current figures should be verified on the school's official site. Tailor everything to the student's specific major, GPA, test scores, and goals. Return ONLY the JSON object, nothing else.`;

function buildPrompt(data: {
  name: string;
  gpa: string;
  satScore: string;
  actScore: string;
  intendedMajor: string;
  collegeType: string;
  location: string;
  interests: string;
}): string {
  return `Find the best college matches for this student and return the JSON:

Name: ${data.name}
GPA: ${data.gpa}
SAT Score: ${data.satScore || "Not taken"}
ACT Score: ${data.actScore || "Not taken"}
Intended Major: ${data.intendedMajor}
Target College Type: ${data.collegeType}
Home Location: ${data.location}
Special Interests / Notes: ${data.interests || "None"}

Make sure the mix includes reach, match, and safety schools appropriate for a student with GPA ${data.gpa}${data.satScore ? ` and SAT ${data.satScore}` : ""}.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.gpa || !body.intendedMajor) {
      return NextResponse.json(
        { error: "Missing required fields: name, gpa, intendedMajor." },
        { status: 400 }
      );
    }

    const response = await getGenAI().models.generateContent({
      model: GEMINI_MODEL,
      contents: buildPrompt(body),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 4096,
      },
    });

    const rawText = response.text ?? "";

    if (!rawText) {
      return NextResponse.json(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    // Parse JSON — strip any accidental markdown fences
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: unknown) {
    console.error("[API /colleges] Error:", err);

    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? Number((err as { status?: number }).status) || 500
        : 500;

    return NextResponse.json(
      { error: "Failed to generate college list. Please try again.", details: message },
      { status }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "ok", route: "/api/plan/colleges", webSearch: false },
    { status: 200 }
  );
}
