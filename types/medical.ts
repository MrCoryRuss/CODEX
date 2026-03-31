/**
 * Medical Guide types for the Posada Underground dashboard
 * Defines structures for medical facilities, contacts, and related resources
 */

/**
 * Represents a town or settlement with medical services
 */
export interface MedicalTown {
  /** Unique identifier for the town */
  id: string;
  /** Name of the town/settlement */
  name: string;
  /** Distance from Posada ConcepciÃ³n in kilometers */
  distanceKm: number;
  /** Estimated drive time from Posada in minutes */
  driveTimeMin: number;
  /** Primary contact phone number */
  phone: string;
  /** Secondary contact phone number, if available */
  phoneAlt?: string;
  /** Whatsapp number for messaging, if available */
  whatsappPhone?: string;
}

/**
 * Category classification for medical facilities
 */
export interface MedicalCategory {
  /** Unique identifier for the category */
  id: string;
  /** Display label (e.g., "Clinic", "Hospital", "Pharmacy", "Dentist") */
  label: string;
  /** Icon identifier for UI rendering */
  icon: string;
  /** Detailed description of services in this category */
  description: string;
}

/**
 * Medical facility location and service information
 */
export interface MedicalFacility {
  /** Unique identifier for the facility */
  id: string;
  /** Name of the medical facility */
  name: string;
  /** Reference to MedicalTown where facility is located */
  townId: string;
  /** Category of medical service */
  categoryId: string;
  /** Street address and location details */
  address: string;
  /** Primary contact phone number */
  phone: string;
  /** Alternative phone number */
  phoneAlt?: string;
  /** Whatsapp number for messaging, if available */
  whatsappPhone?: string;
  /** Operating hours in format "HH:MM-HH:MM" or "24h" */
  hours: string;
  /** Special hours or emergency contact information */
  emergencyHours?: string;
  /** Additional notes about services, insurance, or requirements */
  notes?: string;
  /** Geographic coordinates for mapping */
  coordinates: {
    latitude: number;
    longitude: number;
  };
  /** Whether facility accepts walk-ins */
  acceptsWalkIns?: boolean;
  /** Whether facility accepts appointments */
  acceptsAppointments?: boolean;
  /** Whether facility accepts insurance */
  acceptsInsurance?: boolean;
  /** List of insurance providers accepted */
  insuranceAccepted?: string[];
}

/**
 * Emergency contact person with role-specific information
 */
export interface EmergencyContact {
  /** Unique identifier for the contact */
  id: string;
  /** Name of the contact person */
  name: string;
  /** Professional role or title */
  role: string;
  /** Primary phone number */
  phone: string;
  /** Alternative phone number */
  phoneAlt?: string;
  /** WhatsApp phone number */
  whatsappPhone?: string;
  /** Whether contact is currently available/on-call */
  available: boolean;
  /** Hours when contact is typically available */
  availableHours?: string;
  /** Additional context or special expertise */
  notes?: string;
  /** Priority order for emergency contact attempts (lower = call first) */
  priority: number;
  /** Whether this is a 24-hour emergency number */
  is24Hour?: boolean;
}

/**
 * Reference to a downloadable medical guide or informational PDF
 */
export interface MedicalGuidePDF {
  /** Unique identifier for the document */
  id: string;
  /** Title of the guide or document */
  title: string;
  /** Category for organizing guides (e.g., "Emergency", "First Aid", "Medications") */
  category: string;
  /** URL to access or download the PDF */
  url: string;
  /** Total number of pages in the PDF */
  pageCount: number;
  /** Timestamp of when the document was last updated */
  lastUpdated: Date;
  /** Brief description of document contents */
  description?: string;
  /** Language code (e.g., "es", "en") */
  language?: string;
  /** File size in bytes */
  fileSizeBytes?: number;
}



