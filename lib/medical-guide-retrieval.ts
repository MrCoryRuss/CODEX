/* =============================================================
   lib/medical-guide-retrieval.ts
   Vector search and retrieval for RAG-based medical chatbot.

   Handles querying chunks by semantic similarity. Currently uses
   simple text-based ranking as a fallback. Future integration will
   use vector embeddings (OpenAI Embeddings API, Hugging Face, etc)
   for semantic search.

   The retrieval layer is decoupled from the embedding method,
   allowing easy swapping of backends without changing consumer code.

   Decision D-012: RAG-powered medical guide chatbot.
   ============================================================= */

import type { Chunk } from "./medical-guide-chunks";
import type { ChatSource } from "@/types/medical-chat";

/**
 * A ranked search result combining chunk and relevance score.
 */
export interface RetrievalResult {
  /** The chunk that matched */
  chunk: Chunk;
  /** Relevance score from 0.0 to 1.0 */
  score: number;
  /** Brief preview of the chunk content for display */
  preview: string;
}

// ── In-memory chunk store ────────────────────────────────────
// In production, this would be a vector database or Pinecone/Weaviate.
// For now, chunks are stored in memory and searched by text similarity.

let storedChunks: Chunk[] = [];

/**
 * Add chunks to the retrieval index.
 *
 * Current behavior: Stores in memory. Future: Sends to vector DB.
 *
 * @param chunks - Array of chunks to index
 */
export function addChunksToIndex(chunks: Chunk[]): void {
  storedChunks.push(...chunks);
  console.info(`[medical-guide-retrieval] Added ${chunks.length} chunks to index`, {
    totalChunks: storedChunks.length,
  });
}

/**
 * Clear all chunks from the retrieval index.
 */
export function clearIndex(): void {
  storedChunks = [];
  console.info("[medical-guide-retrieval] Cleared chunk index");
}

/**
 * Get the current number of chunks in the index.
 *
 * @returns Number of indexed chunks
 */
export function getIndexSize(): number {
  return storedChunks.length;
}

// ── Search API ──────────────────────────────────────────────

/**
 * Search for chunks relevant to a query.
 *
 * Current algorithm: Keyword matching with TF-IDF-like scoring.
 * Future: Vector similarity search using embeddings.
 *
 * @param query - User question or search term
 * @param topK - Number of top results to return (default: 5)
 * @returns Array of RetrievalResult objects, sorted by relevance
 */
export function searchChunks(query: string, topK: number = 5): RetrievalResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  if (storedChunks.length === 0) {
    console.warn("[medical-guide-retrieval] searchChunks called on empty index");
    return [];
  }

  // TODO: When vector embeddings are available:
  // 1. Embed the query
  // 2. Compute vector similarity to each chunk
  // 3. Return top-k by similarity score

  // For now, use keyword-based ranking
  const results: RetrievalResult[] = storedChunks
    .map((chunk) => ({
      chunk,
      score: computeKeywordRelevance(query, chunk.text),
      preview: extractPreview(chunk.text, 100),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  console.info(`[medical-guide-retrieval] Search returned ${results.length} results for query`, {
    query: query.slice(0, 50),
    topK,
  });

  return results;
}

/**
 * Rank chunks by relevance to a query.
 *
 * This is a convenience function when you already have chunks
 * and want to rank them without hitting the stored index.
 *
 * @param chunks - Array of chunks to rank
 * @param query - The query to rank against
 * @returns Array of RetrievalResult objects sorted by score
 */
export function rankByRelevance(chunks: Chunk[], query: string): RetrievalResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  return chunks
    .map((chunk) => ({
      chunk,
      score: computeKeywordRelevance(query, chunk.text),
      preview: extractPreview(chunk.text, 100),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Convert retrieval results to ChatSource format for inclusion in assistant responses.
 *
 * @param results - Array of RetrievalResult objects
 * @returns Array of ChatSource objects for the response
 */
export function resultsToSources(results: RetrievalResult[]): ChatSource[] {
  return results.map((result, index) => ({
    chunkId: result.chunk.id,
    title: result.chunk.metadata.source ?? "Medical Guide",
    page: result.chunk.metadata.position ?? result.chunk.metadata.sequenceNumber,
    relevanceScore: result.score,
    preview: result.preview,
  }));
}

// ── Ranking algorithm ───────────────────────────────────────

/**
 * Compute keyword-based relevance score.
 *
 * Simple heuristic scoring based on:
 * - Exact phrase matches (highest weight)
 * - Word frequency in chunk
 * - Word order proximity
 *
 * Future: Replace with embedding-based similarity.
 *
 * @param query - The search query
 * @param text - The text to score
 * @returns Relevance score from 0.0 to 1.0
 */
function computeKeywordRelevance(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact phrase match: highest score
  if (textLower.includes(queryLower)) {
    return 0.9;
  }

  // Count word matches
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
  const textWords = textLower.split(/\s+/);

  let matchCount = 0;
  for (const qWord of queryWords) {
    if (textWords.some((tWord) => tWord.includes(qWord) || qWord.includes(tWord))) {
      matchCount++;
    }
  }

  if (queryWords.length === 0) {
    return 0;
  }

  // Score based on what fraction of query words matched
  const matchRatio = matchCount / queryWords.length;
  return matchRatio * 0.8; // Max 0.8 for keyword match (less than exact phrase)
}

/**
 * Extract a preview string from text.
 *
 * Tries to preserve sentence/word boundaries for readability.
 *
 * @param text - The text to preview
 * @param maxChars - Maximum characters in the preview
 * @returns Preview string
 */
function extractPreview(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text.trim();
  }

  // Try to cut at a word boundary
  let preview = text.substring(0, maxChars);
  const lastSpace = preview.lastIndexOf(" ");
  if (lastSpace > maxChars * 0.8) {
    preview = preview.substring(0, lastSpace);
  }

  return preview.trim() + "...";
}
