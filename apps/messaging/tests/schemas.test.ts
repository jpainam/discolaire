import { describe, it, expect } from "vitest";
import { BroadcastEmailSchema, EmailJobBatchSchema, EmailJobSchema } from "../src/schemas";

// ─── EmailJobSchema ───────────────────────────────────────────────────────────

describe("EmailJobSchema", () => {
  const minimal: unknown = {
    to: "student@example.com",
    subject: "Fee reminder",
    html: "<p>Your fee is due.</p>",
  };

  it("accepts a minimal valid job", () => {
    const result = EmailJobSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("accepts a fully-populated job", () => {
    const result = EmailJobSchema.safeParse({
      to: "parent@example.com",
      from: "school@yourdomain.com",
      subject: "Report card",
      html: "<h1>Grades</h1>",
      text: "Grades available",
      replyTo: "admin@yourdomain.com",
      idempotencyKey: "report-card-2024-student-42",
      tags: { tenant: "my-school", type: "report-card" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing `to` field", () => {
    const result = EmailJobSchema.safeParse({ subject: "Hi", html: "<p>Hi</p>" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid `to` email", () => {
    const result = EmailJobSchema.safeParse({ ...minimal, to: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid `from` email", () => {
    const result = EmailJobSchema.safeParse({ ...minimal, from: "bad" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid `replyTo` email", () => {
    const result = EmailJobSchema.safeParse({ ...minimal, replyTo: "bad@" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty subject", () => {
    const result = EmailJobSchema.safeParse({ ...minimal, subject: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an empty html body", () => {
    const result = EmailJobSchema.safeParse({ ...minimal, html: "" });
    expect(result.success).toBe(false);
  });

  it("allows `from`, `text`, `replyTo`, `tags` to be omitted (all optional)", () => {
    const result = EmailJobSchema.safeParse(minimal);
    if (!result.success) throw result.error;
    expect(result.data.from).toBeUndefined();
    expect(result.data.text).toBeUndefined();
    expect(result.data.replyTo).toBeUndefined();
    expect(result.data.tags).toBeUndefined();
  });

  it("idempotencyKey is preserved when provided", () => {
    const key = "my-custom-key-123";
    const result = EmailJobSchema.safeParse({ ...minimal, idempotencyKey: key });
    if (!result.success) throw result.error;
    expect(result.data.idempotencyKey).toBe(key);
  });

  it("rejects an idempotencyKey longer than 512 characters", () => {
    const result = EmailJobSchema.safeParse({
      ...minimal,
      idempotencyKey: "x".repeat(513),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a subject longer than 998 characters", () => {
    const result = EmailJobSchema.safeParse({
      ...minimal,
      subject: "s".repeat(999),
    });
    expect(result.success).toBe(false);
  });
});

// ─── EmailJobBatchSchema ──────────────────────────────────────────────────────

describe("EmailJobBatchSchema", () => {
  const validJob = {
    to: "a@example.com",
    subject: "Hello",
    html: "<p>Hello</p>",
  };

  it("accepts a batch with one valid job", () => {
    const result = EmailJobBatchSchema.safeParse({ jobs: [validJob] });
    expect(result.success).toBe(true);
  });

  it("accepts a batch with multiple valid jobs", () => {
    const jobs = Array.from({ length: 5 }, (_, i) => ({
      ...validJob,
      to: `user${i}@example.com`,
    }));
    const result = EmailJobBatchSchema.safeParse({ jobs });
    expect(result.success).toBe(true);
  });

  it("rejects an empty jobs array", () => {
    const result = EmailJobBatchSchema.safeParse({ jobs: [] });
    expect(result.success).toBe(false);
  });

  it("rejects a batch exceeding 500 jobs", () => {
    const jobs = Array.from({ length: 501 }, (_, i) => ({
      ...validJob,
      to: `user${i}@example.com`,
    }));
    const result = EmailJobBatchSchema.safeParse({ jobs });
    expect(result.success).toBe(false);
  });

  it("rejects when any job in the batch is invalid", () => {
    const result = EmailJobBatchSchema.safeParse({
      jobs: [validJob, { ...validJob, to: "bad-email" }],
    });
    expect(result.success).toBe(false);
  });
});

// ─── BroadcastEmailSchema ─────────────────────────────────────────────────────

describe("BroadcastEmailSchema", () => {
  const minimal = {
    broadcastId: "fee-reminder-2025-q2",
    recipients: ["alice@example.com", "bob@example.com"],
    subject: "Fee reminder",
    html: "<p>Due Jan 31.</p>",
  };

  it("accepts a minimal valid broadcast", () => {
    const result = BroadcastEmailSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it("accepts a fully-populated broadcast", () => {
    const result = BroadcastEmailSchema.safeParse({
      ...minimal,
      from: "school@example.com",
      text: "Due Jan 31.",
      replyTo: "admin@example.com",
      tags: { type: "fee-reminder", term: "q2-2025" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing broadcastId", () => {
    const { broadcastId: _, ...rest } = minimal;
    expect(BroadcastEmailSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects an empty broadcastId", () => {
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, broadcastId: "" }).success,
    ).toBe(false);
  });

  it("rejects a broadcastId longer than 200 characters", () => {
    expect(
      BroadcastEmailSchema.safeParse({
        ...minimal,
        broadcastId: "x".repeat(201),
      }).success,
    ).toBe(false);
  });

  it("rejects an empty recipients array", () => {
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, recipients: [] }).success,
    ).toBe(false);
  });

  it("rejects a recipients array with an invalid email", () => {
    expect(
      BroadcastEmailSchema.safeParse({
        ...minimal,
        recipients: ["valid@example.com", "not-an-email"],
      }).success,
    ).toBe(false);
  });

  it("rejects a recipients array exceeding 10 000 entries", () => {
    const big = Array.from({ length: 10_001 }, (_, i) => `u${i}@example.com`);
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, recipients: big }).success,
    ).toBe(false);
  });

  it("accepts exactly 10 000 recipients", () => {
    const max = Array.from({ length: 10_000 }, (_, i) => `u${i}@example.com`);
    const result = BroadcastEmailSchema.safeParse({ ...minimal, recipients: max });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid from address", () => {
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, from: "bad" }).success,
    ).toBe(false);
  });

  it("rejects an invalid replyTo address", () => {
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, replyTo: "bad@" }).success,
    ).toBe(false);
  });

  it("rejects an empty subject", () => {
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, subject: "" }).success,
    ).toBe(false);
  });

  it("rejects an empty html body", () => {
    expect(
      BroadcastEmailSchema.safeParse({ ...minimal, html: "" }).success,
    ).toBe(false);
  });
});
