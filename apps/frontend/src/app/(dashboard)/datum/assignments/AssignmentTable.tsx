"use client";

import { format } from "date-fns";
import { Pencil, Trash2, Users } from "lucide-react";

import { Button } from "@repo/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

const initialAssignments = [
  {
    id: 1,
    title: "Math Quiz",
    type: "Quiz",
    dueDate: new Date(2024, 10, 15),
    submitted: 15,
    total: 30,
  },
  {
    id: 2,
    title: "History Essay",
    type: "Homework",
    dueDate: new Date(2024, 10, 20),
    submitted: 25,
    total: 30,
  },
  {
    id: 3,
    title: "Science Project",
    type: "Assignment",
    dueDate: new Date(2024, 11, 1),
    submitted: 10,
    total: 30,
  },
];
export function AssignmentTable() {
  const assignments = initialAssignments;
  return (
    <div className="overflow-hidden border-y">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assignments.map((assignment) => (
            <TableRow key={assignment.id}>
              <TableCell className="font-medium">{assignment.title}</TableCell>
              <TableCell>{assignment.type}</TableCell>
              <TableCell>{format(assignment.dueDate, "PPP")}</TableCell>
              <TableCell>
                {assignment.submitted}/{assignment.total}
              </TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
