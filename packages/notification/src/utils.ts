import { Queue } from "bullmq";
import { decode } from "entities";

import { db } from "@repo/db";
import redisClient from "@repo/kv";

export async function getContactPhoneNumberFromStudent(studentId: string) {
  const parents = await db.studentContact.findMany({
    where: {
      studentId: studentId,
    },
    include: {
      contact: true,
    },
  });

  const results: { id: string; name: string; phoneNumber: string }[] = [];
  for (const parent of parents) {
    const contact = parent.contact;
    if (!contact.phoneNumber1 && !contact.phoneNumber2) {
      return;
    }
    let phone = contact.phoneNumber1;
    phone ??= contact.phoneNumber2;
    if (phone) {
      results.push({
        id: contact.id,
        name: decode(contact.lastName + " " + contact.firstName),
        phoneNumber: phone,
      });
    }
  }
  return results;
}

// Define queues
export const notificationQueue = new Queue("notification", {
  connection: redisClient,
});

const CHANNELS = ["EMAIL", "SMS", "WHATSAPP"] as const;
type Channel = (typeof CHANNELS)[number];

export async function canNotifyUser(
  userId: string,
  channel: Channel,
  event: string,
): Promise<boolean> {
  const key = `notify:user:${userId}`;
  const [quotaStr, prefStr] = await redisClient.hmget(
    key,
    `quota_${channel}`,
    `pref_${event}_${channel}`,
  );

  if (quotaStr && prefStr) {
    const quota = parseInt(quotaStr, 10);
    return quota > 0 && prefStr === "true";
  }

  // fallback: load from DB
  const [notifications, subscriptions] = await Promise.all([
    db.notificationPreference.findMany({ where: { userId } }),
    db.subscription.aggregate({
      where: { userId },
      _count: { email: true, sms: true, whatsapp: true },
    }),
  ]);

  const preferences = notifications.map((notification) => ({
    event: notification.event,
    channels: notification.channels.reduce(
      (acc, channel) => {
        acc[channel] = true;
        return acc;
      },
      {} as Record<Channel, boolean>,
    ),
  }));

  const emailCount = subscriptions._count.email;
  const smsCount = subscriptions._count.sms;
  const whatsappCount = subscriptions._count.whatsapp;

  const quotaMap: Record<Channel, number> = {
    EMAIL: emailCount,
    SMS: smsCount,
    WHATSAPP: whatsappCount,
  };

  const redisData: Record<string, string> = {
    [`quota_email`]: emailCount.toString(),
    [`quota_sms`]: smsCount.toString(),
    [`quota_whatsapp`]: whatsappCount.toString(),
  };

  for (const p of preferences) {
    for (const c of CHANNELS) {
      redisData[`pref_${p.event}_${c}`] = p.channels[c].toString();
    }
  }

  await redisClient.hmset(key, redisData);

  // fallback logic
  const allow =
    preferences.find((p) => p.event === event)?.channels[channel] ?? true;
  return quotaMap[channel] > 0 && allow;
}
