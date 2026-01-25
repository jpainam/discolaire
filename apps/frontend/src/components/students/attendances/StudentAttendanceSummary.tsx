"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useTRPC } from "~/trpc/react";

export function StudentAttendanceSummary({ studentId }: { studentId: string }) {
  const trpc = useTRPC();

  //const t = useTranslations();

  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.student.queryOptions({ studentId }),
  );
  const { absence, late, consigne, chatter } = useMemo(() => {
    return attendances.reduce(
      (acc, at) => {
        return {
          absence: acc.absence + at.absence,
          late: acc.late + at.late,
          consigne: acc.consigne + at.consigne,
          chatter: acc.chatter + at.chatter,
        };
      },
      {
        absence: 0,
        late: 0,
        consigne: 0,
        chatter: 0,
      },
    );
  }, [attendances]);
  return (
    <div className="grid grid-cols-1 gap-2 p-2">
      <Card>
        <CardHeader>
          <CardTitle>{absence}</CardTitle>
          <CardDescription>Absence</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{late}</CardTitle>
          <CardDescription>Retard</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{chatter}</CardTitle>
          <CardDescription>Bavardage</CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{consigne}</CardTitle>
          <CardDescription>Consigne</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
