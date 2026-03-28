# Deployment

## Hosting

The site runs on Vercel. The free tier handles the traffic level for this community (200-500 users at peak season). ISR (Incremental Static Regeneration) keeps pages fresh without a running server.

## Environment variables

Set these in Vercel's project settings under Settings > Environment Variables. For local development, copy them to `.env.local` (never commit this file).

### Required for live calendar data

| Variable | Example | Description |
|---|---|---|
| `GOOGLE_CALENDAR_API_KEY` | `AIzaSyB...` | Google Cloud API key with Calendar API enabled |
| `GCAL_SPORTS_ID` | `abc@group.calendar.google.com` | Calendar ID for the sports schedule |
| `GCAL_COMMUNITY_ID` | `def@group.calendar.google.com` | Calendar ID for community events |

If any of these are missing, the events sections fall back to mock data. The site still works, it just shows placeholder events instead of live ones.

### Not yet needed (future features)

| Variable | Feature | Status |
|---|---|---|
| `ANTHROPIC_API_KEY` | Guide chatbot | Not yet built |
| `ELEVENLABS_API_KEY` or `OPENAI_API_KEY` | Daily audio TTS | Not yet built |
| `WORLDTIDES_API_KEY` | Live tide data | Not yet built |

## ISR revalidation schedule

Pages regenerate on a schedule without manual deploys:

| Route | Revalidate | Why |
|---|---|---|
| `/` (homepage) | 30 minutes | Weather data changes, events change throughout the day |
| `/weather` | 30 minutes | (future) Weather detail page |
| `/events` | 15 minutes | (future) Calendar might update more frequently |
| `/sports` | 30 minutes | (future) Sports schedule changes less often |

The Google Calendar API fetch itself caches for 15 minutes via Next.js `fetch` options. This means a single ISR regeneration cycle hits Google's API at most once for sports and once for community, regardless of how many pages trigger it.

## API rate limits and costs

| Service | Free tier limit | Our usage | Headroom |
|---|---|---|---|
| Open-Meteo (weather) | 10,000/day | ~50/day | Very comfortable |
| Open-Meteo Marine | 10,000/day | ~10/day | Very comfortable |
| Google Calendar API | 1,000,000/day | ~200/day | No concern at all |
| Windy.com embed | Unlimited | N/A (iframe) | N/A |

Google Calendar's free tier is effectively unlimited for this use case. We make about 200 API calls per day (one per ISR regeneration, two calendars each, every 30 minutes, 24 hours). The quota is 1 million.

## Build and deploy

### First deploy

```bash
# Install dependencies
npm install

# Test locally (uses mock data without env vars)
npm run dev

# Build (validates TypeScript, generates static pages)
npm run build

# Connect to Vercel
npx vercel link

# Set env vars
npx vercel env add GOOGLE_CALENDAR_API_KEY
npx vercel env add GCAL_SPORTS_ID
npx vercel env add GCAL_COMMUNITY_ID

# Deploy
npx vercel --prod
```

### Subsequent deploys

Push to the linked Git repo. Vercel auto-deploys on push to main.

### Preview deploys

Vercel creates a preview URL for every branch and PR. Preview deploys use the same env vars as production (configured per-environment in Vercel settings if you want them different).

## Domain

Configure a custom domain in Vercel's project settings. Point DNS (CNAME or A record) to Vercel. HTTPS is automatic.

## Monitoring

Vercel provides basic analytics and function logs. For the calendar integration specifically, check the function logs for:

- `[calendar] Fetched N events from Google Calendar` — healthy, live data
- `[calendar] Google Calendar fetch failed, using mock:` — fallback triggered, check the API key and calendar sharing settings

## Local development

```bash
# Copy env template
cp .env.example .env.local

# Fill in your API key and calendar IDs
# Then:
npm run dev
```

Without env vars, the site runs entirely on mock data. Every feature works, the data is just static.
