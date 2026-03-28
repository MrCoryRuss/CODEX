/* =============================================================
   lib/medical-guide-answer.ts
   LLM answer generation for RAG-based medical chatbot.

   Converts retrieved chunks and user queries into LLM prompts,
   then generates answers. Currently returns mock responses.
   Future: Integrates with Anthropic API (Claude) for real generation.

   The prompt engineering here shapes response quality, safety,
   and adherence to the medical guide context. All responses
   include source citations for transparency.

   Decision D-012: RAG-powered medical guide chatbot.
   ============================================================= */

import type { RetrievalResult } from "./medical-guide-retrieval";
import type { ChatSource } from "@/types/medical-chat";
import { resultsToSources } from "./medical-guide-retrieval";

/**
 * System prompt for guiding LLM medical chatbot behavior.
 */
const SYSTEM_PROMPT = `You are a helpful medical information assistant for Posada Concepción, BCS, Mexico.

Your role:
- Provide accurate, evidence-based medical information
- Reference local facilities and emergency contacts when relevant
- Escalate serious/emergency situations clearly
- Be honest about uncertainty and limitations
- Suggest professional medical consultation for serious conditions

Important safety guidelines:
- This is educational information, not medical diagnosis or treatment
- For emergencies (chest pain, difficulty breathing, severe bleeding), suggest calling 911 or local emergency
- If a user describes critical symptoms, recommend immediate professional evaluation
- Include source citations for medical claims

Tone:
- Compassionate, clear, and accessible
- Spanish and English when needed
- Practical and specific to the Posada/BCS region`;

/**
 * Configuration for LLM generation parameters.
 */
export interface GenerationConfig {
  /** Temperature for generation randomness (0.0-1.0) */
  temperature?: number;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Whether to include source citations in response */
  includeSources?: boolean;
}

/**
 * Request structure for answer generation.
 */
export interface AnswerRequest {
  /** User's question or query */
  query: string;
  /** Retrieved context chunks from RAG */
  sources: RetrievalResult[];
  /** Optional generation parameters */
  config?: GenerationConfig;
}

/**
 * Generated answer with sources and metadata.
 */
export interface GeneratedAnswer {
  /** The assistant's response text */
  text: string;
  /** Source chunks cited in the response */
  sources: ChatSource[];
  /** Confidence level of the answer (0.0-1.0) */
  confidence: number;
  /** Whether this requires escalation to human */
  requiresEscalation: boolean;
  /** Reason for escalation, if applicable */
  escalationReason?: string;
  /** Generation metadata */
  metadata?: {
    /** Which LLM model was used */
    model?: string;
    /** Time to generate in milliseconds */
    generationTimeMs?: number;
  };
}

/**
 * Generate an answer to a medical question using retrieved sources.
 *
 * Current behavior: Returns a mock answer combining sources.
 * Future: Calls Anthropic Claude API for real generation.
 *
 * @param query - User's medical question
 * @param sources - Retrieved relevant chunks
 * @param config - Optional generation configuration
 * @returns GeneratedAnswer with text and sources
 */
export async function generateAnswer(
  query: string,
  sources: RetrievalResult[],
  config: GenerationConfig = {}
): Promise<GeneratedAnswer> {
  const startTime = Date.now();

  try {
    // Build the prompt
    const prompt = buildPrompt(query, sources, config);

    console.info("[medical-guide-answer] Generating answer", {
      queryLength: query.length,
      sourceCount: sources.length,
      temperature: config.temperature ?? 0.7,
    });

    // TODO: When Anthropic API is integrated:
    // const response = await anthropic.messages.create({
    //   model: "claude-3-sonnet-20240229",
    //   max_tokens: config.maxTokens ?? 1024,
    //   system: SYSTEM_PROMPT,
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: config.temperature ?? 0.7,
    // });
    // const answerText = response.content[0].type === "text" ? response.content[0].text : "";

    // For now, return mock answer based on sources
    const answerText = generateMockAnswer(query, sources);

    const generationTimeMs = Date.now() - startTime;
    const chatSources = config.includeSources !== false ? resultsToSources(sources) : [];

    // Detect if answer requires escalation (emergency keywords)
    const requiresEscalation = detectEscalation(query, answerText);
    const escalationReason = requiresEscalation
      ? "Query contains emergency keywords - recommend human review"
      : undefined;

    console.info("[medical-guide-answer] Answer generated successfully", {
      generationTimeMs,
      sourceCount: chatSources.length,
      requiresEscalation,
    });

    return {
      text: answerText,
      sources: chatSources,
      confidence: sources.length > 0 ? 0.85 : 0.5,
      requiresEscalation,
      escalationReason,
      metadata: {
        model: "mock",
        generationTimeMs,
      },
    };
  } catch (err) {
    console.error("[medical-guide-answer] generateAnswer failed:", err);

    return {
      text: "I apologize, but I encountered an error generating an answer. Please try again or contact local medical services.",
      sources: [],
      confidence: 0,
      requiresEscalation: true,
      escalationReason: "System error in answer generation",
      metadata: {
        generationTimeMs: Date.now() - startTime,
      },
    };
  }
}

/**
 * Build the full prompt for the LLM.
 *
 * Combines system instructions, context from sources, and the user query
 * into a coherent prompt that guides generation.
 *
 * @param query - The user's question
 * @param sources - Retrieved relevant chunks
 * @param config - Generation configuration
 * @returns The full prompt string
 */
export function buildPrompt(
  query: string,
  sources: RetrievalResult[],
  config: GenerationConfig = {}
): string {
  let prompt = SYSTEM_PROMPT + "\n\n";

  // Add context from sources
  if (sources.length > 0) {
    prompt += "=== RELEVANT MEDICAL GUIDE CONTENT ===\n\n";

    sources.forEach((result, index) => {
      prompt += `[Source ${index + 1}: ${result.chunk.metadata.source ?? "Medical Guide"}]\n`;
      prompt += result.chunk.text + "\n\n";
    });

    prompt += "=== END SOURCES ===\n\n";
  } else {
    prompt += "Note: No specific medical guide content was found for this query.\n\n";
  }

  // Add the user query
  prompt += `User question: ${query}\n\n`;
  prompt += "Please provide a helpful, accurate answer based on the context above, ";
  prompt += "and cite sources where applicable. If you don't have enough information, ";
  prompt += "suggest professional medical consultation.";

  return prompt;
}

// ── Helper functions ────────────────────────────────────────

/**
 * Generate a mock answer by combining retrieved sources.
 *
 * Used during development. In production, this is replaced
 * by actual LLM API calls.
 *
 * @param query - The user's question
 * @param sources - Retrieved sources
 * @returns Mock answer text
 */
function generateMockAnswer(query: string, sources: RetrievalResult[]): string {
  const queryLower = query.toLowerCase();

  // Special cases for common questions
  if (queryLower.includes("clinic") || queryLower.includes("hospital")) {
    return "Based on the medical guide, there are several healthcare facilities available in the Posada area. The nearest options depend on your specific needs - for general care, local clinics are available; for emergencies or specialized care, regional hospitals may be needed. Please consult the facilities list or call emergency services for immediate help.";
  }

  if (queryLower.includes("emergency") || queryLower.includes("911")) {
    return "In case of emergency, dial 911 or contact local emergency services immediately. You can also call the emergency contact numbers listed in the medical guide. For urgent but non-emergency situations, visit the nearest clinic or urgent care facility.";
  }

  if (sources.length > 0) {
    return `Based on the medical guide, here's what I found about your question: ${sources[0].preview}. For more detailed information, please consult the full medical guide or speak with a healthcare professional.`;
  }

  return "I found information in the medical guide that may help. For personalized medical advice, please consult a healthcare professional or visit a local facility.";
}

/**
 * Detect if a query/answer indicates an emergency requiring escalation.
 *
 * Looks for critical keywords: chest pain, difficulty breathing, severe,
 * unconscious, seizure, etc.
 *
 * @param query - The user's question
 * @param answer - The generated answer
 * @returns true if escalation is recommended
 */
function detectEscalation(query: string, answer: string): boolean {
  const emergencyKeywords = [
    "emergency",
    "911",
    "ambulance",
    "chest pain",
    "difficulty breathing",
    "unconscious",
    "seizure",
    "severe bleeding",
    "poisoning",
    "critical",
    "life-threatening",
  ];

  const combined = (query + " " + answer).toLowerCase();

  return emergencyKeywords.some((keyword) => combined.includes(keyword));
}
