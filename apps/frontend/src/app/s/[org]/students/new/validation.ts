import { z } from "zod";

export const parentSchema = z.object({
  id: z.string().optional(),
  civility: z.string().min(1, "Civility is required"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  phone1: z.string().min(8, "Phone number must be at least 8 digits"),
  phone2: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  relationship: z.string().min(1, "Relationship is required"),
  emergencyContact: z.boolean().default(false),
  observation: z.string().optional(),
});

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

export type Parent = z.infer<typeof parentSchema>;
export type StudentData = z.infer<typeof studentSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type MembershipInfo = z.infer<typeof membershipInfoSchema>;
