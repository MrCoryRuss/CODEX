# Design System

## Guiding Principles

1. **Readable in bright sun.** People will look at this on a phone screen outdoors. High contrast, large touch targets, no subtle grays.
2. **Fast on slow connections.** Cell service in Posada is spotty. Minimize asset weight. No hero videos, no heavy frameworks.
3. **Obvious to non-technical users.** If someone's 70 and checks this site every morning, they should never feel lost.

## Color Palette

Inspired by the bay: desert sand, sea blue, and warm sunset tones.

| Token              | Hex       | Usage                            |
|--------------------|-----------|----------------------------------|
| `--color-sand`     | `#F5F0E8` | Page background                  |
| `--color-sea`      | `#1B6B93` | Primary actions, links, headers  |
| `--color-sea-light`| `#A2D2DF` | Card backgrounds, highlights     |
| `--color-sun`      | `#E8A028` | Accents, warnings, wind alerts   |
| `--color-desert`   | `#C4956A` | Secondary text, borders          |
| `--color-night`    | `#1A1A2E` | Body text                        |
| `--color-white`    | `#FFFFFF` | Card surfaces                    |
| `--color-danger`   | `#D32F2F` | Emergency, medical alerts        |

## Typography

| Role        | Font               | Size   | Weight |
|-------------|--------------------|--------|--------|
| Headings    | Inter              | 20-28px| 600    |
| Body        | Inter              | 16px   | 400    |
| Captions    | Inter              | 14px   | 400    |
| Data values | JetBrains Mono     | 18px   | 500    |

Inter loads fast and reads well at all sizes. JetBrains Mono for weather numbers and data so digits align cleanly.

Minimum body font: 16px. No exceptions. This audience skews older.

## Spacing

Base unit: 8px. Use multiples: 8, 16, 24, 32, 48.

Touch targets: minimum 44x44px (Apple's guideline, and it's a good one).

## Components

### Dashboard Card

Each section on the home page gets a card. Cards have:
- Icon (left or top)
- Title (e.g., "Wind" or "Today's Events")
- Summary data or text (1-3 lines)
- Tap target covers the whole card (links to detail page)

Cards use `--color-white` background with a subtle shadow. On the weather/wind cards, use the data values font for numbers.

### Alert Banner

For wind warnings, weather alerts, or community notices. Full-width bar at top of page.
- Yellow background (`--color-sun`) for advisories
- Red background (`--color-danger`) for emergencies
- Dismissible with an X, but re-shows on next visit if still active

### Audio Player

Custom minimal player for the daily briefing. Play/pause button, progress bar, duration. No playlist UI, just today's briefing with a link to the archive.

### Chat Interface

Simple message bubbles. User messages right-aligned, bot messages left-aligned. Text input at bottom. No avatar images, keep it clean. Include a few suggested starter questions as tappable chips.

### Event/Sports List Item

Date/time on the left, event name and location on the right. Tap to expand for details. Color-coded dot by category (sports = blue, social = sun, medical = red).

## Iconography

Use a single icon set (Lucide or Heroicons). Outline style, 24px default. Don't mix icon sets.

## Responsive Breakpoints

| Breakpoint | Width    | Layout              |
|------------|----------|---------------------|
| Mobile     | < 640px  | Single column       |
| Tablet     | 640-1024 | Two-column cards    |
| Desktop    | > 1024px | Three-column cards  |

Mobile is the primary target. Design mobile-first, then adapt up.

## Tone of Voice

Casual, friendly, local. Write like you're talking to a neighbor.
- "Wind's picking up this afternoon, 15-20 knots from the north."
- Not: "Meteorological data indicates elevated aeolian activity."

Use plain language. Skip jargon. If something's dangerous, say so directly.
