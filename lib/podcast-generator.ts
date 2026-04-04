import type { HomepageWeather } from "./weather";
import type { HomepageMarine } from "./marine";
import type { CalendarEvent } from "@/types/calendar";

const DAYS   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Unit converters ───────────────────────────────────────────────────────────
function toF(c: number)   { return Math.round(c * 9/5 + 32); }
function toMph(kts: number) { return Math.round(kts * 1.151); }
function toFt(m: number)  { return (m * 3.281).toFixed(1); }
// Convert "HH:MM" 24h to "h:MM AM/PM"
function formatTime12(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${mStr} ${ampm}`;
}

// ── Descriptions ─────────────────────────────────────────────────────────────
function seaCondition(waveM: number, gustKts: number): { label: string; glass: boolean; fishing: string } {
  const gustMph = toMph(gustKts);
  const waveFt  = parseFloat(toFt(waveM));
  const glass   = waveFt < 0.5 && gustMph < 8;
  const calm    = waveFt < 1.0 && gustMph < 12;
  const moderate = waveFt < 2.5;

  let label: string;
  if (glass)        label = "glassy calm — absolutely flat out there";
  else if (calm)    label = "calm with light chop";
  else if (moderate) label = "moderate conditions";
  else              label = "rough — use caution on the water";

  let fishing: string;
  if (glass) {
    fishing = "Fishing conditions are exceptional today. Glass water means you can see structure, spot fish, and work lures with precision. If you've been waiting for the right day — this is it. Get out early before the afternoon breeze picks up.";
  } else if (calm) {
    fishing = "Fishing conditions are good today. Light winds and calm water make for comfortable trolling and surface fishing. Dorado, roosterfish, and sierra should all be active near structure and the channel edges.";
  } else if (moderate) {
    fishing = "Fishing is workable today with moderate conditions. Stick to the protected areas of the bay, work the shallow flats on the calm side, and keep an eye on the afternoon gusts.";
  } else {
    fishing = "Conditions are challenging today for fishing. If you do go out, stay inside the bay, keep it short, and prioritize safety. The fish will still be there when the wind lays down.";
  }

  return { label, glass, fishing };
}

function windDescription(mph: number): string {
  if (mph < 5)  return "virtually no wind";
  if (mph < 10) return "light breeze";
  if (mph < 15) return "gentle breeze";
  if (mph < 20) return "moderate breeze";
  if (mph < 25) return "fresh winds";
  if (mph < 35) return "strong winds";
  return "very strong winds — use caution";
}

function forecastDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return DAYS[d.getDay()];
}

// ── Event formatter (Google Calendar events, injected when available) ─────────
function formatEvents(events: CalendarEvent[]): string {
  if (!events || events.length === 0) return "";

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + 4); // today + 3 days

  const relevant = events.filter(e => {
    const d = new Date(e.date + "T12:00:00");
    return d >= today && d <= cutoff;
  });

  if (relevant.length === 0) return "";

  const grouped: Record<string, CalendarEvent[]> = {};
  for (const ev of relevant) {
    const label = forecastDayLabel(ev.date);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(ev);
  }

  const lines: string[] = ["And now let's check the community calendar."];
  for (const [dayLabel, evs] of Object.entries(grouped)) {
    lines.push(`${dayLabel}:`);
    for (const ev of evs) {
      const time = ev.startTime ? ` at ${formatTime12(ev.startTime)}` : "";
      const loc  = ev.location ? ` at ${ev.location}` : "";
      lines.push(`  ${ev.title}${time}${loc}.`);
    }
  }
  lines.push("Check the Posada Underground events page for full details.");
  return lines.join(" ");
}

// ── Main script generator ─────────────────────────────────────────────────────
export function generatePodcastScript(
  weather: HomepageWeather,
  marine: HomepageMarine,
  events?: CalendarEvent[]
): string {
  const now   = new Date();
  const day   = DAYS[now.getDay()];
  const month = MONTHS[now.getMonth()];
  const date  = now.getDate();

  const c = weather.current;
  const windMph  = toMph(c.windSpeedKts);
  const gustMph  = toMph(c.windGustsKts);
  const windWord = windDescription(windMph);

  // Today's forecast
  const today    = weather.forecast?.days?.[0];
  const highF    = today ? toF(today.highC) : null;
  const lowF     = today ? toF(today.lowC)  : null;
  const highC    = today ? Math.round(today.highC) : null;
  const lowC     = today ? Math.round(today.lowC)  : null;

  // 3-day forecast (days 1-3)
  const nextDays = weather.forecast?.days?.slice(1, 4) ?? [];

  // Marine
  const snap  = marine.snapshot;
  const mc    = snap.conditions;
  const tides = snap.tides?.events ?? [];
  const moon  = snap.moon;

  // Sea condition assessment
  const seaInfo = seaCondition(mc.waveHeightM, c.windGustsKts);

  // Tides — find all high and low events today
  const highTides = tides.filter(t => t.type === "high");
  const lowTides  = tides.filter(t => t.type === "low");

  function tideStr(events: typeof tides) {
    return events.map(t => `${t.time} (${toFt(t.heightM)} feet)`).join(" and ");
  }

  // Gust advisory
  const gustNote = gustMph > windMph + 8
    ? ` with gusts up to ${gustMph} miles per hour`
    : "";
  const gustAdvisory = gustMph >= 20
    ? ` Keep an eye on those afternoon gusts — ${gustMph} miles per hour is enough to kick up a chop quickly.`
    : "";

  // Build the script ───────────────────────────────────────────────────────────
  const parts: string[] = [];

  // Intro — Robin Williams energy
  const intros = [
    `GOOOOD MORNING POSADAMITES! It's ${day}, ${month} ${date}th and THIS — IS — YOUR — MORNING BRIEFING! ` +
    `The sun is up, the Sea of Cortez is out there waiting, and YOU are about to get the most important information of your day. Let's GO!`,

    `GOOOOOD MORNING POSADA! Rise and shine, Bahia Concepcion — it is ${day} ${month} ${date}th, ` +
    `the birds are going absolutely NUTS outside, and your daily underground briefing is ON THE AIR. Hold on to your hats!`,

    `HEY HEY HEY — good morning Posadamites! ${day}, ${month} ${date}th, ` +
    `the bay is RIGHT THERE, the coffee is hopefully in your hand, and we have got a FULL report coming at you. Don't touch that dial!`,
  ];
  parts.push(intros[now.getDate() % intros.length]);

  // Current conditions + today's high/low
  const tempLine = highF && lowF
    ? `Today's high will reach ${highF} degrees Fahrenheit — that's ${highC} Celsius — with an overnight low of ${lowF} Fahrenheit, ${lowC} Celsius.`
    : "";

  parts.push(
    `Right now on Bahia Concepcion, we've got ${windWord} out of the ${c.windDirectionLabel} ` +
    `at ${windMph} miles per hour${gustNote}. ${tempLine}${gustAdvisory}`
  );

  // Tides
  if (highTides.length > 0 || lowTides.length > 0) {
    const tideLines: string[] = [];
    if (highTides.length > 0) tideLines.push(`High tide today at ${tideStr(highTides)}`);
    if (lowTides.length  > 0) tideLines.push(`low tide at ${tideStr(lowTides)}`);
    parts.push(`On the tides: ${tideLines.join(", ")}. Plan your beach access and fishing around those windows.`);
  }

  // Sea conditions + fishing — SELL IT if glass
  if (seaInfo.glass) {
    parts.push(
      `NOW HERE IS YOUR HEADLINE. Are you ready? THE BAY — IS — GLASS. ` +
      `I said GLASS, people. We are talking ${toFt(mc.waveHeightM)}-foot waves. ` +
      `That is basically a swimming pool out there. ` +
      `${toFt(mc.swellHeightM)}-foot swells rolling in nice and lazy on a ${mc.swellPeriodS}-second period from the ${mc.swellDirectionLabel}. ` +
      `If you are sitting inside reading this right now, I need you to put down whatever you are doing, ` +
      `grab your gear, and GET ON THE WATER. ` +
      `Days like this on the Sea of Cortez are RARE. This is it. This is the one. GO!`
    );
  } else {
    parts.push(
      `Out on the water, the bay is ${seaInfo.label}. ` +
      `Waves are running ${toFt(mc.waveHeightM)} feet with ${toFt(mc.swellHeightM)}-foot swells ` +
      `out of the ${mc.swellDirectionLabel} on a ${mc.swellPeriodS}-second period.`
    );
  }

  // Fishing outlook
  parts.push(seaInfo.fishing);

  // Moon
  parts.push(
    `Tonight: ${moon.name} moon at ${moon.illuminationPct}% illumination. ` +
    (moon.illuminationPct > 75
      ? "Bright night — great for a beach fire and stargazing, though the fish may be a little slower on the surface."
      : moon.illuminationPct < 30
      ? "Dark skies tonight — ideal for seeing the Milky Way over the bay, and the bioluminescence should be active."
      : "A comfortable night out on the beach or the water.")
  );

  // 3-day forecast
  if (nextDays.length > 0) {
    parts.push(`Now let's look ahead at the next three days.`);
    for (const d of nextDays) {
      const label  = forecastDayLabel(d.date);
      const dHighF = toF(d.highC);
      const dLowF  = toF(d.lowC);
      const dHighC = Math.round(d.highC);
      const dLowC  = Math.round(d.lowC);
      const dWind  = toMph(d.windMaxKts);
      const precip = d.precipMm > 2 ? " Some rain expected." : "";
      parts.push(
        `${label}: ${d.weatherLabel}. High ${dHighF}°F (${dHighC}°C), low ${dLowF}°F (${dLowC}°C). ` +
        `Wind up to ${dWind} miles per hour out of the ${d.windDominantDir}.${precip}`
      );
    }
  }

  // Community events (if provided)
  if (events && events.length > 0) {
    const evSection = formatEvents(events);
    if (evSection) parts.push(evSection);
  }

  // Sign-off
  const signoffs = [
    `And THAT is your Posada Underground morning briefing for ${day}! ` +
    `You are now fully armed with knowledge. Go forth. Be salty. Catch fish. ` +
    `And remember — there is nowhere else on Earth you could be right now. HASTA LUEGO, POSADAMITES!`,

    `That is a WRAP on your ${day} briefing from Posada Underground! ` +
    `Stay safe out there, tip your captains, wear your sunscreen — SPF is not optional at this latitude — ` +
    `and we will see you right back here tomorrow morning. Chao for now!`,

    `And that's the briefing, baby! ${day} on Bahia Concepcion — ` +
    `could be worse, could NOT be better. Get out there and enjoy every single second of it. ` +
    `Posada Underground, signing off. HASTA LUEGO!`,
  ];
  parts.push(signoffs[now.getDate() % signoffs.length]);

  return parts.join("\n\n");
}
