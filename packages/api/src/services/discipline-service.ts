import { db } from "../db";
import { getPeriodicAttendance } from "../services/attendance-service";
import { classroomService } from "./classroom-service";

export type DisciplineMetrics = {
  studentId: string;
  absence: number;
  justifiedAbsence: number;
  lateness: number;
  justifiedLateness: number;
  chatter: number;
  consigne: number;
};

const emptyMetrics = (): DisciplineMetrics => ({
  absence: 0,
  studentId: "",
  justifiedAbsence: 0,
  lateness: 0,
  justifiedLateness: 0,
  chatter: 0,
  consigne: 0,
});

export async function aggregateTermMetrics({
  studentIds,
  classroomId,
  termId,
}: {
  studentIds: string[];
  classroomId: string;
  termId: string;
}): Promise<Map<string, DisciplineMetrics>> {
  const [daily, periodicWrap] = await Promise.all([
    getDiscipline({ studentIds, termId }),
    getPeriodicAttendance({ classroomId, termId }),
  ]);

  const periodic = periodicWrap.map;

  return new Map<string, DisciplineMetrics>(
    studentIds.map((id) => [id, add(daily.get(id), periodic.get(id))] as const),
  );
}
export async function accumulateDisciplineForTerms({
  studentIds,
  classroomId,
  termIds,
}: {
  studentIds: string[];
  classroomId: string;
  termIds: string[];
}) {
  const perTermMaps = await Promise.all(
    termIds.map((termId) =>
      aggregateTermMetrics({ studentIds, classroomId, termId }),
    ),
  );

  // Sum per student across all term maps
  const results = new Map<string, DisciplineMetrics>();
  for (const id of studentIds) {
    const total = perTermMaps.reduce<DisciplineMetrics>(
      (acc, m) => add(acc, m.get(id)),
      emptyMetrics(),
    );
    results.set(id, total);
  }
  return results;
}

export async function getDiscipline({
  studentIds,
  termId,
}: {
  studentIds: string[];
  termId: string;
}) {
  const absences = await db.absence.findMany({
    include: {
      justification: true,
    },
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
  });
  const lateness = await db.lateness.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
    include: {
      justification: true,
    },
  });
  const consignes = await db.consigne.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
  });
  const chatters = await db.chatter.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
      termId: termId,
    },
  });
  const disciplines = new Map<
    string,
    {
      absence: number;
      studentId: string;
      justifiedAbsence: number;
      lateness: number;
      justifiedLateness: number;
      consigne: number;
      chatter: number;
    }
  >();
  for (const studentId of studentIds) {
    disciplines.set(studentId, {
      absence: 0,
      studentId: studentId,
      justifiedAbsence: 0,
      lateness: 0,
      justifiedLateness: 0,
      consigne: 0,
      chatter: 0,
    });
  }
  for (const absence of absences) {
    const student = disciplines.get(absence.studentId);
    if (student) {
      student.absence += absence.value;

      student.justifiedAbsence += absence.justification?.value ?? 0;
    }
  }
  for (const late of lateness) {
    const student = disciplines.get(late.studentId);
    if (student) {
      student.lateness++;

      student.justifiedLateness += late.justification
        ? getLatenessValue(late.justification.value)
        : 0;
    }
  }
  for (const consigne of consignes) {
    const student = disciplines.get(consigne.studentId);
    if (student) {
      student.consigne++;
    }
  }
  for (const chatter of chatters) {
    const student = disciplines.get(chatter.studentId);
    if (student) {
      student.chatter += chatter.value;
    }
  }
  return disciplines;
}

function getLatenessValue(value: string) {
  if (!value.includes(":")) {
    return parseInt(value, 10);
  }
  const [hours, minutes] = value.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

const add = (
  a?: Partial<DisciplineMetrics>,
  b?: Partial<DisciplineMetrics>,
): DisciplineMetrics => ({
  studentId: a?.studentId ?? b?.studentId ?? "",
  absence: (a?.absence ?? 0) + (b?.absence ?? 0),
  justifiedAbsence: (a?.justifiedAbsence ?? 0) + (b?.justifiedAbsence ?? 0),
  lateness: (a?.lateness ?? 0) + (b?.lateness ?? 0),
  justifiedLateness: (a?.justifiedLateness ?? 0) + (b?.justifiedLateness ?? 0),
  chatter: (a?.chatter ?? 0) + (b?.chatter ?? 0),
  consigne: (a?.consigne ?? 0) + (b?.consigne ?? 0),
});

export async function aggregateAllTermsForYear(
  classroomId: string,
  schoolYearId: string,
) {
  const terms = await db.term.findMany({
    where: { schoolYearId: schoolYearId },
    select: { id: true },
  });
  const termIds = terms.map((t) => t.id);

  const students = await classroomService.getStudents(classroomId);
  const studentIds = students.map((s) => s.id);

  // Compute per-term maps (daily+periodic) in parallel
  const perTermMaps = await Promise.all(
    termIds.map((termId) =>
      aggregateTermMetrics({
        studentIds,
        classroomId: classroomId,
        termId,
      }),
    ),
  );

  // Sum across all terms, and keep studentId in the value (to match your original shape)
  const disciplines = new Map<string, DisciplineMetrics>();

  for (const id of studentIds) {
    const total = perTermMaps.reduce<DisciplineMetrics>(
      (acc, m) => add(acc, m.get(id)),
      emptyMetrics(),
    );
    disciplines.set(id, { ...total, studentId: id });
  }

  return disciplines;
}
