// import { z } from "zod";

// import { studentAccountSchema } from "./student-account";

// export const transactionStatusSchema = z.enum([
//   "PENDING",
//   "VALIDATED",
//   "CANCELLED",
// ]);
// export const transactionSchema = z.object({
//   id: z.number(),
//   transactionRef: z.string().nullish(),
//   transactionType: z.string().nullish(),
//   amount: z.number(),
//   isPrinted: z.boolean().nullish(),
//   description: z.string().nullish(),
//   createdAt: z.coerce.date().nullish(),
//   receivedAt: z.coerce.date().nullish(),
//   receivedBy: z.string().nullish(),
//   createdBy: z.string().nullish(),
//   status: transactionStatusSchema.nullish(),
//   schoolYearId: z.string().nullish(),
//   accountId: z.number().nullish(),
//   observation: z.string().nullish(),
//   account: studentAccountSchema.nullish(),
// });

// export const transactionsSchema = z.array(transactionSchema);
// export type Transaction = z.infer<typeof transactionSchema>;
// export type TransactionStatus = z.infer<typeof transactionStatusSchema>;

// export const transactionStatSchema = z.object({
//   totalFee: z.number().nullish(),
//   increased: z.boolean().nullish(),
//   percentage: z.number().nullish(),
//   totalCompleted: z.number().nullish(),
//   totalInProgress: z.number().nullish(),
//   totalDeleted: z.number().nullish(),
// });
// export type TransactionStat = z.infer<typeof transactionStatSchema>;

// export const transactionTrend = z.object({
//   date: z.string(),
//   amount: z.number(),
// });

// export type TransactionTrend = z.infer<typeof transactionTrend>;

// export const transactionQuota = z.object({
//   classroom: z.string(),
//   paid: z.number(),
//   remaining: z.number(),
//   revenue: z.number(),
//   section: z.string(),
//   cycle: z.string(),
// });

// export type TransactionQuota = z.infer<typeof transactionQuota>;
