import { createErrorMap } from "zod-validation-error/v4";
import { z } from "zod/v4";





z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});
export const unused = z.string().describe(
  `This lib is currently used for simple schemas
   But as your application grows and you need other validators to share
   with back and frontend, you can put them in here
  `,
);

// TODO remove, it's unused
export const createUpdateStudentSchema = z.object({
  id: z.string().optional(),
  registrationNumber: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  religionId: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  externalAccountingNo: z.string().optional(),
  isBaptized: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  gender: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().min(1),
  countryId: z.string().min(1),
  dateOfEntry: z.coerce.date().optional(),
  dateOfExit: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  isRepeating: z.enum(["yes", "no"]).optional().default("no"),
  observation: z.string().optional(),
  status: z
    .enum(["ACTIVE", "GRADUATED", "INACTIVE", "EXPELLED"])
    .default("ACTIVE"),
  clubs: z.array(z.string()).optional(),
  sports: z.array(z.string()).optional(),
  classroom: z.string().optional(),
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

export const logActivitySchema = z.object({
  userId: z.string(),
  action: z.string(),
  entity: z.string(),
  entityId: z.string().optional(),
  metadata: z.any().optional(),
  schoolId: z.string(),
});