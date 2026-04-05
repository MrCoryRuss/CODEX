/**
 * app/api/km112/route.ts
 * Fetches the KM112 daily broadcast report and returns it as a combined
 * AudioEpisode + weather/tides/fishing payload.
 * Revalidates every hour (ISR) — audio is generated once at 1 AM daily.
 */

import { NextResponse } from 'next/server';

const KM112_REPORT_URL = 'https://vwpxquth.gensparkclaw.com/km112/report.json';
const KM112_AUDIO_URL  = 'https://vwpxquth.gensparkclaw.com/km112/broadcast.mp3';

function formatTitle(generated: string): string {
  const date = new Date(generated);
  return `KM112 Morning Broadcast — ${date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Mazatlan',
  })}`;
}

function buildTranscript(data: KM112Report): string {
  const t = data.today;
  const tides = data.tides;
  const fishing = data.fishing;

  const tideStr = [
    tides.low1  && `Low tide at ${tides.low1}`,
    tides.high1 && `High tide at ${tides.high1}`,
    tides.low2  && `Low tide at ${tides.low2}`,
    tides.high2 && `High tide at ${tides.high2}`,
  ].filter(Boolean).join(', then ');

  const fishMajor = fishing.major?.join(' and ') ?? '';
  const fishMinor = fishing.minor?.join(' and ') ?? '';

  return [
    `Today in Bahía Concepción: High ${t.high_f}°F / ${t.high_c}°C, Low ${t.low_f}°F / ${t.low_c}°C. ${t.desc}. Wind: ${t.wind}. Water temperature: ${t.water_temp_c}°C.`,
    tideStr ? `Tides: ${tideStr}.` : '',
    fishMajor ? `Best fishing windows: ${fishMajor}.` : '',
    fishMinor ? `Minor fishing windows: ${fishMinor}.` : '',
    fishing.rating ? `Overall: ${fishing.rating} fishing day.` : '',
  ].filter(Boolean).join('\n');
}

interface KM112Today {
  high_f: number;
  high_c: number;
  low_f: number;
  low_c: number;
  desc: string;
  wind: string;
  water_temp_c: number;
}

interface KM112Tides {
  low1?: string;
  high1?: string;
  low2?: string;
  high2?: string;
}

interface KM112Fishing {
  major?: string[];
  minor?: string[];
  rating?: string;
}

interface KM112ForecastDay {
  day: string;
  high_f: number;
  high_c: number;
  low_f: number;
  low_c: number;
  desc: string;
  wind: string;
  rain: boolean;
  clouds: boolean;
}

interface KM112Report {
  generated: string;
  today: KM112Today;
  tides: KM112Tides;
  fishing: KM112Fishing;
  forecast: KM112ForecastDay[];
}

export async function GET() {
  try {
    const res = await fetch(KM112_REPORT_URL, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'KM112 report unavailable', status: res.status },
        { status: 502 }
      );
    }

    const data: KM112Report = await res.json();
    const t = data.today;

    const episode = {
      id: new Date(data.generated).toISOString().split('T')[0],
      date: new Date(data.generated).toISOString(),
      title: formatTitle(data.generated),
      durationSec: 0,
      audioUrl: KM112_AUDIO_URL,
      transcript: buildTranscript(data),
      summary: `High ${t.high_f}°F / ${t.high_c}°C · Low ${t.low_f}°F / ${t.low_c}°C · ${t.desc} · ${t.wind}`,
      generatedAt: data.generated,
      voice: 'KM112 Radio DJ',
    };

    return NextResponse.json(
      {
        episode,
        weather: data.today,
        tides: data.tides,
        fishing: data.fishing,
        forecast: data.forecast,
        generatedAt: data.generated,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
      }
    );
  } catch (err) {
    console.error('[km112/route] fetch error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch KM112 report' },
      { status: 500 }
    );
  }
}
