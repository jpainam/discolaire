"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "~/components/base-badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ReportCardSkillAcquisition({
  termId,
  classroomId,
}: {
  termId: string;
  classroomId: string;
}) {
  const trpc = useTRPC();
  const gradesheetQuery = useQuery(
    trpc.classroom.gradesheets.queryOptions(classroomId),
  );

  const createSkillMutation = useMutation(
    trpc.skillAcquisition.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const debounced = useDebouncedCallback((value: string, subjectId: number) => {
    createSkillMutation.mutate({
      subjectId,
      termId,
      content: value,
    });
  }, 1000);

  const skillQuery = useQuery(
    trpc.skillAcquisition.all.queryOptions({ classroomId, termId }),
  );

  const gradesheets = useMemo(() => {
    const sheets = gradesheetQuery.data;
    return sheets?.filter((g) => g.termId == termId);
  }, [gradesheetQuery.data, termId]);

  if (gradesheetQuery.isPending || skillQuery.isPending) {
    return (
      <div className="grid gap-4 p-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <Skeleton className="h-20" key={idx} />
        ))}
      </div>
    );
  }
  const skills = skillQuery.data;
  return (
    <div>
      <div className="bg-background overflow-hidden border-y">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Matières / Prof.</TableHead>
              <TableHead>Coeff.</TableHead>
              <TableHead>Moy.</TableHead>
              <TableHead>[Min-Max]</TableHead>
              {/* <TableHead>Poid</TableHead> */}
              <TableHead>Compétences évaluées</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gradesheets?.map((gs) => {
              const skill = skills?.find(
                (s) => s.termId == termId && s.subjectId == gs.subjectId,
              );
              return (
                <TableRow key={gs.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/classrooms/${gs.subject.classroomId}/subjects/${gs.subjectId}`}
                        className="hover:underline"
                      >
                        {gs.subject.course.name}
                      </Link>
                      <Link
                        href={`/staffs/${gs.subject.teacherId}`}
                        className="text-muted-foreground text-xs hover:underline"
                      >
                        {getFullName(gs.subject.teacher)}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {gs.subject.coefficient}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      appearance={"outline"}
                      variant={
                        gs.avg < gs.scale / 2
                          ? "destructive"
                          : gs.avg > 15
                            ? "success"
                            : "warning"
                      }
                    >
                      {gs.avg.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    [{gs.min.toFixed(2)} - {gs.max.toFixed(2)}]
                  </TableCell>
                  {/* <TableCell>{gs.weight * 100}%</TableCell> */}
                  <TableCell className="w-full">
                    <Textarea
                      onChange={(e) => {
                        debounced(e.target.value, gs.subjectId);
                      }}
                      defaultValue={skill?.content}
                    ></Textarea>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
