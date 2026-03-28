/* =============================================================
   lib/audio-episodes.ts
   Episode storage, retrieval, and lifecycle management.

   Manages the persistence of generated audio episodes. Currently
   uses an in-memory store. Future: Integrates with database or
   audio hosting platform API (Podbean, Buzzsprout, Anchor, etc).

   Operations:
   - Save newly generated episodes
   - Retrieve by ID or date
   - List episodes with pagination
   - Track generation status
   - Archive old episodes

   Decision D-013: Daily audio briefing for community updates.
   ============================================================= */

import type { AudioEpisode } from "@/types/audio-briefing";

/**
 * Response for save operations.
 */
export interface SaveEpisodeResult {
  /** Whether the save was successful */
  success: boolean;
  /** The saved episode */
  episode?: AudioEpisode;
  /** Error message if save failed */
  error?: string;
}

/**
 * In-memory episode storage.
 * Future: Replace with database or API calls.
 */
let episodeStore: Map<string, AudioEpisode> = new Map();

/**
 * Initialize the episode store with seed data.
 *
 * @param episodes - Initial episodes to populate the store
 */
export function initializeEpisodeStore(episodes: AudioEpisode[]): void {
  episodeStore.clear();
  episodes.forEach((ep) => {
    episodeStore.set(ep.id, ep);
  });
  console.info(`[audio-episodes] Initialized episode store with ${episodes.length} episodes`);
}

/**
 * Save a new audio episode.
 *
 * Validates the episode and stores it. If an episode with the same
 * date already exists, it can be overwritten (via update flag).
 *
 * @param episode - The AudioEpisode to save
 * @param update - Whether to overwrite existing episode with same date
 * @returns SaveEpisodeResult with success status
 */
export function saveEpisode(episode: AudioEpisode, update: boolean = false): SaveEpisodeResult {
  try {
    // Validate required fields
    if (!episode.id) {
      return { success: false, error: "Episode must have an id" };
    }

    if (!episode.title) {
      return { success: false, error: "Episode must have a title" };
    }

    if (!episode.audioUrl) {
      return { success: false, error: "Episode must have an audioUrl" };
    }

    // Check for duplicate date
    const existingByDate = Array.from(episodeStore.values()).find(
      (ep) =>
        new Date(ep.date).toISOString().split("T")[0] ===
        new Date(episode.date).toISOString().split("T")[0]
    );

    if (existingByDate && !update) {
      return {
        success: false,
        error: `Episode already exists for date ${new Date(episode.date).toISOString().split("T")[0]}. Set update=true to replace.`,
      };
    }

    // Store the episode
    episodeStore.set(episode.id, episode);

    console.info("[audio-episodes] Saved episode", {
      id: episode.id,
      title: episode.title,
      date: new Date(episode.date).toISOString().split("T")[0],
      updated: !!existingByDate,
    });

    return { success: true, episode };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[audio-episodes] saveEpisode failed:", err);
    return { success: false, error: errorMessage };
  }
}

/**
 * Retrieve an episode by ID.
 *
 * @param id - The episode ID
 * @returns The AudioEpisode, or null if not found
 */
export function getEpisode(id: string): AudioEpisode | null {
  return episodeStore.get(id) ?? null;
}

/**
 * Retrieve an episode by date.
 *
 * @param date - The date to look up (Date or ISO string)
 * @returns The AudioEpisode for that date, or null if not found
 */
export function getEpisodeByDate(date: Date | string): AudioEpisode | null {
  const targetDate =
    typeof date === "string"
      ? new Date(date).toISOString().split("T")[0]
      : date.toISOString().split("T")[0];

  const episodes = Array.from(episodeStore.values());
  return (
    episodes.find((ep) => {
      const epDate = new Date(ep.date).toISOString().split("T")[0];
      return epDate === targetDate;
    }) ?? null
  );
}

/**
 * List all episodes with optional sorting and limiting.
 *
 * @param limit - Maximum number of episodes to return (default: 50)
 * @param sortBy - Sort order: "newest" or "oldest" (default: "newest")
 * @returns Array of AudioEpisode objects
 */
export function listEpisodes(limit: number = 50, sortBy: "newest" | "oldest" = "newest"): AudioEpisode[] {
  let episodes = Array.from(episodeStore.values());

  // Sort
  episodes.sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return sortBy === "newest" ? bTime - aTime : aTime - bTime;
  });

  // Limit
  return episodes.slice(0, limit);
}

/**
 * Get total count of episodes in the store.
 *
 * @returns Number of episodes
 */
export function getEpisodeCount(): number {
  return episodeStore.size;
}

/**
 * Delete an episode by ID.
 *
 * Note: Deletion is permanent. In production, consider soft-delete
 * or archive instead.
 *
 * @param id - The episode ID to delete
 * @returns true if deleted, false if not found
 */
export function deleteEpisode(id: string): boolean {
  const had = episodeStore.has(id);
  if (had) {
    episodeStore.delete(id);
    console.info("[audio-episodes] Deleted episode", { id });
  }
  return had;
}

/**
 * Get episodes within a date range.
 *
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Array of AudioEpisode objects in range, newest first
 */
export function getEpisodesInRange(startDate: Date, endDate: Date): AudioEpisode[] {
  const start = startDate.getTime();
  const end = endDate.getTime();

  return Array.from(episodeStore.values())
    .filter((ep) => {
      const epTime = new Date(ep.date).getTime();
      return epTime >= start && epTime <= end;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Search episodes by title, summary, or transcript.
 *
 * Simple substring search (case-insensitive).
 *
 * @param query - Search term
 * @returns Array of matching AudioEpisode objects, newest first
 */
export function searchEpisodes(query: string): AudioEpisode[] {
  const lower = query.toLowerCase();

  return Array.from(episodeStore.values())
    .filter(
      (ep) =>
        ep.title.toLowerCase().includes(lower) ||
        (ep.summary && ep.summary.toLowerCase().includes(lower)) ||
        (ep.transcript && ep.transcript.toLowerCase().includes(lower))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get archive statistics.
 *
 * @returns Object with count, date range, and total duration
 */
export function getArchiveStats() {
  const episodes = Array.from(episodeStore.values());

  if (episodes.length === 0) {
    return {
      count: 0,
      oldestDate: null,
      newestDate: null,
      totalDurationHours: 0,
    };
  }

  const sorted = episodes.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const totalDurationSec = episodes.reduce((sum, ep) => sum + ep.durationSec, 0);

  return {
    count: episodes.length,
    oldestDate: sorted[0].date,
    newestDate: sorted[sorted.length - 1].date,
    totalDurationHours: Math.round((totalDurationSec / 3600) * 100) / 100,
  };
}

/**
 * Export all episodes (useful for backup or migration).
 *
 * @returns Array of all AudioEpisode objects
 */
export function exportAllEpisodes(): AudioEpisode[] {
  return Array.from(episodeStore.values());
}

/**
 * Clear all episodes from the store.
 *
 * Warning: This is permanent (in memory; real persistence is
 * implementation-dependent).
 */
export function clearAllEpisodes(): void {
  const count = episodeStore.size;
  episodeStore.clear();
  console.warn("[audio-episodes] Cleared all episodes", { count });
}
