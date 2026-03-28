/* =============================================================
   lib/audio-script-template.ts
   Generate the daily audio briefing script from live data sources.

   Pulls weather, marine, calendar, and medical data to compose
   a coherent script suitable for text-to-speech generation.
   Script is in natural, conversational Spanish/English appropriate
   for reading aloud.

   The script structure:
   1. Greeting and date
   2. Weather overview and forecast
   3. Marine conditions
   4. Today's events and activities
   5. Important announcements
   6. Closing remarks

   Decision D-013: Daily audio briefing for community updates.
   ============================================================= */

import type { AudioScript } from "@/types/audio-briefing";

import { fetchCurrentConditions, fetchDailyForecast } from "@/lib/weather";
import { fetchMarineConditions } from "@/lib/marine";
import { getTodaysSports, getTodaysEvents } from "@/lib/calendar";

// ── Script generation ───────────────────────────────────────

/**
 * Generate a complete daily briefing script.
 *
 * Fetches all required data (weather, marine, calendar) and
 * composes them into a natural, spoken script for audio generation.
 *
 * @param date - The date to generate script for (default: today)
 * @returns AudioScript with sections ready for TTS
 */
export async function generateDailyScript(date: Date = new Date()): Promise<AudioScript> {
  try {
    console.info("[audio-script-template] Generating daily script for", {
      date: date.toISOString().split("T")[0],
    });

    // Fetch all data sources in parallel
    const [current, forecast, marine, sports, events] = await Promise.all([
      fetchCurrentConditions(),
      fetchDailyForecast(),
      fetchMarineConditions(),
      getTodaysSports(),
      getTodaysEvents(),
    ]);

    const sections = [];

    // Opening
    sections.push({
      type: "greeting" as const,
      content: generateGreeting(date),
      estimatedDurationSec: 8,
    });

    // Weather
    sections.push({
      type: "weather" as const,
      content: generateWeatherSection(current, forecast),
      estimatedDurationSec: 25,
    });

    // Marine conditions
    sections.push({
      type: "marine" as const,
      content: generateMarineSection(marine),
      estimatedDurationSec: 20,
    });

    // Events and activities
    if (sports.length > 0 || events.length > 0) {
      sections.push({
        type: "events" as const,
        content: generateEventsSection(sports, events),
        estimatedDurationSec: 20,
      });
    }

    // Closing
    sections.push({
      type: "announcements" as const,
      content: generateClosing(),
      estimatedDurationSec: 8,
    });

    const totalDurationSec = sections.reduce((sum, s) => sum + (s.estimatedDurationSec || 15), 0);

    return {
      date,
      sections,
      metadata: {
        author: "Audio Briefing System",
        estimatedTotalDurationSec: totalDurationSec,
        language: "es-MX",
      },
    };
  } catch (err) {
    console.error("[audio-script-template] generateDailyScript failed:", err);
    // Return fallback script
    return {
      date,
      sections: [
        {
          type: "announcements",
          content:
            "Buenas días. Este es el boletín diario de Posada Concepción. " +
            "No pudimos obtener los datos completos en este momento. Por favor, intente de nuevo más tarde.",
          estimatedDurationSec: 15,
        },
      ],
    };
  }
}

// ── Script section generators ───────────────────────────────

/**
 * Generate opening greeting section.
 *
 * @param date - The date for the briefing
 * @returns Script text for the greeting
 */
function generateGreeting(date: Date): string {
  const dayName = date.toLocaleDateString("es-MX", { weekday: "long" });
  const dateStr = date.toLocaleDateString("es-MX", {
    month: "long",
    day: "numeric",
  });

  return (
    `Bienvenidos al boletín diario de Posada Concepción. ` +
    `Hoy es ${dayName}, ${dateStr}, dos mil veintiséis. ` +
    `Aquí les traemos un resumen de noticias locales, clima, condiciones marinas, y eventos.`
  );
}

/**
 * Generate weather overview section.
 *
 * @param current - Current weather conditions
 * @param forecast - Daily forecast
 * @returns Script text for weather
 */
function generateWeatherSection(current: Awaited<ReturnType<typeof fetchCurrentConditions>>, forecast: Awaited<ReturnType<typeof fetchDailyForecast>>): string {
  const temp = current.tempC;
  const condition = current.weatherLabel;
  const humidity = current.humidity;
  const wind = current.windDirectionLabel;

  let script = `Clima: Actualmente, tenemos ${temp} grados centígrados con ${condition.toLowerCase()}. `;
  script += `La humedad es de ${humidity} por ciento, y hay vientos desde el ${wind}. `;

  if (forecast.days.length > 0) {
    const today = forecast.days[0];
    script += `Para hoy, esperamos una máxima de ${today.highC} grados y una mínima de ${today.lowC} grados. `;

    const tomorrow = forecast.days[1];
    if (tomorrow) {
      script += `Mañana, ${tomorrow.weatherLabel.toLowerCase()}, con máxima de ${tomorrow.highC} grados.`;
    }
  }

  return script;
}

/**
 * Generate marine conditions section.
 *
 * @param marine - Marine conditions
 * @returns Script text for marine conditions
 */
function generateMarineSection(marine: Awaited<ReturnType<typeof fetchMarineConditions>>): string {
  const waveHeight = marine.waveHeightM.toFixed(1);
  const waveDir = marine.waveDirectionLabel;
  const waterTemp = marine.seaTempC;

  let script = `Condiciones marinas: Las olas tienen una altura de ${waveHeight} metros, `;
  script += `viniendo desde el ${waveDir}. `;

  if (waterTemp !== null) {
    script += `La temperatura del agua es de ${waterTemp} grados centígrados. `;
  }

  script += `Es un buen día para actividades acuáticas si sigue las normas de seguridad.`;

  return script;
}

/**
 * Generate events and activities section.
 *
 * @param sports - Today's sports activities
 * @param events - Today's community events
 * @returns Script text for events
 */
function generateEventsSection(
  sports: Awaited<ReturnType<typeof getTodaysSports>>,
  events: Awaited<ReturnType<typeof getTodaysEvents>>
): string {
  let script = `Eventos de hoy: `;

  if (sports.length > 0) {
    script += sports
      .slice(0, 3)
      .map((s) => `${s.sport} a las ${s.time} en ${s.location}`)
      .join(", ") + ". ";
  }

  if (events.length > 0) {
    script += `También tenemos actividades comunitarias: `;
    script += events
      .slice(0, 3)
      .map((e) => `${e.title} a las ${e.time}`)
      .join(", ") + ".";
  }

  if (sports.length === 0 && events.length === 0) {
    script += `No hay eventos especiales programados para hoy.`;
  }

  return script;
}

/**
 * Generate closing remarks section.
 *
 * @returns Script text for closing
 */
function generateClosing(): string {
  return (
    `Gracias por escuchar el boletín diario de Posada Concepción. ` +
    `Para más información, visite nuestro sitio web o llame a la oficina local. ` +
    `¡Que tengan un excelente día!`
  );
}
