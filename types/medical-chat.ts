/**
 * Medical Guide Chatbot types for RAG-based conversational interface
 * Defines structures for chat messaging, source tracking, and sessions
 */

/**
 * Role type for chat participants
 */
export type ChatRole = 'user' | 'assistant';

/**
 * Individual message in a chat conversation
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Role of the message sender */
  role: ChatRole;
  /** Message content text */
  content: string;
  /** Timestamp when message was created */
  timestamp: Date;
  /** Sources referenced in assistant responses (optional, only populated for assistant messages) */
  sources?: ChatSource[];
}

/**
 * Source document chunk referenced in a chat response
 * Used for RAG (Retrieval Augmented Generation) transparency
 */
export interface ChatSource {
  /** Unique identifier for the content chunk in the source system */
  chunkId: string;
  /** Title or name of the source document */
  title: string;
  /** Page number where the information appears */
  page: number;
  /** Relevance score from RAG retrieval (0.0 to 1.0) */
  relevanceScore: number;
  /** Brief preview of the chunk content */
  preview?: string;
}

/**
 * Represents a conversation session with a user
 */
export interface ChatSession {
  /** Unique identifier for the session */
  id: string;
  /** All messages in the conversation chronologically ordered */
  messages: ChatMessage[];
  /** When the session was created */
  createdAt: Date;
  /** When the session was last active */
  lastMessageAt?: Date;
  /** Optional user identifier for multi-user systems */
  userId?: string;
  /** Session title or topic (auto-generated from first message) */
  title?: string;
  /** Whether this session is archived */
  isArchived?: boolean;
}

/**
 * Request structure for sending a message to the medical chatbot
 */
export interface ChatRequest {
  /** The user's message text */
  message: string;
  /** Existing session ID to continue conversation (optional) */
  sessionId?: string;
  /** Optional context or metadata about the user */
  context?: {
    location?: string;
    emergencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
}

/**
 * Response structure from the medical chatbot
 */
export interface ChatResponse {
  /** The assistant's response message */
  message: string;
  /** Source documents used to generate the response */
  sources: ChatSource[];
  /** Session ID for follow-up messages */
  sessionId: string;
  /** Confidence level of the response (0.0 to 1.0) */
  confidence?: number;
  /** Whether this response should trigger escalation to human (for critical queries) */
  requiresEscalation?: boolean;
  /** Reason for escalation, if applicable */
  escalationReason?: string;
}
