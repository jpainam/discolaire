import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { caller } from "~/trpc/server";

// Sample data for recent grades
const recentGrades = [
  {
    student: "Emma Johnson",
    assignment: "Math Quiz 3",
    grade: 95,
    previousGrade: 90,
    date: "Sep 15, 2023",
  },
  {
    student: "Liam Smith",
    assignment: "Science Lab Report",
    grade: 82,
    previousGrade: 78,
    date: "Sep 14, 2023",
  },
  {
    student: "Noah Davis",
    assignment: "English Essay",
    grade: 68,
    previousGrade: 65,
    date: "Sep 14, 2023",
  },
  {
    student: "Ava Taylor",
    assignment: "Math Quiz 3",
    grade: 62,
    previousGrade: 58,
    date: "Sep 13, 2023",
  },
  {
    student: "Sophia Wilson",
    assignment: "History Presentation",
    grade: 93,
    previousGrade: 91,
    date: "Sep 12, 2023",
  },
];

export async function RecentGradesTable() {
  const grades = await caller.gradeSheet.getLatestGradesheet({ limit: 5 });
  const latest: {
    title: string;
    classroom: string;
    minGrade: number;
    avgGrade: number;
    maxGrade: number;
    date: Date;
  }[] = [];
  grades.forEach((gradeSheet) => {
    const subject = gradeSheet.subject.course.name;
    const classroom = gradeSheet.subject.classroom.name;
    const minGrade = Math.min(...gradeSheet.grades.map((g) => g.grade ?? 0));
    const avgGrade =
      gradeSheet.grades.reduce((sum, g) => sum + (g.grade ?? 0), 0) /
      gradeSheet.grades.length;
    const maxGrade = Math.max(...gradeSheet.grades.map((g) => g.grade ?? 0));
    latest.push({
      title: `${subject} - ${classroom}`,
      classroom,
      minGrade,
      avgGrade,
      maxGrade,
      date: gradeSheet.createdAt,
    });
  });
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Assignment</TableHead>
          <TableHead className="text-right">Grade</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentGrades.map((grade) => (
          <TableRow key={`${grade.student}-${grade.assignment}`}>
            <TableCell className="font-medium">{grade.student}</TableCell>
            <TableCell>{grade.assignment}</TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <span>{grade.grade}%</span>
                {grade.grade > grade.previousGrade ? (
                  <ArrowUpIcon className="ml-2 h-4 w-4 text-green-500" />
                ) : grade.grade < grade.previousGrade ? (
                  <ArrowDownIcon className="ml-2 h-4 w-4 text-red-500" />
                ) : null}
              </div>
            </TableCell>
            <TableCell className="text-right">{grade.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
