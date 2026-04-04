import { NextResponse } from "next/server";
import { fetchHomepageWeather } from "@/lib/weather";
import { fetchHomepageMarine } from "@/lib/marine";
import { generatePodcastScript } from "@/lib/podcast-generator";
import { fetchGoogleCalendarEvents } from "@/lib/google-calendar";
import type { CalendarEvent } from "@/types/calendar";

// VM-hosted TTS server (Gemini TTS via gsk — free, high quality)
const TTS_ENDPOINT = process.env.POSADA_TTS_ENDPOINT || "https://vwpxquth.gensparkclaw.com/tts/generate";
const TTS_SECRET   = process.env.POSADA_TTS_SECRET   || "";

// Mock audio fallback
const MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function dateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function POST() {
  try {
    // Fetch weather, marine, and calendar events in parallel
    const gcalConfig = {
      apiKey: process.env.GOOGLE_CALENDAR_API_KEY ?? "",
      sportsCalendarId: process.env.GCAL_SPORTS_ID ?? "",
      communityCalendarId: process.env.GCAL_COMMUNITY_ID ?? "",
    };

    const [weather, marine, events] = await Promise.all([
      fetchHomepageWeather(),
      fetchHomepageMarine(),
      gcalConfig.apiKey
        ? fetchGoogleCalendarEvents(gcalConfig, dateStr(0), dateStr(3)).catch(() => [] as CalendarEvent[])
        : Promise.resolve([] as CalendarEvent[]),
    ]);

    const script = generatePodcastScript(weather, marine, events);

    // Try VM TTS server (Gemini TTS — free, high quality)
    if (TTS_SECRET) {
      try {
        const ttsRes = await fetch(TTS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Secret": TTS_SECRET,
          },
          body: JSON.stringify({
            script,
            voice: "warm, friendly local radio host, clear and upbeat, casual and conversational",
          }),
          signal: AbortSignal.timeout(90000),
        });

        if (ttsRes.ok) {
          const data = await ttsRes.json();
          const audioUrl = `data:audio/mpeg;base64,${data.audioBase64}`;
          return NextResponse.json({
            script,
            audioUrl,
            generatedAt: new Date().toISOString(),
            isMock: false,
            engine: "gemini-tts",
            hasEvents: events.length > 0,
          });
        }
      } catch (ttsErr) {
        console.warn("VM TTS failed, falling back:", ttsErr);
      }
    }

    // ElevenLabs fallback
    const elKey = process.env.ELEVENLABS_API_KEY;
    if (elKey) {
      try {
        const voiceId = "21m00Tcm4TlvDq8ikWAM";
        const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: "POST",
          headers: {
            "xi-api-key": elKey,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
          },
          body: JSON.stringify({
            text: script,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        });
        if (elRes.ok) {
          const buffer = await elRes.arrayBuffer();
          const b64 = Buffer.from(buffer).toString("base64");
          return NextResponse.json({
            script,
            audioUrl: `data:audio/mpeg;base64,${b64}`,
            generatedAt: new Date().toISOString(),
            isMock: false,
            engine: "elevenlabs",
            hasEvents: events.length > 0,
          });
        }
      } catch {}
    }

    // Final fallback — real script, demo audio
    return NextResponse.json({
      script,
      audioUrl: MOCK_AUDIO_URL,
      generatedAt: new Date().toISOString(),
      isMock: true,
      engine: "mock",
      hasEvents: events.length > 0,
    });

  } catch (err) {
    console.error("Podcast generation error:", err);
    return NextResponse.json({ error: "Failed to generate podcast" }, { status: 500 });
  }
}
