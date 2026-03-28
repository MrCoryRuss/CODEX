/**
 * Mock parsed medical guide content for Posada Underground
 * Simulates RAG pipeline output from ingesting medical guide PDFs
 * Represents sections extracted and parsed from the medical guides
 */

export interface ParsedGuideSection {
  id: string;
  title: string;
  content: string;
  pageNumber: number;
  category: string;
  sourceDocument: string;
}

/**
 * Simulated parsed sections from the off-grid medical guide PDF
 * This is what the RAG ingest pipeline would produce for vector search
 */
export const MOCK_PARSED_SECTIONS: ParsedGuideSection[] = [
  {
    id: 'section-001',
    title: 'Dehydration in Hot Climates: Recognition and Treatment',
    content: `Dehydration is one of the most common medical emergencies in remote desert communities. Posada's climate, with temperatures often exceeding 35°C (95°F) and low humidity, creates significant dehydration risk. Early signs include excessive thirst, dark urine, dizziness, and headache. Mild dehydration can be treated by consuming water slowly with electrolytes (salt and sugar). Severe dehydration presents with confusion, rapid weak pulse, and sunken eyes—this requires immediate evacuation. For prevention: drink 2-3 liters of water daily in hot months, avoid alcohol and caffeine which accelerate fluid loss, and maintain consistent electrolyte intake. For off-grid residents, prepare electrolyte solution (ORS) by mixing 6 teaspoons sugar and 1/2 teaspoon salt in 1 liter of water. Keep supplies of oral rehydration salts on hand.`,
    pageNumber: 8,
    category: 'Environmental Emergencies',
    sourceDocument: 'Off-Grid Medical Guide for Baja California',
  },
  {
    id: 'section-002',
    title: 'Wound Care Without Modern Facilities',
    content: `In remote settings where infection risk is high and medical care is distant, proper wound care is critical. For cuts and lacerations: Stop bleeding by applying direct pressure with clean cloth for 5-10 minutes. Wash wound thoroughly with clean water and mild soap. Remove embedded dirt or debris using tweezers sterilized with fire or alcohol. Do not close deep wounds yourself—risk of infection is too high. Instead, clean extensively and keep open to air. Apply antibiotic ointment if available. Cover with sterile gauze. Change dressing daily and watch for signs of infection: increasing pain after 48 hours, redness spreading beyond the wound, pus, fever, or red streaks up the limb. For puncture wounds (especially from marine/fishing sources): Allow wound to bleed freely for 30 seconds to flush bacteria, then soak in hot saltwater (as hot as tolerated) for 20 minutes. Apply antibiotic ointment. Tetanus protection is important—seek tetanus update at Mulegé clinic if unsure of last dose. Any sign of infection requires evacuation.`,
    pageNumber: 12,
    category: 'Trauma and Injury',
    sourceDocument: 'Off-Grid Medical Guide for Baja California',
  },
  {
    id: 'section-003',
    title: 'Heat Exhaustion vs. Heat Stroke: Critical Distinction',
    content: `Heat exhaustion and heat stroke are distinct emergencies requiring different responses. Heat exhaustion occurs when the body is overwhelmed by external heat and excessive sweating. Signs include heavy sweating, weakness, nausea, normal or slightly elevated body temperature (up to 39°C/102°F), and a feeling of malaise. Treatment: Move person to shade or cool location, have them drink cool water with electrolytes, and apply cool water to skin. Recovery typically occurs within 30 minutes. Heat stroke is a medical emergency where the body's temperature regulation fails. Signs include cessation of sweating despite high heat, elevated body temperature (above 40°C/104°F), confusion, irritability, possible loss of consciousness. This is a true emergency requiring immediate evacuation and rapid cooling during transport. Apply ice packs or cold water to neck, armpits, and groin (areas with major blood vessels). Do not delay—call 911/CRUM immediately. Prevention for both: limit outdoor activity during peak heat (11am-4pm), drink water consistently throughout the day, wear light-colored loose clothing, and take frequent breaks in shade.`,
    pageNumber: 15,
    category: 'Environmental Emergencies',
    sourceDocument: 'Off-Grid Medical Guide for Baja California',
  },
  {
    id: 'section-004',
    title: 'Respiratory Issues and Altitude Sickness in Coastal Communities',
    content: `While Posada is at sea level, respiratory problems are common due to dust, salt spray, and seasonal pollution. Asthma and chronic bronchitis may worsen during windy seasons when dust storms occur. For asthma management: Always maintain a rescue inhaler on hand (albuterol/salbutamol). Know how to use it correctly—2 puffs, hold breath for 5-10 seconds. If symptoms don't improve within 20 minutes, use nebulizer if available or seek evacuation. For chronic bronchitis: avoid smoke and dust exposure, maintain hydration, use humidifiers or saline nasal irrigation. Sudden dyspnea (shortness of breath) in someone without asthma history may indicate pneumonia, pulmonary embolism, or cardiac issue—these are emergencies. Warning signs: rapid pulse, fever, chest pain, or difficulty speaking warrant evacuation. Interestingly, visitors coming from sea level rarely experience altitude issues, but residents traveling to higher elevations (rare in Baja) should be aware of acute mountain sickness: headache, nausea, fatigue at elevations above 2500m. Not relevant locally but important for travel guidance.`,
    pageNumber: 22,
    category: 'Medical Conditions',
    sourceDocument: 'Off-Grid Medical Guide for Baja California',
  },
  {
    id: 'section-005',
    title: 'Common Over-the-Counter Medications Available at Local Pharmacies',
    content: `Mexican pharmacies are well-stocked and accessible without prescription for most common medications. Understand local naming differences: Acetaminophen is "paracetamol," ibuprofen may be "Actron" or "Advil," and aspirin is commonly available. For pain relief: Paracetamol (Tylenol) up to 3g daily in divided doses, or ibuprofen (Advil) up to 2g daily. For stomach issues: Omeprazole (for acid reflux), bismuth subsalicylate (Pepto Bismol equivalent), or antacids like Tums are available. Antibiotics requiring prescription: Amoxicillin and azithromycin for bacterial infections. For colds/allergies: Loratadine, cetirizine available OTC. Many Baja residents and expats use pharmacy staff (often trained pharmacy techs) for medical advice—this can be helpful but remember they are not doctors. Always state your symptoms clearly and ask about drug interactions if taking multiple medications. Keep a supply of basic medications at home: pain reliever, antacid, antihistamine, antibiotic ointment, hydrocortisone cream, and anti-diarrheal medication. Request drug information sheets when purchasing unfamiliar medications.`,
    pageNumber: 28,
    category: 'Medications',
    sourceDocument: 'Off-Grid Medical Guide for Baja California',
  },
  {
    id: 'section-006',
    title: 'When to Arrange Medical Evacuation and Transportation Options',
    content: `Not all medical issues require immediate evacuation, but some do. Evacuate immediately (call 911 and Juan Carlos) for: severe trauma, uncontrolled bleeding, signs of stroke or heart attack, severe difficulty breathing, unconsciousness, or seizures. Evacuate urgently (within 2-4 hours) for: suspected serious infections with fever and altered mental status, chest pain without clear cause, severe abdominal pain, possible broken bones, severe allergic reactions, or acute vision loss. Non-urgent evacuation can be scheduled for: chronic condition follow-up, elective procedures, or ongoing investigations. Transportation options: Local boat to Mulegé (45 minutes, rough seas possible, not suitable for unstable patients); Road to Mulegé via rough dirt roads (50-90 minutes depending on vehicle and road condition); Air ambulance from Loreto or La Paz (1-2 hour response, expensive but fast—around $3000-5000 USD). CRUM ambulance from Mulegé is fastest reliable option for urgent cases. Have evacuation insurance or family resources ready—Mexican hospitals require payment upfront. Discuss evacuation scenarios with family and ensure someone knows your preferences and insurance status.`,
    pageNumber: 35,
    category: 'Emergency Response',
    sourceDocument: 'Off-Grid Medical Guide for Baja California',
  },
];
