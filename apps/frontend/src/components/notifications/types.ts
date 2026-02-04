export type NotificationChannel = "in_app" | "sms" | "email" | "whatsapp";

export type NotificationStatus = "delivered" | "failed" | "skipped" | "pending";

export type NotificationSourceType =
  | "grades"
  | "absence_alert"
  | "announcement"
  | "payment"
  | "schedule"
  | "report";

export interface Notification {
  id: string;
  sourceType: NotificationSourceType;
  channel: NotificationChannel;
  status: NotificationStatus;
  content: string;
  payload: Record<string, unknown>;
  recipientName: string;
  recipientEmail: string;
  isRead: boolean;
  createdAt: Date;
  deliveredAt?: Date;
}

export interface NotificationStats {
  total: number;
  delivered: number;
  failed: number;
  pending: number;
  skipped: number;
  smsCreditsUsed: number;
  whatsappCreditsUsed: number;
}

export const CHANNEL_CREDITS: Record<
  NotificationChannel,
  { type: "sms" | "whatsapp" | "free"; amount: number }
> = {
  sms: { type: "sms", amount: 1 },
  whatsapp: { type: "whatsapp", amount: 1 },
  email: { type: "free", amount: 0 },
  in_app: { type: "free", amount: 0 },
};
