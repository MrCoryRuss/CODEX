import { NextRequest, NextResponse } from "next/server";
import { searchChunks, resultsToSources } from "@/lib/medical-guide-retrieval";
import { generateAnswer } from "@/lib/medical-guide-answer";
import type { ChatRequest } from "@/types/medical-chat";

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 });
    }
    const body = (await request.json()) as ChatRequest;
    const { message } = body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message field is required and must be a non-empty string" }, { status: 400 });
    }
    const results = searchChunks(message.trim(), 5);
    const answer = await generateAnswer(message.trim(), results);
    return NextResponse.json({
      response: answer.text,
      sources: answer.sources,
      confidence: answer.confidence,
      requiresEscalation: answer.requiresEscalation,
      escalationReason: answer.escalationReason,
      timestamp: new Date().toISOString(),
    }, {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-cache, no-store, must-revalidate" },
    });
  } catch (error) {
    console.error("[medical-guide-chat] Error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to process your question. Please try again." }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" },
  });
}
