# Feature: Weather & Conditions

## Overview

Real-time weather, wind, and water conditions for Posada Concepción with automatic hourly updates and a 7-day forecast. Data comes from Open-Meteo API (primary) with fallback to OpenWeatherMap for redundancy.

## Data Sources & APIs

### Open-Meteo (Primary)
- **What:** Current weather, hourly forecasts, wind, marine data
- **Endpoint:** `https://api.open-meteo.com/v1/forecast`
- **Cost:** Free, no API key required
- **Rate limits:** Generous (~10k req/day per IP)
- **Coordinates:** Posada Concepción at 26.6°N, 111.8°W

### OpenWeatherMap (Fallback)
- **What:** Current conditions, detailed forecast
- **API Key:** Set in `OPENWEATHERMAP_API_KEY`
- **Cost:** Free tier ~1,000 calls/day
- **Used if:** Open-Meteo unavailable or rate limited

## Implementation Details

### Fetch Functions

**`lib/weather.ts`**
- `fetchHomepageWeather()` - Current + 7-day forecast for homepage
- `fetchWindData()` - Hourly wind speeds and gusts (most important metric)
- `getWeatherSource()` - Returns "live" or "mock" indicating data origin

**`lib/marine.ts`**
- `fetchHomepageMarine()` - Sea temperature, tide, swell
- `getTideTable(date)` - Specific tide predictions

### Update Strategy

1. **Build-time:** Next.js fetches weather at build time (deploy)
2. **ISR:** Pages revalidate every 30 minutes (`revalidate = 1800`)
3. **Client refresh:** Users can manually refresh, frontend calls API
4. **Fallback:** Mock data displays if APIs timeout or fail

### Data Structure

```typescript
interface CurrentConditions {
  temp: number;
  feelsLike: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  windGust: number;
  windDirection: string; // "NW", "SE", etc.
  conditions: string; // "Partly cloudy", "Sunny"
  icon: string; // emoji or icon code
}

interface DayForecast {
  date: string;
  high: number;
  low: number;
  conditions: string;
  precipitation: number;
  windAvg: number;
  windGust: number;
}

interface MarineSnapshot {
  seaTemp: number;
  tides: TideEvent[];
  swell: { height: number; period: number; direction: string };
  confidence: "live" | "mock";
}
```

## UI Components

- **QuickStats** - Prominent current conditions card on homepage
- **ForecastCard** - 7-day mini forecast grid
- **MarineCard** - Sea temp, tide times, swell summary
- **WeatherMap** - Embedded Windy.com interactive radar/satellite map

## Decision References

- **D-006:** Open-Meteo as primary source; fallback strategy
- **D-003:** Data sources section

## Testing & Monitoring

- Mock data location: `/data/mock-weather.ts`
- Test with `MOCK_WEATHER=true` env var to bypass live APIs
- Monitor API response times in Vercel Analytics
- Set up Sentry alerts if source falls back to "mock" frequently

## Future Enhancements

1. **Local weather station:** Set up Davis Instruments station at Posada for truly hyperlocal data
2. **Marine API expansion:** Add swell forecasts from buoys
3. **Wave height:** Integrate European Wave Model for sea state detail
4. **Air quality:** Open-Meteo includes air quality index; add to UI
5. **Historical data:** Archive daily conditions for seasonal analysis
