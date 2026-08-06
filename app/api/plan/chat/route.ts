import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const GEMINI_MODEL = "gemini-3.5-flash";

// More generous since chat is cheap and conversational — 30 messages/hour
const RATE_LIMIT = 30;
const RATE_WINDOW_MINUTES = 60;
// Cap history size so a client can't send unbounded conversation length
const MAX_MESSAGES = 20;

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

// Gemini uses "model" instead of "assistant" for the AI turn role
type ChatMessage = { role: "user" | "assistant"; content: string };

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
    const clientIp = getClientIp(request);
    const rateCheck = await checkRateLimit(clientIp, "chat", RATE_LIMIT, RATE_WINDOW_MINUTES);

    if (!rateCheck.allowed) {
      const minutes = Math.ceil((rateCheck.retryAfterSeconds ?? 3600) / 60);
      return NextResponse.json(
        {
          error: `You've reached the limit of ${RATE_LIMIT} messages per hour. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds ?? 3600) } }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format." }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: `Conversation is too long (max ${MAX_MESSAGES} messages). Please start a new conversation.` },
        { status: 400 }
      );
    }

    // Gemini expects contents as [{ role, parts: [{ text }] }],
    // and uses "model" instead of "assistant" for the AI's turns.
    const contents = (messages as ChatMessage[]).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await getGenAI().models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 2048,
      },
    });

    const text = response.text ?? "";

    return NextResponse.json({ reply: text }, { status: 200 });
  } catch (err: unknown) {
    console.error("[API /chat] Error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}