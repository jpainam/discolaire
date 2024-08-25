import { z } from "zod";
import { classroomLevelSchema } from "./classroom_level";
import { schoolYearSchema } from "./school_year";

export const classroomSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  shortName: z.string().nullish(),
  reportName: z.string().nullish(),
  maxSize: z.number().nullish(),
  size: z.number().nullish(),
  levelId: z.coerce.number().nullish(),
  level: classroomLevelSchema.nullish(),
  sectionId: z.coerce.number().nullish(),
  section: z.any().nullish(),
  cycleId: z.coerce.number().nullish(),
  cycle: z.any().nullish(),
  schoolYearId: z.string().nullish(),
  schoolYear: schoolYearSchema.nullish(),
  createdAt: z.coerce.date().nullish(),
  updatedAt: z.coerce.date().nullish(),
  createdBy: z.string().nullish(),
  updatedBy: z.string().nullish(),
  deletedAt: z.coerce.date().nullish(),
  deletedBy: z.string().nullish(),
  numTeacher: z.number().nullish(),
  numSubject: z.number().nullish(),
  numNewStudent: z.number().nullish(),
  //headTeacher: staffSchema.nullish(),
  headTeacherId: z.string().nullish(),
  //seniorAdvisor: staffSchema.nullish(),
  seniorAdvisorId: z.string().nullish(),
  femaleCount: z.number().nullish(),
  maleCount: z.number().nullish(),
  classroomLeader: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .nullish(),
  classroomLeaderId: z.string().nullish(),
  totalFees: z.number().nullish(),
});

export const classroomsSchema = z.array(classroomSchema);
export type Classroom = z.infer<typeof classroomSchema>;

export const classroomSectionSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type ClassroomSection = z.infer<typeof classroomSectionSchema>;

export const classroomCycleSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type ClassroomCyle = z.infer<typeof classroomCycleSchema>;

export const classroomStatCount = z.object({
  total: z.number(),
  classroom: classroomSchema,
  female: z.number(),
  male: z.number(),
});
export type ClassroomStatCount = z.infer<typeof classroomStatCount>;
