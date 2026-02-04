import {
  NotificationSourceType,
  NotificationStatus,
  type NotificationChannel,
} from "@repo/db/enums";

export const NOTIFICATION_SOURCE_FILTER_VALUES = [
  "all",
  ...Object.values(NotificationSourceType),
] as const;

export type NotificationSourceFilterValue =
  (typeof NOTIFICATION_SOURCE_FILTER_VALUES)[number];

export const NOTIFICATION_STATUS_FILTER_VALUES = [
  "all",
  ...Object.values(NotificationStatus),
] as const;

export type NotificationStatusFilterValue =
  (typeof NOTIFICATION_STATUS_FILTER_VALUES)[number];

export interface NotificationRow {
  id: string;
  sourceType: NotificationSourceType;
  channel: NotificationChannel;
  status: NotificationStatus;
  content: string;
  payload: unknown;
  recipientName: string;
  recipientEmail: string;
  isRead: boolean;
  createdAt: Date;
  deliveredAt?: Date;
}

export interface NotificationStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  skipped: number;
  canceled: number;
  smsCreditsUsed: number;
  whatsappCreditsUsed: number;
}

export const CHANNEL_CREDITS: Record<
  NotificationChannel,
  { type: "sms" | "whatsapp" | "free"; amount: number }
> = {
  SMS: { type: "sms", amount: 1 },
  WHATSAPP: { type: "whatsapp", amount: 1 },
  EMAIL: { type: "free", amount: 0 },
  IN_APP: { type: "free", amount: 0 },
};
