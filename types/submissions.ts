/**
 * Community submission form types
 * Defines structures for user-submitted events, announcements, and corrections
 */

/**
 * Type of community submission
 */
export type SubmissionType =
  | 'event'
  | 'announcement'
  | 'medical-correction';

/**
 * Status of a submission in the review/approval workflow
 */
export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'archived';

/**
 * Base properties common to all submission types
 */
export interface BaseSubmission {
  /** Unique identifier for the submission */
  id: string;
  /** Type of submission */
  type: SubmissionType;
  /** Name/email of the person submitting */
  submittedBy: string;
  /** Contact email for the submitter */
  email: string;
  /** Timestamp when submission was created */
  submittedAt: Date;
  /** Current status in the approval workflow */
  status: SubmissionStatus;
  /** Optional notes from reviewer/moderator */
  moderationNotes?: string;
  /** Timestamp when submission was last modified */
  updatedAt?: Date;
}

/**
 * Submission for a community event
 */
export interface EventSubmission extends BaseSubmission {
  type: 'event';
  /** Title or name of the event */
  title: string;
  /** Date when the event occurs */
  date: Date;
  /** Start time in HH:MM format (24-hour) */
  startTime: string;
  /** End time in HH:MM format (24-hour), optional */
  endTime?: string;
  /** Location or address where event takes place */
  location: string;
  /** Detailed description of the event */
  description: string;
  /** Category for organizing events (e.g., "Cultural", "Sports", "Meeting", "Festival") */
  category: string;
  /** Optional contact phone for the event organizer */
  organizerPhone?: string;
  /** Optional website or social media link */
  externalLink?: string;
  /** Whether this is a recurring event */
  isRecurring?: boolean;
  /** Recurrence pattern if recurring (e.g., "daily", "weekly", "monthly") */
  recurrencePattern?: string;
}

/**
 * Submission for a community announcement
 */
export interface AnnouncementSubmission extends BaseSubmission {
  type: 'announcement';
  /** Full text of the announcement */
  text: string;
  /** Urgency/importance level of the announcement */
  level: 'low' | 'medium' | 'high' | 'critical';
  /** Timestamp after which announcement should no longer be displayed */
  expiresAt?: Date;
  /** Category for organizing announcements (e.g., "Safety", "Services", "Notice") */
  category?: string;
  /** Hashtags for discoverability */
  tags?: string[];
}

/**
 * Submission for correcting or updating medical facility information
 */
export interface MedicalCorrectionSubmission extends BaseSubmission {
  type: 'medical-correction';
  /** ID of the medical facility being corrected */
  facilityId: string;
  /** The field that needs correction (e.g., "phone", "hours", "address") */
  field: string;
  /** The current/incorrect value */
  currentValue: string;
  /** The suggested correct value */
  suggestedValue: string;
  /** Explanation of why this correction is needed */
  reason: string;
  /** Supporting evidence or documentation URL */
  evidenceUrl?: string;
}

/**
 * Union type representing any submission type
 * Used for handling submissions polymorphically
 */
export type Submission =
  | EventSubmission
  | AnnouncementSubmission
  | MedicalCorrectionSubmission;
