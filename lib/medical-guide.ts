/* =============================================================
   lib/medical-guide.ts
   Main medical guide data layer for facility and contact lookup.

   Data source priority:
     1. Live source (TBD: medical database API, spreadsheet)
     2. Mock data from data/mock-medical-guide.ts (fallback)
     3. Mock emergency contacts from data/mock-emergency-contacts.ts

   This adapter layer provides town, facility, category, emergency
   contact, and PDF reference lookups. When the real data source is
   available, only getAllTowns() and getFacilities() change.
   Downstream code stays the same.

   Decision D-011: Community-maintained medical guide.
   ============================================================= */

import type {
  MedicalTown,
  MedicalCategory,
  MedicalFacility,
  EmergencyContact,
  MedicalGuidePDF,
} from "@/types/medical";

// Import mock data (when real source is wired, these become fallbacks)
import {
  MOCK_TOWNS,
  MOCK_CATEGORIES,
  MOCK_FACILITIES,
  MOCK_PDFS,
} from "@/data/mock-medical-guide";

import { MOCK_EMERGENCY_CONTACTS } from "@/data/mock-emergency-contacts";

// ── Data source ─────────────────────────────────────────────
// Currently all operations return mock data.
// When a live API is available, getData() functions will fetch first,
// falling back to mock on failure.

let _lastSource: "live" | "mock" = "mock";

/**
 * Check whether the last fetch came from a live source or mock data.
 */
export function getMedicalGuideSource(): "live" | "mock" {
  return _lastSource;
}

// ── Public API: Towns ───────────────────────────────────────

/**
 * Get all towns with medical services near Posada Concepcion.
 * Falls back to mock data if live source is unavailable.
 *
 * @returns Array of MedicalTown objects, sorted by distance.
 */
export async function getMedicalTowns(): Promise<MedicalTown[]> {
  try {
    // TODO: When live source is available:
    // const towns = await fetchLivemedicalTowns();
    // _lastSource = "live";
    // return towns;

    _lastSource = "mock";
    return MOCK_TOWNS.sort((a, b) => a.distanceKm - b.distanceKm);
  } catch (err) {
    console.error("[medical-guide] getMedicalTowns failed, using mock:", err);
    _lastSource = "mock";
    return MOCK_TOWNS;
  }
}

// ── Public API: Categories ──────────────────────────────────

/**
 * Get all medical service categories (clinic, hospital, pharmacy, etc).
 * Falls back to mock data if live source is unavailable.
 *
 * @returns Array of MedicalCategory objects.
 */
export async function getMedicalCategories(): Promise<MedicalCategory[]> {
  try {
    // TODO: When live source is available:
    // const cats = await fetchLiveCategories();
    // _lastSource = "live";
    // return cats;

    _lastSource = "mock";
    return MOCK_CATEGORIES;
  } catch (err) {
    console.error("[medical-guide] getMedicalCategories failed, using mock:", err);
    _lastSource = "mock";
    return MOCK_CATEGORIES;
  }
}

/**
 * Get category by ID.
 *
 * @param categoryId - The category ID to look up.
 * @returns MedicalCategory or undefined if not found.
 */
export async function getCategoryById(categoryId: string): Promise<MedicalCategory | undefined> {
  const all = await getMedicalCategories();
  return all.find((c) => c.id === categoryId);
}

// ── Public API: Facilities ──────────────────────────────────

/**
 * Get all medical facilities across all towns.
 * Falls back to mock data if live source is unavailable.
 *
 * @returns Array of MedicalFacility objects.
 */
async function getAllFacilities(): Promise<MedicalFacility[]> {
  try {
    // TODO: When live source is available:
    // const facilities = await fetchLiveFacilities();
    // _lastSource = "live";
    // return facilities;

    _lastSource = "mock";
    return MOCK_FACILITIES;
  } catch (err) {
    console.error("[medical-guide] getAllFacilities failed, using mock:", err);
    _lastSource = "mock";
    return MOCK_FACILITIES;
  }
}

/**
 * Get all facilities in a specific town.
 *
 * @param townId - The town ID to filter by.
 * @returns Array of MedicalFacility objects in that town.
 */
export async function getFacilitiesByTown(townId: string): Promise<MedicalFacility[]> {
  const all = await getAllFacilities();
  return all
    .filter((f) => f.townId === townId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get all facilities in a specific category.
 *
 * @param categoryId - The category ID to filter by.
 * @returns Array of MedicalFacility objects in that category.
 */
export async function getFacilitiesByCategory(categoryId: string): Promise<MedicalFacility[]> {
  const all = await getAllFacilities();
  return all
    .filter((f) => f.categoryId === categoryId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a specific facility by ID.
 *
 * @param facilityId - The facility ID to look up.
 * @returns MedicalFacility or undefined if not found.
 */
export async function getFacilityById(facilityId: string): Promise<MedicalFacility | undefined> {
  const all = await getAllFacilities();
  return all.find((f) => f.id === facilityId);
}

/**
 * Search facilities by name (case-insensitive substring match).
 *
 * @param query - The search term.
 * @returns Array of matching MedicalFacility objects.
 */
export async function searchFacilities(query: string): Promise<MedicalFacility[]> {
  const all = await getAllFacilities();
  const lower = query.toLowerCase();
  return all
    .filter((f) => f.name.toLowerCase().includes(lower))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ── Public API: Emergency Contacts ──────────────────────────

/**
 * Get all emergency contacts, sorted by priority.
 * Falls back to mock data if live source is unavailable.
 *
 * @returns Array of EmergencyContact objects, sorted by priority.
 */
export async function getEmergencyContacts(): Promise<EmergencyContact[]> {
  try {
    // TODO: When live source is available:
    // const contacts = await fetchLiveEmergencyContacts();
    // _lastSource = "live";
    // return contacts.sort((a, b) => a.priority - b.priority);

    return MOCK_EMERGENCY_CONTACTS.sort((a, b) => a.priority - b.priority);
  } catch (err) {
    console.error("[medical-guide] getEmergencyContacts failed, using mock:", err);
    return MOCK_EMERGENCY_CONTACTS.sort((a, b) => a.priority - b.priority);
  }
}

/**
 * Get emergency contacts currently available (on-call).
 *
 * @returns Array of available EmergencyContact objects, sorted by priority.
 */
export async function getAvailableEmergencyContacts(): Promise<EmergencyContact[]> {
  const all = await getEmergencyContacts();
  return all.filter((c) => c.available);
}

/**
 * Get a specific emergency contact by ID.
 *
 * @param contactId - The contact ID to look up.
 * @returns EmergencyContact or undefined if not found.
 */
export async function getEmergencyContactById(
  contactId: string
): Promise<EmergencyContact | undefined> {
  const all = await getEmergencyContacts();
  return all.find((c) => c.id === contactId);
}

// ── Public API: Medical PDFs ────────────────────────────────

/**
 * Get all medical guide PDFs available for download.
 * Falls back to mock data if live source is unavailable.
 *
 * @returns Array of MedicalGuidePDF objects.
 */
export async function getMedicalPDFs(): Promise<MedicalGuidePDF[]> {
  try {
    // TODO: When live source is available:
    // const pdfs = await fetchLivePDFs();
    // _lastSource = "live";
    // return pdfs.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());

    return MOCK_PDFS.sort(
      (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    );
  } catch (err) {
    console.error("[medical-guide] getMedicalPDFs failed, using mock:", err);
    return MOCK_PDFS;
  }
}

/**
 * Get medical PDFs by category.
 *
 * @param category - The category to filter by (e.g., "Emergency", "First Aid").
 * @returns Array of matching MedicalGuidePDF objects.
 */
export async function getMedicalPDFsByCategory(category: string): Promise<MedicalGuidePDF[]> {
  const all = await getMedicalPDFs();
  return all
    .filter((p) => p.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
}

/**
 * Get a specific PDF by ID.
 *
 * @param pdfId - The PDF ID to look up.
 * @returns MedicalGuidePDF or undefined if not found.
 */
export async function getMedicalPDFById(pdfId: string): Promise<MedicalGuidePDF | undefined> {
  const all = await getMedicalPDFs();
  return all.find((p) => p.id === pdfId);
}

// ── Combined homepage data ──────────────────────────────────

export interface MedicalGuideSnapshot {
  towns: MedicalTown[];
  categories: MedicalCategory[];
  emergencyContacts: EmergencyContact[];
  pdfs: MedicalGuidePDF[];
  source: "live" | "mock";
}

/**
 * Fetch all medical guide data needed for homepage or initial load.
 * Runs all data fetches in parallel for efficiency.
 *
 * @returns MedicalGuideSnapshot with all guide data.
 */
export async function getMedicalGuideSnapshot(): Promise<MedicalGuideSnapshot> {
  const [towns, categories, emergencyContacts, pdfs] = await Promise.all([
    getMedicalTowns(),
    getMedicalCategories(),
    getEmergencyContacts(),
    getMedicalPDFs(),
  ]);

  return {
    towns,
    categories,
    emergencyContacts,
    pdfs,
    source: _lastSource,
  };
}
