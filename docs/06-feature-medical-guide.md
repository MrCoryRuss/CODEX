# Feature: Medical Guide

## Overview

Curated medical facilities, emergency contacts, and health reference materials for Posada Concepción and surrounding towns (Loreto, Mulege, La Paz). Includes emergency contact list, facility directory searchable by service type, and AI-powered chatbot for answering visitor questions.

## Components

### 1. Facility Directory

**Data structure:**
```typescript
interface MedicalTown {
  id: string;
  name: string;
  distanceKm: number;
  facilities: MedicalFacility[];
}

interface MedicalFacility {
  id: string;
  name: string;
  type: "clinic" | "hospital" | "pharmacy" | "dental" | "veterinary";
  address: string;
  phone: string;
  hours?: string;
  acceptsInsurance: boolean;
  languages: string[];
}
```

**Data source:** `/data/mock-medical-guide.ts` (currently mock, wired for live API swap)

**Pages:**
- `/medical-guide` - Browse facilities by town and service category
- `/medical-guide/viewer?id=PDFID` - View medical guide PDF documents

### 2. Emergency Contacts

Critical numbers and after-hours services:
- **Posada emergency:** Local radio frequency, contact names
- **Loreto hospital:** IMSS (Instituto Mexicano del Seguro Social)
- **Red Cross:** Cruz Roja ambulance service
- **Pharmacy:** 24-hour pharmacy locations
- **DAN (Divers Alert Network):** For diving emergencies

**Page:** `/emergency-contacts`

**Data source:** `/data/mock-emergency-contacts.ts`

### 3. PDF Viewer & Documents

Medical guides as uploadable PDFs (First Aid, Common Conditions, etc.):
- Embedded viewer with page navigation
- Download fallback for unsupported browsers
- Searchable via sidebar on main guide page

**Storage:** `/public/pdfs/` directory

### 4. AI Chatbot (RAG Pipeline)

"Ask the Medical Guide" chatbot at `/ask-the-medical-guide`:
- Retrieves relevant medical information from PDFs using semantic search
- Generates context-aware answers via Claude API
- Shows source attribution for transparency
- Handles common questions: "Where's a doctor?", "Cost of treatment?", "Insurance?", etc.

**Architecture:**
```
Medical PDFs → Chunk & Embed → Vector Store → Search → Claude API → Response + Sources
```

## Implementation Files

**lib/medical-guide.ts**
- `getMedicalTowns()` - All towns with facilities, sorted by distance
- `getMedicalCategories()` - Service types (clinic, pharmacy, etc.)
- `getMedicalPDFs()` - Available reference documents
- `getEmergencyContacts()` - Critical contact numbers
- `getMedicalGuideSource()` - Returns "live" or "mock"

**lib/medical-guide-retrieval.ts**
- `searchChunks(query, options)` - Semantic search over medical PDF content
- `getChunkById(id)` - Retrieve specific chunk with full text

**lib/medical-guide-answer.ts**
- `generateAnswer(query, chunks)` - Claude API call with context, streaming support

**app/api/medical-guide-chat/route.ts**
- POST handler for chat messages
- Calls retrieval pipeline, returns answer + sources

## UI Components

**components/medical/**
- `MedicalGuideHero` - Hero with search CTA
- `TownGrid` - Browse facilities by location
- `CategoryGrid` - Browse by service type
- `PdfViewerCard` - Card linking to PDF viewer
- `EmergencyHero` - Hero for emergency contacts page
- `EmergencyContactList` - Formatted critical numbers
- `ChatShell` - Chat UI wrapper with message history
- `ChatInput` - Text input with send button
- `ChatMessage` - Individual message with source links

## Data Flow

```
User visits /medical-guide
  ↓
  getMedicalTowns() + getMedicalCategories() + getMedicalPDFs()
  ↓
  Render TownGrid, CategoryGrid, PdfViewerCard components
  ↓
  User clicks "Ask the Medical Guide"
  ↓
  POST /api/medical-guide-chat { message: "..." }
  ↓
  searchChunks(message) → retrieve top 5 relevant chunks
  ↓
  generateAnswer(message, chunks) → Claude API
  ↓
  Return response + source attribution
```

## Decision References

- **D-011:** Community-maintained medical guide approach
- **D-005:** Claude API for chatbot
- **Data sources section:** Facility and contact data strategy

## Fallback & Error Handling

- No live data source? Uses mock data, page still renders
- PDF viewer fails? Shows download link
- Claude API timeout? Returns generic message + retry suggestion
- Bad search query? Returns helpful clarification prompt

## Future Enhancements

1. **Live facility data:** Connect to medical database or spreadsheet API
2. **Insurance verification:** Integration with IMSS patient lookup
3. **Appointment booking:** Links to online scheduling if available
4. **Translation:** Spanish-language version of all content
5. **Specialist finder:** Filter by specialties (pediatrics, cardiology, etc.)
6. **Cost lookup:** Common procedure costs at each facility
