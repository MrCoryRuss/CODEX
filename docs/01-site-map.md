# Site Map

## Page Structure

```
/                         Home (dashboard view)
├── /weather              Weather detail page
│   ├── Current conditions
│   ├── 7-day forecast
│   ├── Radar/satellite embed
│   └── UV index
├── /wind                 Wind detail page
│   ├── Current speed + direction
│   ├── Gust history (today)
│   └── Wind forecast (48hr)
├── /water                Water conditions
│   ├── Sea temperature
│   ├── Tide table
│   └── Swell/wave info (if source available)
├── /events               Community events
│   ├── Calendar view
│   └── Individual event detail
├── /sports               Sports schedules
│   ├── Weekly grid view
│   └── Per-sport detail (location, time, contact)
├── /medical              Medical guide
│   ├── Emergency contacts
│   ├── Nearest clinics + hospitals
│   ├── Common medical situations
│   └── Pharmacy info
├── /guide                Guide chatbot
│   └── Chat interface with local knowledge base
└── /briefing             Daily audio briefing
    ├── Today's briefing (audio player)
    └── Archive of past briefings
```

## Home Page Layout

The home page is a dashboard. It shows summary cards for each section so people can get the gist without clicking through. Cards link to detail pages.

**Card order (top to bottom):**

1. Daily audio briefing player (prominent, top of page)
2. Weather summary (temp, conditions, wind speed)
3. Wind card (speed, direction, trend arrow)
4. Water conditions card (sea temp, tide status)
5. Today's events (next 2-3 upcoming)
6. Sports schedule (today/tomorrow)
7. Medical quick-dial (tap-to-call emergency numbers)
8. Guide chatbot entry point

## Navigation

Bottom tab bar on mobile. Horizontal nav on desktop. Tabs: Home, Weather, Events, Medical, Guide.

Wind, Water, Sports, and Briefing are reachable from the home dashboard cards and from a "More" menu if needed. Keep the primary nav to five items max.

## Notes

- Every page should work without JavaScript for basic content. The chatbot and audio player obviously need JS.
- No login, no user state. Everything is public.
- Deep links should work so people can share specific pages in WhatsApp.
