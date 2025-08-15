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
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  regNo: z.string().min(1, "Registration number is required"),
  studentId: z.string().min(1, "Student ID is required"),
});

export const academicInfoSchema = z.object({
  classroom: z.string().min(1, "Classroom is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  admissionDate: z.string().min(1, "Admission date is required"),
  formerSchool: z.string().optional(),
  gradeLevel: z.string().min(1, "Grade level is required"),
  section: z.string().optional(),
});

export const contactInfoSchema = z.object({
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
});

export const membershipInfoSchema = z.object({
  religion: z.string().optional(),
  baptized: z.string().min(1, "Baptized status is required"),
  repeating: z.string().min(1, "Repeating status is required"),
  isNew: z.string().min(1, "New student status is required"),
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
  ...contactInfoSchema.shape,
  ...membershipInfoSchema.shape,
});

export type Parent = z.infer<typeof parentSchema>;
export type StudentData = z.infer<typeof studentSchema>;
export type BasicInfo = z.infer<typeof basicInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;
export type MembershipInfo = z.infer<typeof membershipInfoSchema>;
