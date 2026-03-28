# Admin Workflows: Community Submissions & Moderation

## Overview

Posada Underground accepts community submissions (events, announcements, medical corrections) through a unified form, routes them to a moderation queue, and publishes approved content. This doc covers the submission flow, approval process, and admin tooling.

## Submission Types

### 1. Event Submissions

**Form:** `components/forms/event-submission-form.tsx`

**Fields:**
- Event name (required)
- Category: Sports / Community (required)
- Date & time start/end (required)
- Location (required)
- Description (optional, max 500 chars)
- Contact person name (required)
- Contact email or phone (required)
- Recurring? (weekly, monthly, once)

**Destination:** Google Calendar (if approved)
- Sports events → "Posada Sports" calendar
- Community events → "Posada Community" calendar

### 2. Announcements

**Form:** `components/forms/announcement-submission-form.tsx`

**Fields:**
- Title (required, max 100 chars)
- Category: Medical / Service / Social / Market (required)
- Body text (required, max 1000 chars)
- Image URL (optional)
- Valid until date (optional)
- Contact person (required)
- Contact email or phone (required)

**Destination:** Announcements carousel on homepage and `/announcements` page

### 3. Medical Corrections

**Form:** `components/forms/medical-correction-form.tsx`

**Fields:**
- Facility/contact name (required)
- Current info (what's wrong)
- Corrected info (what should be there)
- Source of correction (personal visit, phone call, website)
- Submitter name (required)
- Submitter email (required)

**Destination:** Medical guide data update queue

## Submission Flow

```
User fills form → Validation → Database insert → Email notification
                                      ↓
                              Moderation queue
                                      ↓
                         Admin reviews in dashboard
                                      ↓
                          Approve or Reject decision
                                      ↓
                            [Approved]    [Rejected]
                               ↓               ↓
                         Add to source    Delete submission
                         (Calendar,       Send rejection
                          Announcements)  email to submitter
                               ↓
                           Publish live
```

## Backend Implementation

**lib/submissions.ts**

```typescript
interface Submission {
  id: string;
  type: "event" | "announcement" | "medical-correction";
  status: "pending" | "approved" | "rejected";
  data: Record<string, any>; // Type-specific fields
  submittedAt: string;
  submittedBy: { name: string; email: string };
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}
```

**Storage:** Supabase or Firebase (real-time updates for moderation dashboard)

**API Routes:**
- `POST /api/submissions` - Accept form submission
- `GET /api/submissions?type=event&status=pending` - List pending (admin)
- `POST /api/submissions/[id]/approve` - Approve submission
- `POST /api/submissions/[id]/reject` - Reject with reason

### API Handler: POST /api/submissions

```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();

  // 1. Validate against submission type schema
  const { type, data } = body;
  validateSubmission(type, data);

  // 2. Spam checks (optional)
  checkForSpam(data);

  // 3. Insert into submissions table
  const submission = await db.submissions.create({
    type,
    data,
    status: "pending",
    submittedAt: new Date(),
    submittedBy: { name: data.contactName, email: data.contactEmail },
  });

  // 4. Send confirmation email to submitter
  await sendEmail({
    to: data.contactEmail,
    template: "submission-received",
    variables: { submissionType: type, submissionId: submission.id }
  });

  // 5. Notify admins (Slack or email)
  await notifyAdmins(submission);

  return NextResponse.json({ id: submission.id, status: "received" });
}
```

## Moderation Dashboard

**Page:** `/admin/submissions` (protected by auth)

**View:**
- List of pending submissions (sortable by date, type)
- Preview of submission data
- Approve / Reject buttons with optional reason field
- Search & filter: type, date range, submitter email
- Bulk actions: approve multiple, mark spam

**Features:**
- Real-time sync with Supabase
- Audit trail: who approved/rejected and when
- Rejection email templates (customizable per reason)

## Publishing Workflow

### For Events
1. Admin approves event submission
2. System adds event to Google Calendar (via API)
3. Triggers calendar sync (next fetch pulls it in)
4. Event appears on `/sports` or `/events`, homepage cards

### For Announcements
1. Admin approves announcement
2. System inserts into announcements table
3. Next homepage refresh (ISR revalidate) picks it up
4. Displayed in carousel for duration of "valid until" date

### For Medical Corrections
1. Admin reviews correction against current medical guide data
2. If valid: admin updates source document (spreadsheet, database, or manual PDF)
3. Next medical guide page revalidate pulls updated data
4. Submitter receives thank-you email with confirmation

## Notifications

**Email templates:**
- **Submission received** - Confirm form was received, give reference ID
- **Approved** - Your submission was approved and is now live (with link)
- **Rejected** - Your submission was not approved (reason + guidelines)

**Admin alerts (Slack or email):**
- New submission pending review
- Submission older than 24 hours without action
- Spam patterns detected (multiple submissions same email, etc.)

## Constraints & Rules

1. **Event names:** Must include activity name (e.g., "Pickleball" not just "Game") for auto-categorization
2. **Announcements:** Must be community-focused (no commercial ads, real estate, spam)
3. **Medical corrections:** Must include source (personal visit, verified phone call, etc.)
4. **Rate limits:** 5 submissions per IP per day (prevent spam)
5. **Content review:** Admins can flag for inappropriate language or off-topic content

## Admin Approval Checklist

### Events
- [ ] Event name includes activity type
- [ ] Date/time is reasonable (not far in past)
- [ ] Location is clear
- [ ] Contact info is valid
- [ ] Not a duplicate (check calendar)

### Announcements
- [ ] Title is descriptive
- [ ] Content is community-focused (not spam)
- [ ] No personal attacks or controversial content
- [ ] Image (if provided) is community-appropriate
- [ ] Valid until date is reasonable

### Medical Corrections
- [ ] Correction has credible source
- [ ] Information matches submitter's description
- [ ] Phone number format is valid (Mexico code +52)
- [ ] Hours/address are plausible

## Future Enhancements

1. **Community voting:** Low-visibility submissions auto-approve after 5 upvotes
2. **Recurring events:** Auto-populate calendar instances for recurring submissions
3. **Webhook integrations:** Push approved events to external calendars (Outlook, etc.)
4. **Analytics:** Track which submission types get approved/rejected most
5. **Moderation queue assignment:** Route submissions to specific admins by type
6. **Attachment support:** Allow submitters to upload images for events/announcements
