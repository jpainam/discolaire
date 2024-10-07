// import { z } from "zod";

// export const schoolYearSchema = z.object({
//   id: z.string(),
//   name: z.string().nullish(),
//   startDate: z.coerce.date().nullish(),
//   endDate: z.coerce.date().nullish(),
//   createdAt: z.coerce.date().nullish(),
//   isActive: z.coerce.boolean().nullish(),
//   isDefault: z.coerce.boolean(),
//   updatedAt: z.coerce.date().nullish(),
//   enrollmentStartDate: z.coerce.date().nullish(),
//   enrollmentEndDate: z.coerce.date().nullish(),
//   createdBy: z.string().nullish(),
//   updatedBy: z.string().nullish(),
//   deletedAt: z.date().nullish(),
//   deletedBy: z.string().nullish(),
// });

// export const schoolYearListSchema = z.array(schoolYearSchema);
// export type SchoolYear = z.infer<typeof schoolYearSchema>;
