# Feature: Daily Audio Briefing

## Overview

A 60-90 second daily audio summary generated automatically from live weather, wind, marine data, and community events. Generated early each morning (6 AM local time), voiced via text-to-speech, and served as a static MP3 file. Users can listen on the homepage or browse the archive.

## Data Flow

```
Cron trigger (6 AM local) → Generate briefing script → TTS API → MP3 file
  ↓
  Data sources:
  - Current weather (temp, conditions, wind)
  - 7-day forecast summary
  - Sea conditions (temp, tide times)
  - Today's events (sports, community)
  - Announcements
  ↓
  Script template + data → Claude API → Natural language script
  ↓
  Script → ElevenLabs or OpenAI TTS → MP3
  ↓
  Store in /public/audio/YYYY-MM-DD.mp3
  ↓
  Update metadata in /data/audio-episodes.ts
```

## Script Generation

**lib/audio-script-template.ts**

Template-based script generation with data placeholders:

```
"Good morning, Posada. Here's your briefing for [DATE].

Weather: [TEMP_RANGE] with [CONDITIONS]. Humidity [HUMIDITY]%.

Wind from the [WIND_DIRECTION] at [WIND_SPEED] knots, gusting to [WIND_GUST].

Sea temperature: [SEA_TEMP]°F. High tide at [TIDE_TIME], low at [TIDE_TIME2].

Today's events: [EVENT_1], [EVENT_2], [EVENT_3].

Have a great day!"
```

**Variables:**
- `[TEMP_RANGE]` - "68 to 78 degrees"
- `[CONDITIONS]` - "partly cloudy"
- `[WIND_DIRECTION]` - "north", "northeast", etc.
- `[WIND_SPEED]` - numeric, converted from m/s to knots
- `[TIDE_TIME]` - "1:45 PM", "high" or "low"
- `[EVENT_1]` - "Pickleball at 8 AM", "Beach cleanup at 3 PM"

## Audio Generation

**lib/audio-generation.ts**

TTS API abstraction supporting multiple providers:

```typescript
interface AudioGenerator {
  generateSpeech(script: string): Promise<Buffer>;
}

class ElevenLabsGenerator implements AudioGenerator {
  async generateSpeech(script: string): Promise<Buffer> {
    // POST to https://api.elevenlabs.io/v1/text-to-speech
    // Use voice: "English female, friendly tone"
    // Return MP3 buffer
  }
}

class OpenAIGenerator implements AudioGenerator {
  async generateSpeech(script: string): Promise<Buffer> {
    // POST to https://api.openai.com/v1/audio/speech
    // Use voice: "alloy" or "nova"
    // Return MP3 buffer
  }
}
```

**Provider selection:**
- Default: ElevenLabs (sounds more natural, but costs ~$5-10/mo at 1 episode/day)
- Fallback: OpenAI TTS (lower cost, ~$1-2/mo)
- Set via `AUDIO_TTS_PROVIDER` env var

## Episode Storage & Retrieval

**Data structure:**
```typescript
interface AudioEpisode {
  id: string;
  date: string; // YYYY-MM-DD
  title: string; // "Daily Briefing - March 28"
  description: string;
  duration: number; // seconds
  url: string; // /audio/2026-03-28.mp3
  script: string; // Full text of spoken script
  transcript: string; // Searchable transcript
  generatedAt: string; // ISO timestamp
  source: "live" | "mock";
}
```

**Storage:**
- **Episodes:** `/data/audio-episodes.ts` (metadata index)
- **Audio files:** `/public/audio/YYYY-MM-DD.mp3`
- **Transcripts:** Embedded in metadata or separate `/public/transcripts/YYYY-MM-DD.txt`

## Retrieval Functions

**lib/audio-briefing.ts**

```typescript
export function getLatestBriefing(): AudioEpisode | null
export function getBriefingByDate(date: Date | string): AudioEpisode | null
export function getBriefingArchive(limit?: number): AudioEpisode[]
export function getBriefingCount(): number
```

## UI Components

**components/audio/**
- `AudioPlayerCard` - Playback control, metadata, transcript toggle
- `AudioArchiveList` - Chronological list of past episodes with duration, date, play buttons

**Pages:**
- `/daily-briefing` - Latest episode featured, archive below
- Homepage card: `AudioBriefingCard` - "Play Today's Briefing"

## Scheduling & Automation

**Cron job:**
```bash
# Every day at 6 AM Posada time (MST / UTC-7)
0 6 * * * npm run generate:briefing
```

**Vercel Cron (preferred):**
```json
{
  "crons": [{
    "path": "/api/cron/generate-briefing",
    "schedule": "0 6 * * *"
  }]
}
```

**Endpoint:** `POST /api/cron/generate-briefing`
- Fetches latest data
- Generates script via Claude
- Calls TTS provider
- Saves MP3 + metadata
- Returns success/error status

## Error Handling & Fallback

1. **TTS API down?** Use mock audio (pre-recorded sample)
2. **Data fetch timeout?** Use yesterday's data as fallback
3. **Script generation fails?** Generic briefing: "Check back later"
4. **Cron job misses?** Manual generation via admin UI (future)

## Decision References

- **D-013:** Daily audio briefing feature
- **D-007:** ElevenLabs or OpenAI TTS selection
- **Data sources section:** Script generation and audio hosting

## Cost Estimates

| Provider | Price | Monthly (1 ep/day) | Notes |
|----------|-------|-------------------|-------|
| ElevenLabs | $0.30/1k chars | $3-5 | High quality, natural voice |
| OpenAI TTS | $15/1M tokens | $1-2 | Faster, cheaper, adequate quality |
| Storage (AWS S3) | $0.023/GB | <$1 | 365 episodes × 5MB = 1.8GB/year |

## Future Enhancements

1. **Multi-voice:** Different speakers for weather, events, announcements
2. **Music intro:** Branded theme music before briefing
3. **Localization:** Spanish-language audio briefing
4. **Podcast feed:** Submit briefing to Apple Podcasts, Spotify via RSS
5. **Custom subscriptions:** Email or SMS notification when new episode posted
6. **Listener feedback:** "Was this helpful?" buttons to track engagement
7. **Analytics:** Track play counts, average listen duration, skip patterns
