/**
 * Audio Briefing types for daily audio content generation
 * Defines structures for audio episodes, scripts, and generation workflows
 */

/**
 * Type of content section in an audio briefing script
 */
export type AudioScriptSectionType =
  | 'weather'
  | 'marine'
  | 'events'
  | 'announcements'
  | 'medical';

/**
 * A single section of an audio briefing script
 */
export interface AudioScriptSection {
  /** Type categorizing the section content */
  type: AudioScriptSectionType;
  /** The written content/script for this section */
  content: string;
  /** Estimated duration in seconds for this section */
  estimatedDurationSec?: number;
}

/**
 * Complete script for a daily audio briefing
 */
export interface AudioScript {
  /** The date this script is for */
  date: Date;
  /** Ordered array of script sections */
  sections: AudioScriptSection[];
  /** Optional metadata about the script */
  metadata?: {
    /** Who compiled or approved this script */
    author?: string;
    /** Total estimated duration in seconds */
    estimatedTotalDurationSec?: number;
    /** Language code (e.g., "es", "en") */
    language?: string;
  };
}

/**
 * Published audio episode available to users
 */
export interface AudioEpisode {
  /** Unique identifier for the episode */
  id: string;
  /** Date the episode covers */
  date: Date;
  /** Title/heading for the episode */
  title: string;
  /** Duration of audio in seconds */
  durationSec: number;
  /** URL to the audio file (mp3, m4a, etc.) */
  audioUrl: string;
  /** Full transcript of the audio content */
  transcript: string;
  /** Brief summary of key information */
  summary: string;
  /** Timestamp when this episode was generated */
  generatedAt: Date;
  /** URL to access episode on hosting platform (if different from audioUrl) */
  episodeUrl?: string;
  /** Which script was used to generate this episode */
  scriptId?: string;
  /** Voice used for generation (e.g., "Maria", "Carlos") */
  voice?: string;
}

/**
 * Request to generate audio from a script
 */
export interface AudioGenerationRequest {
  /** The script to convert to audio */
  script: AudioScript;
  /** Optional voice selection for text-to-speech */
  voice?: {
    /** Voice identifier or name */
    name: string;
    /** Language code (e.g., "es-MX") */
    language?: string;
    /** Speed multiplier (1.0 = normal, 0.8 = slower, 1.2 = faster) */
    speed?: number;
  };
  /** Whether to include background music or effects */
  includeMusic?: boolean;
}

/**
 * Result of audio generation
 */
export interface AudioGenerationResult {
  /** URL where the generated audio file is stored */
  audioUrl: string;
  /** Actual duration of the generated audio in seconds */
  durationSec: number;
  /** Timestamp when audio was generated */
  generatedAt: Date;
  /** Provider used for generation (e.g., "Google TTS", "AWS Polly") */
  provider?: string;
  /** Unique identifier for tracking the generation job */
  jobId?: string;
  /** Success status and error details if generation failed */
  status: {
    success: boolean;
    /** Error message if generation failed */
    error?: string;
    /** Processing time in milliseconds */
    processingTimeMs?: number;
  };
}
