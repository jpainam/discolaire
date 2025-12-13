"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, User } from "lucide-react";

import { Progress } from "~/components/ui/progress";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function GradeReportTracker({
  subjectId,
  classroomId,
}: {
  subjectId: number;
  classroomId: string;
}) {
  const trpc = useTRPC();
  const gradeTracker = useQuery(
    trpc.gradeSheet.gradeReportTracker.queryOptions({ subjectId }),
  );
  const classroomQuery = useQuery(trpc.classroom.get.queryOptions(classroomId));
  const subjectQuery = useQuery(trpc.subject.get.queryOptions(subjectId));

  //   const getGradesCompleted = (grades: (number | null)[]) => {
  //     return grades.filter((grade) => grade !== null).length;
  //   };

  //   const getGradesRemaining = (grades: (number | null)[]) => {
  //     return 6 - getGradesCompleted(grades);
  //   };
  if (
    classroomQuery.isLoading ||
    subjectQuery.isLoading ||
    gradeTracker.isLoading
  ) {
    return (
      <div className="animate-spin text-center">
        <Loader2 className="h-8 w-8" />
      </div>
    );
  }
  return (
    <div>
      <div className="w-[400px] sm:w-[540px]">
        <div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {getFullName(subjectQuery.data?.teacher)} - Grade Input
          </div>
          <div>
            Enter all 6 grades for this teacher. Grades should be between 0-100.
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="bg-muted flex items-center justify-between rounded-lg p-3">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center gap-2">
              <Progress
                //value={(getGradesCompleted(selectedTeacher.grades) / 6) * 100}
                value={50}
                className="w-24"
              />
              <span className="text-sm">
                {/* {getGradesCompleted(selectedTeacher.grades)}/6 */}8
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            {/* {selectedTeacher.grades.map((grade, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`grade-${index}`}>Grade {index + 1}</Label>
                <Input
                  id={`grade-${index}`}
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter grade (0-100)"
                  value={grade || ""}
                  onChange={(e) =>
                    updateGrade(selectedTeacher.id, index, e.target.value)
                  }
                  className={grade !== null ? "border-green-500" : ""}
                />
              </div>
            ))} */}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm">
              <span>Completed:</span>
              <span className="font-medium">
                {/* {getGradesCompleted(selectedTeacher.grades)} grades */}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Remaining:</span>
              <span className="font-medium">
                {/* {getGradesRemaining(selectedTeacher.grades)} grades */}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
