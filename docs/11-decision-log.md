# Decision Log

Decisions that shape the project. Each entry records what we decided, why, and what we traded off. Numbered sequentially.

---

## D-001: Static-first architecture

**Date:** 2026-03-26
**Decision:** Build as a static site with scheduled data fetches, not a traditional server-rendered app.
**Why:** Hosting costs stay near zero. A static site on Cloudflare Pages, Netlify, or Vercel is free at this traffic level. No server to maintain, no database to back up. Data gets fetched at build time or via lightweight client-side API calls.
**Trade-off:** Real-time updates are harder. The chatbot needs a serverless function or external API call. Acceptable for v1 since most data (weather, tides, events) doesn't change minute-to-minute.

---

## D-002: Mobile-first, no native app

**Date:** 2026-03-26
**Decision:** Web only. No iOS or Android app.
**Why:** The audience is small (maybe 200-500 regular users at peak season). A native app means app store approval, two codebases or a cross-platform framework, and update friction. A responsive website works on every device and can be added to the home screen as a PWA if people want an app-like experience.
**Trade-off:** No push notifications (unless we add PWA service worker support later). No offline access without extra work. Fine for now.

---

## D-003: English-only for v1

**Date:** 2026-03-26
**Decision:** Launch in English. Add Spanish in a future version.
**Why:** The primary audience for v1 is the expat community, which communicates mostly in English. The local Mexican community also has strong English skills in Posada, but a Spanish version would be the right thing to do eventually. Deferring it avoids doubling the content effort on day one.
**Trade-off:** Excludes some Spanish-speaking residents and visitors from getting full value immediately. Flag this for v2 planning.

---

## D-004: Google Calendar for community events input

**Date:** 2026-03-26
**Decision:** Use a shared Google Calendar as the data entry point for community events and sports schedules.
**Why:** The people adding events are not developers. Google Calendar is familiar, free, and accessible from any device. We pull from the Calendar API at build time or on a schedule. No CMS to build or maintain.
**Trade-off:** Depends on Google's API staying free and available. Slightly less control over data structure. If we need richer event metadata later, we might outgrow this approach.

---

## D-005: Claude API for the guide chatbot

**Date:** 2026-03-26
**Decision:** Use the Claude API (Anthropic) for the guide chatbot, with a curated local knowledge base in the system prompt or via RAG.
**Why:** Claude handles conversational Q&A well and can work with a structured knowledge base. The API is straightforward to integrate. Starting with a fat system prompt keeps things simple. If the knowledge base grows past what fits in context, switch to RAG with a vector store.
**Trade-off:** Usage-based cost. If the chatbot gets heavy traffic, costs go up. Mitigate by caching common questions, rate limiting, and keeping responses concise.

---

## D-006: Open-Meteo as primary weather/wind data source

**Date:** 2026-03-26
**Decision:** Use Open-Meteo as the primary API for weather, wind, and marine data. Use OpenWeatherMap as a fallback.
**Why:** Open-Meteo is fully free with no API key required, has good global coverage including marine data, and the rate limits are generous. OpenWeatherMap's free tier works but has tighter call limits. Having both gives us redundancy.
**Trade-off:** Open-Meteo data resolution may be coarser than a paid service. Acceptable for a community site. If we add a local weather station later, that becomes the primary source and APIs become supplemental.

---

## D-007: ElevenLabs or OpenAI TTS for daily audio briefing

**Date:** 2026-03-26
**Decision:** Generate the daily audio briefing using a cloud TTS API. Evaluate ElevenLabs and OpenAI TTS, pick whichever sounds more natural at a reasonable cost.
**Why:** The briefing is one audio file per day, roughly 60-90 seconds. At that volume the cost is minimal for either service. The script is auto-generated from the day's data, then passed to TTS. Store the resulting MP3 as a static file.
**Trade-off:** Depends on a third-party API. If the API is down at generation time, that day's briefing is late or missing. Could add a retry mechanism or fallback to a second TTS provider.

---

## D-008: Public Google Calendar + API key (no OAuth)

**Date:** 2026-03-28
**Decision:** Access Google Calendar data using the public events endpoint with a simple API key. No OAuth flow, no service account, no Google client library.
**Why:** The calendars are community-facing and don't contain private information. Making them public and reading via API key is the simplest approach that works on Vercel. No token refresh logic, no secrets rotation, no server-side session management. One env var for the key, two for the calendar IDs.
**Alternatives considered:**
- Service account with JSON key file: works but requires storing a multi-line JSON credential as an env var, which is fragile. Overkill for public calendars.
- OAuth with refresh token: requires a persistent token store and refresh logic. Way too much machinery for read-only access to public calendars.
- Google Apps Script webhook: push-based, but adds a middleman service to maintain.
**Trade-off:** Calendars must be set to "Make available to public" in Google Calendar settings. This means anyone with the calendar ID could read events. That's fine for community events that are meant to be public. API key should be restricted to the Calendar API and the production domain.

---

*Add new decisions below. Keep the numbering sequential.*
