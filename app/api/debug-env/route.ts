import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasElKey: !!process.env.ELEVENLABS_API_KEY,
    hasVoiceId: !!process.env.ELEVENLABS_VOICE_ID,
    hasTtsSecret: !!process.env.POSADA_TTS_SECRET,
    elKeyPrefix: (process.env.ELEVENLABS_API_KEY || "").slice(0, 8) + "...",
    voiceId: process.env.ELEVENLABS_VOICE_ID || "(not set)",
    nodeEnv: process.env.NODE_ENV,
  });
}
