import type { Classroom, ClassroomLevel } from "@repo/db";
import { db } from "@repo/db";

export async function getRegistrationNumber({
  schoolYearId,
  schoolCode,
  level,
}: {
  classroom: Classroom;
  schoolCode: string;
  level: ClassroomLevel;
  schoolYearId: string;
}): Promise<string> {
  if (schoolCode === "csabrazzaville") {
    return CSABrazzavile({
      schoolYearId,
      level,
    });
  }
  throw new Error(`Unknown school code: ${schoolCode}`);
}

async function CSABrazzavile({
  schoolYearId,
  level,
}: {
  level: ClassroomLevel;
  schoolYearId: string;
}) {
  const year = schoolYearId.slice(-2);
  const matricNumber = `${year}${level.order}`;
  const lastStudent = await db.student.findFirst({
    where: {
      registrationNumber: {
        startsWith: matricNumber,
      },
    },
    orderBy: {
      registrationNumber: "desc",
    },
  });
  const lastNumber = lastStudent?.registrationNumber;
  if (lastNumber) {
    const lastTwoDigits = lastNumber.toString().slice(-2);
    const newNumber = (parseInt(lastTwoDigits) + 1).toString().padStart(3, "0");
    return `${lastNumber.toString().slice(0, -2)}${newNumber}`;
  }
  return `${year}${level.order}123`;
}
