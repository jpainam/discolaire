"use client";

import { useSearchParams } from "next/navigation";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import z from "zod/v4";

import { Form } from "@repo/ui/components/form";

import { AttendanceClassroom } from "./AttendanceClassroom";
import { AttendanceClassroomStudentList } from "./AttendanceClassroomStudentList";

const formSchema = z.object({
  students: z.array(
    z.object({
      id: z.string(),
      absences: z.number().min(0).max(100).default(0),
      justifiedAbsences: z.number().min(0).max(100).default(0),
      consignes: z.number().min(0).max(100).default(0),
      retards: z.number().min(0).max(100).default(0),
      justifiedRetards: z.number().min(0).max(100).default(0),
      bavardages: z.number().min(0).max(100).default(0),
    }),
  ),
});
export function PeriodicAttendance() {
  const form = useForm({
    defaultValues: { students: [] },
    resolver: standardSchemaResolver(formSchema),
  });
  const searchParams = useSearchParams();

  const classroomId = searchParams.get("classroomId");
  const termId = searchParams.get("termId");
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <AttendanceClassroom />
        {classroomId && termId && (
          <AttendanceClassroomStudentList
            classroomId={classroomId}
            termId={termId}
          />
        )}
      </form>
    </Form>
  );
}
