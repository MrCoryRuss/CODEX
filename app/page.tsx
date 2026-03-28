import {
  QuickStats,
  WeatherMap,
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

export const revalidate = 1800; // ISR: regenerate every 30 minutes

export default async function Home() {
  const [weather, marine] = await Promise.all([
    fetchHomepageWeather(),
    fetchHomepageMarine(),
  ]);

  return (
    <div className="page-container">
      <h1 className="sr-only">Posada Underground &ndash; Daily Dashboard</h1>

      {/* Live current conditions */}
      <QuickStats conditions={weather.current} isLive={weather.isLive} />

      {/* Card grid */}
      <div className="dashboard-grid">

        {/* Row 1: audio briefing, always full width */}
        <div className="grid-span-full">
          <AudioBriefingCard briefing={MOCK_AUDIO} />
        </div>

        {/* Row 2: live weather map (wide) + announcements */}
        <div className="grid-span-wide">
          <WeatherMap />
        </div>
        <div className="grid-span-narrow">
          <AnnouncementsCard items={MOCK_ANNOUNCEMENTS} />
        </div>

        {/* Row 3: live forecast + live marine, side by side on tablet+ */}
        <ForecastCard
          days={weather.forecast.days}
          fetchedAt={weather.forecast.fetchedAt}
          isLive={weather.isLive}
        />
        <MarineCard
          snapshot={marine.snapshot}
          isLive={marine.isLive}
        />

        {/* Row 4: sports + events (mock), side by side on tablet+ */}
        <SportsCard items={MOCK_SPORTS} />
        <EventsCard items={MOCK_EVENTS} />
      </div>
    </div>
  );
}
