/**
 * Mock audio episodes for Posada Underground daily briefings
 * Past episodes of the community audio briefing/news
 */

import { AudioEpisode } from '@/types/audio-briefing';

/**
 * Past daily briefing episodes with realistic content
 * Simulates audio content that would be generated and published for the community
 */
export const MOCK_AUDIO_EPISODES: AudioEpisode[] = [
  {
    id: 'episode-2026-03-27',
    date: new Date('2026-03-27'),
    title: 'Daily Briefing - March 27: Road Closures and Water Delivery',
    durationSec: 285,
    audioUrl: 'https://example.com/audio/briefing-2026-03-27.mp3',
    transcript: `Good morning, Posada. This is your daily briefing for March 27th. We have several important announcements to cover this morning.

First, a critical road update: The main road to Mulegé remains washed out at kilometer 15 following recent runoff. Community Council advises avoiding private vehicle travel until further notice. If you have a medical emergency, contact Juan Carlos or call 911—CRUM ambulance is coordinating responses. Road repairs are underway and we expect partial access by March 30th.

Second, the water delivery truck will arrive at 10:00 AM today at the community center. Please have your containers ready. Remember, no delivery tomorrow Thursday due to vehicle maintenance.

Weather: Expect continued strong northwesterly winds at 35-40 kilometers per hour with gusts to 50 kph. Secure any loose items around your property. Boating is not recommended. Protect generator fuel supplies and prepare for potential power fluctuations.

Community news: Fishing tournament sign-ups continue for the April 5th event. Entry is 50 USD per boat. Prize pool is growing and proceeds support school supplies. Sign up at the tienda by April 2nd.

Finally, reminder: Satellite internet maintenance scheduled for 2:00 to 4:00 PM March 29th. Plan accordingly and back up important files. Emergency satellite phone remains active.

Stay safe, stay hydrated, and we'll see you in tomorrow's briefing. This is Posada Daily News.`,
    summary:
      'Road to Mulegé closed at km 15; water delivery today at 10 AM; strong winds 35-50 kph expected; fishing tournament April 5; satellite internet maintenance March 29, 2-4 PM.',
    generatedAt: new Date('2026-03-27T06:30:00Z'),
    voice: 'Elena',
  },
  {
    id: 'episode-2026-03-26',
    date: new Date('2026-03-26'),
    title: 'Daily Briefing - March 26: Wind Warning and Upcoming Events',
    durationSec: 312,
    audioUrl: 'https://example.com/audio/briefing-2026-03-26.mp3',
    transcript: `Good morning, Posada. Today is March 26th, and this is your community daily briefing.

Let's start with weather: Meteorological service is forecasting strong northwesterly winds beginning this evening and continuing through March 30th. Wind speeds will reach 35 to 45 kilometers per hour with gusts potentially exceeding 50 kph. This is typical spring wind season for our area, but we want everyone prepared. Secure tarps on roofs, tie down anything that could blow away, fill water tanks if possible, and check fuel supplies for generators. If you have solar panels or outdoor structures, ensure they're properly secured. This wind pattern typically causes elevated dust and may reduce visibility on roads.

For boating and fishing community members: Exercise extreme caution. The sea state will become rough. Small boats should remain in protected anchorages. Fishing operations on larger vessels can continue but weather routing is essential.

Next, a reminder about Sunday's community gathering: On March 29th at sunset, there will be a planning meeting for the April 5th fishing tournament and community dinner. Everyone is welcome. This is a chance to discuss community needs and upcoming events. Location is the community center.

Water updates: Regular Tuesday and Thursday deliveries continue as scheduled. Store-keeper María García asks that people prepare containers in advance to speed up the delivery process.

Medical reminder: Juan Carlos Lopez is available for consultations this week. If you need supplies or have health concerns, visit during morning hours before the afternoon wind picks up.

Finally, if you haven't checked your emergency supply kit recently, spring is a good time to refresh it. Make sure you have plenty of water, non-perishable food, first aid supplies, and any prescription medications you need.

That's today's briefing. Take care out there, and stay safe during the wind. See you tomorrow morning.`,
    summary:
      'Strong winds 35-50 kph expected March 27-30; secure property and generators; boating caution advised; community meeting March 29; water delivery schedule continues; refresh emergency supplies.',
    generatedAt: new Date('2026-03-26T06:30:00Z'),
    voice: 'Elena',
  },
  {
    id: 'episode-2026-03-25',
    date: new Date('2026-03-25'),
    title: 'Daily Briefing - March 25: Events and Fishing Tournament Details',
    durationSec: 298,
    audioUrl: 'https://example.com/audio/briefing-2026-03-25.mp3',
    transcript: `Good morning, Posada. March 25th briefing, let's get started.

Today we're highlighting some community events that are coming up. First, the much-anticipated fishing tournament and community dinner scheduled for Saturday, April 5th at sunset. This is shaping up to be one of our best events of the spring season. Entry is 50 United States dollars per boat. This year, proceeds are going directly to the school supplies fund, which is needed for our kids' education. There will be prizes for the largest catch, the most fish, and a judges' choice award. Food will be provided by community volunteers—we're talking fresh ceviche, grilled fish, beans, and fresh tortillas. Non-fishers are absolutely welcome to attend for the dinner and festivities. Sign-ups are happening at the tienda. Deadline is April 2nd.

Weather outlook: This week remains clear and sunny with morning temperatures around 18 Celsius and afternoon highs around 32. Beautiful fishing weather, but watch for wind picking up as we move into the weekend. The Spring wind season is beginning, and we may see some activity late this week.

Technical update: Internet connectivity has been good this week. If you're having issues with satellite access, contact Pedro López at the tech center between 9 AM and noon.

Medical check-in: Rosario, our community nurse, will be available for consultations Thursday morning if anyone needs a health assessment or advice.

Fishing update: Recent catches have been good—pargo, dorado, and some yellowtail reported this week. Water temperature is around 22 degrees Celsius. The offshore reefs should be productive for the coming weeks. Remember safety protocols: life jackets, communication equipment, and tell someone your planned route and return time.

That's your briefing for today. Enjoy the sunshine, and we'll see you tomorrow morning. Stay hydrated and stay safe.`,
    summary:
      'Fishing tournament April 5 sign-ups underway; clear weather this week; evening wind possible by weekend; internet stable; nurse consultation Thursday; good fishing activity at reefs.',
    generatedAt: new Date('2026-03-25T06:30:00Z'),
    voice: 'Elena',
  },
  {
    id: 'episode-2026-03-24',
    date: new Date('2026-03-24'),
    title: 'Daily Briefing - March 24: Weekly Recap and Infrastructure Updates',
    durationSec: 320,
    audioUrl: 'https://example.com/audio/briefing-2026-03-24.mp3',
    transcript: `Good morning, Posada. This is your March 24th daily briefing. We've got a lot to cover this morning, so let's get into it.

First, a brief recap of this week: We've had excellent weather overall with calm seas and steady trade winds. The community has been very active—we've seen good fishing activity, continued infrastructure maintenance on the water system, and planning for our upcoming events. The road to Mulegé has been passable, which allowed for regular supply runs and a medical appointment rotation for those who needed clinic visits.

Now, infrastructure updates: The water committee reports that our main storage tank is at about 85 percent capacity. This is good heading into the dry season. They remind everyone to continue water conservation practices—shower timing, washing dishes efficiently, and minimizing landscape irrigation during peak heat. A delivery truck is scheduled for Wednesday March 27th.

Electricity: The solar array has been performing excellently with consistent daily production. Battery storage is at full capacity. Generator is maintained and ready as backup. The technical team reports no issues.

Internet and communication: Satellite uplink has had 99.2 percent uptime this week. Emergency radio equipment is all functional. If you need to report a technical issue, contact Pedro or the tech team.

Fishing news: Several boats have reported excellent catches at the offshore reefs. Dorado and pargo are running well. Yellowtail activity has also been good. Safety reminder: always file your fishing plan with someone on shore. The sea can change quickly, and we want to know where you are.

Social calendar: Community gathering this Sunday evening to plan events. Children's program continues Tuesday and Thursday afternoons. Spanish language class is ongoing Wednesday evenings if you want to join.

Finally, a special note: Thank you to everyone who has been helping with community maintenance, road repairs, and general upkeep. The mutual aid system that keeps Posada running is what makes this place special.

That's your briefing for today. Have a productive day, and we'll see you again tomorrow morning.`,
    summary:
      'Week recap: excellent weather, good fishing activity; water tank at 85%; solar system full, backup generator ready; internet 99.2% uptime; community events planning Sunday; fishing safety reminders; thank you to volunteers.',
    generatedAt: new Date('2026-03-24T06:30:00Z'),
    voice: 'Elena',
  },
];
