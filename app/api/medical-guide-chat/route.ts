import { NextRequest, NextResponse } from "next/server";
import {
  searchChunks,
  generateAnswer,
} from "@/lib/medical-guide-retrieval";
import type { ChatCompletionRequest } from "@/types/medical-chat";

/**
 * POST /api/medical-guide-chat
 *
 * Accepts a user message, retrieves relevant medical guide chunks via RAG,
 * and generates a response using Claude API with source attribution.
 *
 * Request body:
 * {
 *   "message": "Where can I find a doctor?",
 *   "conversationHistory": [{ "role": "user", "content": "..." }] // optional
 * }
 *
 * Response:
 * {
 *   "response": "The nearest clinic is...",
 *   "sources": [{ "title": "...", "chunk": "...", "score": 0.92 }],
 *   "timestamp": "2026-03-28T..."
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate request
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    const body = (await request.json()) as ChatCompletionRequest;
    const { message, conversationHistory } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Message field is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // 1. Search for relevant chunks in medical guide PDFs
    const chunks = await searchChunks(message.trim(), {
      maxResults: 5,
      minScore: 0.5,
    });

    // 2. Generate answer using Claude API with retrieved chunks
    const answer = await generateAnswer({
      query: message.trim(),
      chunks,
      conversationHistory: conversationHistory || [],
    });

    // 3. Return response with sources
    return NextResponse.json(
      {
        response: answer.text,
        sources: chunks.map((chunk) => ({
          id: chunk.id,
          title: chunk.title,
          page: chunk.page,
          preview: chunk.text.substring(0, 150) + "...",
          relevanceScore: chunk.score,
        })),
        timestamp: new Date().toISOString(),
        model: "claude-3-5-sonnet",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[medical-guide-chat] Error:", error);

    // Handle specific errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("API")) {
      return NextResponse.json(
        {
          error:
            "AI service temporarily unavailable. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to process your question. Please try again.",
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
