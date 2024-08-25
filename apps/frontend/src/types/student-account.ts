import { z } from "zod";
import { studentSchema } from "./student";

export const studentAccountSchema = z.object({
  id: z.number(),
  code: z.string().nullish(),
  name: z.string().nullish(),
  studentId: z.string().nullish(),
  student: studentSchema.nullish(),
});

export const studentAccountsSchema = z.array(studentAccountSchema);
export type StudentAccount = z.infer<typeof studentAccountSchema>;
