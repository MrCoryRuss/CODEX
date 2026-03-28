# Data Sources

This doc tracks where each type of data comes from, how we access it, and how often we update it.

## Weather

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Current temp   | OpenWeatherMap or WeatherAPI  | REST API (free tier) | Every 30 min  |
| Humidity       | Same as above                 | Same              | Every 30 min     |
| UV Index       | Same as above                 | Same              | Every 30 min     |
| 7-day forecast | Same as above                 | Same              | Every 2 hours    |
| Radar/satellite| Windy.com embed or NOAA imagery | iframe or static image | Real-time (iframe) |

**Notes:** Posada Concepcion coordinates are approximately 26.6°N, 111.8°W. The nearest official weather station is in Loreto or Mulege. We may need to use interpolated data. OpenWeatherMap free tier gives 1,000 calls/day, which is plenty.

**TBD:** Evaluate whether a local weather station (personal Davis or similar) is worth setting up for truly local readings. The API data comes from stations 30-50 km away.

## Wind

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Speed/direction| OpenWeatherMap or Windy API   | REST API          | Every 15-30 min  |
| Gusts          | Same                          | Same              | Same             |
| 48hr forecast  | Windy API or Open-Meteo       | REST API          | Every 2 hours    |

**Notes:** Wind is the single most-checked data point for this community. Kayakers, sailors, and anyone on the water care about this daily. If we can only get one thing right, it's wind. Open-Meteo is free and has solid wind forecast data for marine areas.

## Water Conditions

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Sea temperature| NOAA SST data or Open-Meteo marine | REST API    | Daily            |
| Tides          | NOAA Tides & Currents or WorldTides | REST API   | Daily (static table) |
| Swell/wave     | Open-Meteo Marine API         | REST API          | Every 6 hours    |

**Notes:** The nearest NOAA tide station may be Loreto. Tide data for the Sea of Cortez is available but the station coverage is sparse. WorldTides API has a free tier with limited calls. Swell data is less critical here since the bay is protected, but it matters for people heading out to open water.

## Community Events

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Events         | Manual entry or Google Calendar | Google Calendar API or JSON file | As updated |

**Notes:** This is the human-powered part. Someone (or a small group) needs to add events. Options: a shared Google Calendar that we pull from, or a simple JSON/markdown file that gets edited and triggers a rebuild. Google Calendar is probably the lowest-friction option for non-technical contributors.

## Sports Schedules

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Schedules      | Manual entry                  | JSON or Google Calendar | Weekly      |

**Notes:** Sports in Posada are informal. Pickleball at the courts, volleyball on the beach, yoga at someone's palapa. Schedules change season to season. This data is small and doesn't change often. A simple structured file is fine.

## Medical Guide

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Emergency contacts | Manual curation            | Static content    | Reviewed monthly |
| Clinic/hospital info | Manual curation           | Static content    | Reviewed monthly |
| Common situations | Written content              | Static markdown   | Reviewed quarterly |

**Notes:** This is static reference content, not a live feed. Accuracy matters a lot here. Include: Loreto IMSS hospital, Mulege clinic, Red Cross contacts, how to reach emergency services (911 works in Mexico), nearest hyperbaric chamber (La Paz), and basic first aid for scorpion stings, jellyfish, heat exhaustion.

## Guide Chatbot

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Knowledge base | Curated local info            | Vector store or prompt context | As updated |
| LLM            | Claude API or similar         | REST API          | Real-time        |

**Notes:** The chatbot answers questions like "Where can I fill my propane tank?" or "Is there a laundromat?" The knowledge base is a set of curated Q&A pairs and local info documents. Could use RAG with a vector store, or keep it simple with a well-structured system prompt if the knowledge base stays small.

## Daily Audio Briefing

| Field          | Source                        | Access Method     | Update Frequency |
|----------------|-------------------------------|-------------------|------------------|
| Script         | Generated from weather + events data | Internal build step | Daily, early morning |
| Audio          | Text-to-speech API (ElevenLabs, OpenAI TTS, or similar) | REST API | Daily |

**Notes:** The briefing pulls together today's weather, wind, water conditions, and upcoming events into a 60-90 second spoken summary. Generate the script from data, then run it through TTS. Store the MP3 and serve it statically. Target generation time: 5-6 AM local (MST, UTC-7).

## API Cost Estimates

Most of these APIs have free tiers that will work fine for a low-traffic community site. The main costs to watch:
- LLM API for chatbot (usage-based, depends on traffic)
- TTS for daily briefing (small, one generation per day)
- Everything else is free or near-free at this scale
