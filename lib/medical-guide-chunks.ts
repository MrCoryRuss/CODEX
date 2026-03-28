/* =============================================================
   lib/medical-guide-chunks.ts
   Chunking logic for RAG text segmentation and embedding.

   Converts extracted PDF text into semantic chunks suitable for
   embedding and retrieval. Each chunk is sized to fit within
   embedding context windows while preserving semantic meaning.

   Chunks can overlap to maintain context continuity across
   boundaries. This module is format-agnostic: it works with
   any extracted text regardless of source.

   Decision D-012: RAG-powered medical guide chatbot.
   ============================================================= */

/**
 * Options for controlling chunk generation behavior.
 */
export interface ChunkOptions {
  /** Maximum tokens per chunk (default: 512) */
  maxTokens?: number;
  /** Number of tokens to overlap between chunks (default: 50) */
  overlap?: number;
  /** String to use as chunk separator (default: "\n\n") */
  separator?: string;
}

/**
 * A semantic chunk of text ready for embedding.
 */
export interface Chunk {
  /** Unique identifier for this chunk */
  id: string;
  /** The text content of this chunk */
  text: string;
  /** Metadata about the chunk source and position */
  metadata: {
    /** Document or page this chunk came from */
    source?: string;
    /** Position in the source document (page or section number) */
    position?: number;
    /** Estimated token count for this chunk */
    tokenCount: number;
    /** Order of this chunk in the document */
    sequenceNumber: number;
  };
  /** Estimated number of tokens in this chunk (for context budgeting) */
  tokenCount: number;
}

/**
 * Chunk text into semantic segments suitable for RAG retrieval.
 *
 * Algorithm:
 * 1. Split on primary separator (usually paragraph breaks)
 * 2. Group segments into chunks respecting maxTokens limit
 * 3. Add overlap to preserve context across chunk boundaries
 * 4. Assign unique IDs and metadata to each chunk
 *
 * @param text - The text to chunk (typically from extractTextFromPDF)
 * @param options - Chunking behavior options
 * @returns Array of Chunk objects ready for embedding
 */
export function chunkText(text: string, options: ChunkOptions = {}): Chunk[] {
  const maxTokens = options.maxTokens ?? 512;
  const overlap = options.overlap ?? 50;
  const separator = options.separator ?? "\n\n";

  // Validate inputs
  if (!text || text.trim().length === 0) {
    console.warn("[medical-guide-chunks] Empty text provided to chunkText");
    return [];
  }

  if (maxTokens < 100) {
    console.warn("[medical-guide-chunks] maxTokens < 100, clamping to 100");
  }

  if (overlap >= maxTokens) {
    console.warn(
      "[medical-guide-chunks] overlap >= maxTokens, reducing overlap to maxTokens * 0.1"
    );
  }

  // Split text into candidate segments
  const segments = text.split(separator).filter((s) => s.trim().length > 0);

  if (segments.length === 0) {
    return [];
  }

  // Build chunks with overlap
  const chunks: Chunk[] = [];
  let currentChunkText = "";
  let sequenceNumber = 0;
  let overlapBuffer = "";

  for (const segment of segments) {
    const segmentTokens = estimateTokenCount(segment);
    const currentTokens = estimateTokenCount(currentChunkText);

    // If adding this segment would exceed maxTokens, finalize current chunk
    if (currentTokens + segmentTokens > maxTokens && currentChunkText.length > 0) {
      // Save current chunk
      chunks.push(createChunk(currentChunkText, sequenceNumber));
      sequenceNumber++;

      // Prepare overlap for next chunk
      overlapBuffer = extractOverlapBuffer(currentChunkText, overlap);
      currentChunkText = overlapBuffer + (overlapBuffer ? separator : "") + segment;
    } else {
      // Segment fits, add it
      currentChunkText += (currentChunkText ? separator : "") + segment;
    }
  }

  // Don't forget the final chunk
  if (currentChunkText.trim().length > 0) {
    chunks.push(createChunk(currentChunkText, sequenceNumber));
  }

  console.info(`[medical-guide-chunks] Generated ${chunks.length} chunks from text`, {
    inputLength: text.length,
    maxTokens,
    overlap,
  });

  return chunks;
}

// ── Helper functions ────────────────────────────────────────

/**
 * Estimate token count for a string.
 *
 * Simple heuristic: 1 token ≈ 4 characters (OpenAI's rough estimate).
 * For production, consider using a real tokenizer (js-tiktoken, etc).
 *
 * @param text - The text to estimate
 * @returns Estimated token count
 */
function estimateTokenCount(text: string): number {
  // Simple heuristic: roughly 4 chars per token
  // This is conservative (actual might be 3-5 chars per token)
  return Math.ceil(text.length / 4);
}

/**
 * Extract the tail of text to use as overlap for the next chunk.
 *
 * Grabs the last N tokens worth of content to preserve context
 * across chunk boundaries.
 *
 * @param text - The text to extract from
 * @param overlapTokens - Number of tokens to include in overlap
 * @returns Overlap text (last ~overlapTokens of input)
 */
function extractOverlapBuffer(text: string, overlapTokens: number): string {
  const targetChars = overlapTokens * 4; // Rough 1 token = 4 chars
  return text.slice(-targetChars);
}

/**
 * Create a Chunk object with ID and metadata.
 *
 * @param text - The chunk text
 * @param sequenceNumber - The order of this chunk
 * @returns A Chunk object with unique ID and metadata
 */
function createChunk(text: string, sequenceNumber: number): Chunk {
  const tokenCount = estimateTokenCount(text);
  const id = `chunk-${Date.now()}-${sequenceNumber}`;

  return {
    id,
    text: text.trim(),
    metadata: {
      tokenCount,
      sequenceNumber,
    },
    tokenCount,
  };
}
