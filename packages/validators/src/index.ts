import { z } from "zod";

export const unused = z.string().describe(
  `This lib is currently used for simple schemas
   But as your application grows and you need other validators to share
   with back and frontend, you can put them in here
  `,
);

export const createUpdateStudentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().optional(),
  countryId: z.string().optional(),
  dateOfEntry: z.coerce.date().optional(),
  dateOfExit: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  observation: z.string().optional(),
});

// export const createGradeSheetSchema = z.object({
//   notifyParents: z.boolean().default(true),
//   notifyStudents: z.boolean().default(true),
//   termId: z.coerce.number(),
//   subjectId: z.coerce.number(),
//   weight: z.coerce.number().nonnegative(),
//   name: z.string().optional(),
//   date: z.coerce.date(),
//   scale: z.coerce.number().nonnegative(),
//   grades: z.array(
//     z.object({
//       id: z.string(),
//       grade: z.coerce.number().nonnegative(),
//     }),
//   ),
// });
