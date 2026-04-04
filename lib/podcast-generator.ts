import type { HomepageWeather } from "./weather";
import type { HomepageMarine } from "./marine";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toF(c: number) { return Math.round(c * 9/5 + 32); }
function toMph(kts: number) { return Math.round(kts * 1.151); }
function toFt(m: number) { return Math.round(m * 3.281 * 10) / 10; }

function seaDescription(waveM: number): string {
  const ft = toFt(waveM);
  if (ft < 1) return "glassy calm";
  if (ft < 2) return "light chop";
  if (ft < 4) return "moderate";
  if (ft < 6) return "rough";
  return "very rough";
}

function windDescription(mph: number): string {
  if (mph < 5) return "calm";
  if (mph < 10) return "light";
  if (mph < 15) return "gentle";
  if (mph < 20) return "moderate";
  if (mph < 25) return "fresh";
  return "strong";
}

export function generatePodcastScript(
  weather: HomepageWeather,
  marine: HomepageMarine
): string {
  const now = new Date();
  const day = DAYS[now.getDay()];
  const month = MONTHS[now.getMonth()];
  const date = now.getDate();

  const c = weather.current;
  const tempF = toF(c.tempC);
  const feelsF = toF(c.feelsLikeC);
  const windMph = toMph(c.windSpeedKts);
  const gustMph = toMph(c.windGustsKts);
  const windWord = windDescription(windMph);

  const snap = marine.snapshot;
  const wavesFt = toFt(snap.conditions.waveHeightM);
  const swellFt = toFt(snap.conditions.swellHeightM);
  const seaWord = seaDescription(snap.conditions.waveHeightM);
  const moon = snap.moon;

  // Today's forecast high/low
  const today = weather.forecast?.days?.[0];
  const highF = today ? toF(today.highC) : null;
  const lowF  = today ? toF(today.lowC)  : null;

  // Next tide event
  const nextTide = snap.tides?.events?.[0];
  const tideStr = nextTide
    ? `${nextTide.type === "high" ? "high" : "low"} tide at ${nextTide.time}, ${toFt(nextTide.heightM)} feet`
    : null;

  // UV advisory
  const uvNote = c.uvIndex >= 8
    ? `UV index is very high at ${c.uvIndex} — don't forget your sunscreen and a hat.`
    : c.uvIndex >= 6
    ? `UV index is high today at ${c.uvIndex}, so sun protection is a must.`
    : "";

  // Gust note
  const gustNote = gustMph > windMph + 5
    ? `, with gusts up to ${gustMph} miles per hour`
    : "";

  const lines: string[] = [
    `Good morning, Posada! It's ${day}, ${month} ${date}th — and another day in paradise on Bahia Concepcion.`,
    "",
    `Right now at Posada Concepcion, we're sitting at ${tempF} degrees Fahrenheit — feels like ${feelsF}. ${c.isDay ? "Skies are" : "Overnight conditions"} ${(c.weatherCode <= 3 ? "clear to partly cloudy" : "mostly cloudy")}.`,
    "",
    `Winds are ${windWord} out of the ${c.windDirectionLabel} at ${windMph} miles per hour${gustNote}. ${uvNote}`,
    "",
    `Out on the water, the sea is ${seaWord} with ${wavesFt}-foot waves and ${swellFt}-foot swells rolling in from the ${snap.conditions.swellDirectionLabel} on a ${snap.conditions.swellPeriodS}-second period.${snap.conditions.seaTempC ? ` Sea temperature is ${toF(snap.conditions.seaTempC)}°F.` : ""}`,
    "",
    highF && lowF ? `Today's forecast: highs near ${highF}, overnight lows around ${lowF}. ${today?.precipMm && today.precipMm > 1 ? "There's a chance of showers later." : "Nice and dry."}` : "",
    "",
    tideStr ? `Tides: next ${tideStr}. Plan your beach time accordingly.` : "",
    "",
    `Tonight's sky: ${moon.name} moon at ${moon.illuminationPct}% illumination. ${moon.illuminationPct > 80 ? "Great night for stargazing — or spotting manta rays." : "Dark skies tonight — perfect for the Milky Way."}`,
    "",
    `That's your Posada Underground morning briefing. Stay salty, stay safe, and we'll see you on the water. Hasta luego!`,
  ];

  return lines.filter(l => l !== null && l !== undefined).join("\n").trim();
}
