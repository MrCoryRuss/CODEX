/**
 * Mock medical guide data for Posada Underground
 * Realistic medical facilities, towns, and resources in Baja California Sur
 */

import {
  MedicalTown,
  MedicalCategory,
  MedicalFacility,
  MedicalGuidePDF,
} from '@/types/medical';

/**
 * Nearby towns with medical services accessible from Posada Concepción
 * Distances and drive times are approximate
 */
export const MOCK_TOWNS: MedicalTown[] = [
  {
    id: 'mulege',
    name: 'Mulegé',
    distanceKm: 60,
    driveTimeMin: 50,
    phone: '+52 613 153 0010',
    phoneAlt: '+52 613 153 0015',
    whatsappPhone: '+52 613 153 0010',
  },
  {
    id: 'loreto',
    name: 'Loreto',
    distanceKm: 130,
    driveTimeMin: 120,
    phone: '+52 613 134 0010',
    phoneAlt: '+52 613 134 1600',
    whatsappPhone: '+52 613 134 0010',
  },
  {
    id: 'santa-rosalia',
    name: 'Santa Rosalía',
    distanceKm: 85,
    driveTimeMin: 75,
    phone: '+52 615 152 0100',
    phoneAlt: '+52 615 152 0150',
    whatsappPhone: '+52 615 152 0100',
  },
  {
    id: 'ciudad-constitucion',
    name: 'Ciudad Constitución',
    distanceKm: 240,
    driveTimeMin: 220,
    phone: '+52 613 132 0000',
    phoneAlt: '+52 613 132 0100',
  },
  {
    id: 'la-paz',
    name: 'La Paz',
    distanceKm: 480,
    driveTimeMin: 480,
    phone: '+52 612 122 4000',
    phoneAlt: '+52 612 125 0800',
    whatsappPhone: '+52 612 122 4000',
  },
];

/**
 * Categories of medical services available
 */
export const MOCK_CATEGORIES: MedicalCategory[] = [
  {
    id: 'hospital',
    label: 'Hospital',
    icon: 'building-hospital',
    description:
      'Full-service hospital with emergency services, surgery, and inpatient care',
  },
  {
    id: 'clinic',
    label: 'Clinic / Medical Center',
    icon: 'stethoscope',
    description:
      'Primary care clinic offering consultations, vaccinations, and basic diagnostics',
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    icon: 'pills',
    description: 'Pharmacy with prescription filling and over-the-counter medications',
  },
  {
    id: 'dental',
    label: 'Dental Clinic',
    icon: 'tooth',
    description: 'Dental services including preventive care and extractions',
  },
  {
    id: 'emergency',
    label: 'Emergency Services',
    icon: 'alert-circle',
    description: '24-hour emergency response and trauma care',
  },
  {
    id: 'veterinary',
    label: 'Veterinary',
    icon: 'paw-print',
    description: 'Veterinary services for livestock, pets, and marine animals',
  },
];

/**
 * Medical facilities across nearby towns
 * Includes hospitals, clinics, pharmacies, and specialized services
 */
export const MOCK_FACILITIES: MedicalFacility[] = [
  {
    id: 'facility-mulege-hospital',
    name: 'Clínica Mulege (Hospital)',
    townId: 'mulege',
    categoryId: 'hospital',
    address: 'Calle Zaragoza 44, Mulegé',
    phone: '+52 613 153 0010',
    phoneAlt: '+52 613 153 0014',
    whatsappPhone: '+52 613 153 0010',
    hours: '24h',
    emergencyHours: '24h',
    notes:
      'Primary hospital for Mulegé area. Has laboratory, X-ray, and basic surgical capability. English-speaking staff available.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    acceptsInsurance: true,
    insuranceAccepted: ['IMSS', 'ISSSTE', 'Seguros Monterrey'],
    coordinates: { latitude: 26.8919, longitude: -111.9719 },
  },
  {
    id: 'facility-mulege-clinic',
    name: 'Clínica Dr. Salvador García',
    townId: 'mulege',
    categoryId: 'clinic',
    address: 'Calle Martínez 12, Mulegé',
    phone: '+52 613 153 0050',
    hours: '08:00-17:00',
    emergencyHours: '+52 613 153 0010 (refer to main hospital)',
    notes: 'Primary care clinic. Good for routine check-ups and prescriptions.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    coordinates: { latitude: 26.8930, longitude: -111.9750 },
  },
  {
    id: 'facility-mulege-pharmacy',
    name: 'Farmacia del Centro',
    townId: 'mulege',
    categoryId: 'pharmacy',
    address: 'Calle Zaragoza 56, Mulegé',
    phone: '+52 613 153 0086',
    hours: '08:00-20:00',
    emergencyHours: '+52 613 153 0025',
    notes: 'Well-stocked pharmacy. Can advise on medications without prescription.',
    acceptsWalkIns: true,
    coordinates: { latitude: 26.8910, longitude: -111.9710 },
  },
  {
    id: 'facility-loreto-hospital',
    name: 'Hospital General de Loreto',
    townId: 'loreto',
    categoryId: 'hospital',
    address: 'Boulevard Damiana Ortiz, Loreto',
    phone: '+52 613 134 1600',
    phoneAlt: '+52 613 134 0010',
    whatsappPhone: '+52 613 134 0010',
    hours: '24h',
    emergencyHours: '24h',
    notes:
      'Larger regional hospital. More comprehensive services than Mulegé. Has CT scanner and expanded surgical capability.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    acceptsInsurance: true,
    insuranceAccepted: ['IMSS', 'ISSSTE', 'Seguros Monterrey', 'Most private insurance'],
    coordinates: { latitude: 26.0173, longitude: -111.3545 },
  },
  {
    id: 'facility-loreto-clinic',
    name: 'Centro Médico Loreto',
    townId: 'loreto',
    categoryId: 'clinic',
    address: 'Calle Salvatierra 2, Loreto',
    phone: '+52 613 134 0890',
    hours: '08:00-18:00',
    notes: 'Modern private clinic with English-speaking doctors. Good for expats.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    coordinates: { latitude: 26.0165, longitude: -111.3520 },
  },
  {
    id: 'facility-loreto-dental',
    name: 'Clínica Dental Loreto',
    townId: 'loreto',
    categoryId: 'dental',
    address: 'Calle Madero 45, Loreto',
    phone: '+52 613 134 1234',
    hours: '09:00-17:00',
    notes: 'Dental services. Appointments recommended.',
    acceptsAppointments: true,
    coordinates: { latitude: 26.0170, longitude: -111.3500 },
  },
  {
    id: 'facility-santa-rosalia-clinic',
    name: 'Clínica Santa Rosalía',
    townId: 'santa-rosalia',
    categoryId: 'clinic',
    address: 'Avenida Obregón 155, Santa Rosalía',
    phone: '+52 615 152 0100',
    phoneAlt: '+52 615 152 0150',
    hours: '08:00-17:00',
    emergencyHours: '+52 615 152 0120',
    notes:
      'Local clinic in Santa Rosalía. Mining town with basic medical services. Good fallback if Mulegé is inaccessible.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    coordinates: { latitude: 27.3063, longitude: -112.2642 },
  },
  {
    id: 'facility-santa-rosalia-pharmacy',
    name: 'Farmacia María de la Salud',
    townId: 'santa-rosalia',
    categoryId: 'pharmacy',
    address: 'Avenida Obregón 120, Santa Rosalía',
    phone: '+52 615 152 0140',
    hours: '07:30-19:30',
    notes: 'Local pharmacy. May have limited selection of specialty medications.',
    acceptsWalkIns: true,
    coordinates: { latitude: 27.3070, longitude: -112.2650 },
  },
  {
    id: 'facility-cc-hospital',
    name: 'Hospital General de Ciudad Constitución',
    townId: 'ciudad-constitucion',
    categoryId: 'hospital',
    address: 'Boulevard Salvatierra 333, Ciudad Constitución',
    phone: '+52 613 132 0000',
    hours: '24h',
    emergencyHours: '24h',
    notes:
      'Full-service hospital for agricultural region. More robust than Mulegé. Last resort for serious cases.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    acceptsInsurance: true,
    coordinates: { latitude: 25.0404, longitude: -111.6707 },
  },
  {
    id: 'facility-lapaz-hospital',
    name: 'Hospital Angeles La Paz',
    townId: 'la-paz',
    categoryId: 'hospital',
    address: 'Carretera a Nopoló km 5.5, La Paz',
    phone: '+52 612 125 0800',
    phoneAlt: '+52 612 122 4000',
    whatsappPhone: '+52 612 125 0800',
    hours: '24h',
    emergencyHours: '24h',
    notes:
      'Private hospital in state capital. Best equipped facility. 8+ hours by car or 1 hour by air ambulance. Serves as reference hospital.',
    acceptsWalkIns: true,
    acceptsAppointments: true,
    acceptsInsurance: true,
    insuranceAccepted: ['All major Mexican insurance', 'US insurance with authorization'],
    coordinates: { latitude: 24.1932, longitude: -110.2993 },
  },
  {
    id: 'facility-lapaz-emergency',
    name: 'Servicios Médicos de Emergencia La Paz',
    townId: 'la-paz',
    categoryId: 'emergency',
    address: 'La Paz, Baja California Sur',
    phone: '+52 612 122 5050',
    phoneAlt: '+52 612 125 6000',
    hours: '24h',
    emergencyHours: '24h',
    notes: 'Medical transport and emergency response from La Paz. Can dispatch air ambulance.',
    acceptsWalkIns: true,
    coordinates: { latitude: 24.1900, longitude: -110.3000 },
  },
  {
    id: 'facility-mulege-veterinary',
    name: 'Veterinaria Mulegé',
    townId: 'mulege',
    categoryId: 'veterinary',
    address: 'Calle Libramiento s/n, Mulegé',
    phone: '+52 613 153 0220',
    hours: '09:00-18:00',
    notes: 'Veterinary services for pets and livestock. Also treats marine wildlife.',
    acceptsAppointments: true,
    coordinates: { latitude: 26.8900, longitude: -111.9700 },
  },
];

/**
 * Medical guide PDFs and resources
 * Documents that would be available for download and offline use
 */
export const MOCK_PDFS: MedicalGuidePDF[] = [
  {
    id: 'pdf-offgrid-medical',
    title: 'Off-Grid Medical Guide for Baja California',
    category: 'Emergency',
    url: 'https://example.com/guides/offgrid-medical-baja.pdf',
    pageCount: 47,
    lastUpdated: new Date('2024-08-15'),
    description:
      'Comprehensive guide to managing medical emergencies in remote areas. Covers wound care, dehydration, heat illness, and evacuation procedures.',
    language: 'en',
    fileSizeBytes: 2847293,
  },
  {
    id: 'pdf-first-aid',
    title: 'Guía de Primeros Auxilios para Comunidades Remotas',
    category: 'First Aid',
    url: 'https://example.com/guides/primeros-auxilios-remotas.pdf',
    pageCount: 32,
    lastUpdated: new Date('2024-06-22'),
    description:
      'Spanish-language first aid guide focused on remote community scenarios. CPR, choking, severe bleeding, and common injuries.',
    language: 'es',
    fileSizeBytes: 1924567,
  },
  {
    id: 'pdf-pharmacy-guide',
    title: 'Common Medications & Their Uses in Remote Settings',
    category: 'Medications',
    url: 'https://example.com/guides/pharmacy-remote.pdf',
    pageCount: 28,
    lastUpdated: new Date('2024-09-10'),
    description:
      'Guide to common medications available at local pharmacies, including dosing and when to use. References Mexican pharmaceutical naming conventions.',
    language: 'en',
    fileSizeBytes: 1567834,
  },
  {
    id: 'pdf-evacuation',
    title: 'Medical Evacuation Procedures for Baja Sur',
    category: 'Emergency',
    url: 'https://example.com/guides/evacuation-procedures.pdf',
    pageCount: 18,
    lastUpdated: new Date('2024-11-05'),
    description:
      'Step-by-step procedures for arranging medical evacuation from Posada to Mulegé, Loreto, or La Paz. Includes contact information and cost estimates.',
    language: 'en',
    fileSizeBytes: 876543,
  },
];
