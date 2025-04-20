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
