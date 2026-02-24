import { z } from "zod";

/**
 * Payload for a single transactional / bulk email delivered via AWS SES.
 *
 * This schema is the shared contract between:
 *  - the enqueue client (apps/messaging/src/client)
 *  - the tRPC sesEmail router (packages/api/src/routers/sesEmail)
 *  - the Lambda consumer (apps/messaging/src/lambda/consumer)
 */
export const EmailJobSchema = z.object({
  /** Recipient email address */
  to: z.email(),

  /**
   * Sender address. Must be a verified SES identity.
   * Defaults to SES_FROM_ADDRESS env var when omitted.
   */
  from: z.email().optional(),

  /** Email subject line */
  subject: z.string().min(1).max(998),

  /** HTML body (required) */
  html: z.string().min(1),

  /** Plain-text fallback (recommended for deliverability) */
  text: z.string().optional(),

  /** Reply-To address */
  replyTo: z.email().optional(),

  /**
   * Custom idempotency key. When omitted the SQS messageId is used.
   * Provide a stable business key (e.g. "invoice-123-payment-reminder")
   * to survive queue re-drives without duplicate sends.
   */
  idempotencyKey: z.string().max(512).optional(),

  /**
   * Arbitrary key/value tags forwarded to SES for cost allocation
   * and CloudWatch Insights filtering.
   */
  tags: z.record(z.string(), z.string()).optional(),
});

export type EmailJob = z.infer<typeof EmailJobSchema>;

/**
 * Batch input validated by the enqueue client / tRPC router.
 * SQS SendMessageBatch supports up to 10 messages per call;
 * the client handles chunking automatically.
 */
export const EmailJobBatchSchema = z.object({
  jobs: z.array(EmailJobSchema).min(1).max(500),
});

export type EmailJobBatch = z.infer<typeof EmailJobBatchSchema>;

/**
 * Broadcast: one email template sent individually to many recipients.
 *
 * Each recipient receives a separate SES send (not CC/BCC), so their inbox
 * shows it as if it were addressed only to them.
 *
 * A stable `broadcastId` is required to build per-recipient idempotency keys
 * (`${broadcastId}::${email}`), ensuring that a re-drive of the SQS queue
 * never sends the same broadcast twice to the same person.
 */
export const BroadcastEmailSchema = z.object({
  /**
   * Stable, unique identifier for this broadcast.
   * Use a business key (e.g. "fee-reminder-2025-q2") or a UUID generated
   * once before calling the API. Re-using the same broadcastId is safe —
   * duplicates are suppressed via DynamoDB idempotency.
   */
  broadcastId: z.string().min(1).max(200),

  /** Recipient email addresses. Each gets an individual send. */
  recipients: z.array(z.email()).min(1).max(10_000),

  /**
   * Sender address. Must be a verified SES identity.
   * Defaults to SES_FROM_ADDRESS env var when omitted.
   */
  from: z.email().optional(),

  /** Email subject line (same for every recipient) */
  subject: z.string().min(1).max(998),

  /** HTML body (same for every recipient) */
  html: z.string().min(1),

  /** Plain-text fallback (recommended for deliverability) */
  text: z.string().optional(),

  /** Reply-To address */
  replyTo: z.email().optional(),

  /**
   * SES tags forwarded to every individual send.
   * Useful for cost allocation and CloudWatch Insights filtering.
   */
  tags: z.record(z.string(), z.string()).optional(),
});

export type BroadcastEmail = z.infer<typeof BroadcastEmailSchema>;
