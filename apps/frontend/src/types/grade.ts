// import { z } from "zod";

// import { gradeSheetSchema } from "./gradesheet";

// export const gradeSchema = z.object({
//   id: z.number(),
//   grade: z.number(),
//   observation: z.string().nullish(),
//   isAbsent: z.boolean().nullish(),
//   gradeSheetId: z.number(),
//   createdAt: z.coerce.date().nullish(),
//   studentId: z.string(),
//   student: z
//     .object({
//       id: z.string(),
//       firstName: z.string(),
//       lastName: z.string(),
//       avatar: z.string().nullish(),
//       gender: z.string().nullish(),
//     })
//     .nullish(),
//   gradeSheet: gradeSheetSchema.nullish(),
// });
// export const gradeListSchema = z.array(gradeSchema);
// export type Grade = z.infer<typeof gradeSchema>;

// export const gradeMinMaxMoySchema = z.object({
//   min: z.number().nullish(),
//   max: z.number().nullish(),
//   moy: z.number().nullish(),
//   gradeSheetId: z.number(),
//   name: z.string().nullish(),
//   weight: z.number().nullish(),
//   subjectId: z.number(),
//   coefficient: z.number(),
//   termId: z.number(),
// });

// export const gradeMinMaxMoyListSchema = z.array(gradeMinMaxMoySchema);

// export type GradeMinMaxMoy = z.infer<typeof gradeMinMaxMoySchema>;
