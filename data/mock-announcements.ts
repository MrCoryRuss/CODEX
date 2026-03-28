/**
 * Mock community announcements for Posada Underground
 * Realistic announcements for a small off-grid community in Baja California Sur
 */

export interface CommunityAnnouncement {
  id: string;
  text: string;
  level: 'info' | 'warning' | 'urgent';
  date: Date;
  author: string;
}

/**
 * Current and recent announcements for Posada Concepción
 * Mix of routine updates and important safety/service notices
 */
export const MOCK_ANNOUNCEMENTS: CommunityAnnouncement[] = [
  {
    id: 'announce-001',
    text: 'Water delivery truck will arrive Wednesday (March 27) at 10:00 AM. Please have containers ready at the community center. No delivery on Thursday due to vehicle maintenance.',
    level: 'info',
    date: new Date('2026-03-25'),
    author: 'María García - Water Committee',
  },
  {
    id: 'announce-002',
    text: 'WIND WARNING: Strong northwesterly winds (40-50 kph gusts) expected March 28-30. Secure loose items, avoid boating if possible, and check generator fuel supplies. Prepare for potential power interruptions.',
    level: 'warning',
    date: new Date('2026-03-26'),
    author: 'José Mendoza - Safety Committee',
  },
  {
    id: 'announce-003',
    text: 'URGENT: Road to Mulegé is washed out at kilometer 15 after heavy runoff. Avoid travel by private vehicle. Medical emergencies will be handled by CRUM ambulance. Please report travel by March 30.',
    level: 'urgent',
    date: new Date('2026-03-27'),
    author: 'Community Council',
  },
  {
    id: 'announce-004',
    text: 'Community dinner and fishing tournament sign-up: April 5 at sunset. Families welcome. $50 USD entry per boat, prizes for largest catch. Sign up at the tienda by April 2. Proceeds support school supplies fund.',
    level: 'info',
    date: new Date('2026-03-25'),
    author: 'Roberto Flores - Recreation Committee',
  },
  {
    id: 'announce-005',
    text: 'Satellite internet service will be down for maintenance from 2:00-4:00 PM on March 29. Please backup critical files and plan accordingly. Emergency satellite phone will remain active.',
    level: 'warning',
    date: new Date('2026-03-26'),
    author: 'Pedro López - Technical Support',
  },
];
