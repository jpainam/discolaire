"use server";

import { db } from "@repo/db";

export async function syncTransactionIds() {
  const staffs = await db.staff.findMany({
    select: {
      id: true,
      userId: true,
    },
  });

  const staffIds = staffs.map((s) => s.id);
  const transactions = await db.transaction.findMany({
    where: {
      OR: [
        {
          createdById: {
            in: staffIds,
          },
        },
        {
          printedById: {
            in: staffIds,
          },
        },
        {
          receivedById: {
            in: staffIds,
          },
        },
      ],
    },
  });
  console.log(">>>>> Found", transactions.length, "transactions to update");
  for (const transaction of transactions) {
    const _createdById = staffs.find(
      (s) => s.id == transaction.createdById,
    )?.userId;
    const _receivedById = staffs.find(
      (s) => s.id == transaction.receivedById,
    )?.userId;
    const _printedById = staffs.find(
      (s) => s.id == transaction.printedById,
    )?.userId;
    if (!_createdById || !_receivedById) {
      console.warn(
        ">>>>> Skipping",
        transaction.id,
        _createdById,
        _receivedById,
      );
      continue;
    }

    await db.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        createdById: _createdById,
        receivedById: _receivedById,
        printedById: _printedById,
      },
    });
    console.log(">>>>> updated", transaction.id);
  }
  console.log(">>>>> Sync completed");
  return transactions.length;
}

export async function updateFeesDate() {
  const fees = await db.fee.findMany({
    include: {
      classroom: {
        include: {
          schoolYear: true,
        },
      },
    },
    where: {
      dueDate: {
        lte: new Date("2010-12-30"),
      },
    },
  });
  console.log(">>>>> Found", fees.length, "fees to update");
  for (const fee of fees) {
    const schoolYear = fee.classroom.schoolYear;
    const year = schoolYear.startDate.getFullYear();
    await db.fee.update({
      where: {
        id: fee.id,
      },
      data: {
        dueDate: new Date(year, 5, 1),
      },
    });
    console.log(">>>>> Updated fee", fee.id, "to year", year);
  }
  return fees.length;
}
