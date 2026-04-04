import { NextResponse } from "next/server";
import { fetchHomepageWeather } from "@/lib/weather";
import { fetchHomepageMarine } from "@/lib/marine";
import { generatePodcastScript } from "@/lib/podcast-generator";
import { fetchGoogleCalendarEvents } from "@/lib/google-calendar";
import type { CalendarEvent } from "@/types/calendar";

// ElevenLabs — primary voice engine
// Voice: AQ6yxtsTonfHLHY2zUcO (deep baritone, Sam Elliott-style)
const EL_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "AQ6yxtsTonfHLHY2zUcO";

// VM Gemini TTS — fallback
const TTS_ENDPOINT = process.env.POSADA_TTS_ENDPOINT || "https://vwpxquth.gensparkclaw.com/tts/generate";
const TTS_SECRET   = process.env.POSADA_TTS_SECRET   || "";

// Last resort mock
const MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

function dateStr(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function POST() {
  try {
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

    // 1️⃣ ElevenLabs — primary (deep baritone voice)
    const elKey = process.env.ELEVENLABS_API_KEY;
    if (elKey) {
      try {
        const elRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE_ID}`, {
          method: "POST",
          headers: {
            "xi-api-key": elKey,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
          },
          body: JSON.stringify({
            text: script,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.45,
              similarity_boost: 0.80,
              style: 0.25,
              use_speaker_boost: true,
            },
          }),
          signal: AbortSignal.timeout(60000),
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
      } catch (err) {
        console.warn("ElevenLabs TTS failed, falling back to Gemini:", err);
      }
    }

    // 2️⃣ Gemini TTS via VM — fallback
    if (TTS_SECRET) {
      try {
        const ttsRes = await fetch(TTS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Secret": TTS_SECRET,
          },
          body: JSON.stringify({ script }),
          signal: AbortSignal.timeout(90000),
        });
        if (ttsRes.ok) {
          const data = await ttsRes.json();
          return NextResponse.json({
            script,
            audioUrl: `data:audio/mpeg;base64,${data.audioBase64}`,
            generatedAt: new Date().toISOString(),
            isMock: false,
            engine: "gemini-tts",
            hasEvents: events.length > 0,
          });
        }
      } catch (err) {
        console.warn("Gemini TTS failed, using mock:", err);
      }
    }

    // 3️⃣ Mock audio — last resort (real script, demo audio)
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
