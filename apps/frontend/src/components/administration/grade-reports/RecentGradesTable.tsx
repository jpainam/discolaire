import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

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

export function RecentGradesTable() {
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
