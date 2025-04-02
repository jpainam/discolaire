"use client";

import Link from "next/link";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import i18next from "i18next";
import type { Assignment } from "./transcript-content";

interface TranscriptItemProps {
  assignment: Assignment;
}
export function TranscriptItem({ assignment }: TranscriptItemProps) {
  return (
    <AccordionItem data-state="open" value={`${assignment.id}`}>
      <AccordionTrigger className="py-1 font-semibold">
        <div className="grid grid-cols-1 items-start md:grid-cols-4">
          <span className="flex">{assignment.course}</span>
          <span className="flex">Moy. 12.5</span>
          <span className="flex">
            {assignment.teacher.lastName} {assignment.teacher.firstName}
          </span>
          <span className="flex">
            {assignment.teacher.phoneNumber} jpainam@gmail.com
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent data-state="open" className="ml-6">
        <Table>
          <TableHeader className="border-b-2 border-primary">
            <TableHead className="h-0">Title</TableHead>
            <TableHead className="h-0">Assignment Date</TableHead>
            <TableHead className="h-0">Due Date</TableHead>
            <TableHead className="h-0">Weight</TableHead>
            <TableHead className="h-0">Grade</TableHead>
            <TableHead className="h-0">File</TableHead>
            <TableHead className="h-0">Observation</TableHead>
          </TableHeader>
          <TableBody>
            {assignment.assignments.map((ass, index) => {
              const assDate = ass.assignmentDate.toLocaleDateString(
                i18next.language,
                {
                  month: "short",
                  year: "numeric",
                  day: "2-digit",
                },
              );
              const dueDate = ass.dueDate.toLocaleDateString(i18next.language, {
                month: "short",
                year: "numeric",
                day: "2-digit",
              });
              return (
                <TableRow
                  className="border-none"
                  key={`${assignment.id}-${index}`}
                >
                  <TableCell className="py-0">
                    <Link className="underline" href="#">
                      {ass.title}
                    </Link>
                  </TableCell>
                  <TableCell className="py-0">{assDate}</TableCell>
                  <TableCell className="py-0">{dueDate}</TableCell>
                  <TableCell className="py-0">{ass.weigth}%</TableCell>
                  <TableCell className="py-0">{ass.grade}</TableCell>
                  <TableCell className="py-0"> </TableCell>
                  <TableCell className="py-0">{ass.observation}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </AccordionContent>
    </AccordionItem>
  );
}
