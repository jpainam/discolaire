import { z } from "zod/v4";

export const basicInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.date(),
  avatar: z.string().optional(),
  placeOfBirth: z.string().min(1),
  gender: z.enum(["male", "female"]),
  countryId: z.string().min(1),
  bloodType: z.string().optional(),
  religionId: z.string().optional(),
  clubs: z.string().array().default([]),
  sports: z.string().array().default([]),
  isBaptized: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  registrationNumber: z.string().optional(),
  externalAccountingNo: z.string().optional().default(""),
  phoneNumber: z.string().optional().default(""),
  residence: z.string().min(1),
  allergies: z.string().optional().default(""),
  observation: z.string().optional().default(""),
});

export const academicInfoSchema = z.object({
  classroomId: z.string().optional().default(""),
  dateOfEntry: z.date().default(new Date()),
  dateOfExit: z.date().optional(),
  isRepeating: z.boolean().default(false),
  isNew: z.boolean().default(true),
  status: z
    .enum(["ACTIVE", "INACTIVE", "GRADUATED", "EXPELLED"])
    .default("ACTIVE"),
  formerSchoolId: z.string().min(1),
});

export const parentInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  relationshipId: z.string(),
});

export const parentsSchema = z.object({
  selectedParents: z.array(parentInfoSchema).default([]),
});

export const studentSchema = z.object({
  ...basicInfoSchema.shape,
  ...academicInfoSchema.shape,
  //...membershipInfoSchema.shape,
});

export type StudentData = z.infer<typeof studentSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type ParentInfo = z.infer<typeof parentInfoSchema>;
export type ParentsInfo = z.infer<typeof parentsSchema>;
//export type MembershipInfo = z.infer<typeof membershipInfoSchema>;
