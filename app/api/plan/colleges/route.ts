import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are an expert college admissions counselor with deep knowledge of hundreds of universities across the United States. You have access to web search to find current, accurate data about colleges.

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
      "financialAid": "Specific info about merit aid, need-based aid, or scholarships at this school",
      "deadlines": "Early Decision: Nov 1, Regular Decision: Jan 1",
      "strengths": ["Strength 1", "Strength 2", "Strength 3"],
      "campusLife": "1-2 sentences about campus culture and student life"
    }
  ]
}

Include 7-10 schools total: 2-3 reach, 3-4 match, 2-3 safety. Use web search to verify current acceptance rates, tuition, and program info. Tailor everything to the student's specific major, GPA, test scores, and goals. Return ONLY the JSON object, nothing else.`;

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

Search the web for current acceptance rates, notable programs for ${data.intendedMajor}, tuition costs, and financial aid info for each recommended school. Make sure the mix includes reach, match, and safety schools appropriate for a student with GPA ${data.gpa}${data.satScore ? ` and SAT ${data.satScore}` : ""}.`;
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

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [
        {
          type: "web_search_20250305" as const,
          name: "web_search",
        },
      ],
      messages: [
        {
          role: "user",
          content: buildPrompt(body),
        },
      ],
    });

    const rawText = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    // Parse JSON — strip any accidental markdown fences
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed, { status: 200 });
  } catch (err: unknown) {
    console.error("[API /colleges] Error:", err);

    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: "Claude API error. Please try again.", details: err.message },
        { status: err.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate college list. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: "ok", route: "/api/colleges", webSearch: true },
    { status: 200 }
  );
}