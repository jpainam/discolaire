import {
  SQSClient,
  SendMessageBatchCommand,
  type SendMessageBatchRequestEntry,
} from "@aws-sdk/client-sqs";
import { randomUUID } from "crypto";

import {
  EmailJobSchema,
  BroadcastEmailSchema,
  type EmailJob,
  type BroadcastEmail,
} from "../schemas";

// ─── Email validation ─────────────────────────────────────────────────────────

const BLOCKED_DOMAINS = new Set([
  "example.com", "example.org", "example.net",
  "test.com", "localhost",
]);

function isValidEmail(email: string): boolean {
  if (!email.includes("@")) return false;
  const [, domain] = email.split("@");
  if (!domain || BLOCKED_DOMAINS.has(domain.toLowerCase())) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── SQS client ───────────────────────────────────────────────────────────────

let _sqs: SQSClient | null = null;
function getSQSClient(): SQSClient {
  if (!_sqs) {
    _sqs = new SQSClient({ region: process.env.AWS_REGION ?? "us-east-1" });
  }
  return _sqs;
}

function getQueueUrl(): string {
  const url = process.env.SQS_EMAIL_QUEUE_URL;
  if (!url) {
    throw new Error(
      "SQS_EMAIL_QUEUE_URL is not set. " +
        "Set it to the queue URL output by `pnpm cdk:deploy` in apps/messaging.",
    );
  }
  return url;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EnqueueResult {
  /** SQS MessageId for each successfully enqueued job */
  messageIds: string[];
  /** Jobs that SQS rejected (rare; typically a payload size issue) */
  failed: Array<{ job: EmailJob; code: string; message: string }>;
}

export interface BroadcastResult {
  /** Total recipients successfully enqueued */
  enqueuedCount: number;
  /** Recipients that SQS rejected */
  failedCount: number;
  /** Addresses that failed to enqueue */
  failedRecipients: string[];
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Send one batch of up to 10 jobs to SQS (hard AWS limit per BatchSend call).
 */
async function sendSQSBatch(
  sqs: SQSClient,
  queueUrl: string,
  jobs: EmailJob[],
): Promise<{ messageIds: string[]; failed: EnqueueResult["failed"] }> {
  const entries: SendMessageBatchRequestEntry[] = jobs.map((job) => ({
    Id: randomUUID().replace(/-/g, ""),
    MessageBody: JSON.stringify(job),
    ...(job.idempotencyKey && {
      MessageAttributes: {
        idempotencyKey: {
          DataType: "String",
          StringValue: job.idempotencyKey,
        },
      },
    }),
  }));

  const response = await sqs.send(
    new SendMessageBatchCommand({ QueueUrl: queueUrl, Entries: entries }),
  );

  const messageIds: string[] = [];
  const failed: EnqueueResult["failed"] = [];

  for (const success of response.Successful ?? []) {
    messageIds.push(success.MessageId ?? "");
  }

  for (const failure of response.Failed ?? []) {
    const originalIndex = entries.findIndex((e) => e.Id === failure.Id);
    const job = jobs[originalIndex];
    if (job) {
      failed.push({
        job,
        code: failure.Code ?? "Unknown",
        message: failure.Message ?? "",
      });
    }
  }

  return { messageIds, failed };
}

/**
 * Split `jobs` into chunks of `size` and run up to `concurrency` chunks in
 * parallel. This keeps throughput high (10k recipients ≈ 2 s) without
 * overwhelming SQS or blowing Lambda memory.
 */
async function sendAllBatches(
  sqs: SQSClient,
  queueUrl: string,
  jobs: EmailJob[],
  { batchSize = 10, concurrency = 5 } = {},
): Promise<EnqueueResult> {
  const chunks: EmailJob[][] = [];
  for (let i = 0; i < jobs.length; i += batchSize) {
    chunks.push(jobs.slice(i, i + batchSize));
  }

  const allMessageIds: string[] = [];
  const allFailed: EnqueueResult["failed"] = [];

  for (let i = 0; i < chunks.length; i += concurrency) {
    const window = chunks.slice(i, i + concurrency);
    const results = await Promise.all(
      window.map((chunk) => sendSQSBatch(sqs, queueUrl, chunk)),
    );
    for (const r of results) {
      allMessageIds.push(...r.messageIds);
      allFailed.push(...r.failed);
    }
  }

  return { messageIds: allMessageIds, failed: allFailed };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Validate and enqueue one or more individual email jobs onto the SQS queue.
 *
 * Use this when each job already has its own `to`, `subject`, `html`, etc.
 * For sending the same email to many recipients, use `broadcastEmail` instead.
 *
 * - Validates every job with Zod before sending (throws on validation failure).
 * - Batches messages in groups of 10 (SQS limit), up to 5 batches concurrently.
 * - Returns the list of SQS MessageIds on success.
 *
 * @example
 * ```ts
 * const { messageIds } = await enqueueEmailJobs([{
 *   to: "parent@example.com",
 *   subject: "Fee reminder",
 *   html: "<p>Your invoice is due.</p>",
 * }]);
 * ```
 */
export async function enqueueEmailJobs(
  jobs: EmailJob[],
): Promise<EnqueueResult> {
  if (jobs.length === 0) return { messageIds: [], failed: [] };

  const filtered = jobs.filter((job) => isValidEmail(job.to));
  const skipped = jobs.length - filtered.length;
  if (skipped > 0) {
    console.warn(`[enqueueEmailJobs] Skipped ${skipped} job(s) with invalid/blocked email address.`);
  }
  if (filtered.length === 0) return { messageIds: [], failed: [] };

  const validated = filtered.map((job, i) => {
    const result = EmailJobSchema.safeParse(job);
    if (!result.success) {
      throw new Error(
        `Invalid EmailJob at index ${i}: ${result.error.message}`,
      );
    }
    return result.data;
  });

  const sqs = getSQSClient();
  const queueUrl = getQueueUrl();
  return sendAllBatches(sqs, queueUrl, validated);
}

/**
 * Send the same email to many recipients, each as an individual SES send.
 *
 * Recipients see the email as if it were addressed only to them — no CC/BCC.
 * Per-recipient idempotency keys (`${broadcastId}::${email}`) guarantee that
 * re-driving the SQS queue never produces duplicate sends.
 *
 * @example
 * ```ts
 * const result = await broadcastEmail({
 *   broadcastId: "fee-reminder-2025-q2",
 *   recipients: ["alice@example.com", "bob@example.com"],
 *   subject: "Your fee is due",
 *   html: "<p>Please pay by Jan 31.</p>",
 *   text: "Please pay by Jan 31.",
 *   tags: { type: "fee-reminder", term: "q2-2025" },
 * });
 * console.log(`Enqueued: ${result.enqueuedCount}, Failed: ${result.failedCount}`);
 * ```
 */
export async function broadcastEmail(
  input: BroadcastEmail,
): Promise<BroadcastResult> {
  const parsed = BroadcastEmailSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid BroadcastEmail: ${parsed.error.message}`);
  }

  const { broadcastId, recipients: rawRecipients, from, subject, html, text, replyTo, tags } =
    parsed.data;

  const recipients = rawRecipients.filter(isValidEmail);
  const skipped = rawRecipients.length - recipients.length;
  if (skipped > 0) {
    console.warn(`[broadcastEmail] Skipped ${skipped} recipient(s) with invalid/blocked email address.`);
  }
  if (recipients.length === 0) return { enqueuedCount: 0, failedCount: 0, failedRecipients: [] };

  // Expand each recipient into an individual EmailJob.
  // The idempotencyKey is stable across retries so DynamoDB dedup kicks in.
  const jobs: EmailJob[] = recipients.map((to) => ({
    to,
    from,
    subject,
    html,
    text,
    replyTo,
    tags,
    idempotencyKey: `${broadcastId}::${to}`,
  }));

  const sqs = getSQSClient();
  const queueUrl = getQueueUrl();
  const result = await sendAllBatches(sqs, queueUrl, jobs);

  return {
    enqueuedCount: result.messageIds.length,
    failedCount: result.failed.length,
    failedRecipients: result.failed.map((f) => f.job.to),
  };
}
