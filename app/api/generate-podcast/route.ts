import { NextResponse } from "next/server";
import { fetchHomepageWeather } from "@/lib/weather";
import { fetchHomepageMarine } from "@/lib/marine";
import { generatePodcastScript } from "@/lib/podcast-generator";

// Mock audio for when ElevenLabs key isn't set
const MOCK_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export async function POST() {
  try {
    const [weather, marine] = await Promise.all([
      fetchHomepageWeather(),
      fetchHomepageMarine(),
    ]);

    const script = generatePodcastScript(weather, marine);

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (apiKey) {
      // ElevenLabs TTS — voice: Rachel (21m00Tcm4TlvDq8ikWAM) or Bella
      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_monolingual_v1",
          voice_settings: { stability: 0.5, similarity_boost: 0.75 },
        }),
      });

      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const b64 = Buffer.from(buffer).toString("base64");
        const audioUrl = `data:audio/mpeg;base64,${b64}`;
        return NextResponse.json({
          script,
          audioUrl,
          generatedAt: new Date().toISOString(),
          isMock: false,
        });
      }
    }

    // Fallback — mock audio with real script
    return NextResponse.json({
      script,
      audioUrl: MOCK_AUDIO_URL,
      generatedAt: new Date().toISOString(),
      isMock: true,
    });
  } catch (err) {
    console.error("Podcast generation error:", err);
    return NextResponse.json({ error: "Failed to generate podcast" }, { status: 500 });
  }
}
