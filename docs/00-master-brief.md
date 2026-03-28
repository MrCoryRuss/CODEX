# Posada Underground - Master Brief

## What is this?

A daily community website for Posada Concepcion, the small coastal village on the Sea of Cortez in Baja California Sur. The site gives residents and visitors a single place to check weather, wind, water conditions, community events, sports schedules, and local medical info. It also has a chatbot for common visitor questions and a daily audio briefing you can listen to over coffee.

Think of it as the digital version of the bulletin board at the palapa, except it updates itself.

## Who's it for?

- Full-time residents (mix of expat retirees and local Mexican families)
- Snowbirds who show up November through April
- Visitors passing through on Highway 1 or by boat
- Anyone anchored in the bay wondering if the wind is going to pick up

Most users will be on phones. Many are older and not especially tech-savvy. The site needs to be dead simple.

## Goals

1. Replace the scattered WhatsApp/Facebook group routine for daily info
2. Give people weather and wind data without making them parse raw NOAA feeds
3. Put community events, sports schedules, and emergency medical info in one spot
4. Offer a daily audio briefing for people who'd rather listen than read
5. Provide a chatbot that can answer the "where do I find..." questions that every new arrival asks

## What's in scope

- Weather dashboard (temp, humidity, UV, forecast)
- Wind conditions and forecast (this matters a lot here, the bay gets north wind)
- Radar/satellite imagery
- Water conditions (sea temp, tide, swell if available)
- Community events calendar
- Sports schedules (pickleball, volleyball, yoga, whatever's running)
- Medical guide (nearest clinic, hospital in Loreto, emergency contacts, common issues)
- Guide chatbot (local knowledge Q&A)
- Daily audio briefing (generated summary of conditions + events)

## What's out of scope (for now)

- Real estate listings
- Restaurant reviews
- Classified ads
- User accounts or login
- Native mobile app
- Spanish-language version (want it eventually, not v1)

## Tech direction

Static-first site. Pull data from APIs and update on a schedule. Keep hosting costs near zero. More detail in the decision log.

## Timeline

No hard deadline. Build it module by module, ship early, improve based on what people actually use.
