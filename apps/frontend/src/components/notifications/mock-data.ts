import type {
  Notification,
  NotificationChannel,
  NotificationSourceType,
  NotificationStats,
  NotificationStatus,
} from "./types";

const sourceTypes: NotificationSourceType[] = [
  "grades",
  "absence_alert",
  "announcement",
  "payment",
  "schedule",
  "report",
];
const channels: NotificationChannel[] = ["in_app", "sms", "email", "whatsapp"];
const statuses: NotificationStatus[] = [
  "delivered",
  "failed",
  "skipped",
  "pending",
];

const names = [
  "John Smith",
  "Emma Wilson",
  "Michael Brown",
  "Sarah Davis",
  "James Miller",
  "Emily Johnson",
  "David Williams",
  "Olivia Jones",
  "Daniel Garcia",
  "Sophia Martinez",
];

const contentTemplates: Record<NotificationSourceType, string[]> = {
  grades: [
    "Your child received a grade of A in Mathematics",
    "New grade posted for Science: B+",
    "Final exam results are now available",
  ],
  absence_alert: [
    "Your child was marked absent today",
    "Attendance alert: 3 consecutive absences recorded",
    "Please contact school regarding recent absences",
  ],
  announcement: [
    "School will be closed next Monday for maintenance",
    "Parent-teacher conference scheduled for Friday",
    "New semester begins on January 15th",
  ],
  payment: [
    "Tuition payment due in 5 days",
    "Payment received - Thank you!",
    "Reminder: Field trip fee deadline approaching",
  ],
  schedule: [
    "Class schedule has been updated",
    "Tomorrow's classes cancelled due to weather",
    "New extracurricular activities available",
  ],
  report: [
    "Monthly progress report is ready",
    "Behavior report updated",
    "Academic performance summary available",
  ],
};

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function generateNotification(index: number): Notification {
  const sourceType =
    sourceTypes[Math.floor(Math.random() * sourceTypes.length)];
  const channel = channels[Math.floor(Math.random() * channels.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const name = names[Math.floor(Math.random() * names.length)];
  const contents = contentTemplates[sourceType!];
  const content = contents[Math.floor(Math.random() * contents.length)];
  const createdAt = randomDate(new Date(2024, 0, 1), new Date());

  return {
    id: `notif-${index + 1}`,
    sourceType,
    channel,
    status,
    content,
    payload: {
      studentId: `STU-${1000 + index}`,
      timestamp: createdAt.toISOString(),
      priority: Math.random() > 0.7 ? "high" : "normal",
    },
    recipientName: name ?? "Name",
    recipientEmail: `${name?.toLowerCase().replace(" ", ".")}@email.com`,
    isRead: Math.random() > 0.5,
    createdAt,
    deliveredAt:
      status === "delivered"
        ? new Date(createdAt.getTime() + Math.random() * 60000)
        : undefined,
  };
}

export const mockNotifications: Notification[] = Array.from(
  { length: 50 },
  (_, i) => generateNotification(i),
).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

export function calculateStats(
  notifications: Notification[],
): NotificationStats {
  const stats: NotificationStats = {
    total: notifications.length,
    delivered: 0,
    failed: 0,
    pending: 0,
    skipped: 0,
    smsCreditsUsed: 0,
    whatsappCreditsUsed: 0,
  };

  for (const notif of notifications) {
    stats[notif.status]++;

    if (notif.channel === "sms") {
      stats.smsCreditsUsed++;
    } else if (notif.channel === "whatsapp") {
      stats.whatsappCreditsUsed++;
    }
  }

  return stats;
}
