/**
 * SQS → SES Lambda consumer.
 *
 * Triggered by SQS with reportBatchItemFailures enabled.
 * Idempotency is enforced via DynamoDB (TTL = 48 h).
 *
 * Throttling: reserved concurrency = 1 (set in CDK stack) so only one
 * Lambda invocation runs at a time, preventing SES burst violations.
 */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  SESClient,
  SendEmailCommand,
  type SendEmailCommandInput,
} from "@aws-sdk/client-ses";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import type {
  SQSBatchItemFailure,
  SQSBatchResponse,
  SQSEvent,
} from "aws-lambda";

import { EmailJobSchema } from "../schemas";

// ─── AWS clients (initialised once per container) ────────────────────────────

const ses = new SESClient({ region: process.env.SES_REGION ?? "us-east-1" });

const dynamo = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// ─── Constants ───────────────────────────────────────────────────────────────

const IDEMPOTENCY_TABLE = process.env.IDEMPOTENCY_TABLE!;
const SES_FROM_ADDRESS = process.env.SES_FROM_ADDRESS!;
/** Keep idempotency records for 48 hours to cover any re-drive window. */
const IDEMPOTENCY_TTL_SECONDS = 48 * 60 * 60;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Classify SES / SDK errors as transient (should retry) or permanent.
 * Transient errors are returned as batchItemFailures so SQS will retry them.
 * Permanent errors are logged and consumed (routed to DLQ after maxReceiveCount).
 */
function isTransient(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const code = (err as { Code?: string; name?: string }).Code ?? err.name ?? "";
  const transientCodes = [
    "Throttling",
    "ThrottlingException",
    "RequestTimeout",
    "RequestExpired",
    "ServiceUnavailable",
    "InternalFailure",
    "InternalServerError",
    "ProvisionedThroughputExceededException",
    "RequestLimitExceeded",
  ];
  return transientCodes.some(
    (c) => code.includes(c) || err.message.includes(c),
  );
}

async function isAlreadyProcessed(idempotencyKey: string): Promise<boolean> {
  const item = await dynamo.send(
    new GetCommand({
      TableName: IDEMPOTENCY_TABLE,
      Key: { messageId: idempotencyKey },
    }),
  );
  return !!item.Item;
}

async function markProcessed(
  idempotencyKey: string,
  to: string,
): Promise<void> {
  await dynamo.send(
    new PutCommand({
      TableName: IDEMPOTENCY_TABLE,
      Item: {
        messageId: idempotencyKey,
        to,
        processedAt: new Date().toISOString(),
        expiresAt: Math.floor(Date.now() / 1000) + IDEMPOTENCY_TTL_SECONDS,
      },
      // Prevent overwriting a record created by a concurrent invocation.
      ConditionExpression: "attribute_not_exists(messageId)",
    }),
  );
}

// ─── Main handler ────────────────────────────────────────────────────────────

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const itemFailures: SQSBatchItemFailure[] = [];

  // Process records sequentially to respect the SES sending rate.
  // Reserved concurrency = 1 already limits parallelism at the Lambda level.
  for (const record of event.Records) {
    const idempotencyKey =
      record.messageAttributes?.["idempotencyKey"]?.stringValue ??
      record.messageId;

    try {
      // ── 1. Parse & validate payload ───────────────────────────────────────
      let body: unknown;
      try {
        body = JSON.parse(record.body);
      } catch {
        // Malformed JSON is a permanent failure; do not retry.
        console.error(
          `[consumer] Permanent failure – invalid JSON for ${record.messageId}`,
        );
        continue;
      }

      const parsed = EmailJobSchema.safeParse(body);
      if (!parsed.success) {
        // Invalid schema is a permanent failure; do not retry.
        console.error(
          `[consumer] Permanent failure – Zod validation error for ${record.messageId}:`,
          parsed.error.flatten(),
        );
        continue;
      }
      const job = parsed.data;

      // ── 2. Idempotency check ──────────────────────────────────────────────
      if (await isAlreadyProcessed(idempotencyKey)) {
        console.log(`[consumer] Skipping duplicate message: ${idempotencyKey}`);
        continue;
      }

      // ── 3. Build SES input ────────────────────────────────────────────────
      const sesInput: SendEmailCommandInput = {
        Source: job.from ?? SES_FROM_ADDRESS,
        Destination: { ToAddresses: [job.to] },
        Message: {
          Subject: { Data: job.subject, Charset: "UTF-8" },
          Body: {
            Html: { Data: job.html, Charset: "UTF-8" },
            ...(job.text && {
              Text: { Data: job.text, Charset: "UTF-8" },
            }),
          },
        },
        ...(job.replyTo && { ReplyToAddresses: [job.replyTo] }),
        ...(job.tags && {
          Tags: Object.entries(job.tags).map(([Name, Value]) => ({
            Name,
            Value,
          })),
        }),
      };

      // ── 4. Send via SES ───────────────────────────────────────────────────
      const result = await ses.send(new SendEmailCommand(sesInput));
      console.log(
        `[consumer] Sent to ${job.to} | SES MessageId: ${result.MessageId} | idempotencyKey: ${idempotencyKey}`,
      );

      // ── 5. Mark as processed ──────────────────────────────────────────────
      try {
        await markProcessed(idempotencyKey, job.to);
      } catch (ddbErr) {
        // ConditionalCheckFailedException means a concurrent invocation won
        // the race and already marked it. Both sent the email in this case,
        // which is acceptable (rare); do NOT retry, just log.
        const code = (ddbErr as { name?: string }).name ?? "";
        if (code === "ConditionalCheckFailedException") {
          console.warn(
            `[consumer] Concurrent duplicate detected for ${idempotencyKey} – ignoring.`,
          );
        } else {
          // Unexpected DynamoDB error after a successful send; log but don't
          // retry (email was already sent).
          console.error(
            `[consumer] Failed to persist idempotency record for ${idempotencyKey}:`,
            ddbErr,
          );
        }
      }
    } catch (err) {
      if (isTransient(err)) {
        console.warn(
          `[consumer] Transient error for ${record.messageId}, will retry:`,
          err,
        );
        itemFailures.push({ itemIdentifier: record.messageId });
      } else {
        // Permanent / unknown error: log and allow the message to be consumed.
        // After maxReceiveCount retries the message lands in the DLQ anyway.
        console.error(
          `[consumer] Permanent error for ${record.messageId}, routing to DLQ:`,
          err,
        );
        // Still push as item failure so SQS drives it to DLQ after retries.
        itemFailures.push({ itemIdentifier: record.messageId });
      }
    }
  }

  return { batchItemFailures: itemFailures };
};
