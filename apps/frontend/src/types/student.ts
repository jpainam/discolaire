import { z } from "zod";

import { countrySchema } from "./country";
import { schoolSchema } from "./school";

//import { studentContactsSchema } from "./student-contact";

export const studentSchema = z.object({
  id: z.string(),
  avatar: z.string().nullish(),
  registrationNumber: z.string().nullish(),
  email: z.string().nullish(),
  firstName: z.string().nullish(),
  gender: z.string().nullish(),
  lastName: z.string().nullish(),
  placeOfBirth: z.string().nullish(),
  isActive: z.boolean().nullish(),
  dateOfBirth: z.coerce.date().nullish(),
  residence: z.string().nullish(),
  phoneNumber: z.string().nullish(),
  parentDivorced: z.boolean().nullish(),
  dateOfEntry: z.coerce.date().nullish(),
  dateOfExit: z.coerce.date().nullish(),
  dateOfWithdraw: z.coerce.date().nullable(),
  observation: z.string().nullish(),
  formerSchoolId: z.string().nullish(),
  countryId: z.string().nullish(),
  country: countrySchema.nullish(),
  religion: z.string().nullish(),
  formerSchool: schoolSchema.nullish(),
  enrollments: z.any().nullish(),
  isRepeating: z.coerce.boolean().nullish(),
  classroom: z
    .object({
      id: z.string(),
      name: z.string(),
      reportName: z.string().nullish(),
    })
    .nullish(),
  tags: z.array(z.string()).nullish(),
  //studentContacts: studentContactsSchema.nullish(),
  userId: z.string().nullish(),
  createdAt: z.coerce.date().nullish(),
  updatedAt: z.coerce.date().nullish(),
  isBaptized: z.boolean().nullish(),
  isChurchMember: z.boolean().nullish(),
  pastorName: z.string().nullish(),
});

export type Student = z.infer<typeof studentSchema>;
export const studentsSchema = z.array(studentSchema);

export enum StudentTabIndex {
  INFO = "info",
  DISCIPLINE = "discipline",
  NOTES = "notes",
  EMPLOI = "emploi",
  DOCUMENTS = "documents",
  SANTE = "sante",
  FINANCES = "finances",
}

export interface RegisteredStudent {
  id: string;
  first_name: string;
  last_name: string;
  sex: string;
  dob: string;
}
