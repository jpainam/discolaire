import { parseAsBoolean, parseAsInteger, parseAsString } from "nuqs/server";

export const createGradeSheetSearchSchema = {
  termId: parseAsString,
  subjectId: parseAsInteger,
  notifyParents: parseAsBoolean.withDefault(false),
  notifyStudents: parseAsBoolean.withDefault(false),
};
