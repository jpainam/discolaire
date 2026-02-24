/**
 * SNS → Lambda handler for SES bounce and complaint notifications.
 *
 * This is a STUB. Wire it to the SNS topics created in the CDK stack and
 * implement the TODOs below to handle suppression list management.
 *
 * @see https://docs.aws.amazon.com/ses/latest/dg/notification-contents.html
 */
import type { SNSEvent } from "aws-lambda";

// ─── SES notification types (minimal) ────────────────────────────────────────

interface SESBounce {
  bounceType: "Permanent" | "Transient" | "Undetermined";
  bounceSubType: string;
  bouncedRecipients: Array<{ emailAddress: string }>;
  timestamp: string;
}

interface SESComplaint {
  complainedRecipients: Array<{ emailAddress: string }>;
  complaintFeedbackType?: string;
  timestamp: string;
}

interface SESNotification {
  notificationType: "Bounce" | "Complaint" | "Delivery";
  bounce?: SESBounce;
  complaint?: SESComplaint;
  mail: { messageId: string; destination: string[] };
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export const handler = async (event: SNSEvent): Promise<void> => {
  for (const record of event.Records) {
    let notification: SESNotification;
    try {
      notification = JSON.parse(record.Sns.Message) as SESNotification;
    } catch {
      console.error(
        "[notifications] Failed to parse SNS message:",
        record.Sns.Message,
      );
      continue;
    }

    switch (notification.notificationType) {
      case "Bounce": {
        const bounce = notification.bounce!;
        const addresses = bounce.bouncedRecipients.map((r) => r.emailAddress);

        console.log(
          `[notifications] Bounce (${bounce.bounceType}/${bounce.bounceSubType}) for: ${addresses.join(", ")}`,
        );

        if (bounce.bounceType === "Permanent") {
          // TODO: Add addresses to a suppression list in your database.
          //
          // Suggested approach:
          //   1. Write to a `EmailSuppression` Prisma model with reason = "hard_bounce"
          //   2. Check this table before calling enqueueEmailJobs to avoid re-sending
          //      to permanently bounced addresses.
          //
          // Example:
          //   await db.emailSuppression.createMany({
          //     data: addresses.map(email => ({ email, reason: "hard_bounce" })),
          //     skipDuplicates: true,
          //   });
          console.warn(
            "[notifications] TODO: suppress hard-bounce addresses:",
            addresses,
          );
        } else {
          // Transient bounce (e.g. mailbox full) — optionally schedule a retry.
          console.warn(
            "[notifications] Transient bounce, no action taken:",
            addresses,
          );
        }
        break;
      }

      case "Complaint": {
        const complaint = notification.complaint!;
        const addresses = complaint.complainedRecipients.map(
          (r) => r.emailAddress,
        );

        console.log(
          `[notifications] Complaint (${complaint.complaintFeedbackType ?? "unknown"}) for: ${addresses.join(", ")}`,
        );

        // TODO: Immediately suppress these addresses.
        //
        // Spam complaints damage sender reputation. Add to suppression list
        // with reason = "complaint" and do NOT send to them again.
        //
        // Example:
        //   await db.emailSuppression.createMany({
        //     data: addresses.map(email => ({ email, reason: "complaint" })),
        //     skipDuplicates: true,
        //   });
        console.warn(
          "[notifications] TODO: suppress complaint addresses:",
          addresses,
        );
        break;
      }

      case "Delivery": {
        // Delivery notifications are informational only.
        console.log(
          `[notifications] Delivery confirmed for messageId=${notification.mail.messageId}`,
        );
        break;
      }

      default: {
        console.warn(
          "[notifications] Unknown notification type:",
          notification,
        );
      }
    }
  }
};
