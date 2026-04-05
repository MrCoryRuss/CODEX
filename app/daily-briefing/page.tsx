import DailyBriefingClient from "@/components/audio/daily-briefing-client";
import type { AudioEpisode } from "@/types/audio-briefing";

interface KM112Today {
  high_f: number; high_c: number;
  low_f: number;  low_c: number;
  desc: string; wind: string; water_temp_c: number;
}
interface KM112Tides { low1?: string; high1?: string; low2?: string; high2?: string; }
interface KM112Fishing { major?: string[]; minor?: string[]; rating?: string; }
interface KM112ForecastDay {
  day: string;
  high_f: number; high_c: number;
  low_f: number;  low_c: number;
  desc: string; wind: string;
  rain: boolean; clouds: boolean;
}
interface KM112Payload {
  episode: AudioEpisode;
  weather: KM112Today;
  tides: KM112Tides;
  fishing: KM112Fishing;
  forecast: KM112ForecastDay[];
  generatedAt: string;
}

async function getKM112Data(): Promise<KM112Payload | null> {
  try {
    const res = await fetch(
      'https://vwpxquth.gensparkclaw.com/km112/report.json',
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    const t: KM112Today = data.today;
    const now = new Date(data.generated);

    const title = `KM112 Morning Broadcast — ${now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Mazatlan',
    })}`;

    const tideStr = [
      data.tides?.low1  && `Low tide at ${data.tides.low1}`,
      data.tides?.high1 && `High tide at ${data.tides.high1}`,
      data.tides?.low2  && `Low tide at ${data.tides.low2}`,
      data.tides?.high2 && `High tide at ${data.tides.high2}`,
    ].filter(Boolean).join(', then ');

    const episode: AudioEpisode = {
      id: now.toISOString().split('T')[0],
      date: now,
      title,
      durationSec: 0,
      audioUrl: 'https://vwpxquth.gensparkclaw.com/km112/broadcast.mp3',
      transcript: [
        `Today in Bahía Concepción: High ${t.high_f}°F / ${t.high_c}°C, Low ${t.low_f}°F / ${t.low_c}°C. ${t.desc}. Wind: ${t.wind}. Water: ${t.water_temp_c}°C.`,
        tideStr ? `Tides: ${tideStr}.` : '',
        data.fishing?.major?.length ? `Best fishing: ${data.fishing.major.join(' and ')}.` : '',
        data.fishing?.rating ? `${data.fishing.rating} fishing day.` : '',
      ].filter(Boolean).join('\n'),
      summary: `High ${t.high_f}°F / ${t.high_c}°C · Low ${t.low_f}°F / ${t.low_c}°C · ${t.desc} · ${t.wind}`,
      generatedAt: now,
      voice: 'KM112 Radio DJ',
    };

    return {
      episode,
      weather: t,
      tides: data.tides ?? {},
      fishing: data.fishing ?? {},
      forecast: data.forecast ?? [],
      generatedAt: data.generated,
    };
  } catch {
    return null;
  }
}

export default async function DailyBriefingPage() {
  const data = await getKM112Data();

  const genTime = data?.generatedAt
    ? new Date(data.generatedAt).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', timeZone: 'America/Mazatlan',
      })
    : null;

  return (
    <DailyBriefingClient
      episode={data?.episode ?? null}
      weather={data?.weather ?? null}
      tides={data?.tides ?? null}
      fishing={data?.fishing ?? null}
      forecast={data?.forecast ?? []}
      genTime={genTime}
    />
  );
}
