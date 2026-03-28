/* =============================================================
   lib/audio-briefing.ts
   Main audio briefing data layer for episode retrieval and metadata.

   Manages published audio episodes for the daily briefing program.
   Returns episodes by date, archives historical episodes, and
   provides listings for the media player interface.

   Current behavior: Uses in-memory mock data store.
   Future: Integrates with audio hosting platform (Podbean, Buzzsprout, etc).

   Decision D-013: Daily audio briefing for community updates.
   ============================================================= */

import type { AudioEpisode } from "@/types/audio-briefing";

// Import mock episodes
import { MOCK_AUDIO_EPISODES } from "@/data/mock-audio-episodes";

// ── In-memory episode store ──────────────────────────────────
// Future: Replace with database or API calls to hosting platform

let storedEpisodes: AudioEpisode[] = [...MOCK_AUDIO_EPISODES];

/**
 * Get the most recent published audio briefing episode.
 *
 * @returns The latest AudioEpisode, or null if none exist
 */
export function getLatestBriefing(): AudioEpisode | null {
  if (storedEpisodes.length === 0) {
    return null;
  }

  return storedEpisodes.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
}

/**
 * Get the audio briefing episode for a specific date.
 *
 * @param date - Date to look up (Date object or ISO string)
 * @returns AudioEpisode for that date, or null if not found
 */
export function getBriefingByDate(date: Date | string): AudioEpisode | null {
  const targetDate =
    typeof date === "string"
      ? new Date(date).toISOString().split("T")[0]
      : date.toISOString().split("T")[0];

  return (
    storedEpisodes.find((ep) => {
      const epDate = new Date(ep.date).toISOString().split("T")[0];
      return epDate === targetDate;
    }) ?? null
  );
}

/**
 * Get archived episodes with optional limit.
 *
 * Returns episodes sorted by date (newest first).
 *
 * @param limit - Maximum number of episodes to return (default: 30)
 * @returns Array of AudioEpisode objects
 */
export function getBriefingArchive(limit: number = 30): AudioEpisode[] {
  return storedEpisodes
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * Get total number of published episodes.
 *
 * @returns Episode count
 */
export function getBriefingCount(): number {
  return storedEpisodes.length;
}

/**
 * Add a new episode to the store.
 *
 * Note: In production, this would validate and persist to database.
 * Currently stores in memory (resets on server restart).
 *
 * @param episode - The AudioEpisode to add
 */
export function addBriefing(episode: AudioEpisode): void {
  // Check for duplicates
  if (storedEpisodes.some((ep) => ep.id === episode.id)) {
    console.warn(`[audio-briefing] Episode with id ${episode.id} already exists`);
    return;
  }

  storedEpisodes.push(episode);
  console.info(`[audio-briefing] Added episode: ${episode.title}`, {
    id: episode.id,
    date: new Date(episode.date).toISOString().split("T")[0],
  });
}

/**
 * Get episodes published within a date range.
 *
 * @param startDate - Start date (inclusive)
 * @param endDate - End date (inclusive)
 * @returns Array of AudioEpisode objects in the range, newest first
 */
export function getBriefingsInRange(startDate: Date, endDate: Date): AudioEpisode[] {
  const start = startDate.getTime();
  const end = endDate.getTime();

  return storedEpisodes
    .filter((ep) => {
      const epTime = new Date(ep.date).getTime();
      return epTime >= start && epTime <= end;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Search episodes by title or transcript content.
 *
 * Simple substring search (case-insensitive).
 *
 * @param query - Search term
 * @returns Array of matching AudioEpisode objects
 */
export function searchBriefings(query: string): AudioEpisode[] {
  const lower = query.toLowerCase();

  return storedEpisodes
    .filter(
      (ep) =>
        ep.title.toLowerCase().includes(lower) ||
        ep.transcript.toLowerCase().includes(lower) ||
        (ep.summary && ep.summary.toLowerCase().includes(lower))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get information about the briefing archive.
 *
 * Useful for UI that shows archive statistics.
 *
 * @returns Object with archive metadata
 */
export function getArchiveInfo() {
  const count = storedEpisodes.length;

  if (count === 0) {
    return {
      count: 0,
      oldestDate: null,
      newestDate: null,
      totalDurationSec: 0,
    };
  }

  const sorted = storedEpisodes.slice().sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const totalDurationSec = storedEpisodes.reduce((sum, ep) => sum + ep.durationSec, 0);

  return {
    count,
    oldestDate: sorted[0].date,
    newestDate: sorted[sorted.length - 1].date,
    totalDurationSec,
  };
}

// ── Homepage data ────────────────────────────────────────────

export interface AudioBriefingSnapshot {
  /** The latest published episode */
  latest: AudioEpisode | null;
  /** Recent episodes for the player list */
  recent: AudioEpisode[];
  /** Count of total available episodes */
  totalCount: number;
}

/**
 * Fetch audio briefing data for homepage or player interface.
 *
 * @param recentCount - Number of recent episodes to return (default: 5)
 * @returns AudioBriefingSnapshot with latest and recent episodes
 */
export function getAudioBriefingSnapshot(recentCount: number = 5): AudioBriefingSnapshot {
  return {
    latest: getLatestBriefing(),
    recent: getBriefingArchive(recentCount),
    totalCount: getBriefingCount(),
  };
}
