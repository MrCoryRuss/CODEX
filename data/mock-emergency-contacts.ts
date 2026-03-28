/**
 * Mock emergency contacts for Posada Underground
 * Critical contacts for medical emergencies, safety, and crisis situations
 */

import { EmergencyContact } from '@/types/medical';

/**
 * Essential emergency contacts for Posada Concepción community
 * Ordered by priority (1 = call first, higher numbers = backup contacts)
 */
export const MOCK_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'contact-mexico-911',
    name: 'Emergency Response - Mexico',
    role: 'National Emergency Services',
    phone: '911',
    available: true,
    availableHours: '24/7',
    notes:
      'Call for police, fire, ambulance. Operators may have limited English. Have location and situation clearly stated.',
    priority: 1,
    is24Hour: true,
  },
  {
    id: 'contact-juan-medic',
    name: 'Juan Carlos López Mendoza',
    role: 'Volunteer First Responder / Community Paramedic',
    phone: '+52 613 135 1234',
    phoneAlt: '+52 613 135 1234',
    available: true,
    availableHours: 'Most times, call first',
    notes:
      'Lives in Posada. Has first responder training and oxygen. Can provide initial stabilization and transport coordination to Mulegé. Best for immediate local response.',
    priority: 2,
    is24Hour: false,
  },
  {
    id: 'contact-mulege-ambulance',
    name: 'CRUM Mulegé (Servicios de Ambulancia)',
    role: 'Emergency Medical Transport',
    phone: '+52 613 153 0010',
    phoneAlt: '+52 613 153 0025',
    whatsappPhone: '+52 613 153 0025',
    available: true,
    availableHours: '24/7',
    notes:
      'Ambulance service based in Mulegé, ~60km away. Response time 45-60 minutes by road. Has paramedics and equipment. Often faster than Loreto for transport.',
    priority: 3,
    is24Hour: true,
  },
  {
    id: 'contact-loreto-redcross',
    name: 'Cruz Roja Mexicana - Loreto',
    role: 'Red Cross Emergency Services',
    phone: '+52 613 134 0300',
    phoneAlt: '+52 613 134 0310',
    available: true,
    availableHours: '24/7',
    notes:
      'Red Cross emergency services in Loreto. More established than Mulegé station. Transport to regional hospital. ~2 hour response time.',
    priority: 4,
    is24Hour: true,
  },
  {
    id: 'contact-loreto-hospital',
    name: 'Hospital General de Loreto - Emergency Department',
    role: 'Emergency Medicine / Hospital Services',
    phone: '+52 613 134 1600',
    phoneAlt: '+52 613 134 0010',
    available: true,
    availableHours: '24/7',
    notes:
      'Regional hospital with emergency department. CT scan and surgical capability. Better equipped than Mulegé. Verify patient is being transported here.',
    priority: 5,
    is24Hour: true,
  },
  {
    id: 'contact-nurse-posada',
    name: 'Rosario Guillén Santos',
    role: 'Community Health Nurse (Posada)',
    phone: '+52 613 135 1567',
    phoneAlt: '+52 613 135 1568',
    available: true,
    availableHours: '07:00-18:00, emergencies anytime',
    notes:
      'Registered nurse living in Posada. Can assess injuries and advise on treatment. Not equipped for major interventions but invaluable for triage.',
    priority: 2,
    is24Hour: false,
  },
  {
    id: 'contact-us-embassy',
    name: 'U.S. Embassy Emergency Line - Mexico',
    role: 'U.S. Citizen Emergency Services',
    phone: '+52 55 8526 2561',
    phoneAlt: '+52 612 122 0561',
    available: true,
    availableHours: 'After-hours emergencies 24/7',
    notes:
      'For U.S. citizens needing assistance. Can help coordinate evacuation, contact family, navigate Mexican medical system. Have passport ready.',
    priority: 6,
    is24Hour: true,
  },
  {
    id: 'contact-satellite-phone',
    name: 'Emergency Satellite Phone Operator',
    role: 'Emergency Communication',
    phone: '+881 515 161 234', // Iridium example
    available: true,
    availableHours: '24/7',
    notes:
      'If internet/cell is down, can reach emergency response via satellite. May charge per minute. Community maintains satellite account for emergencies.',
    priority: 7,
    is24Hour: true,
  },
  {
    id: 'contact-navy-marine',
    name: 'Mexican Navy - Mulegé Station (Marinos)',
    role: 'Marine Emergency / Coast Guard',
    phone: '+52 613 153 0098',
    phoneAlt: '+52 613 153 0088',
    available: true,
    availableHours: '24/7',
    notes:
      'For maritime emergencies, boat incidents, or emergencies offshore. Can dispatch vessel for rescue. Important for fishing community.',
    priority: 8,
    is24Hour: true,
  },
];
