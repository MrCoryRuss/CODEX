# Feature: Chatbot - Retrieval-Augmented Generation (RAG)

## Architecture Overview

The Posada Medical Guide chatbot uses a Retrieval-Augmented Generation (RAG) pipeline to answer visitor and resident questions accurately by grounding responses in curated medical documents. The flow:

1. **Ingest:** PDF documents are split into semantic chunks
2. **Chunk:** Each chunk is embedded into vector space
3. **Retrieve:** User query is embedded and matched against chunk embeddings
4. **Answer:** Claude API generates response using retrieved chunks as context

## Pipeline Components

### 1. Ingestion (`lib/medical-guide-ingest.ts`)

Reads PDF files and extracts text:
```typescript
interface RawDocument {
  id: string;
  title: string;
  filePath: string;
  extractedText: string;
}
```

**Process:**
- Use PDF parsing library (pdfjs-dist or similar) to extract text
- Preserve page breaks and structure hints
- Store raw text for later chunking

### 2. Chunking (`lib/medical-guide-chunks.ts`)

Splits documents into semantic units:
```typescript
interface Chunk {
  id: string;
  documentId: string;
  title: string;
  page: number;
  text: string;
  tokens: number;
  embedding?: number[]; // 1536-dim for Claude embeddings
}
```

**Strategy:**
- Target chunk size: 300-500 tokens (typical paragraph)
- Overlap: 100 tokens between chunks (preserve context)
- Split at sentence boundaries, not mid-word
- Preserve metadata (document title, page number)

### 3. Embedding & Storage

**Embedding model:** Anthropic Claude API embeddings (1536 dimensions)

**Vector store:** In-memory map (current) → Future: Pinecone, Weaviate, or self-hosted vector DB

```typescript
interface EmbeddingStore {
  [chunkId: string]: {
    embedding: number[];
    chunk: Chunk;
  };
}
```

### 4. Retrieval (`lib/medical-guide-retrieval.ts`)

```typescript
async function searchChunks(
  query: string,
  options?: {
    maxResults?: number;
    minScore?: number;
  }
): Promise<Chunk[]>
```

**Process:**
1. Embed user query using Claude embeddings API
2. Compute cosine similarity against all chunk embeddings
3. Sort by relevance score
4. Return top N results above minScore threshold
5. Filter duplicates by document ID (max 1 chunk per doc)

### 5. Answer Generation (`lib/medical-guide-answer.ts`)

```typescript
async function generateAnswer(
  query: string,
  chunks: Chunk[]
): Promise<{ text: string; sources: Chunk[] }>
```

**System Prompt:**
```
You are a medical guide assistant for Posada Concepción, Baja California Sur.
Answer questions about medical facilities, emergency services, and health information.
Use ONLY the provided document chunks as your knowledge base.
If a question cannot be answered from the documents, say so clearly.
Always cite your sources by mentioning the document title and page number.
Keep responses concise (under 150 words) and conversational.
```

**Implementation:**
- Concatenate top 5 chunks with clear separators
- Include source attribution headers
- Set temperature to 0.7 (balance accuracy + natural tone)
- Max tokens: 500

### 6. Chat API Endpoint

**Route:** `POST /api/medical-guide-chat`

**Request:**
```json
{
  "message": "Where's the nearest clinic?",
  "conversationHistory": [
    { "role": "user", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "response": "The nearest clinic is...",
  "sources": [
    {
      "id": "chunk-001",
      "title": "Facility Directory",
      "page": 1,
      "preview": "text excerpt...",
      "relevanceScore": 0.92
    }
  ],
  "timestamp": "2026-03-28T...",
  "model": "claude-3-5-sonnet"
}
```

## Safety & Guardrails

1. **Medical Disclaimer:** System prompt includes:
   > "I provide information from local medical guides, not medical advice. Always consult a doctor for health concerns."

2. **Scope Limiting:**
   - Only answers questions relevant to the medical guide content
   - Refuses to diagnose or prescribe
   - Redirects emergencies to 911

3. **Rate Limiting:**
   - Max 10 messages per IP per minute
   - Prevent abuse of Claude API quota

4. **Input Validation:**
   - Strip HTML/markdown injection attempts
   - Max query length: 1000 characters
   - Reject non-text content

## Data Files

- **PDFs:** `/public/pdfs/*.pdf`
- **Chunks cache:** `/data/chunks.json` (generated at build time)
- **Embeddings:** In-memory or external vector store
- **Fallback mock:** `/data/mock-chat-context.ts`

## Development & Testing

**Local testing without APIs:**
```bash
MOCK_CHAT=true npm run dev  # Uses mock responses
OPENAI_API_KEY=sk_test_... npm run dev  # Real API
```

**Embedding generation (one-time):**
```bash
npm run generate:embeddings
```

This rebuilds chunk embeddings from PDF source. Run when:
- Adding new medical guide PDFs
- Updating chunking strategy
- Retraining on new data

## Performance Characteristics

| Operation | Latency | Notes |
|-----------|---------|-------|
| Query embedding | 100ms | Claude Embed API |
| Semantic search | 50-100ms | In-memory vector ops |
| Answer generation | 2-4s | Claude API streaming |
| **Total P95** | **4-5s** | End-to-end response |

## Decision References

- **D-005:** Claude API for chatbot
- **D-010:** Safety guardrails for medical content

## Future Enhancements

1. **Persistent vector store:** Move from in-memory to Pinecone or Supabase pgvector
2. **Multi-document chat:** Support conversation history across sessions
3. **Streaming responses:** Implement Server-Sent Events for real-time answer streaming
4. **Feedback loop:** Collect user feedback on answer quality for fine-tuning
5. **Specialized models:** Fine-tune Claude on Posada medical corpus
6. **Multilingual:** Add Spanish language support with translated chunks
