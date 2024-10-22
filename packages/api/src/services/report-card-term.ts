import { db } from "@repo/db";

interface StudentMapType {
  id: string;
  rank: number;
  subjects: Record<
    string,
    {
      coefficient: number;
      grades: { gradeValue: number; weight: number; scale: number }[];
      finalGrade: number;
      total: number;
    }
  >;
  averageGrade: number;
  totalPoints: number;
  totalCoefficient: number;
}
interface SubjectMapType {
  id: number;
  coefficient: number;
  grades: {
    studentId: string;
    finalGrade: number;
    total: number;
    rank: number;
  }[];
  classAverage: number;
  minGrade: number;
  maxGrade: number;
}
export async function getReportCardTerm({
  studentId,
  termId,
  classroomId,
}: {
  studentId: string;
  termId: number;
  classroomId: string;
}) {
  const grades = await db.grade.findMany({
    where: {
      gradeSheet: {
        termId: termId,
        subject: {
          classroomId: classroomId,
        },
      },
    },
    include: {
      student: true,
      gradeSheet: {
        include: {
          subject: true,
        },
      },
    },
  });
  console.log(">>>>>>>> grades", grades.length);

  const studentMap: Record<string, StudentMapType> = {};
  const subjectMap: Record<string, SubjectMapType> = {};

  grades.forEach((gradeRecord) => {
    const studentId = gradeRecord.student.id;
    const subjectId = gradeRecord.gradeSheet.subject.id;
    const coefficient = gradeRecord.gradeSheet.subject.coefficient;
    const gradeValue = gradeRecord.grade;
    const weight = gradeRecord.gradeSheet.weight;
    const scale = gradeRecord.gradeSheet.scale;

    if (!studentMap[studentId]) {
      studentMap[studentId] = {
        id: studentId,
        subjects: {},
        rank: -1,
        averageGrade: 0,
        totalPoints: 0,
        totalCoefficient: 0,
      };
    }

    if (!subjectMap[subjectId]) {
      subjectMap[subjectId] = {
        id: subjectId,
        coefficient: coefficient,
        grades: [],
        classAverage: 0,
        minGrade: Infinity,
        maxGrade: -Infinity,
      };
    }

    if (!studentMap[studentId].subjects[subjectId]) {
      studentMap[studentId].subjects[subjectId] = {
        coefficient: coefficient,
        grades: [],
        finalGrade: 0,
        total: 0,
      };
    }

    studentMap[studentId].subjects[subjectId].grades.push({
      gradeValue: gradeValue,
      weight: weight,
      scale: scale,
    });
  });

  Object.values(studentMap).forEach((student) => {
    Object.entries(student.subjects).forEach(([subjectIdStr, subjectData]) => {
      const subjectId = parseInt(subjectIdStr, 10);
      let finalGrade = 0;

      subjectData.grades.forEach((gradeItem) => {
        const weightFraction = gradeItem.weight / 100;
        const normalizedGrade = (gradeItem.gradeValue / gradeItem.scale) * 20; // Normalize to scale of 20
        const weightedGrade = normalizedGrade * weightFraction;
        finalGrade += weightedGrade;
      });

      subjectData.finalGrade = finalGrade;
      subjectData.total = finalGrade * subjectData.coefficient;

      // Update student's total points and coefficients
      student.totalPoints += subjectData.total;
      student.totalCoefficient += subjectData.coefficient;

      // Add to subject data for class computations
      subjectMap[subjectId]?.grades.push({
        studentId: student.id,
        finalGrade: finalGrade,
        total: subjectData.total,
        rank: -1,
      });
    });

    // Compute student's average grade
    student.averageGrade = student.totalPoints / student.totalCoefficient;
  });

  // Compute class averages, min, max, and assign ranks for each subject
  Object.values(subjectMap).forEach((subjectData) => {
    const grades = subjectData.grades.map((g) => g.finalGrade);
    const sumGrades = grades.reduce(
      (sum: number, grade: number) => sum + grade,
      0,
    );
    subjectData.classAverage = sumGrades / grades.length;
    subjectData.minGrade = Math.min(...grades);
    subjectData.maxGrade = Math.max(...grades);

    // Assign ranks
    subjectData.grades.sort((a, b) => b.finalGrade - a.finalGrade);
    subjectData.grades.forEach((gradeData, index) => {
      gradeData.rank = index + 1;
    });
  });

  // Assign overall ranks to students
  const studentArray = Object.values(studentMap);
  studentArray.sort((a, b) => b.averageGrade - a.averageGrade);
  studentArray.forEach((student, index) => {
    student.rank = index + 1;
  });

  // Display the results
  studentArray.forEach((student) => {
    console.log(
      `\nStudent: ${studentId} (Average Grade: ${student.averageGrade.toFixed(2)}, Rank: ${student.rank})`,
    );

    Object.entries(student.subjects).forEach(([subjectIdStr, subjectData]) => {
      const subjectId = parseInt(subjectIdStr, 10);
      const subjectInfo = subjectMap[subjectId];
      if (!subjectInfo) return;

      // Find the student's rank in this subject
      const gradeData = subjectInfo.grades.find(
        (g) => g.studentId === student.id,
      );

      console.log(`Subject: ${subjectIdStr}`);
      console.log(`Grade: ${subjectData.finalGrade.toFixed(2)}`);
      console.log(`Coeff: ${subjectData.coefficient}`);
      console.log(`Total: ${subjectData.total.toFixed(2)}`);
      console.log(`Rank in Subject: ${gradeData?.rank}`);
      console.log(`Class Avg: ${subjectInfo.classAverage.toFixed(2)}`);
      console.log(
        `Min: ${subjectInfo.minGrade.toFixed(2)}, Max: ${subjectInfo.maxGrade.toFixed(2)}`,
      );
      console.log("---------------------------------");
    });
  });
}
