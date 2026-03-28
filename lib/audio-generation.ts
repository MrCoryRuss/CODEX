/* =============================================================
   lib/audio-generation.ts
   Text-to-speech (TTS) generation for audio briefing scripts.

   Converts AudioScript objects into audio files via external TTS API.
   Currently returns mock results. Future: Integrates with ElevenLabs,
   Google Cloud TTS, or AWS Polly.

   Voice configuration allows per-script customization:
   - Spanish female voice for Posada (Default: María)
   - Male voice option (Default: Carlos)
   - Speed adjustment for readability
   - Tone/emotion customization

   Decision D-013: Daily audio briefing for community updates.
   ============================================================= */

import type {
  AudioScript,
  AudioGenerationRequest,
  AudioGenerationResult,
} from "@/types/audio-briefing";

/**
 * Configuration for available voices and TTS parameters.
 */
export interface VoiceConfig {
  /** Voice identifier/name */
  name: string;
  /** Language code (e.g., "es-MX") */
  language: string;
  /** Gender of the voice ("male" | "female" | "neutral") */
  gender: string;
  /** Provider identifier (e.g., "eleven-labs", "google-tts") */
  provider: string;
  /** Voice-specific ID for the provider */
  providerId: string;
  /** Description of the voice */
  description: string;
}

/**
 * Default voice configurations for the briefing system.
 */
const VOICE_CONFIGS: Record<string, VoiceConfig> = {
  maria: {
    name: "María",
    language: "es-MX",
    gender: "female",
    provider: "eleven-labs",
    providerId: "EXAVITQu4SE4DOHD8lew", // Example; replace with real ID
    description: "Professional female voice for Spanish briefings",
  },
  carlos: {
    name: "Carlos",
    language: "es-MX",
    gender: "male",
    provider: "eleven-labs",
    providerId: "N2lVS1w4EtoT3dr4eOWO", // Example; replace with real ID
    description: "Professional male voice for Spanish briefings",
  },
};

/**
 * Get default voice configuration for audio generation.
 *
 * @param voiceName - Name of the voice (default: "maria")
 * @returns VoiceConfig for the requested voice, or default if not found
 */
export function getVoiceConfig(voiceName: string = "maria"): VoiceConfig {
  const config = VOICE_CONFIGS[voiceName.toLowerCase()];

  if (!config) {
    console.warn(`[audio-generation] Voice "${voiceName}" not found, using default (María)`, {
      available: Object.keys(VOICE_CONFIGS),
    });
    return VOICE_CONFIGS.maria;
  }

  return config;
}

/**
 * Get all available voices.
 *
 * @returns Array of available VoiceConfig objects
 */
export function listAvailableVoices(): VoiceConfig[] {
  return Object.values(VOICE_CONFIGS);
}

// ── Audio generation ────────────────────────────────────────

/**
 * Generate audio from an AudioScript.
 *
 * Current behavior: Logs request and returns mock audio result.
 * Future: Calls ElevenLabs API (or alternative TTS provider).
 *
 * @param request - AudioGenerationRequest with script and voice
 * @returns AudioGenerationResult with audio URL and metadata
 */
export async function generateAudio(
  request: AudioGenerationRequest
): Promise<AudioGenerationResult> {
  const startTime = Date.now();
  const voiceConfig = getVoiceConfig(request.voice?.name);

  try {
    console.info("[audio-generation] Starting audio generation", {
      scriptSections: request.script.sections.length,
      voice: voiceConfig.name,
      language: voiceConfig.language,
    });

    // Combine all script sections into one text
    const fullText = request.script.sections.map((s) => s.content).join("\n\n");

    // TODO: When TTS provider is integrated:
    // const audioUrl = await callElevenLabsAPI({
    //   text: fullText,
    //   voice_id: voiceConfig.providerId,
    //   model_id: "eleven_multilingual_v2",
    //   voice_settings: {
    //     stability: 0.5,
    //     similarity_boost: 0.75,
    //   },
    // });

    // For now, return mock audio result
    const processingTimeMs = Date.now() - startTime;
    const estimatedDuration =
      request.script.metadata?.estimatedTotalDurationSec || calculateEstimatedDuration(fullText);

    const mockAudioUrl = generateMockAudioUrl(
      request.script.metadata?.author ?? "system",
      new Date(request.script.date).toISOString().split("T")[0]
    );

    console.info("[audio-generation] Mock audio generation completed", {
      processingTimeMs,
      durationSec: estimatedDuration,
      audioUrl: mockAudioUrl,
    });

    return {
      audioUrl: mockAudioUrl,
      durationSec: estimatedDuration,
      generatedAt: new Date(),
      provider: "mock",
      jobId: generateJobId(),
      status: {
        success: true,
        processingTimeMs,
      },
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const processingTimeMs = Date.now() - startTime;

    console.error("[audio-generation] generateAudio failed:", err);

    return {
      audioUrl: "",
      durationSec: 0,
      generatedAt: new Date(),
      provider: "mock",
      status: {
        success: false,
        error: errorMessage,
        processingTimeMs,
      },
    };
  }
}

/**
 * Generate audio from a script with default parameters.
 *
 * Convenience wrapper around generateAudio with sensible defaults.
 *
 * @param script - The AudioScript to generate audio from
 * @param voiceName - Name of voice to use (default: "maria")
 * @returns AudioGenerationResult
 */
export async function generateAudioFromScript(
  script: AudioScript,
  voiceName: string = "maria"
): Promise<AudioGenerationResult> {
  return generateAudio({
    script,
    voice: {
      name: voiceName,
      language: "es-MX",
      speed: 1.0,
    },
    includeMusic: true,
  });
}

// ── Helper functions ────────────────────────────────────────

/**
 * Estimate audio duration from text.
 *
 * Simple heuristic: Average reading speed is 150 words per minute.
 * 1 word ≈ 5 characters.
 *
 * @param text - The text to estimate duration for
 * @returns Estimated duration in seconds
 */
function calculateEstimatedDuration(text: string): number {
  // Rough estimate: 150 words/minute = 2.5 words/second
  // 1 word ≈ 5 characters
  const charCount = text.length;
  const wordCount = charCount / 5;
  const seconds = (wordCount / 150) * 60;

  // Add buffer for pacing and pauses
  return Math.round(seconds * 1.15);
}

/**
 * Generate a unique job ID for audio generation tracking.
 *
 * @returns Unique job ID string
 */
function generateJobId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `audio-${timestamp}-${random}`;
}

/**
 * Generate a mock audio file URL.
 *
 * Used during development. In production, this would be a real URL
 * to a hosted audio file.
 *
 * @param author - Author/system that created the audio
 * @param dateStr - Date in ISO format
 * @returns Mock audio URL
 */
function generateMockAudioUrl(author: string, dateStr: string): string {
  const encoded = Buffer.from(`${author}:${dateStr}`).toString("base64");
  return `https://mock-audio.posada.local/briefings/${dateStr}/${encoded}.mp3`;
}
