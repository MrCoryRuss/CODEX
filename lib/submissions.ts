/* =============================================================
   lib/submissions.ts
   Community submission handling for events, announcements, and corrections.

   Manages user-submitted content through a moderation workflow:
   - Users submit events, announcements, or medical corrections
   - Submissions go into review queue
   - Moderators approve or reject
   - Approved content is published

   Current behavior: Uses in-memory store with simple state management.
   Future: Integrates with database and email notifications.

   Decision D-014: Community-driven content with moderation.
   ============================================================= */

import type {
  Submission,
  SubmissionType,
  SubmissionStatus,
  EventSubmission,
  AnnouncementSubmission,
  MedicalCorrectionSubmission,
  BaseSubmission,
} from "@/types/submissions";

// ── In-memory submission store ──────────────────────────────

let submissionStore: Map<string, Submission> = new Map();

/**
 * Initialize the submission store.
 *
 * @param initialSubmissions - Initial submissions to populate the store
 */
export function initializeSubmissionStore(initialSubmissions: Submission[] = []): void {
  submissionStore.clear();
  initialSubmissions.forEach((sub) => {
    submissionStore.set(sub.id, sub);
  });
  console.info("[submissions] Initialized submission store", {
    count: initialSubmissions.length,
  });
}

// ── Submit functions ────────────────────────────────────────

/**
 * Submit a new community event for review.
 *
 * @param data - Event submission data
 * @returns The created EventSubmission with ID and status
 */
export function submitEvent(
  data: Omit<EventSubmission, "id" | "submittedAt" | "status" | "type">
): EventSubmission {
  const submission: EventSubmission = {
    ...data,
    type: "event",
    id: generateSubmissionId(),
    submittedAt: new Date(),
    status: "submitted",
  };

  submissionStore.set(submission.id, submission);

  console.info("[submissions] Event submitted", {
    id: submission.id,
    title: submission.title,
    date: submission.date.toISOString().split("T")[0],
  });

  return submission;
}

/**
 * Submit a new community announcement for review.
 *
 * @param data - Announcement submission data
 * @returns The created AnnouncementSubmission with ID and status
 */
export function submitAnnouncement(
  data: Omit<AnnouncementSubmission, "id" | "submittedAt" | "status" | "type">
): AnnouncementSubmission {
  const submission: AnnouncementSubmission = {
    ...data,
    type: "announcement",
    id: generateSubmissionId(),
    submittedAt: new Date(),
    status: "submitted",
  };

  submissionStore.set(submission.id, submission);

  console.info("[submissions] Announcement submitted", {
    id: submission.id,
    level: submission.level,
    textLength: submission.text.length,
  });

  return submission;
}

/**
 * Submit a correction to medical facility information.
 *
 * @param data - Medical correction submission data
 * @returns The created MedicalCorrectionSubmission with ID and status
 */
export function submitMedicalCorrection(
  data: Omit<MedicalCorrectionSubmission, "id" | "submittedAt" | "status" | "type">
): MedicalCorrectionSubmission {
  const submission: MedicalCorrectionSubmission = {
    ...data,
    type: "medical-correction",
    id: generateSubmissionId(),
    submittedAt: new Date(),
    status: "submitted",
  };

  submissionStore.set(submission.id, submission);

  console.info("[submissions] Medical correction submitted", {
    id: submission.id,
    facilityId: submission.facilityId,
    field: submission.field,
  });

  return submission;
}

// ── Retrieval functions ─────────────────────────────────────

/**
 * Get a submission by ID.
 *
 * @param id - The submission ID
 * @returns The Submission, or null if not found
 */
export function getSubmissionById(id: string): Submission | null {
  return submissionStore.get(id) ?? null;
}

/**
 * Get all submissions, optionally filtered by type or status.
 *
 * @param type - Optional: filter by submission type
 * @param status - Optional: filter by submission status
 * @returns Array of matching Submission objects
 */
export function getSubmissions(
  type?: SubmissionType,
  status?: SubmissionStatus
): Submission[] {
  let subs = Array.from(submissionStore.values());

  if (type) {
    subs = subs.filter((s) => s.type === type);
  }

  if (status) {
    subs = subs.filter((s) => s.status === status);
  }

  return subs.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

/**
 * Get submissions by type only.
 *
 * @param type - The submission type to filter by
 * @returns Array of submissions of that type
 */
export function getSubmissionsByType(type: SubmissionType): Submission[] {
  return getSubmissions(type);
}

/**
 * Get submissions by status only.
 *
 * @param status - The submission status to filter by
 * @returns Array of submissions with that status
 */
export function getSubmissionsByStatus(status: SubmissionStatus): Submission[] {
  return getSubmissions(undefined, status);
}

/**
 * Get submissions pending review.
 *
 * @returns Array of submissions awaiting moderation
 */
export function getPendingSubmissions(): Submission[] {
  return getSubmissions(undefined, "submitted");
}

/**
 * Get approved (published) submissions.
 *
 * @returns Array of published submissions
 */
export function getApprovedSubmissions(): Submission[] {
  return getSubmissions(undefined, "published");
}

// ── Moderation functions ────────────────────────────────────

/**
 * Approve a submission and mark it for publishing.
 *
 * @param id - The submission ID to approve
 * @param moderatorNotes - Optional notes from the moderator
 * @returns The updated Submission, or null if not found
 */
export function approveSubmission(id: string, moderatorNotes?: string): Submission | null {
  const sub = submissionStore.get(id);
  if (!sub) {
    return null;
  }

  const updated: Submission = {
    ...sub,
    status: "approved" as const,
    moderationNotes: moderatorNotes,
    updatedAt: new Date(),
  };

  submissionStore.set(id, updated);

  console.info("[submissions] Submission approved", {
    id,
    type: sub.type,
    status: "approved",
  });

  return updated;
}

/**
 * Reject a submission and remove it from consideration.
 *
 * @param id - The submission ID to reject
 * @param reason - Required: reason for rejection
 * @returns The updated Submission, or null if not found
 */
export function rejectSubmission(id: string, reason: string): Submission | null {
  if (!reason || reason.trim().length === 0) {
    console.warn("[submissions] Rejection requires a reason");
    return null;
  }

  const sub = submissionStore.get(id);
  if (!sub) {
    return null;
  }

  const updated: Submission = {
    ...sub,
    status: "rejected" as const,
    moderationNotes: reason,
    updatedAt: new Date(),
  };

  submissionStore.set(id, updated);

  console.info("[submissions] Submission rejected", {
    id,
    type: sub.type,
    reason: reason.slice(0, 50),
  });

  return updated;
}

/**
 * Mark a submission as published.
 *
 * @param id - The submission ID to publish
 * @returns The updated Submission, or null if not found
 */
export function publishSubmission(id: string): Submission | null {
  const sub = submissionStore.get(id);
  if (!sub) {
    return null;
  }

  const updated: Submission = {
    ...sub,
    status: "published" as const,
    updatedAt: new Date(),
  };

  submissionStore.set(id, updated);

  console.info("[submissions] Submission published", {
    id,
    type: sub.type,
  });

  return updated;
}

/**
 * Archive a submission (remove from active view).
 *
 * @param id - The submission ID to archive
 * @returns The updated Submission, or null if not found
 */
export function archiveSubmission(id: string): Submission | null {
  const sub = submissionStore.get(id);
  if (!sub) {
    return null;
  }

  const updated: Submission = {
    ...sub,
    status: "archived" as const,
    updatedAt: new Date(),
  };

  submissionStore.set(id, updated);

  console.info("[submissions] Submission archived", {
    id,
    type: sub.type,
  });

  return updated;
}

// ── Search and analytics ────────────────────────────────────

/**
 * Search submissions by submitter name or email.
 *
 * @param query - Search term
 * @returns Array of matching Submission objects
 */
export function searchBySubmitter(query: string): Submission[] {
  const lower = query.toLowerCase();

  return Array.from(submissionStore.values())
    .filter((s) => s.submittedBy.toLowerCase().includes(lower) || s.email.toLowerCase().includes(lower))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

/**
 * Get submission statistics.
 *
 * @returns Object with counts by type and status
 */
export function getSubmissionStats() {
  const all = Array.from(submissionStore.values());

  const byType: Record<SubmissionType, number> = {
    event: 0,
    announcement: 0,
    "medical-correction": 0,
  };

  const byStatus: Record<SubmissionStatus, number> = {
    draft: 0,
    submitted: 0,
    "under-review": 0,
    approved: 0,
    published: 0,
    rejected: 0,
    archived: 0,
  };

  all.forEach((sub) => {
    byType[sub.type]++;
    byStatus[sub.status]++;
  });

  return {
    total: all.length,
    byType,
    byStatus,
    lastSubmission: all.length > 0 ? all.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0].submittedAt : null,
  };
}

// ── Helper functions ────────────────────────────────────────

/**
 * Generate a unique submission ID.
 *
 * Format: "sub-{timestamp}-{random}".
 *
 * @returns Unique submission ID
 */
function generateSubmissionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `sub-${timestamp}-${random}`;
}
