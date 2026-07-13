import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const SYSTEM_PROMPT = `You are an expert college and academic planning advisor helping high school students with questions about:
- SAT/ACT preparation and test strategy
- College applications and admissions
- Course selection and AP/IB classes
- Extracurricular activities and leadership
- College list building (reach, match, safety schools)
- Financial aid, scholarships, and FAFSA
- Summer programs and internships
- What to focus on each year of high school

Keep your answers concise, encouraging, and specific. Use bullet points when listing multiple items. Always tailor advice to what the student is actually asking. If they mention their grade level, GPA, or intended major, factor that into your answer.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format." }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as { type: "text"; text: string }).text)
      .join("\n");

    return NextResponse.json({ reply: text }, { status: 200 });
  } catch (err: unknown) {
    console.error("[API /chat] Error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}