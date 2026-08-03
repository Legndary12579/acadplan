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
      "tagline": "One sentence on why this fits the student",
      "autoAdmitEligible": true | false,
      "autoAdmitNote": "Short note if applicable, e.g. 'Guaranteed admission — you're in the top 5% required for UT Austin auto-admit.' Omit or leave empty string if not applicable."
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

Include 7-10 schools total: 2-3 reach, 3-4 match, 2-3 safety. Use your general knowledge to provide realistic acceptance rates, tuition, and program info, and note in the tagline/deepDive fields where relevant that exact current figures should be verified on the school's official site. Tailor everything to the student's specific major, GPA, test scores, and goals.

TEXAS AUTOMATIC ADMISSION RULES (only apply these if the student profile indicates they are a Texas resident with a class rank percentile provided):
- Texas state law guarantees automatic admission to ANY Texas public university for in-state students who rank in the top 10% of their graduating class.
- Texas A&M University specifically uses this general top 10% threshold for automatic admission.
- The University of Texas at Austin sets a STRICTER threshold than the general state law: as of the Fall 2026 admissions cycle onward, UT Austin's auto-admit cutoff is the top 5% (this has been progressively tightening from 6% in recent years — mention this is the current known cutoff and to verify on UT's site since it can change annually).
- Auto-admit guarantees a spot at the university, NOT a specific major — competitive/limited programs (e.g. Computer Science, Engineering, Business, Nursing) often still require separate holistic review even for auto-admitted students. Mention this caveat when relevant.
- If the student's percentile qualifies them for auto-admit at a Texas public university you include in the list, set "autoAdmitEligible": true and write a specific "autoAdmitNote" explaining which rule applies (general 10% law vs. UT Austin's 5%) and the major-specific caveat above.
- If the student is not a Texas resident, or didn't provide class rank, do not include autoAdmitEligible/autoAdmitNote fields (or set autoAdmitEligible to false).
- Only mark Texas PUBLIC universities as auto-admit eligible — never private Texas schools (e.g. Rice, SMU, Baylor, TCU do not offer this).

Return ONLY the JSON object, nothing else.`;

function buildPrompt(data: {
  name: string;
  gpa: string;
  satScore: string;
  actScore: string;
  intendedMajor: string;
  collegeType: string;
  location: string;
  interests: string;
  awardsHonorsEcs?: string;
  isTexasResident?: boolean;
  classRank?: string;
  classSize?: string;
}): string {
  let texasSection = "";
  if (data.isTexasResident && data.classRank && data.classSize && Number(data.classSize) > 0) {
    const percentile = (Number(data.classRank) / Number(data.classSize)) * 100;
    texasSection = `

Texas Residency: Yes
Class Rank: ${data.classRank} out of ${data.classSize} (top ${percentile.toFixed(1)}% of class)
Please evaluate Texas public university auto-admit eligibility per the rules in your system instructions, and include relevant Texas public universities in the list if they're a good fit, clearly flagging auto-admit eligibility.`;
  } else if (data.isTexasResident) {
    texasSection = `

Texas Residency: Yes (class rank not provided, so auto-admit eligibility cannot be determined — do not guess)`;
  }

  return `Find the best college matches for this student and return the JSON:

Name: ${data.name}
GPA: ${data.gpa}
SAT Score: ${data.satScore || "Not taken"}
ACT Score: ${data.actScore || "Not taken"}
Intended Major: ${data.intendedMajor}
Target College Type: ${data.collegeType}
Home Location: ${data.location}
Special Interests / Notes: ${data.interests || "None"}
Awards, Honors & Extracurriculars: ${data.awardsHonorsEcs || "None listed"}${texasSection}

Use the awards/honors/extracurriculars to inform "whyItFits", "applicationTips", and how competitive the student is for selective programs — this matters especially for schools/majors that don't use auto-admit or where auto-admit only guarantees the university, not the specific program.

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
        maxOutputTokens: 8192,
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

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("[API /colleges] JSON parse failed. Raw text length:", rawText.length, "First 200 chars:", rawText.slice(0, 200), "Last 200 chars:", rawText.slice(-200));
      return NextResponse.json(
        {
          error: "Gemini returned malformed JSON. Please try again — this can happen if the response is cut off.",
          details: parseErr instanceof Error ? parseErr.message : "Unknown parse error",
        },
        { status: 502 }
      );
    }

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
