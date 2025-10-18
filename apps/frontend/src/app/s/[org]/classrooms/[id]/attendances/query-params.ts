import { createLoader, parseAsString } from "nuqs/server";

export const attendanceSearchSchema = {
  termId: parseAsString,
};

export const attendanceSearchParams = createLoader(attendanceSearchSchema);
