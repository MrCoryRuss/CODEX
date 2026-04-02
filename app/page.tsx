import {
  QuickStats,
  WindyAppMap,
  WindyForecast,
  ForecastCard,
  MarineCard,
  SportsCard,
  EventsCard,
  AnnouncementsCard,
  AudioBriefingCard,
} from "@/components/home";

import {
  MOCK_SPORTS,
  MOCK_EVENTS,
  MOCK_ANNOUNCEMENTS,
  MOCK_AUDIO,
} from "@/components/home/mock-data";

import { fetchHomepageWeather } from "@/lib/weather";
import { fetchHomepageMarine } from "@/lib/marine";

export const revalidate = 1800;

export default async function Home() {
  const [weather, marine] = await Promise.all([
    fetchHomepageWeather(),
    fetchHomepageMarine(),
  ]);

  return (
    <div className="page-container">
      <h1 className="sr-only">Posada Underground &ndash; Daily Dashboard</h1>
      <QuickStats conditions={weather.current} isLive={weather.isLive} />
      <div className="dashboard-grid">
        <ForecastCard days={weather.forecast.days} fetchedAt={weather.forecast.fetchedAt} isLive={weather.isLive} />
        <MarineCard snapshot={marine.snapshot} isLive={marine.isLive} />
        <div className="grid-span-full"><WindyForecast /></div>
        <div className="grid-span-full"><WindyAppMap /></div>
        <AnnouncementsCard items={MOCK_ANNOUNCEMENTS} />
        <AudioBriefingCard briefing={MOCK_AUDIO} />
        <SportsCard items={MOCK_SPORTS} />
        <EventsCard items={MOCK_EVENTS} />
      </div>
    </div>
  );
}