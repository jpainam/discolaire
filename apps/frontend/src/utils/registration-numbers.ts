import { db } from "@repo/db";

export async function getRegistrationNumber({
  schoolYearId,
  schoolId,
}: {
  schoolId: string;
  schoolYearId: string;
}): Promise<string> {
  const schoolYear = await db.schoolYear.findUnique({
    where: {
      id: schoolYearId,
      schoolId: schoolId,
    },
  });
  if (!schoolYear) {
    throw new Error("School year not found");
  }
  const yearCode = schoolYear.name.slice(-2); // 2021-2022 => 22
  const lastSchoolStudent = await db.student.findFirst({
    where: {
      schoolId: schoolId,
      registrationNumber: {
        startsWith: yearCode,
      },
    },
    orderBy: {
      registrationNumber: "desc",
    },
  });
  if (lastSchoolStudent?.registrationNumber) {
    return (parseInt(lastSchoolStudent.registrationNumber) + 1).toString();
  }
  // Most school stops here

  const lastStudent = await db.student.findFirst({
    orderBy: {
      registrationNumber: "desc",
    },
  });
  if (!lastStudent?.registrationNumber) {
    throw new Error("No student found"); // Should never happen
  }
  const schoolCode = lastStudent.registrationNumber.slice(2, 3);
  const nextSchoolCode = parseInt(schoolCode) + 1;

  return `${yearCode}${nextSchoolCode}${"0001"}`;
}
