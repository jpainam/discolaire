import { z } from "zod/v4";

export const basicInfoSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  gender: z.enum(["male", "female"]),
  countryId: z.string().min(1),
  registrationNumber: z.string().optional(),
  externalAccountingNo: z.string().optional().default(""),
  phoneNumber: z.string().optional().default(""),
  email: z.string().email().optional().or(z.literal("")),
  residence: z.string().min(1),
  allergies: z.string().optional().default(""),
  city: z.string().optional().default(""),
  postalCode: z.string().optional().default(""),
});

export const academicInfoSchema = z.object({
  classroomId: z.string().optional().default(""),
  dateOfEntry: z.coerce.date().default(new Date()),
  dateOfExit: z.coerce.date().optional(),
  isRepeating: z.boolean().default(false),
  isNew: z.boolean().default(true),
  status: z
    .enum(["ACTIVE", "INACTIVE", "GRADUATED", "EXPELLED"])
    .default("ACTIVE"),
  formerSchoolId: z.string().min(1),
});

export const membershipInfoSchema = z.object({
  religion: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  emergencyMedicalInfo: z.string().optional(),
  sports: z.string().optional(),
  clubs: z.string().optional(),
  interests: z.string().optional(),
  observation: z.string().optional(),
});

export const studentSchema = z.object({
  ...basicInfoSchema.shape,
  ...academicInfoSchema.shape,
  ...membershipInfoSchema.shape,
});

export type StudentData = z.infer<typeof studentSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type MembershipInfo = z.infer<typeof membershipInfoSchema>;
