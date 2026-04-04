import {
  WindyAppMap,
  WindyForecast,
  AnnouncementsCard,
  SportsCard,
} from "@/components/home";

import { MOCK_SPORTS, MOCK_ANNOUNCEMENTS, MOCK_EVENTS } from "@/components/home/mock-data";
import { fetchHomepageWeather } from "@/lib/weather";
import { fetchHomepageMarine } from "@/lib/marine";
import WeatherHero from "@/components/home/weather-hero";
import CompactMarine from "@/components/home/compact-marine";
import EventsCard from "@/components/home/community-events";
import DailyBriefingCard from "@/components/home/daily-briefing";
import QuickLinks from "@/components/home/quick-links";

export const revalidate = 1800;

export default async function Home() {
  const [weather, marine] = await Promise.all([
    fetchHomepageWeather(),
    fetchHomepageMarine(),
  ]);

  return (
    <div className="page-container">
      <h1 className="sr-only">Posada Underground — Daily Dashboard</h1>

      {/* 1. Daily briefing — top of page */}
      <div className="home-widget">
        <DailyBriefingCard />
      </div>

      {/* 2. Quick action links */}
      <QuickLinks />

      {/* 3. Weather hero */}
      <WeatherHero conditions={weather.current} isLive={weather.isLive} />

      {/* 3. Marine + announcements */}
      <div className="home-two-col">
        <CompactMarine snapshot={marine.snapshot} isLive={marine.isLive} />
        <AnnouncementsCard items={MOCK_ANNOUNCEMENTS} />
      </div>

      {/* 4. Windy forecast */}
      <div className="home-widget">
        <WindyForecast />
      </div>

      {/* 5. Windy map */}
      <div className="home-widget">
        <WindyAppMap />
      </div>

      {/* 6. Events + Sports */}
      <div className="home-two-col">
        <EventsCard items={MOCK_EVENTS} />
        <SportsCard items={MOCK_SPORTS} />
      </div>
    </div>
  );
}
