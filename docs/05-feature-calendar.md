# Feature: Community Calendar

## How it works

Two shared Google Calendars feed the sports and community events sections on the homepage and the `/events` and `/sports` pages. Anyone with edit access to the calendars can add, change, or cancel events from their phone or laptop. The site pulls events via the Google Calendar API every 15 minutes.

## Calendar setup (one-time)

### 1. Create two Google Calendars

Sign into Google Calendar with the account that will own these calendars. Create two new calendars:

- **Posada Sports** (pickleball, volleyball, yoga, walks, fishing, anything athletic)
- **Posada Community** (potlucks, movie nights, swap meets, clinics, cleanups, announcements)

### 2. Make them public

For each calendar: Settings > Access permissions > check "Make available to public." This allows the API to read events without OAuth or a service account. No one can edit the calendars through the public URL, only read.

### 3. Get the calendar IDs

For each calendar: Settings > Integrate calendar > "Calendar ID." It looks like `abc123@group.calendar.google.com`.

### 4. Get a Google API key

Go to the [Google Cloud Console](https://console.cloud.google.com/):

1. Create a project (or use an existing one).
2. Enable the **Google Calendar API** in APIs & Services > Library.
3. Create an API key in APIs & Services > Credentials.
4. Restrict the key:
   - Application restriction: HTTP referrers, add your Vercel domain.
   - API restriction: Google Calendar API only.

### 5. Set environment variables

In Vercel (or your `.env.local` for development):

```
GOOGLE_CALENDAR_API_KEY=AIza...your-key
GCAL_SPORTS_ID=abc123@group.calendar.google.com
GCAL_COMMUNITY_ID=def456@group.calendar.google.com
```

The site starts showing live calendar data as soon as all three vars are present. If any are missing, it falls back to mock data.

## How events get categorized

The site figures out what type of event it is based on the calendar it's in and keywords in the title.

**Sports calendar** events are auto-categorized by title:

| Title contains | Category | Card color | Icon |
|---|---|---|---|
| pickleball | pickleball | sea (blue) | 🏓 |
| volleyball | volleyball | sea | 🏐 |
| yoga | yoga | sun (gold) | 🧘 |
| walk, hiking, hike | walking | sun | 🚶 |
| fish | fishing | sea | 🎣 |
| swim | swimming | sea | 🏊 |
| (anything else) | other-sport | sea | ⚽ |

**Community calendar** events are auto-categorized by title:

| Title contains | Category | Card color |
|---|---|---|
| clinic, nurse, doctor, medical, health | medical | red |
| cleanup, trash | service | blue |
| water truck, delivery, propane, road work | service | blue |
| swap, market, garage sale | market | tan |
| (anything else) | social | gold |

This means event creators don't need to tag or code anything. Just name the event normally ("Pickleball 8-10am", "Beach cleanup Saturday") and the site figures it out.

## How to add events

Open Google Calendar on your phone or computer. Add an event to the right calendar (Sports or Community). Fill in:

- **Title**: Name the event. Include the activity name so categorization works (e.g., "Pickleball" not just "Morning game").
- **Time**: Start and end time. Use the Posada time zone (MST, UTC-7).
- **Location**: Where it's happening ("Courts by the ramp", "George's palapa", etc.).
- **Description** (optional): A sentence or two. This shows up in the detail view.

Recurring events work. If pickleball happens every morning, set it as a daily recurring event in Google Calendar. The API expands recurring events into individual instances automatically.

To cancel a specific occurrence, delete that instance in Google Calendar. Deleted events disappear from the site on the next refresh (up to 15 minutes).

## Sharing calendar edit access

Give edit access to trusted community members so multiple people can manage events:

Calendar Settings > Share with specific people > add their email > set permission to "Make changes to events."

Keep the group small. 2-3 people is enough for a community this size.

## Fallback behavior

If the Google Calendar API is unreachable (quota exceeded, network issue, API key expired), the site shows mock data instead of an empty page. The mock data is a representative week of Posada events so the site doesn't look broken.

The `source` field in the API response tells the UI whether data came from Google Calendar or the mock fallback.

## Architecture

```
Google Calendar (Sports)  ─┐
                            ├──> lib/google-calendar.ts  ──> lib/calendar.ts ──> UI
Google Calendar (Community)─┘         (raw API)              (adapter)
         │
         └── data/mock-events.ts (fallback if API fails)
```

All category detection, icon mapping, and data transformation happen in `lib/google-calendar.ts` and `lib/calendar.ts`. The UI components never see Google Calendar data shapes.
